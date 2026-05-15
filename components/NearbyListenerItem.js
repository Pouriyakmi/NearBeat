import Link from 'next/link';
import { ChevronRight, Headphones, Lock, MapPin, Play, Radio } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function NearbyListenerItem({ listener, index = 0 }) {
  const track = listener.nowPlaying;

  return (
    <Link href={`/profile/${listener.id}`} className="group block rounded-[1.6rem] border border-white/8 bg-white/[0.045] p-3 transition hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.07]">
      <article className="flex gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg sm:h-14 sm:w-14" style={{ backgroundImage: `linear-gradient(135deg, ${listener.avatarGradient})` }}>
            {listener.avatar}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#11141d] ${listener.live ? 'bg-emerald-400' : 'bg-slate-500'}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-bold text-white">{listener.username}</h2>
                <span className="hidden text-xs text-slate-500 sm:inline">#{index + 1} closest</span>
              </div>
              <p className="mt-0.5 truncate text-sm text-slate-400">{listener.note}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-400">
              <MapPin size={14} className="text-emerald-300" />
              {listener.distance}
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-black/18 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundImage: `linear-gradient(135deg, ${track.artworkGradient})` }}>
                {track.isUploaded ? <Play size={16} fill="currentColor" /> : <Lock size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-white">{track.title}</p>
                  <span className={`hidden rounded-full px-2 py-0.5 text-[0.62rem] font-bold sm:inline ${track.isUploaded ? 'bg-emerald-400/12 text-emerald-200' : 'bg-white/8 text-slate-300'}`}>
                    {track.isUploaded ? 'Playable' : 'Metadata'}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-400">{track.artist}</p>
              </div>
              <ChevronRight size={18} className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
            <div className="mt-3">
              <ProgressBar value={track.progress} subtle />
              <div className="mt-2 flex items-center justify-between text-[0.7rem] text-slate-500">
                <span className="inline-flex items-center gap-1"><Headphones size={12} /> {listener.lastActive}</span>
                <span>{track.currentTime} / {track.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
