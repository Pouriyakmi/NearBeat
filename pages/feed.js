import AppShell from '../components/AppShell';
import FeedCard from '../components/FeedCard';
import { useFeed } from '../hooks/useFeed';

export default function Feed() {
  const { items, loading, error } = useFeed();
  const rows = items.map((p) => ({ id: p.id, displayName: p.ownerName || 'Unknown', username: p.ownerUsername || 'listener', systemId: p.ownerSystemId || 'NB-UNKNOWN', avatar: (p.ownerName || 'NB').slice(0, 2).toUpperCase(), songTitle: p.title, artist: p.artist, postType: p.type || 'track', timeLabel: p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : 'Just now', location: p.locationLabel || 'Unavailable' }));

  return <AppShell title="NearBeat | Feed"><section className="px-4 py-10 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.36em] text-pulse">live feed</p><h1 className="mt-4 text-4xl font-black sm:text-5xl">Real listener activity</h1></section>{loading && <div className="px-6 py-10 text-slate-400">Loading feed…</div>}{error && <div className="px-6 py-10 text-rose-400">Failed to load feed: {error}</div>}{!loading && !error && rows.length === 0 && <div className="px-6 py-10 text-slate-400">No posts yet. Upload a track to start.</div>}{!loading && !error && rows.length > 0 && <section className="grid gap-5 px-4 py-8 md:grid-cols-2 xl:grid-cols-3 sm:px-6">{rows.map((listener, index) => <FeedCard key={listener.id} listener={listener} index={index} />)}</section>}</AppShell>;
}
