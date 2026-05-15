import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Music2, Signal } from 'lucide-react';
import { useNowPlayingPulse } from '../hooks/useNowPlayingPulse';
import { usePrivacy } from '../context/PrivacyContext';

export default function FeedCard({ listener, index = 0 }) {
  const pulse = useNowPlayingPulse();
  const { privacy } = usePrivacy();
  const distanceLabel = privacy.hideDistance ? 'Distance hidden' : listener.distance;

  return (
    <motion.article initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }} whileHover={{ y: -8, scale: 1.015 }} className="glass-card group relative overflow-hidden rounded-[2rem] p-4 transition duration-300 hover:border-pulse/40 hover:shadow-glow">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pulse/10 blur-3xl transition group-hover:bg-pulse/20" />
      <div className="relative flex gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl shadow-2xl" style={{ backgroundImage: `linear-gradient(135deg, ${listener.albumGradient})` }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_24%),linear-gradient(135deg,transparent,rgba(0,0,0,0.45))]" />
          <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl"><Music2 size={18} /></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-night shadow-pinkGlow" style={{ backgroundImage: `linear-gradient(135deg, ${listener.avatarGradient})` }}>{listener.avatar}</div><div><p className="font-semibold text-white">{listener.username}</p><div className="mt-1 flex items-center gap-1.5 text-xs text-pulse"><Signal size={13} /><span>live now</span></div></div></div><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{listener.mood}</span></div>
          <div className="mt-5"><h3 className="truncate text-2xl font-black tracking-tight text-white">{listener.songTitle}</h3><p className="mt-1 truncate text-sm text-slate-300">{listener.artist}</p></div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5"><MapPin size={15} className="text-neonBlue" />{distanceLabel}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5"><MessageCircle size={15} className="text-neonPink" />{listener.note}</span>
            <span className="rounded-full bg-pulse/10 px-3 py-1.5 text-pulse">{listener.bpm} bpm</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
