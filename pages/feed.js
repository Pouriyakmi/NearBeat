import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import FeedCard from '../components/FeedCard';
import AppShell from '../components/AppShell';
import SectionLabel from '../components/SectionLabel';
import { usePrivacy } from '../context/PrivacyContext';
import { liveStats, nearbyListeners } from '../data/mockUsers';

export default function Feed() {
  const { privacy } = usePrivacy();

  return (
    <AppShell title="NearBeat | Nearby feed">
      <section className="px-4 py-10 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.36em] text-pulse">nearby feed</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">People around you listening right now.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">We only show approximate distance, not your real location. No coordinates, no map pins, no exact address.</p>
      </section>
      <section className="px-4 sm:px-6">
        <div className="glass-card rounded-[2rem] p-5">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neonBlue/10 text-neonBlue"><Map size={22} /></div><div><p className="font-bold">Privacy-first location layer</p><p className="text-sm text-slate-400">Current location state: {privacy.approximateLocation}</p></div></div>
          <div className="mt-5 grid grid-cols-3 gap-3">{liveStats.map((stat) => <div key={stat.label} className="rounded-2xl bg-white/5 p-3 text-center"><p className="text-xl font-black text-white">{stat.value}</p><p className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-slate-500">{stat.label}</p></div>)}</div>
        </div>
      </section>
      <section className="grid gap-5 px-4 py-8 md:grid-cols-2 xl:grid-cols-3 sm:px-6">{nearbyListeners.map((listener, index) => <FeedCard key={listener.id} listener={listener} index={index} />)}</section>
      <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="px-4 pb-20 sm:px-6"><div className="glass-card rounded-[2.5rem] p-8 text-center sm:p-10"><SectionLabel eyebrow="architecture ready" title="Frontend prepared for auth, OTP, sessions, privacy, and realtime." description="All backend calls are mocked today, but the flow is intentionally structured for secure integration later." /></div></motion.section>
    </AppShell>
  );
}
