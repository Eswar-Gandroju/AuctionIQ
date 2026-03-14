import pandas as pd
from pathlib import Path
from sklearn.preprocessing import MinMaxScaler

# 1. PATH RESOLUTION
# This ensures the script finds your data regardless of where it's called from
BASE_DIR = Path(__file__).resolve().parents[2]
PROCESSED_DIR = BASE_DIR / "data" / "processed"
features_path = PROCESSED_DIR / "features_engineered.csv"

# 2. LOAD DATA
df = pd.read_csv(features_path)

# 3. PRE-PROCESSING FOR IMPACT
# Fill situational columns with 0 to prevent NaN results in math
impact_cols = ["runs", "strike_rate", "powerplay_runs", "death_runs", 
               "wickets", "economy", "powerplay_wickets", "death_wickets"]
df[impact_cols] = df[impact_cols].fillna(0)

# Normalize consistency_index to 0-1 range to align with weighted inputs
scaler = MinMaxScaler()
df["consistency_norm"] = scaler.fit_transform(df[["consistency_index"]])

# 4. WEIGHTED IMPACT LOGIC
def calc_impact(row):
    # Clean role string (case-insensitive and trimmed)
    role = str(row["role"]).lower().strip()
    
    # Batter logic (Including Wicketkeeper Batters)
    if "batter" in role:
        return (
            0.35 * row["runs"] + 
            0.25 * row["strike_rate"] + 
            0.20 * row["powerplay_runs"] + 
            0.20 * row["death_runs"] + 
            0.05 * row["consistency_norm"]
        )
    
    # Bowler logic
    elif "bowler" in role:
        return (
            0.35 * row["wickets"] + 
            0.25 * row["powerplay_wickets"] + 
            0.25 * row["death_wickets"] + 
            0.15 * (1 - row["economy"]) + # Lower economy = Higher impact
            0.05 * row["consistency_norm"]
        )
    
    # All-rounder logic
    else:
        return (
            0.25 * row["runs"] + 
            0.20 * row["strike_rate"] + 
            0.15 * row["wickets"] + 
            0.10 * (1 - row["economy"]) + 
            0.15 * row["powerplay_runs"] + 
            0.15 * row["death_runs"] + 
            0.05 * row["consistency_norm"]
        )

# 5. EXECUTION & STANDARDIZATION
# Calculate raw impact first
df["impact_score_raw"] = df.apply(calc_impact, axis=1)

# Map the raw scores to a clean 0-100 scale for the backend UI
# We add a tiny epsilon to the denominator to prevent division by zero errors
max_raw = df["impact_score_raw"].max()
min_raw = df["impact_score_raw"].min()
df["impact_score"] = ((df["impact_score_raw"] - min_raw) / (max_raw - min_raw + 1e-6)) * 100

# 6. CLEANUP & SAVE
# Round scores for clean database storage
df["impact_score"] = df["impact_score"].round(2)

# Properly remove temporary columns (Fixed 'impact_score_raw' key)
columns_to_drop = ["consistency_norm", "impact_score_raw"]
df.drop(columns=columns_to_drop, inplace=True, errors='ignore')

# Save the final engineered features
df.to_csv(features_path, index=False)

print(f"✅ Impact Score calculated and standardized (0-100).")
print(f"📁 Database updated at: {features_path}")