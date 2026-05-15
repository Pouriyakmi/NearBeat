import { ListMusic, Search, Upload } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { playlists, sharedTracks, trendingTracks } from '../data/mockUsers';

export default function MusicPage() {
  return (
    <AppShell title="Music library | NearBeat">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          eyebrow="Music"
          title="Shared music library"
          description="A future home for searchable tracks, uploads, saved songs, and playlists. The mock UI distinguishes playable uploads from metadata-only listening presence."
          action={<button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950" type="button"><Upload size={16} /> Upload later</button>}
        />

        <label className="mt-6 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.055] px-4 py-3 text-slate-400">
          <Search size={19} />
          <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search tracks, artists, playlists, or nearby uploads" />
        </label>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="mb-3 text-lg font-black text-white">Trending nearby</h2>
            <div className="space-y-3">{trendingTracks.map((track) => <TrackRow key={track.id} track={track} meta={`${track.saves} saves`} />)}</div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-black text-white">Recently shared</h2>
            <div className="space-y-3">{sharedTracks.map((track) => <TrackRow key={track.id} track={track} meta={track.length} />)}</div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-black text-white"><ListMusic size={18} /> Playlists</h2>
            <button className="rounded-full bg-white/8 px-3 py-2 text-sm font-semibold text-slate-300" type="button">Create later</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {playlists.map((playlist) => (
              <article key={playlist.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-3">
                <div className="h-28 rounded-[1.2rem]" style={{ backgroundImage: `linear-gradient(135deg, ${playlist.gradient})` }} />
                <h3 className="mt-3 font-black text-white">{playlist.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{playlist.description}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{playlist.trackCount} tracks</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
