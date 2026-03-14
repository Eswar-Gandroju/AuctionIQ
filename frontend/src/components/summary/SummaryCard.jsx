import React from 'react';

export default function SummaryCard({ filters }) {
  // 🛡️ Guard against undefined filters to prevent black screen
  if (!filters) return null;

  const {
    role,
    nationality,
    budget,
    player_type,
    allrounder_bias,
  } = filters;

  // Logic: Determine the specific strategy label based on role
  const strategyLabel = role === "All-rounder" ? allrounder_bias : player_type;

  return (
    <div className="glass-panel rounded-[2rem] p-8 space-y-8 shadow-2xl sticky top-10">
      <h3 className="text-xl font-bold text-white tracking-tight border-b border-white/5 pb-4">
        Selection summary!
      </h3>

      {/* DYNAMIC TEXT: Matches your Sketch 2 layout exactly */}
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Target Role</p>
          <p className="text-xl text-zinc-100 font-medium italic">
            Looking for a <span className="text-green-400 font-bold not-italic">{strategyLabel || "Balanced"}</span> {role}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Origin Preference</p>
          <p className="text-xl text-zinc-100 font-medium italic">
            From <span className="text-indigo-400 font-bold not-italic">{nationality}</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Financial Cap</p>
          <p className="text-xl text-zinc-100 font-medium italic">
            Budget Under <span className="text-green-400 font-bold not-italic">₹{budget} Lakhs</span>
          </p>
        </div>
      </div>

      {/* FOOTER: Minimalist visual indicator */}
      <div className="pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
            AI Engine Ready to Rank
          </p>
        </div>
      </div>
    </div>
  );
}