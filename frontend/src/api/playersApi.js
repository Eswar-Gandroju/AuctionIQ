import axios from "axios";

// 🔁 Ensure this matches your Flask server port
const API_BASE_URL = "http://127.0.0.1:5000";

/**
 * 🔹 RECOMMEND PLAYERS
 * Hits the XGBoost Ranker. This is the heart of your "Find Best Players" button.
 */
export const recommendPlayers = async (filters) => {
  try {
    // We map the React state to the exact CSV column names
    const payload = {
      role: filters.role,
      nationality: filters.nationality,
      budget: filters.budget,
      // Logic: Use player_type for most, but allrounder_bias if that's the role
      player_type: filters.role === "All-rounder" ? filters.allrounder_bias : filters.player_type,
      batting_position: filters.batting_position,
      batting_style: filters.batting_style,
      bowling_style: filters.bowling_style,
      bowling_type: filters.bowling_type,
    };

    const res = await axios.post(
      `${API_BASE_URL}/recommendations`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // This returns the 8-9 players needed for your Results layout
    return res.data; 
  } catch (err) {
    console.error("❌ Recommendation API error:", err);
    return [];
  }
};

/**
 * 🔹 FETCH PLAYER BY ID
 * Crucial for the Compare page to ensure Player 1 data is fresh and "glitch-free."
 */
export const fetchPlayerById = async (playerId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/players/${playerId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Error fetching player ${playerId}:`, err);
    return null;
  }
};

/**
 * 🔹 GET ALL PLAYERS (Optional/Utility)
 * Can be used to populate the Player 2 dropdown if the shortlist is empty.
 */
export const fetchPlayers = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/players`);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching all players:", err);
    return [];
  }
};