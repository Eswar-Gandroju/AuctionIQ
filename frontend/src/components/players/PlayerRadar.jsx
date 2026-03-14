import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

export default function PlayerRadar({ p1, p2 }) {
  // Mode Detection: Matches your "Selector Funnel" requirements
  const isCompare = p1 && p2;
  const isSingle = p1 && !p2;

  if (!p1) {
    return (
      <div className="h-[400px] flex items-center justify-center text-zinc-600 italic border border-dashed border-zinc-800 rounded-[2rem]">
        Select a player to visualize performance metrics
      </div>
    );
  }

  /* =========================
     DATA NORMALIZATION
     Ensures Impact (0-100) and Consistency (0-5) fit the same scale
  ========================== */
  const data = [
    { 
      metric: "Impact", 
      A: (p1.impact_score || 0) , 
      B: (p2?.impact_score || 0) 
    },
    { 
      metric: "Consistency", 
      A: (p1.consistency_index || 0) * 20, // Scaled 5.0 -> 100
      B: (p2?.consistency_index || 0) * 20 
    },
    { 
      metric: "Recent Form", 
      A: (p1.recent_form_score || 0) , 
      B: (p2?.recent_form_score || 0) 
    },
    { 
      metric: "Reliability", 
      A: (p1.rule_score || 0) , 
      B: (p2?.rule_score || 0)
    },
    { 
      metric: "Suitability", 
      A: (p1.pred_score || 0) , 
      // Requirement: Show P2 as 0 if not selected to avoid glitches
      B: (p2?.pred_score || 0)  
    }
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          {/* Visual Styling matching Sketch 3 */}
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          {/* PLAYER 1: The "Locked" Subject (Requirement #1) */}
          <Radar
            name={p1.player_name}
            dataKey="A"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.4}
            strokeWidth={3}
            animationBegin={0}
            animationDuration={1200} // Requirement #2: Animation
          />

          {/* PLAYER 2: The Comparison Subject */}
          {p2 && (
            <Radar
              name={p2.player_name}
              dataKey="B"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
              strokeWidth={3}
              animationBegin={200}
              animationDuration={1200} // Requirement #2: Animation
            />
          )}

          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}