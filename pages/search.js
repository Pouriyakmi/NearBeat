import Link from 'next/link';
import { MapPin, Search as SearchIcon, UserRound } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { useFeed } from '../hooks/useFeed';
import { useUsers } from '../hooks/useUsers';

export default function SearchPage() {
  const { users } = useUsers();
  const { items } = useFeed();
  return (
    <AppShell title="Search | NearBeat">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader eyebrow="Search" title="Find people and music" description="Live results from Firestore." />
        <label className="mt-6 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.055] px-4 py-3 text-slate-400"><SearchIcon size={19} /><input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search NearBeat" /></label>
        <section className="mt-7 grid gap-6 lg:grid-cols-2">
          <div><h2 className="mb-3 flex items-center gap-2 text-lg font-black text-white"><UserRound size={18} /> Nearby people</h2><div className="space-y-3">{users.slice(0, 4).map((u) => <Link key={u.uid} href={`/profile/${u.uid}`} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl font-black bg-emerald-400 text-black">{u.avatar || 'NB'}</div><div className="min-w-0 flex-1"><p className="truncate font-bold text-white">{u.displayName || u.username}</p><p className="truncate text-sm text-slate-400">@{u.username || 'listener'}</p></div><span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={13} /> {u.approximateLocation || 'Nearby'}</span></Link>)}</div></div>
          <div><h2 className="mb-3 text-lg font-black text-white">Tracks</h2><div className="space-y-3">{items.slice(0, 6).map((t) => <TrackRow key={t.id} track={{ title: t.title, artist: t.artist, artworkGradient: t.artworkGradient || '#0f172a,#334155', isUploaded: true }} meta="track result" />)}</div></div>
        </section>
      </div>
    </AppShell>
  );
}
