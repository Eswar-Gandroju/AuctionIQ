import React from "react";
import PlayerRadar from "../players/PlayerRadar";
import StatBadge from "../players/StatBadge";

// Added onSelectP1 to the props
export default function PlayerCompare({ p1, p2, pool = [], onSelectP1, onSelectP2 }) {
  
  // Requirement #1: Dynamic filtering
  // P2 cannot be P1
  const p2Options = pool.filter((p) => p.player_id !== p1?.player_id);
  // P1 cannot be P2
  const p1Options = pool.filter((p) => p.player_id !== p2?.player_id);

  if (!p1) {
    return (
      <div className="text-zinc-500 text-center py-20 italic">
        Return to the builder to select a primary player for comparison.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. SELECTOR HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
        
        {/* PLAYER 1 (Now switchable from the same pool!) */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Subject Player</p>
          <select
            className="bg-transparent border-none text-3xl font-black text-green-400 italic uppercase tracking-tighter outline-none cursor-pointer"
            value={p1?.player_id || ""}
            onChange={(e) => onSelectP1(pool.find(p => String(p.player_id) === e.target.value))}
          >
            {p1Options.map(player => (
              <option key={player.player_id} value={player.player_id} className="bg-zinc-900 text-white text-sm">
                {player.player_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-400 mt-1">{p1.role} • {p1.country}</p>
        </div>

        {/* VS DIVIDER */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black text-zinc-800 italic leading-none">VS</span>
          <div className="h-10 w-px bg-gradient-to-b from-zinc-800 to-transparent mt-2" />
        </div>

        {/* PLAYER 2 (Dropdown Selector) */}
        {/* PLAYER 2 (Dropdown Selector) */}
   <div className="flex-1 text-center md:text-right">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Compare With</p>
      <select
         className="bg-transparent border-none text-3xl font-black text-indigo-400 italic uppercase tracking-tighter outline-none cursor-pointer text-right appearance-none md:appearance-auto"
    // Note: I used indigo-400 here to match your theme's "Player 2" color, 
    // but change it to text-green-400 if you want them identical.
        onChange={(e) => onSelectP2(pool.find(p => String(p.player_id) === e.target.value))}
      value={p2?.player_id || ""}
  >
    <option value="" disabled className="bg-zinc-900 text-white text-sm">Select Player 2...</option>
    {p2Options.map((player) => (
      <option key={player.player_id} value={player.player_id} className="bg-zinc-900 text-white text-sm">
        {player.player_name}
      </option>
    ))}
  </select>
  {p2 && <p className="text-xs text-zinc-400 mt-1">{p2.role} • {p2.country}</p>}
</div>
      </div>

      {/* 2. CENTRAL ANIMATED RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Stats (Added fallbacks) */}
        <div className="lg:col-span-3 space-y-4">
           <StatBadge label="Impact" value={(p1.impact_score || 0).toFixed(1)} highlight />
           <StatBadge label="Consistency" value={(p1.consistency_index || 0).toFixed(1)} />
           <StatBadge label="Recent Form" value={(p1.recent_form_score || 0).toFixed(1)} />
        </div>

        {/* The Animated Radar Overlay */}
        <div className="lg:col-span-6 bg-zinc-950/30 rounded-[3rem] p-6 border border-white/5 shadow-inner">
          <PlayerRadar p1={p1} p2={p2} />
        </div>

        {/* Right Stats */}
        <div className="lg:col-span-3 space-y-4">
           {p2 ? (
             <>
               <StatBadge label="Impact" value={(p2.impact_score || 0).toFixed(1)} highlight />
               <StatBadge label="Consistency" value={(p2.consistency_index || 0).toFixed(1)} />
               <StatBadge label="Recent Form" value={(p2.recent_form_score || 0).toFixed(1)} />
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic text-xs text-center px-6 space-y-4">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center animate-pulse">?</div>
                <p>Pick a candidate from your shortlist to see comparison data</p>
             </div>
           )}
        </div>
      </div>

      {/* 3. FINAL INSIGHT TABLE */}
      {p2 && (
        <div className="pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="text-center p-4 bg-zinc-900/20 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1 tracking-widest">Price Gap</p>
              <p className="text-xl font-bold text-white">
                ₹{Math.abs((p1.base_price_in_lakhs || 0) - (p2.base_price_in_lakhs || 0))}L
              </p>
           </div>
           <div className="text-center p-4 bg-zinc-900/20 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1 tracking-widest">Suitability Δ</p>
              <p className={`text-xl font-bold ${p1.pred_score >= p2.pred_score ? 'text-green-400' : 'text-indigo-400'}`}>
                {Math.abs((p1.pred_score || 0) - (p2.pred_score || 0)).toFixed(1)}%
              </p>
           </div>
        </div>
      )}
    </div>
  );
}