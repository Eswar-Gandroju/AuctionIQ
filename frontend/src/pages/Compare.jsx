import { useState, useContext, useEffect } from "react";
import { TeamContext } from "../context/TeamContext";
import PlayerCompare from "../components/compare/PlayerCompare";
import { Link } from "react-router-dom";

export default function Compare() {
  const { player1, shortlist, results, setPlayer1 } = useContext(TeamContext);
  
  // State for Player 2
  const [player2, setPlayer2] = useState(null);

  // 🛠️ AUTO-LOAD LOGIC:
  // If the user arrives here with a shortlist but p1/p2 aren't set, 
  // let's grab the first two players automatically.
 useEffect(() => {
  // Strategy: ONLY auto-load if the slots are currently empty.
  // This allows the initial setup to happen but doesn't "lock" the user.
  if (shortlist.length >= 2) {
    if (!player1) {
      setPlayer1(shortlist[0]);
    }
    // Only set player2 if it hasn't been picked yet
    if (!player2) {
      setPlayer2(shortlist[1]);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ⚡ THE FIX: Empty dependency array means this runs ONLY once on mount.

  const comparisonPool = shortlist.length > 0 ? shortlist : results;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <Link to="/" className="group flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest">
            <span className="transition-transform group-hover:-translate-x-1">←</span> 
            Back to Team Builder
          </Link>
          <h1 className="text-4xl font-black mt-2 tracking-tighter italic uppercase">
            Comparison <span className="text-green-500">Engine</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
            {shortlist.length > 0 
              ? `Filtering: Shortlist Bucket (${shortlist.length} Players)` 
              : "Filtering: Search Results Pool"}
          </p>
        </div>
        
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Analytics Feed</span>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <span className="text-xs font-mono text-zinc-400">RADAR_COMP_ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-zinc-900/30 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full" />
        
        <PlayerCompare
          p1={player1}          
          p2={player2}          
          pool={comparisonPool} 
          onSelectP1={setPlayer1} // Added: User might want to swap P1 too
          onSelectP2={setPlayer2}
        />
      </div>

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Impact Overlay</h4>
          <p className="text-xs text-zinc-400">Higher area in the radar chart indicates a more versatile match-winner.</p>
        </div>
        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Consistency Delta</h4>
          <p className="text-xs text-zinc-400">Check the variance between the two players' Consistency Index scores.</p>
        </div>
        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Value Score</h4>
          <p className="text-xs text-zinc-400">Cross-reference Suitability % with their base price for ROI analysis.</p>
        </div>
      </div>
    </div>
  );
}