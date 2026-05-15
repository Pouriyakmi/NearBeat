import { motion } from 'framer-motion';
import { MapPin, Radio, Sparkles } from 'lucide-react';
import AppShell from '../components/AppShell';
import NearbyListenerItem from '../components/NearbyListenerItem';
import NowPlayingPanel from '../components/NowPlayingPanel';
import PageHeader from '../components/PageHeader';
import { currentUser, liveStats, sortedNearbyListeners } from '../data/mockUsers';

export default function Home() {
  return (
    <AppShell title="NearBeat | Live feed">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          eyebrow="Live feed"
          title="Music happening around you"
          description="Open NearBeat straight into listening presence: your current track, closest people, shared songs, and human status notes. Mock data only for now."
          action={<span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/12 px-3 py-2 text-sm font-bold text-emerald-200"><Radio size={16} /> 3 live nearby</span>}
        />

        <div className="mt-6">
          <NowPlayingPanel user={currentUser} />
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {liveStats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Closest listeners</h2>
              <p className="mt-1 text-sm text-slate-400">Always sorted by nearest available distance.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm font-semibold text-slate-200" type="button">
              <MapPin size={15} /> Radius
            </button>
          </div>
          <div className="space-y-3">
            {sortedNearbyListeners.map((listener, index) => (
              <motion.div key={listener.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <NearbyListenerItem listener={listener} index={index} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/8 bg-white/[0.04] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 rounded-2xl bg-emerald-400/12 p-2 text-emerald-300"><Sparkles size={18} /></span>
            <div>
              <h2 className="font-black text-white">Built for the next phases</h2>
              <p className="mt-2 leading-7 text-slate-400">The UI already separates playable shared uploads from metadata-only tracks, leaving room for PocketBase, realtime presence, auth, geolocation, and streaming later without overcomplicating Phase 1.</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
