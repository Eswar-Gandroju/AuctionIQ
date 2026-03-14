import React from 'react';

export default function StatBadge({ label, value, highlight = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl border transition-all duration-300
        ${highlight
          ? "bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
          : "bg-zinc-900/50 border-white/5 text-zinc-300"}
      `}
    >
      {/* Small, tight uppercase label matching your Results Card sketch */}
      <span className="uppercase tracking-[0.15em] text-[9px] font-black text-zinc-500 mb-0.5">
        {label}
      </span>

      {/* Bold, clean value display */}
      <span className="text-sm font-mono font-bold tracking-tight">
        {value ?? "N/A"}
      </span>
    </div>
  );
}