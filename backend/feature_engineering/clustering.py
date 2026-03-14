import pandas as pd
from pathlib import Path
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

perf_path = RAW_DIR / "performance_raw.csv"
players_path = RAW_DIR / "players_raw.csv"

out_path = PROCESSED_DIR / "player_clusters.csv"

perf = pd.read_csv(perf_path)
players = pd.read_csv(players_path)

# Merge role
df = perf.merge(players[["player_id", "role"]], on="player_id", how="left")

# ---- AGGREGATE PER PLAYER ----
agg = df.groupby(["player_id", "role"]).agg(
    matches_played=("matches", "sum"),
    runs=("runs", "sum"),
    balls_faced=("balls_faced", "sum"),
    wickets=("wickets", "sum"),
    overs=("overs", "sum"),
    runs_conceded=("runs_conceded", "sum"),
    strike_rate=("strike_rate", "mean"),
    economy=("economy", "mean"),
    fifties=("fifties", "sum"),
    hundreds=("hundreds", "sum"),
    four_wickets=("four_wickets", "sum"),
    five_wickets=("five_wickets", "sum")
).reset_index()

# ---- BATTER FEATURES ----
bat = agg[agg["role"].isin(["Batter", "Wicketkeeper Batter"])].copy()

bat["avg_runs"] = bat["runs"] / (bat["matches_played"] + 1)
bat["balls_per_match"] = bat["balls_faced"] / (bat["matches_played"] + 1)
bat["boundary_rate"] = (bat["fifties"] + bat["hundreds"]) / (bat["matches_played"] + 1)
bat["consistency"] = df[df["role"].isin(["Batter", "Wicketkeeper Batter"])].groupby("player_id")["runs"].std().fillna(0)

bat_features = ["avg_runs", "strike_rate", "balls_per_match", "boundary_rate", "consistency"]

# ---- BOWLER FEATURES ----
bowl = agg[agg["role"] == "Bowler"].copy()

bowl["wickets_per_match"] = bowl["wickets"] / (bowl["matches_played"] + 1)
bowl["balls_per_wicket"] = (bowl["overs"] * 6) / (bowl["wickets"] + 1)
bowl["strike_rate"] = bowl["balls_per_wicket"]
bowl["dot_ball_rate"] = (bowl["balls_per_wicket"] - bowl["economy"]) / (bowl["balls_per_wicket"] + 1)

bowl_features = ["wickets_per_match", "economy", "strike_rate", "dot_ball_rate"]

# ---- ALLROUNDER FEATURES ----
allr = agg[agg["role"] == "All-rounder"].copy()

allr["avg_runs"] = allr["runs"] / (allr["matches_played"] + 1)
allr["balls_per_match"] = allr["balls_faced"] / (allr["matches_played"] + 1)
allr["boundary_rate"] = (allr["fifties"] + allr["hundreds"]) / (allr["matches_played"] + 1)
allr["consistency"] = df[df["role"] == "All-rounder"].groupby("player_id")["runs"].std().fillna(0)

allr["wickets_per_match"] = allr["wickets"] / (allr["matches_played"] + 1)
allr["balls_per_wicket"] = (allr["overs"] * 6) / (allr["wickets"] + 1)
allr["strike_rate_bowl"] = allr["balls_per_wicket"]

allr_features = ["avg_runs", "strike_rate", "balls_per_match", "boundary_rate", "consistency",
                "wickets_per_match", "economy", "strike_rate_bowl"]

# ---- SCALE & CLUSTER ----
scaler = StandardScaler()

# ----------------------------
# BATTERS CLUSTERING (3 clusters ONLY)
# ----------------------------
bat_clean = bat[bat_features].fillna(0)

bat["cluster"] = KMeans(n_clusters=3, random_state=42).fit_predict(
    scaler.fit_transform(bat_clean)
)

# ----------------------------
# BOWLERS CLUSTERING (3 clusters ONLY)
# ----------------------------
bowl_clean = bowl[bowl_features].fillna(0)

bowl["cluster"] = KMeans(n_clusters=3, random_state=42).fit_predict(
    scaler.fit_transform(bowl_clean)
)

# ----------------------------
# ALL-ROUNDERS CLUSTERING (3 clusters ONLY)
# ----------------------------
allr_clean = allr[allr_features].fillna(0)

allr["cluster"] = KMeans(n_clusters=3, random_state=42).fit_predict(
    scaler.fit_transform(allr_clean)
)

combined = pd.concat([bat, bowl, allr], ignore_index=True)
combined = combined[["player_id", "role", "cluster"]]

combined.to_csv(out_path, index=False)
print("✅ player_clusters.csv created")
