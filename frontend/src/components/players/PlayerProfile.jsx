import React from "react";
import StatBadge from "./StatBadge";
import PlayerRadar from "./PlayerRadar";

export default function PlayerProfile({ player }) {
  if (!player) {
    return (
      <div className="text-zinc-500 text-center py-20 italic border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
        Select a player to view detailed AI analysis
      </div>
    );
  }

  // Helper for consistent formatting
  const formatScore = (val) => (val != null ? Number(val).toFixed(2) : "0.00");

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 space-y-8 w-full max-w-4xl shadow-2xl overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          {/* Circular Image Area from Sketch 1 */}
          <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-indigo-500/30 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
              {player.player_name}
            </h2>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
              {player.country} <span className="mx-2 text-zinc-800">|</span> 
              <span className="text-indigo-400">{player.role}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
          <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            {player.player_type}
          </div>
          <div className="text-[10px] text-zinc-600 font-mono">
            ID: {player.player_id}
          </div>
        </div>
      </div>

      {/* 2. VISUALIZATION & CORE STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="bg-zinc-950/50 rounded-[2rem] p-4 border border-white/5 shadow-inner">
           <PlayerRadar p1={player} />
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Market Valuation</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">₹{player.base_price_in_lakhs}</span>
            <span className="text-zinc-500 font-bold">LAKHS</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatBadge label="Impact" value={formatScore(player.impact_score)} highlight />
            <StatBadge label="Rank Score" value={formatScore(player.pred_score)} />
            <StatBadge label="Form" value={formatScore(player.recent_form_score)} />
            <StatBadge label="Consistency" value={formatScore(player.consistency_index)} />
          </div>
        </div>
      </div>

      {/* 3. TECHNICAL SPECS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
        <div className="space-y-1">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Batting Style</p>
          <p className="text-sm text-zinc-100 font-semibold">{player.batting_style || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Position</p>
          <p className="text-sm text-zinc-100 font-semibold">{player.batting_position || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Bowling</p>
          <p className="text-sm text-zinc-100 font-semibold">{player.bowling_type || "N/A"}</p>
        </div>
      </div>

      {/* 4. AI INSIGHT BOX */}
      <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
          <span className="text-green-500 font-black uppercase text-[10px] tracking-[0.2em]">Selector Note</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-medium">
          Based on 2024-2026 data, <span className="text-white font-bold">{player.player_name}</span> is 
          identified as a <span className="text-indigo-300 font-bold">{player.player_type}</span>. 
          His high Suitability score of <span className="text-white font-bold">{formatScore(player.pred_score)}</span> suggests 
          he is a premium pick for your current team strategy.
        </p>
      </div>
    </div>
  );
}