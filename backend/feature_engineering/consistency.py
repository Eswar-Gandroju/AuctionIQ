import pandas as pd
from pathlib import Path

# 1. Setup Paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
features_path = PROCESSED_DIR / "features_engineered.csv"

# 2. Load Data
df = pd.read_csv(features_path)

# 3. ADVANCED CLEANING (Fixes "All-rounder" vs "Allrounder" vs "all rounder")
df['role_clean'] = df['role'].str.lower().str.replace('-', '').str.replace(' ', '').str.strip()

# 4. Define Raw Components
df['bat_raw'] = (df['runs'] / (df['matches'] + 1)) * (df['strike_rate'] / 100)
df['bowl_raw'] = (df['wickets'] / (df['matches'] + 1)) * (10 / (df['economy'] + 1))

# 5. Global Scaling (0-5)
def scale_series(series):
    if series.max() <= series.min(): return series * 0
    return ((series - series.min()) / (series.max() - series.min() + 1e-6)) * 5

df['bat_scaled'] = scale_series(df['bat_raw'])
df['bowl_scaled'] = scale_series(df['bowl_raw'])

# 6. Apply logic by Cleaned Role
df['consistency_index'] = 0.0

# Batters & Keepers
bat_mask = df['role_clean'].isin(['batter', 'wicketkeeperbatter'])
df.loc[bat_mask, 'consistency_index'] = df.loc[bat_mask, 'bat_scaled']

# Bowlers
bowl_mask = df['role_clean'] == 'bowler'
df.loc[bowl_mask, 'consistency_index'] = df.loc[bowl_mask, 'bowl_scaled']

# All-rounders (Now matches "all-rounder" correctly)
ar_mask = df['role_clean'] == 'allrounder'
df.loc[ar_mask, 'consistency_index'] = (df.loc[ar_mask, 'bat_scaled'] + df.loc[ar_mask, 'bowl_scaled']) / 2

# 7. Final Cleanup & Save
df['consistency_index'] = df['consistency_index'].fillna(0).round(2)
df.drop(columns=['role_clean', 'bat_raw', 'bowl_raw', 'bat_scaled', 'bowl_scaled'], inplace=True)

df.to_csv(features_path, index=False)

print("✅ FIXED: All-rounders (with hyphens) now have correct scores.")
print(df[df['role'].str.contains('rounder', case=False)][['player_name', 'consistency_index']].head())