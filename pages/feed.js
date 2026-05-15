import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, SlidersHorizontal } from 'lucide-react';
import FeedCard from '../components/FeedCard';
import PageShell from '../components/PageShell';
import SectionLabel from '../components/SectionLabel';
import { liveStats, nearbyListeners } from '../data/mockUsers';

export default function Feed() {
  return (
    <PageShell title="NearBeat | Nearby feed">
      <section className="py-10 sm:py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
          <ArrowLeft size={16} />
          Back to landing
        </Link>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.36em] text-pulse">nearby feed</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              The soundtrack around you, visualized.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              This page uses mock JSON data to preview the future NearBeat experience: nearby people, current songs, album covers, distance, and tiny status notes.
            </p>
          </div>
          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neonBlue/10 text-neonBlue">
                  <Map size={22} />
                </div>
                <div>
                  <p className="font-bold">Local radius preview</p>
                  <p className="text-sm text-slate-400">Fake distances for design only</p>
                </div>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Mock filters">
                <SlidersHorizontal size={18} />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {liveStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 p-3 text-center">
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 pb-14 md:grid-cols-2 xl:grid-cols-3">
        {nearbyListeners.map((listener, index) => (
          <FeedCard key={listener.id} listener={listener} index={index} />
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="pb-20"
      >
        <div className="glass-card rounded-[2.5rem] p-8 text-center sm:p-10">
          <SectionLabel
            eyebrow="next later"
            title="Backend and realtime come after the vibe feels right."
            description="Phase 2 can connect PocketBase, real users, and live updates. For now, every card is local mock data so the project stays beginner-friendly."
          />
        </div>
      </motion.section>
    </PageShell>
  );
}
