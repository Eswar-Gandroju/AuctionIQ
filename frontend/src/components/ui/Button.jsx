import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", // primary, secondary, ghost, outline
  size = "md", 
  isLoading = false,
  className = "",
  disabled = false,
  icon: Icon
}) {
  
  // 🎨 Variants matching your Glassmorphism theme
  const variants = {
    primary: "bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.2)]",
    secondary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]",
    outline: "bg-transparent border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900",
    danger: "bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm"
  };

  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          {/* Subtle spinner for the "Ranking..." state */}
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {children}
        </div>
      )}
    </button>
  );
}