import pandas as pd
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import xgboost as xgb

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = PROJECT_ROOT / "data" / "processed"

df = pd.read_csv(DATA_PATH / "features_engineered_with_clusters.csv")

# ----------------------------
# 1) Rank separately per role
# ----------------------------
def rank_role(role_df):
    X = role_df[[
        "impact_score",
        "consistency_index",
        "recent_form_score",
        "cluster",
        "base_price_in_lakhs"
    ]]

    # Target label using rule-based scoring
    role_df["rule_score"] = (
        0.4 * role_df["impact_score"] +
        0.3 * (role_df["consistency_index"] * 20) +
        0.2 * role_df["recent_form_score"] +
        0.1 * (1 / (role_df["base_price_in_lakhs"] + 1))
    )

    y = role_df["rule_score"]

    # Scale numeric features only
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train XGBoost regressor
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.1,
        random_state=42
    )

    model.fit(X_train, y_train)

    role_df["pred_score"] = model.predict(X_scaled)
    return role_df


# Apply per role
batters = rank_role(df[df["role"].isin(["Batter", "Wicketkeeper Batter"])])
bowlers = rank_role(df[df["role"] == "Bowler"])
allrounders = rank_role(df[df["role"] == "All-rounder"])

# Combine
final_df = pd.concat([batters, bowlers, allrounders], ignore_index=True)

# Sort overall ranking
final_df = final_df.sort_values("pred_score", ascending=False)

# Save
final_df.to_csv(DATA_PATH / "ranked_players.csv", index=False)
print("✅ ranked_players.csv created")
