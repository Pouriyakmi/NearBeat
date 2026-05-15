import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../hooks/useFeed';
import { useUsers } from '../hooks/useUsers';
import { usePlaylists } from '../hooks/usePlaylists';
import NearbyListenerItem from '../components/NearbyListenerItem';
import TrackRow from '../components/TrackRow';
import { usePrivacy } from '../context/PrivacyContext';

export default function Feed() {
  const { session } = useAuth();
  const { items: posts, loading: postsLoading } = useFeed();
  const { users, loading: usersLoading } = useUsers();
  const { playlists, loading: plLoading } = usePlaylists();
  const { privacy } = usePrivacy();

  const me = users.find((u) => u.uid === session?.uid);
  const others = users.filter((u) => u.uid !== session?.uid);

  return (
    <AppShell title="NearBeat | Feed">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Now playing</p>
          <h1 className="mt-2 text-3xl font-black">{me?.displayName || 'You'}</h1>
          <p className="mt-2 text-slate-300">{me?.bio || 'Complete your profile from Profile page.'}</p>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">We only show approximate distance, not your real location. {privacy.hideDistance ? 'Distance hidden mode is ON.' : ''}</section>

        <section>
          <h2 className="mb-3 text-xl font-black">Latest music activity</h2>
          {postsLoading ? <p className="text-slate-400">Loading feed...</p> : posts.length === 0 ? <p className="text-slate-500">No posts yet. Upload your first track from Music page.</p> : <div className="space-y-3">{posts.map((p) => <TrackRow key={p.id} track={{ title: p.title, artist: p.artist, artworkGradient: p.artworkGradient || '#0f172a,#334155', isUploaded: true }} meta={p.ownerName || 'listener'} />)}</div>}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-black">People around you listening now</h2>
          {usersLoading ? <p className="text-slate-400">Loading users...</p> : others.length === 0 ? <p className="text-slate-500">No nearby users yet.</p> : <div className="grid gap-3 lg:grid-cols-2">{others.map((u, i) => <NearbyListenerItem key={u.uid} index={i} listener={{ id: u.uid, username: u.username || 'listener', avatar: u.avatar || 'NB', avatarGradient: '#1ed760,#39d0ff', note: u.bio || 'Listening on NearBeat', distance: privacy.hideDistance ? 'Distance hidden' : (u.approximateLocation || 'Nearby'), live: u.online, lastActive: 'now', nowPlaying: { title: 'Unknown track', artist: 'Unknown artist', artworkGradient: '#1f2937,#111827', isUploaded: false, progress: 20, currentTime: '0:40', duration: '3:30' } }} />)}</div>}
        </section>

        <section><h2 className="mb-3 text-xl font-black">Playlists</h2>{plLoading ? <p className="text-slate-400">Loading playlists...</p> : playlists.length === 0 ? <p className="text-slate-500">No playlists created yet.</p> : <div className="grid gap-3 sm:grid-cols-3">{playlists.map((playlist) => <article key={playlist.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-3"><div className="h-24 rounded-xl" style={{backgroundImage:`linear-gradient(135deg, ${playlist.gradient || '#0f172a,#334155'})`}}/><p className="mt-2 font-bold">{playlist.title}</p><p className="text-xs text-slate-400">{playlist.trackCount || 0} tracks</p></article>)}</div>}</section>
      </div>
    </AppShell>
  );
}
