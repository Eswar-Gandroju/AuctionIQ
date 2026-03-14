import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

players_processed_path = PROCESSED_DIR / "players_processed.csv"
performance_path = RAW_DIR / "performance_raw.csv"

output_path = PROCESSED_DIR / "features_engineered.csv"

# Load processed players
players_df = pd.read_csv(players_processed_path)

# Load performance
perf_df = pd.read_csv(performance_path)

# Merge
features_df = perf_df.merge(players_df, on="player_id", how="left")

# Keep latest season (if multiple)
features_df = features_df.sort_values("season").groupby("player_id").tail(1)

# Save
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
features_df.to_csv(output_path, index=False)

print("✅ features_engineered.csv created successfully")
print(f"📁 Saved at: {output_path}")
print(features_df.head())
