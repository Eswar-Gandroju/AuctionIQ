import React from 'react';

export default function BudgetSlider({ value, onChange }) {
  return (
    <div className="space-y-4 py-2">
      {/* 1. HEADER: LABEL + DYNAMIC VALUE (Sketch 2) */}
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
          Budget (in lakhs)
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-green-400">₹{value}</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase">Lakhs</span>
        </div>
      </div>

      {/* 2. CUSTOM SLIDER TRACK */}
      <div className="relative flex items-center group">
        <input
          type="range"
          min={10}
          max={300}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer
            accent-green-500 hover:accent-green-400 transition-all
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,197,94,0.5)]
          "
        />
      </div>

      {/* 3. RANGE HINTS matching the "Nice" Ratio */}
      <div className="flex justify-between px-1">
        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">Min: ₹10L</span>
        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">Max: ₹300L</span>
      </div>
    </div>
  );
}