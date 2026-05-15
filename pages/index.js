import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Music2, Sparkles, Users } from 'lucide-react';
import PageShell from '../components/PageShell';
import PhonePreview from '../components/PhonePreview';
import SectionLabel from '../components/SectionLabel';
import { liveStats } from '../data/mockUsers';

const featureCards = [
  {
    icon: Music2,
    title: 'See what is playing',
    description: 'Mock nearby listeners share the track, artist, mood, and album-cover energy they are tuned into.',
  },
  {
    icon: MapPin,
    title: 'Feel the distance',
    description: 'Prototype cards show approximate distances so the feed feels local without building location logic yet.',
  },
  {
    icon: Users,
    title: 'Social presence first',
    description: 'Short notes make every song feel human, like Discord status meets Spotify activity.',
  },
];

export default function Home() {
  return (
    <PageShell title="NearBeat | Social music presence">
      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pulse/30 bg-pulse/10 px-4 py-2 text-sm text-pulse shadow-glow">
            <Sparkles size={16} />
            Phase 1 prototype — mock data only
          </div>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Hear the city around you.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            NearBeat is a dark, ambient social music prototype where nearby people, songs, notes, and distance glow together in one alive feed.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/feed" className="group inline-flex items-center justify-center gap-2 rounded-full bg-pulse px-6 py-4 font-bold text-night shadow-glow transition hover:scale-[1.02]">
              Explore nearby feed
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <a href="#prototype" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10">
              See what is included
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {liveStats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-3xl p-4">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <PhonePreview />
      </section>

      <section id="prototype" className="pb-20">
        <SectionLabel
          eyebrow="simple by design"
          title="Built to learn, not to overwhelm."
          description="This first phase is only UI, animation, and fake JSON data. No auth, no backend, no realtime, and no database yet."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="glass-card rounded-[2rem] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-pulse">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
