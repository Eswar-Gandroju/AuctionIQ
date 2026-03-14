import React from 'react';

export default function PlayerCard({ 
  player, 
  onCompare, 
  onShortlist, 
  isShortlisted = false 
}) {
  // Logic: Scale pred_score to 100 for the "Suitability" bar
  const suitability = Math.round(player.pred_score || 0) ;

  return (
    <div className="glass-panel rounded-[2rem] p-6 transition-all duration-300 hover:border-green-500/50 group">
      <div className="flex flex-col items-center text-center">
        
        {/* TOP SECTION: Circular Image & Star (Sketch 1) */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden">
            {/* Placeholder for player image */}
            <span className="text-zinc-700 text-3xl">👤</span>
          </div>
          {isShortlisted && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
              ★
            </div>
          )}
        </div>

        {/* NAME & SPECS (Sketch 1) */}
    {/* NAME & DYNAMIC SPECS */}
<h3 className="text-xl font-bold text-white tracking-tight">{player.player_name}</h3>

<p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-medium">
  {player.role === "Bowler" ? (
    // 🏏 If Bowler: Show Bowling Type & Style
    <>
      {player.bowling_type}
    </>
  ) : (
    // ⚡ If Batter or WK: Show Position & Batting Style
    <>
      {player.batting_position} <span className="mx-1 text-zinc-700">|</span> {player.batting_style}
    </>
  )}
</p>

        {/* PRICING & ORIGIN */}
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-sm text-zinc-300">
            Base Price: <span className="text-green-400 font-bold">₹{player.base_price_in_lakhs}L</span>
          </p>
          <p className="text-xs text-zinc-500">Nationality: {player.country}</p>
        </div>

        {/* SUITABILITY BAR (Sketch 1) */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Suitability</span>
            <span className="text-sm font-black text-green-400">{suitability}/100</span>
          </div>
          <div className="suitability-bar">
            <div 
              className="suitability-progress" 
              style={{ width: `${suitability}%` }} 
            />
          </div>
        </div>

        {/* METRICS PREVIEW (Subtle) */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6 pb-6 border-b border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Recent Form</p>
            <p className="text-sm text-zinc-200 font-mono">{(player.recent_form_score ).toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Consistency</p>
            <p className="text-sm text-zinc-200 font-mono">{player.consistency_index?.toFixed(1)}</p>
          </div>
        </div>

        {/* ACTION BUTTONS (Sketch 1) */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
         
          <button 
            onClick={(e) => { e.stopPropagation(); onShortlist(player); }}
            className={`col-span-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              isShortlisted 
              ? "bg-yellow-500 text-black" 
              : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </div>

      </div>
    </div>
  );
}