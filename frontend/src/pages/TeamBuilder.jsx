import { useState, useContext, useEffect } from "react";
import { TeamContext } from "../context/TeamContext";
import PlayerConstraint from "../components/filters/PlayerConstraintsPanel";
import PlayerCard from "../components/players/PlayerCard";
import SummaryCard from "../components/summary/SummaryCard";
import ShortlistTray from "../components/summary/ShortlistTray"; // Added the Tray we built
import { getRecommendations } from "../api/recommend";

export default function TeamBuilder() {
  // 🧠 Context for global state management
  const { setResults, results, setPlayer1, toggleShortlist, shortlist } = useContext(TeamContext);
  
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    role: "Batter",
    nationality: "Indian",
    budget: 100,
    player_type: "Balanced",
    batting_position: "Toporder",
  });

  // 🔍 Handle Search from Requirement Panel
  const handleSearch = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    
    try {
      const data = await getRecommendations(newFilters);
      
      // 🛡️ CRASH FIX: Ensure we only set the state if data is an actual list
      if (Array.isArray(data)) {
        setResults(data); 
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Ranker API Error:", error);
      setResults([]); // Fallback to empty on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-green-400 tracking-tighter italic uppercase">
              🏟️ IARS Architect
            </h1>
            <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase mt-2">
              XGBoost Powered Talent Discovery
            </p>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">System Status</span>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-xs font-mono text-zinc-400">HOSTEL_NODE_ACTIVE</span>
             </div>
          </div>
        </div>

        {/* 60/40 GRID RATIO */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start">
          
          {/* LEFT: 🧠 Requirement Panel & Results (60%) */}
          <div className="lg:col-span-6 space-y-10">
            
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
              <PlayerConstraint onSubmit={handleSearch} isLoading={loading} />
            </div>

            {/* RESULTS SECTION */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">Recommendations</h2>
                  <span className="h-[1px] w-12 bg-zinc-800"></span>
                </div>
                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">AI Ranking...</span>
                  </div>
                )}
              </div>

              {/* 🛡️ DEFENSIVE RENDERING: results.map is only called if it's an array */}
              {Array.isArray(results) && results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((player) => (
                    <PlayerCard
                      key={player.player_id || player.player_name}
                      player={player}
                      onCompare={() => setPlayer1(player)}
                      onShortlist={() => toggleShortlist(player)}
                      isShortlisted={shortlist.some(s => s.player_id === player.player_id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center border border-white/5 bg-zinc-900/20 rounded-[2.5rem] text-zinc-600">
                  {loading ? (
                    <div className="space-y-4 text-center">
                       <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                       <p className="text-[10px] font-bold uppercase tracking-widest">Processing Data...</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="italic text-sm">No players match the current constraints.</p>
                      <p className="text-[10px] uppercase font-bold text-zinc-700">Try relaxing the budget or role type</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: 🎯 Selection Summary (40% - Sticky) */}
          <div className="lg:col-span-4 sticky top-10 space-y-6">
            <SummaryCard 
              filters={filters} 
              shortlist={shortlist}
            />
            {/* Added the Shortlist Tray here to visualize your "Bucket" */}
            <ShortlistTray />
          </div>

        </div>
      </div>
    </div>
  );
}