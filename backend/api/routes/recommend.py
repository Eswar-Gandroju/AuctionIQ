from flask import Blueprint, request, jsonify
import pandas as pd
from pathlib import Path

recommend_bp = Blueprint("recommend", __name__)

# --- PATH LOGIC ---
current_dir = Path(__file__).resolve().parent
PROJECT_ROOT = current_dir.parents[2] 
RANKED_PATH = PROJECT_ROOT / "data" / "processed" / "ranked_players.csv"

# Load the data once
if RANKED_PATH.exists():
    ranked_df = pd.read_csv(RANKED_PATH)
    print(f"✅ Data Loaded from: {RANKED_PATH}")
else:
    print(f"❌ DATA NOT FOUND AT: {RANKED_PATH}")

def fuzzy_filter(df, column, target_value):
    """
    Normalizes both the CSV column and the filter value by removing 
    hyphens, spaces, and converting to lowercase.
    """
    if not target_value or target_value == "Any":
        return df
    
    # Normalize the target value (e.g., "Middleorder" -> "middleorder")
    target = str(target_value).replace("-", "").replace(" ", "").lower()
    
    # Normalize the column values for comparison
    return df[
        df[column].astype(str)
        .str.replace("-", "", regex=False)
        .str.replace(" ", "", regex=False)
        .str.lower() == target
    ]

def apply_filters(df, filters):
    # 1. Nationality Logic (Direct Mapping)
    nationality = filters.get("nationality")
    if nationality == "Indian":
        df = df[df["country"] == "India"]
    elif nationality == "Overseas":
        df = df[df["country"] != "India"]

    # 2. Role Filter (Strict match usually works here, but fuzzy is safer)
    df = fuzzy_filter(df, "role", filters.get("role"))

    # 3. Batting Position & Styles (FUZZY)
    # This fixes the "Middleorder" vs "Middle-order" issue
    df = fuzzy_filter(df, "batting_position", filters.get("batting_position"))
    df = fuzzy_filter(df, "batting_style", filters.get("batting_style"))
    df = fuzzy_filter(df, "bowling_style", filters.get("bowling_style"))
    df = fuzzy_filter(df, "bowling_type", filters.get("bowling_type"))
    df = fuzzy_filter(df, "player_type", filters.get("player_type"))

    # 4. Budget Filter
    budget = filters.get("budget")
    if budget:
        try:
            df = df[df["base_price_in_lakhs"] <= float(budget)]
        except ValueError:
            pass # Handle non-numeric budget gracefully

    return df

@recommend_bp.route("/recommendations", methods=["POST"])
def recommend():
    filters = request.json or {}
    print(f"📥 Received filters: {filters}") # Critical for hostel debugging
    
    df = ranked_df.copy()

    # Apply Filtering
    df = apply_filters(df, filters)
    
    # Print match count to terminal
    print(f"🔍 Match found: {len(df)} players")

    # Sort by rank_score (Fallback to impact_score)
    sort_col = "rank_score" if "rank_score" in df.columns else "impact_score"
    df = df.sort_values(sort_col, ascending=False)

    # Return top 12
    result = df.head(12).to_dict(orient="records")
    return jsonify(result)