import { Map } from 'lucide-react';
import AppShell from '../components/AppShell';
import FeedCard from '../components/FeedCard';
import { useFeed } from '../hooks/useFeed';
import { useUsers } from '../hooks/useUsers';
import { usePrivacy } from '../context/PrivacyContext';

export default function Feed() {
  const { privacy } = usePrivacy();
  const { users, loading: usersLoading } = useUsers();
  const { items, loading: feedLoading } = useFeed();

  const listeners = users.map((u) => ({
    id: u.uid || u.id,
    displayName: u.displayName || u.username || 'NearBeat User',
    username: u.username || 'listener',
    avatar: u.avatar || 'NB',
    avatarGradient: '#1ed760, #39d0ff',
    distance: u.approximateLocation || 'Nearby',
    note: u.bio || 'listening now',
    mood: 'live',
    live: true,
    lastActive: 'now',
    nowPlaying: {
      title: items.find((x) => x.ownerUid === (u.uid || u.id))?.title || 'No track yet',
      artist: items.find((x) => x.ownerUid === (u.uid || u.id))?.artist || 'NearBeat',
      artworkGradient: '#22d3ee, #2563eb, #0f172a',
      progress: 44,
      currentTime: '1:10',
      duration: '3:40',
      isUploaded: true,
    },
  }));

  return (
    <AppShell title="NearBeat | Nearby feed">
      <section className="px-4 py-10 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.36em] text-pulse">nearby feed</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">People around you listening right now.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Current location state: {privacy.approximateLocation}</p>
      </section>
      <section className="px-4 sm:px-6"><div className="glass-card rounded-[2rem] p-5"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neonBlue/10 text-neonBlue"><Map size={22} /></div><div><p className="font-bold">Live Firestore feed</p><p className="text-sm text-slate-400">{items.length} posts synced</p></div></div></div></section>
      {usersLoading || feedLoading ? <div className="px-6 py-10 text-slate-400">Loading live feed...</div> : listeners.length === 0 ? <div className="px-6 py-10 text-slate-400">No listeners yet. Create users in Firestore.</div> : <section className="grid gap-5 px-4 py-8 md:grid-cols-2 xl:grid-cols-3 sm:px-6">{listeners.map((listener, index) => <FeedCard key={listener.id} listener={listener} index={index} />)}</section>}
    </AppShell>
  );
}
