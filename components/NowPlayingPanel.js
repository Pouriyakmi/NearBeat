import Link from 'next/link';
import { Eye, Pause, Play, Settings, Share2, ShieldCheck } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function NowPlayingPanel({ user }) {
  const track = user.nowPlaying;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
      <div className="relative p-4 sm:p-5">
        <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 12% 20%, ${track.artworkGradient.split(',')[0]}55, transparent 35%)` }} />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.6rem] shadow-2xl sm:h-32 sm:w-32" style={{ backgroundImage: `linear-gradient(135deg, ${track.artworkGradient})` }}>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_38%,rgba(0,0,0,0.35))]" />
            </div>
            <div className="min-w-0 sm:hidden">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Now playing</p>
              <h1 className="mt-2 truncate text-2xl font-black tracking-tight">{track.title}</h1>
              <p className="truncate text-sm text-slate-300">{track.artist}</p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Now playing</p>
              <h1 className="mt-2 truncate text-4xl font-black tracking-tight">{track.title}</h1>
              <p className="mt-1 truncate text-slate-300">{track.artist} · {track.album}</p>
            </div>

            <div className="mt-4">
              <ProgressBar value={track.progress} />
              <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>{track.currentTime}</span>
                <span>{track.duration}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:scale-[1.02]" type="button">
                {track.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {track.isPlaying ? 'Playing' : 'Paused'}
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/12 px-3 py-2 text-xs font-bold text-emerald-200">
                <Share2 size={14} /> {user.uploadStatus}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-2 text-xs font-semibold text-slate-200">
                <Eye size={14} /> {user.visibility}
              </span>
              <Link href="/settings" className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/12">
                <Settings size={14} /> Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 bg-black/18 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5">
            <ShieldCheck size={15} className="text-emerald-300" /> Mood: {user.mood}
          </span>
          <span className="text-slate-400">“{user.status}”</span>
        </div>
      </div>
    </section>
  );
}
