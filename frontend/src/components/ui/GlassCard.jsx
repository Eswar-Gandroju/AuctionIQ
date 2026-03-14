import React from 'react';

export default function GlassCard({ 
  children, 
  className = "", 
  interactive = false,
  noPadding = false 
}) {
  return (
    <div className={`
      /* 🪄 The Core Glassmorphism Logic */
      bg-zinc-900/40 
      backdrop-blur-xl 
      border border-white/10 
      rounded-[2.5rem] 
      shadow-2xl 
      transition-all 
      duration-500
      
      /* Interactive state for Player Cards */
      ${interactive ? 'hover:bg-zinc-900/60 hover:border-green-500/30 hover:shadow-green-500/5' : ''}
      
      /* Padding and Custom Overrides */
      ${noPadding ? '' : 'p-8'}
      ${className}
    `}>
      {children}
    </div>
  );
}