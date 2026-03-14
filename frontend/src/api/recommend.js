import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export const getRecommendations = async (filters) => {
  try {
    let refined = { ...filters };

    // 1. 🛡️ Role-Based Cleanup
    if (refined.role === "Batter" || refined.role === "Wicketkeeper Batter") {
      delete refined.bowling_type;
      delete refined.bowling_style;
    } else if (refined.role === "Bowler") {
      delete refined.batting_position;
      delete refined.batting_style; 
    }else if (refined.role === "All-rounder") {
    // 🏏 All-rounders are usually flexible. 
    // Unless your backend specifically requires these, it's better to remove them 
    // so the search doesn't return 0 results due to over-filtering.
    delete refined.batting_position;
    delete refined.batting_style;
    delete refined.bowling_type;
    delete refined.bowling_style;
}

    // 2. Map UI keys to Backend keys
    const mappedFilters = {
      ...refined,
      player_type: refined.role === "All-rounder" ? refined.allrounder_bias : refined.player_type
    };

    // 3. 🧼 Final Data Cleaning
    const payload = Object.fromEntries(
      Object.entries(mappedFilters).filter(
        ([key, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "Any" &&
          key !== "allrounder_bias"
      )
    );

    console.log("🚀 Payload:", payload);

    const response = await axios.post(`${API_BASE_URL}/recommendations`, payload);

    // 🛡️ CRASH FIX: Ensure we return an array, never an object
    const finalData = Array.isArray(response.data) ? response.data : [];
    console.log("📥 Final Array for State:", finalData);
    
    return finalData;

  } catch (error) {
    console.error("❌ Fetch failed:", error);
    return []; // Fallback to empty array on error
  }
};