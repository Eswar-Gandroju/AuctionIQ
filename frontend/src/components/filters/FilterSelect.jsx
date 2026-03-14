import React from 'react';

export default function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      {/* 1. LABEL: High-contrast, tight tracking matching Sketch 2 */}
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>

      {/* 2. SELECT: Styled for the "Glass Panel" aesthetic */}
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            bg-zinc-950/50 
            border border-white/5 
            text-zinc-100 
            text-sm font-semibold
            rounded-2xl 
            px-4 py-3
            appearance-none
            cursor-pointer
            transition-all duration-300
            focus:outline-none 
            focus:ring-2 focus:ring-green-500/20
            focus:border-green-500/50
            group-hover:border-white/10
          "
        >
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              className="bg-zinc-900 text-zinc-200"
            >
              {opt}
            </option>
          ))}
        </select>

        {/* 3. CUSTOM ARROW: Makes it look "nice" and custom */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-green-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}