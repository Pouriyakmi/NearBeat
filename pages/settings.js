import { Bell, Eye, MapPin, Music2, Shield } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';

const settingsGroups = [
  { icon: Eye, title: 'Listening visibility', description: 'Choose whether nearby people, friends, or only you can see your current song.', value: 'Nearby friends' },
  { icon: MapPin, title: 'Approximate location', description: 'Future geolocation should use approximate distance instead of exact coordinates.', value: 'Approximate' },
  { icon: Music2, title: 'Upload sharing', description: 'Control whether uploaded tracks are playable by others or metadata-only.', value: 'Ask every time' },
  { icon: Bell, title: 'Presence alerts', description: 'Optional notifications when close friends start listening nearby.', value: 'Off for now' },
  { icon: Shield, title: 'Safety defaults', description: 'Privacy-first defaults for beginners before authentication and backend work begin.', value: 'Enabled' },
];

export default function SettingsPage() {
  return (
    <AppShell title="Settings | NearBeat">
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader eyebrow="Settings" title="Privacy and presence controls" description="Mock controls that show how NearBeat can stay social without exposing too much. These are UI-only until backend and auth arrive." />
        <section className="mt-7 space-y-3">
          {settingsGroups.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="flex gap-3 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-emerald-300"><Icon size={19} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-black text-white">{item.title}</h2>
                    <span className="text-sm font-bold text-emerald-200">{item.value}</span>
                  </div>
                  <p className="mt-1 leading-6 text-slate-400">{item.description}</p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
