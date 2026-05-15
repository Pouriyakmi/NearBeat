import { useState } from 'react';
import { Upload } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { useFeed } from '../hooks/useFeed';
import { useAuth } from '../context/AuthContext';
import { usePrivacy } from '../context/PrivacyContext';
import { createMusicPost } from '../services/firestore';
import { uploadTrackFile } from '../services/storage';

export default function MusicPage() {
  const { items, loading, error } = useFeed();
  const { user, profile } = useAuth();
  const { refreshLocation } = usePrivacy();
  const [busy, setBusy] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const title = prompt('Track title') || file.name;
    const artist = prompt('Artist name') || profile?.displayName || 'Unknown';
    setBusy(true);
    try {
      const loc = await refreshLocation();
      const { downloadURL, storagePath } = await uploadTrackFile(user.uid, file);
      await createMusicPost({ title, artist, audioUrl: downloadURL, storagePath, ownerUid: user.uid, ownerName: profile?.displayName || user.email, ownerUsername: profile?.username || 'listener', ownerSystemId: profile?.systemId || 'NB-UNKNOWN', locationLabel: loc ? `${loc.lat}, ${loc.lng}` : 'Unavailable', locationMeta: loc || null, type: 'track' });
      alert('Track uploaded.');
    } finally { setBusy(false); e.target.value = ''; }
  };

  return <AppShell title="Music | NearBeat"><div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8"><PageHeader eyebrow="Music" title="Shared music library" description="Upload and discover real tracks from Firebase." action={<label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950"><Upload size={16} /> {busy ? 'Uploading…' : 'Upload track'}<input type="file" accept="audio/*" hidden onChange={handleUpload} disabled={busy} /></label>} />{loading && <p className="mt-6 text-slate-400">Loading tracks…</p>}{error && <p className="mt-6 text-rose-400">{error}</p>}<div className="mt-6 space-y-3">{items.map((track) => <TrackRow key={track.id} track={{ title: track.title, artist: track.artist, artworkGradient: '#0f172a,#334155', isUploaded: true }} meta={track.ownerUid === user?.uid ? 'you' : track.ownerName} />)}</div></div></AppShell>;
}
