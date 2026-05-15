import { Eye, MapPin, Radio, Shield, Wifi } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import { usePrivacy } from '../context/PrivacyContext';

export default function SettingsPage() {
  const { privacy, updatePrivacy, refreshLocation } = usePrivacy();

  return (
    <AppShell title="Settings | NearBeat">
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader eyebrow="Settings" title="Privacy and location controls" description="We only show approximate distance, never exact location. You are always in control." />
        <section className="mt-7 space-y-3">
          <button onClick={refreshLocation} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <p className="font-bold text-white">Update my location</p><p className="text-sm text-slate-400">Last known approximation: {privacy.approximateLocation}</p>
          </button>
          <button onClick={() => updatePrivacy({ hideDistance: !privacy.hideDistance })} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left"><p className="font-bold text-white">Hide distance temporarily</p><p className="text-sm text-slate-400">Status: {privacy.hideDistance ? 'Hidden' : 'Visible'}</p></button>
          <button onClick={() => updatePrivacy({ visibleTo: privacy.visibleTo === 'nearby' ? 'friends' : 'nearby' })} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left"><p className="font-bold text-white">Visibility controls</p><p className="text-sm text-slate-400">Currently visible to: {privacy.visibleTo}</p></button>
          <button onClick={() => updatePrivacy({ online: !privacy.online })} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left"><p className="font-bold text-white">Online / offline state</p><p className="text-sm text-slate-400">Current state: {privacy.online ? 'Online' : 'Offline'}</p></button>
        </section>
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          {[Eye, MapPin, Radio, Wifi, Shield].map((Icon, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon size={18} className="text-emerald-300" /></div>)}
        </section>
      </div>
    </AppShell>
  );
}
