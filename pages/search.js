import Link from 'next/link';
import { MapPin, Search as SearchIcon, UserRound } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { sortedNearbyListeners, trendingTracks } from '../data/mockUsers';

export default function SearchPage() {
  return (
    <AppShell title="Search | NearBeat">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader eyebrow="Search" title="Find people and music" description="A simple mock search page prepared for future users, tracks, playlists, and places." />
        <label className="mt-6 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.055] px-4 py-3 text-slate-400">
          <SearchIcon size={19} />
          <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search NearBeat" />
        </label>

        <section className="mt-7 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-white"><UserRound size={18} /> Nearby people</h2>
            <div className="space-y-3">
              {sortedNearbyListeners.slice(0, 4).map((listener) => (
                <Link key={listener.id} href={`/profile/${listener.id}`} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl font-black" style={{ backgroundImage: `linear-gradient(135deg, ${listener.avatarGradient})` }}>{listener.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">{listener.displayName}</p>
                    <p className="truncate text-sm text-slate-400">Listening to {listener.nowPlaying.title}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={13} /> {listener.distance}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-black text-white">Tracks</h2>
            <div className="space-y-3">{trendingTracks.map((track) => <TrackRow key={track.id} track={track} meta="track result" />)}</div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
