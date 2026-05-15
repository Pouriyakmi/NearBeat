import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { useRealTimeFeed } from '../hooks/useRealTimeFeed';
import { useAuth } from '../context/AuthContext';

export default function FeedPage() {
  const { items, loading, error } = useRealTimeFeed();
  const { user } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Update timestamp whenever items change
  useEffect(() => {
    if (items.length > 0) {
      setLastUpdate(new Date());
    }
  }, [items]);

  return (
    <AppShell title="Feed | NearBeat">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          eyebrow="Nearby"
          title="Live Feed"
          description="Discover music from people around you. Updates in real-time."
        />

        {loading && !items.length && (
          <div className="mt-6 text-slate-400">Loading your feed…</div>
        )}

        {error && <div className="mt-6 text-rose-400">Error: {error}</div>}

        {!loading && items.length === 0 && (
          <div className="mt-6 text-slate-400">No tracks nearby yet.</div>
        )}

        <div className="mt-6 space-y-3">
          {items.map((track) => (
            <TrackRow
              key={track.id}
              track={{
                title: track.title,
                artist: track.artist,
                artworkGradient: '#0f172a,#334155',
                isUploaded: true,
              }}
              meta={track.ownerUid === user?.uid ? 'you' : track.ownerName}
            />
          ))}
        </div>

        {items.length > 0 && (
          <p className="mt-4 text-xs text-slate-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </AppShell>
  );
}
