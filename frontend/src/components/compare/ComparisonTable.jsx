import React from 'react';

export default function ComparisonTable({ p1, p2 }) {
  if (!p1 || !p2) return null;

  // Define the rows for comparison to keep the UI organized
  const stats = [
    { label: "Base Price", key: "base_price_in_lakhs", prefix: "₹", suffix: "L" },
    { label: "Recent Form (0-10)", key: "recent_form_score", multiplier: 10 },
    { label: "Impact Score", key: "impact_score", multiplier: 1 },
    { label: "Consistency", key: "consistency_index", multiplier: 1 },
    { label: "Suitability %", key: "pred_score", multiplier: 100, suffix: "%" },
    { label: "Reliability (AI)", key: "rule_score", multiplier: 100, suffix: "%" },
    { label: "Technical Style", key: "batting_style" },
    { label: "Ideal Position", key: "batting_position" },
  ];

  const formatValue = (player, stat) => {
    let val = player[stat.key];
    if (val === undefined || val === null) return "N/A";
    if (stat.multiplier) val = (val * stat.multiplier).toFixed(stat.label.includes('%') ? 0 : 2);
    return `${stat.prefix || ""}${val}${stat.suffix || ""}`;
  };

  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-950/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-zinc-900/50">
            <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Metric Comparison</th>
            <th className="p-6 text-sm font-bold text-green-400 text-center uppercase tracking-tighter italic">{p1.player_name}</th>
            <th className="p-6 text-sm font-bold text-indigo-400 text-center uppercase tracking-tighter italic">{p2.player_name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {stats.map((stat) => {
            const val1 = p1[stat.key];
            const val2 = p2[stat.key];
            
            // Highlight the better value if numeric
            const isP1Better = typeof val1 === 'number' && val1 > val2;
            const isP2Better = typeof val2 === 'number' && val2 > val1;

            return (
              <tr key={stat.label} className="hover:bg-white/5 transition-colors group">
                <td className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</td>
                <td className={`p-5 text-sm text-center font-mono ${isP1Better ? 'text-green-400 font-black' : 'text-zinc-300'}`}>
                  {formatValue(p1, stat)}
                </td>
                <td className={`p-5 text-sm text-center font-mono ${isP2Better ? 'text-indigo-400 font-black' : 'text-zinc-300'}`}>
                  {formatValue(p2, stat)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}