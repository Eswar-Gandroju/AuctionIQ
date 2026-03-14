import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

FEATURES_PATH = PROJECT_ROOT / "data" / "processed" / "features_engineered.csv"
CLUSTER_PATH = PROJECT_ROOT / "data" / "processed" / "player_clusters.csv"
PLAYERS_PATH = PROJECT_ROOT / "data" / "processed" / "players_processed.csv"

out_path = PROJECT_ROOT / "data" / "processed" / "features_engineered_with_clusters.csv"

features = pd.read_csv(FEATURES_PATH)
clusters = pd.read_csv(CLUSTER_PATH)
players = pd.read_csv(PLAYERS_PATH)

# Merge role into features (from players_processed)
features = features.merge(players[["player_id", "role"]], on="player_id", how="left")

# Merge cluster
df = features.merge(clusters, on="player_id", how="left")

# Cluster naming
def name_cluster(row):
    role = row["role"]
    c = row["cluster"]

    # ---- BATTERS (3 clusters) ----
    if role in ["Batter", "Wicketkeeper Batter"]:
        return {0: "Anchor", 1: "Balanced",2: "Power Hitter" }.get(c, "Unknown")

    # ---- BOWLERS (3 clusters) ----
    if role == "Bowler":
        return {0: "Economical", 1: "Wicket Taker", 2: "Death Specialist"}.get(c, "Unknown")

    # ---- ALL-ROUNDERS (3 clusters) ----
    if role == "All-rounder":
        return {0: "Batting Heavy", 1: "Balanced", 2: "Bowling Heavy"}.get(c, "Unknown")

    return "Unknown"

df["player_type"] = df.apply(name_cluster, axis=1)

df.to_csv(out_path, index=False)
print("✅ features_engineered_with_clusters.csv created")
print(df.head())
