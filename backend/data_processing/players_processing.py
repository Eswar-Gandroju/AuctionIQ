import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

players_path = RAW_DIR / "players_raw.csv"
base_price_path = RAW_DIR / "base_prices_raw.csv"
output_path = PROCESSED_DIR / "players_processed.csv"

players_df = pd.read_csv(players_path)
base_price_df = pd.read_csv(base_price_path)

df = players_df.merge(base_price_df, on="player_id", how="left")

df["bowling_style"] = df["bowling_style"].fillna("None")
df["bowling_type"] = df["bowling_type"].fillna("None")
df["batting_position"] = df["batting_position"].fillna("Lowerorder")
df["base_price_in_lakhs"] = df["base_price_in_lakhs"].fillna(0)

final_columns = [
    "player_id",
    "player_name",
    "age",
    "country",
    "role",
    "batting_style",
    "batting_position",
    "bowling_style",
    "bowling_type",
    "base_price_in_lakhs",
]

df = df[final_columns]

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
df.to_csv(output_path, index=False)

print("✅ players_processed.csv created successfully")
print(f"📁 Saved at: {output_path}")
print(df.head())
