import { motion } from 'framer-motion';
import { Clock3, MapPin, Music2 } from 'lucide-react';

export default function FeedCard({ listener, index = 0 }) {
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="glass-card rounded-[2rem] p-4">
      <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400 text-black font-black">{listener.avatar}</div><div><p className="font-semibold">{listener.displayName}</p><p className="text-sm text-slate-400">@{listener.username} · {listener.systemId}</p></div></div>
      <div className="mt-4 rounded-2xl bg-white/5 p-3"><p className="text-xl font-black truncate">{listener.songTitle}</p><p className="text-sm text-slate-300 truncate">{listener.artist}</p></div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300"><span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"><Music2 size={13} />{listener.postType || 'upload'}</span><span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"><Clock3 size={13} />{listener.timeLabel}</span><span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1"><MapPin size={13} />{listener.location || 'Location unavailable'}</span></div>
    </motion.article>
  );
}
