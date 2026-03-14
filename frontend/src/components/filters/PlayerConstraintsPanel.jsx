import { useState } from "react";
import FilterSelect from "./FilterSelect";
import BudgetSlider from "./BudgetSlider";

// Mapping based on your CSV 'player_type' values
const ROLE_SPECIFIC_TYPES = {
  "Batter": ["Anchor", "Balanced", "Power Hitter"],
  "Wicketkeeper Batter": ["Anchor", "Balanced", "Power Hitter"],
  "Bowler": ["Economical", "Wicket Taker", "Death Specialist"],
  "All-rounder": ["Batting Heavy", "Balanced", "Bowling Heavy"]
};

export default function PlayerConstraint({ onSubmit }) {
  const [filters, setFilters] = useState({
    role: "Batter",
    nationality: "Indian",
    budget: 100,
    batting_position: "Toporder",
    player_type: "Balanced", 
    batting_style: "Any",
    bowling_style: "Right-arm",
    bowling_type: "Right-arm fast",
    allrounder_bias: "Balanced",
  });

  const handleRoleChange = (newRole) => {
    setFilters((prev) => ({
      ...prev,
      role: newRole,
      player_type: ROLE_SPECIFIC_TYPES[newRole][0]
    }));
  };

  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const finalPayload = { ...filters };
    if (filters.role === "All-rounder") {
      finalPayload.player_type = filters.allrounder_bias;
    }
    onSubmit(finalPayload);
  };

  return (
    <div className="space-y-8">
      {/* HEADER MATCHING SKETCH 2 */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em]">
          Requirement Panel
        </h2>
      </div>

      {/* 2-COLUMN INPUT GRID FOR "NICE" RATIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* ROW 1: CORE SELECTION */}
        <FilterSelect
          label="Target Role"
          value={filters.role}
          options={Object.keys(ROLE_SPECIFIC_TYPES)}
          onChange={handleRoleChange}
        />

        <FilterSelect
          label="Nationality"
          value={filters.nationality}
          options={["Indian", "Overseas"]}
          onChange={(v) => update("nationality", v)}
        />

        {/* ROW 2: STRATEGY & BUDGET */}
        <FilterSelect
          label={filters.role === "Bowler" ? "Bowling Strategy" : "Batter Strategy"}
          value={filters.player_type}
          options={ROLE_SPECIFIC_TYPES[filters.role]}
          onChange={(v) => update("player_type", v)}
        />

        <div className="pt-1">
          <BudgetSlider
            value={filters.budget}
            onChange={(v) => update("budget", v)}
          />
        </div>

        {/* DYNAMIC SECTION: BATTING (Sketch 2 Logic) */}
        {(filters.role === "Batter" || filters.role === "Wicketkeeper Batter") && (
          <>
            <FilterSelect
              label="Batting Position"
              value={filters.batting_position}
              options={["Toporder", "Middleorder", "Lowerorder"]}
              onChange={(v) => update("batting_position", v)}
            />
            <FilterSelect
              label="Preferred Hand"
              value={filters.batting_style}
              options={["Any", "RHB", "LHB"]}
              onChange={(v) => update("batting_style", v)}
            />
          </>
        )}

        {/* DYNAMIC SECTION: BOWLING */}
        {filters.role === "Bowler" && (
          <>
            <FilterSelect
              label="Arm Side"
              value={filters.bowling_style}
              options={["Right-arm", "Left-arm"]}
              onChange={(v) => update("bowling_style", v)}
            />
            <FilterSelect
              label="Action Type"
              value={filters.bowling_type}
              options={["Right-arm fast",
                        "Right-arm medium-fast",
                        "Right-arm off spin",
                        "Right-arm leg spin",
                        "Right-arm mystery spin",
                        "Left-arm fast",
                        "Left-arm medium-fast",
                        "Left-arm medium",
                        "Left-arm orthodox",
                        "Left-arm wrist spin"]}
              onChange={(v) => update("bowling_type", v)}
            />
          </>
        )}

        {/* DYNAMIC SECTION: ALL-ROUNDER BIAS */}
         {filters.role === "All-rounder" && (
      <FilterSelect
           label="All-rounder Priority"
           value={filters.allrounder_bias}
           options={ROLE_SPECIFIC_TYPES["All-rounder"]}
           onChange={(v) => update("allrounder_bias", v)}
  />
)}
      </div>

      {/* ACTION BUTTON (Sketch 2: "Find Best Players") */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all active:scale-[0.98]"
        >
          🔍 Find Best Players
        </button>
      </div>
    </div>
  );
}