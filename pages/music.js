import { ListMusic, Search, Upload } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { useFeed } from '../hooks/useFeed';
import { usePlaylists } from '../hooks/usePlaylists';
import { createPost } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export default function MusicPage() {
  const { items } = useFeed();
  const { playlists } = usePlaylists();
  const { session } = useAuth();

  const handleUpload = async () => {
    const title = prompt('Track title');
    const artist = prompt('Artist name');
    if (!title || !artist) return;
    await createPost({ title, artist, ownerUid: session.uid, ownerName: session.email || 'listener' });
    alert('Uploaded to feed');
  };

  return (
    <AppShell title="Music library | NearBeat">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader eyebrow="Music" title="Shared music library" description="Real posts + playlists from Firestore." action={<button onClick={handleUpload} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950" type="button"><Upload size={16} /> Upload track</button>} />
        <label className="mt-6 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.055] px-4 py-3 text-slate-400"><Search size={19} /><input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search tracks" /></label>
        <section className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.9fr]"><div><h2 className="mb-3 text-lg font-black text-white">Trending nearby</h2><div className="space-y-3">{items.map((track) => <TrackRow key={track.id} track={{ title: track.title, artist: track.artist, artworkGradient: track.artworkGradient || '#0f172a,#334155', isUploaded: true }} meta={track.ownerName || 'listener'} />)}</div></div><div><h2 className="mb-3 text-lg font-black text-white">Playlists</h2><div className="space-y-3">{playlists.map((p) => <article key={p.id} className="rounded-2xl border border-white/8 bg-white/[0.04] p-3"><p className="font-bold">{p.title}</p><p className="text-sm text-slate-400">{p.description}</p></article>)}</div></div></section>
        <section className="mt-8"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-black text-white"><ListMusic size={18} /> Your uploads</h2></div><div className="space-y-3">{items.filter((x) => x.ownerUid === session.uid).map((track) => <TrackRow key={track.id} track={{ title: track.title, artist: track.artist, artworkGradient: track.artworkGradient || '#0f172a,#334155', isUploaded: true }} meta="you" />)}</div></section>
      </div>
    </AppShell>
  );
}
