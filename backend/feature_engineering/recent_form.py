import pandas as pd
from pathlib import Path

# 1. PATH RESOLUTION
PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

# Your current file with all the raw columns
input_path = PROCESSED_DIR / "features_engineered.csv" 
performance_path = RAW_DIR / "performance_raw.csv"
output_path = PROCESSED_DIR / "features_engineered.csv"

# 2. LOAD DATA
df = pd.read_csv(input_path)
perf = pd.read_csv(performance_path)

# 3. CALCULATE FORM RAW DATA
recent_seasons = sorted(perf["season"].unique())[-2:]
perf_recent = perf[perf["season"].isin(recent_seasons)].copy()

perf_recent["bat_form_raw"] = (
    perf_recent["strike_rate"] *
    (perf_recent["balls_faced"] / (perf_recent["balls_faced"] + 20)) *
    (perf_recent["runs"] / (perf_recent["runs"] + 10))
)

perf_recent["bowl_form_raw"] = (
    (perf_recent["wickets"] / (perf_recent["overs"] + 1)) *
    (1 / (perf_recent["economy"] + 1)) *
    (perf_recent["overs"] / (perf_recent["overs"] + 4))
)

# Aggregate scores
agg = perf_recent.groupby("player_id").agg(
    batting_form_score=("bat_form_raw", "mean"),
    bowling_form_score=("bowl_form_raw", "mean"),
    matches_played=("matches", "sum")
).reset_index()

# Normalize 0-1
def normalize(col):
    return (col - col.min()) / (col.max() - col.min() + 1e-6)

agg["batting_form_score"] = normalize(agg["batting_form_score"])
agg["bowling_form_score"] = normalize(agg["bowling_form_score"])

# 4. MERGE AGGREGATED FORM INTO MAIN DF
# We drop the old 'matches' column from df to use 'matches_played' from agg
if 'matches' in df.columns:
    df = df.drop(columns=['matches'])

df = df.merge(agg, on="player_id", how="left")

# 5. ROLE-BASED FORM SCORE (0-100)
def calculate_role_based_form(row):
    role = str(row["role"]).lower()
    if "batter" in role and "allrounder" not in role:
        return row["batting_form_score"]
    elif "bowler" in role:
        return row["bowling_form_score"]
    else: # All-rounders
        return (0.6 * row["batting_form_score"] + 0.4 * row["bowling_form_score"])

df["recent_form_score"] = (df.apply(calculate_role_based_form, axis=1) * 100).round(2)

# 6. FINAL COLUMN FILTERING (Exactly what you requested)
final_desired_cols = [
    "player_id", "player_name", "age", "country", "role", 
    "batting_style", "batting_position", "bowling_style", "bowling_type", 
    "base_price_in_lakhs", "batting_form_score", "bowling_form_score", 
    "matches_played", "recent_form_score", "consistency_index", "impact_score"
]

# Ensure everything missing is 0 (Debutants)
df[final_desired_cols] = df[final_desired_cols].fillna(0)

# Apply filter
df_final = df[final_desired_cols]

# 7. SAVE
df_final.to_csv(output_path, index=False)

print("✅ Final File Cleaned! All raw columns dropped.")
print(f"📁 Columns remaining: {list(df_final.columns)}")