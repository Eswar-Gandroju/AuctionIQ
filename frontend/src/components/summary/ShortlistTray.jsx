import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { TeamContext } from '../../context/TeamContext';
import GlassCard from '../ui/GlassCard';

export default function ShortlistTray() {
  const { shortlist, toggleShortlist } = useContext(TeamContext);
  const navigate = useNavigate();

  const canCompare = shortlist.length >= 2;

  return (
    <GlassCard className="border-indigo-500/20 shadow-2xl shadow-indigo-500/10 bg-zinc-900/90 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Shortlist Bucket
          </h3>
        </div>
        <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
          {shortlist.length}/9
        </span>
      </div>

      {shortlist.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-600 text-xs italic">No probables added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {shortlist.map((player) => (
            <div 
              key={player.player_id}
              className="group flex items-center justify-between bg-zinc-950/50 p-3 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                  👤
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-200">{player.player_name}</p>
                  <p className="text-[9px] text-zinc-500 uppercase">{player.role}</p>
                </div>
              </div>

              <button 
                onClick={() => toggleShortlist(player)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-all"
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* COMPARE ACTION SECTION */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <button 
          disabled={!canCompare}
          onClick={() => navigate('/compare')}
          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            canCompare 
            ? "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {canCompare ? "🚀 Launch Comparison" : `Add ${2 - shortlist.length} more to compare`}
        </button>
      </div>
    </GlassCard>
  );
}