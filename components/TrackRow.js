import { Lock, Play, Plus } from 'lucide-react';

export default function TrackRow({ track, meta }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundImage: `linear-gradient(135deg, ${track.artworkGradient})` }}>
        {track.isUploaded ? <Play size={15} fill="currentColor" /> : <Lock size={15} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{track.title}</p>
        <p className="truncate text-xs text-slate-400">{track.artist}{meta ? ` · ${meta}` : ''}</p>
      </div>
      <span className={`hidden rounded-full px-2.5 py-1 text-xs font-bold sm:inline ${track.isUploaded ? 'bg-emerald-400/12 text-emerald-200' : 'bg-white/8 text-slate-400'}`}>
        {track.isUploaded ? 'Listen' : 'Info'}
      </span>
      <button className="rounded-full bg-white/8 p-2 text-slate-300" type="button" aria-label={`Save ${track.title}`}>
        <Plus size={16} />
      </button>
    </div>
  );
}
