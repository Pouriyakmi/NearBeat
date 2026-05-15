import AppShell from '../components/AppShell';
import NowPlayingPanel from '../components/NowPlayingPanel';
import NearbyListenerItem from '../components/NearbyListenerItem';
import { usePrivacy } from '../context/PrivacyContext';
import { currentUser, nearbyListeners, playlists, trendingTracks } from '../data/mockUsers';
import TrackRow from '../components/TrackRow';

export default function Feed() {
  const { privacy } = usePrivacy();
  return (
    <AppShell title="NearBeat | Feed">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8 space-y-6">
        <NowPlayingPanel user={currentUser} />

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm text-slate-300">We only show approximate distance, not your real location.</p>
          <p className="mt-1 text-xs text-slate-500">Current mode: {privacy.hideDistance ? 'Distance hidden' : privacy.approximateLocation}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-black text-white">What you can do with music</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {trendingTracks.slice(0, 4).map((track) => <TrackRow key={track.id} track={track} meta={`${track.saves} saves`} />)}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-black text-white">People around you listening now</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {nearbyListeners.map((listener, i) => <NearbyListenerItem key={listener.id} listener={{...listener, distance: privacy.hideDistance ? 'Distance hidden' : listener.distance}} index={i} />)}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-black text-white">Playlists for your mood</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {playlists.map((playlist) => <article key={playlist.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-3"><div className="h-24 rounded-xl" style={{backgroundImage:`linear-gradient(135deg, ${playlist.gradient})`}}/><p className="mt-2 font-bold">{playlist.title}</p><p className="text-xs text-slate-400">{playlist.trackCount} tracks</p></article>)}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
