import React, { createContext, useState, useEffect } from "react";

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  // 1. Search Results (The 8-12 ranked players from XGBoost)
  const [results, setResults] = useState([]);
  
  // 2. The Shortlist Bucket (Your 4-9 "probables")
  const [shortlist, setShortlist] = useState(() => {
  const saved = sessionStorage.getItem("shortlist"); // Changed to session
  return saved ? JSON.parse(saved) : [];
});

  // 3. Comparison State (Player 1 is the subject you clicked)
  const [player1, setPlayer1] = useState(null);

  // Sync Shortlist to LocalStorage to prevent refresh glitches
  useEffect(() => {
  sessionStorage.setItem("shortlist", JSON.stringify(shortlist)); // Changed to session
}, [shortlist]);

  // Logic: Add/Remove from Shortlist (The "Bucket" logic)
  const toggleShortlist = (player) => {
    setShortlist((prev) => {
      const exists = prev.find((p) => p.player_id === player.player_id);
     if (exists) {
  // Fix: If the player being removed is currently the comparison subject, clear it
        if (player1?.player_id === player.player_id) {
         setPlayer1(null);
  }
  return prev.filter((p) => p.player_id !== player.player_id);
}
      // Optional: Limit to 9 players as per your selector funnel
      if (prev.length >= 9) return prev; 
      return [...prev, player];
    });
  };

  // Logic: Clear all (For a new scouting session)
  const resetTeam = () => {
    setResults([]);
    setShortlist([]);
    setPlayer1(null);
    sessionStorage.removeItem("shortlist");
  };

  return (
    <TeamContext.Provider
      value={{
        results,
        setResults,
        shortlist,
        toggleShortlist,
        player1,
        setPlayer1,
        resetTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};