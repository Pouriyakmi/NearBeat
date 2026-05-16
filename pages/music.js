import { useMemo, useState } from 'react';
import { Upload } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import TrackRow from '../components/TrackRow';
import { useFeed } from '../hooks/useFeed';
import { useAuth } from '../context/AuthContext';
import { usePrivacy } from '../context/PrivacyContext';
import { createMusicPost } from '../services/firestore';
import { uploadTrackFile } from '../services/storage';

const LOCATION_TIMEOUT_MS = 7000;

async function safeRefreshLocation(refreshLocation) {
  if (!refreshLocation) return null;
  return Promise.race([
    refreshLocation(),
    new Promise((resolve) => setTimeout(() => resolve(null), LOCATION_TIMEOUT_MS)),
  ]);
}

export default function MusicPage() {
  const { items, loading, error } = useFeed();
  const { user, profile } = useAuth();
  const { refreshLocation } = usePrivacy();
  const [progress, setProgress] = useState(0);
  const [uploadState, setUploadState] = useState('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [form, setForm] = useState({ title: '', artist: '', album: '', genre: '', imageUrl: '' });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const title = form.title || file.name.replace(/\.[^/.]+$/, '');
    const artist = form.artist || profile?.displayName || 'Unknown';

    setUploadMessage('Starting upload…');
    setUploadState('uploading');
    setProgress(1);
    try {
      setUploadMessage('Checking location permission…');
      const loc = await safeRefreshLocation(refreshLocation);
      setUploadMessage('Uploading file to Firebase Storage…');
      const { downloadURL, storagePath } = await uploadTrackFile(user.uid, file, (nextProgress, rawState) => {
        setProgress(nextProgress);
        if (rawState === 'paused') setUploadState('uploading');
      }, {
        title,
        artist,
        album: form.album,
        genre: form.genre,
      });
      setUploadState('finalizing');
      setUploadMessage('Upload finished. Creating post…');
      const createdPost = await createMusicPost({
        title,
        artist,
        album: form.album || 'Unknown album',
        genre: form.genre || 'Unknown genre',
        coverImage: form.imageUrl || '',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        audioUrl: downloadURL,
        storagePath,
        ownerUid: user.uid,
        ownerName: profile?.displayName || user.email,
        ownerUsername: profile?.username || 'listener',
        ownerSystemId: profile?.systemId || 'NB-UNKNOWN',
        locationLabel: loc ? `${loc.lat}, ${loc.lng}` : 'Unavailable',
        locationMeta: loc || null,
        type: 'track',
      });
      setUploadState('success');
      setUploadMessage(`Track uploaded successfully${createdPost?.id ? ` (post: ${createdPost.id})` : ''}.`);
      setForm({ title: '', artist: '', album: '', genre: '', imageUrl: '' });
    } catch (err) {
      setUploadState('error');
      console.error('[music] upload failed', {
        code: err?.code,
        message: err?.message,
        originalMessage: err?.originalMessage,
        originalError: err?.originalError,
      });
      if (err?.code === 'storage/cors') {
        console.error('[music] storage CORS setup required for origin:', window?.location?.origin);
      }
      setUploadMessage(err?.message || err?.originalMessage || 'Upload failed.');
    } finally {
      setProgress(0);
      e.target.value = '';
    }
  };

  const myTracks = useMemo(() => items.filter((t) => t.ownerUid === user?.uid), [items, user?.uid]);

  return <AppShell title="Music | NearBeat"><div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8"><PageHeader eyebrow="Music" title="Shared music library" description="Upload and discover real tracks from Firebase." />
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <p className="mb-3 text-sm font-bold text-slate-200">Upload with metadata</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {['title', 'artist', 'album', 'genre', 'imageUrl'].map((key) => <input key={key} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={key === 'imageUrl' ? 'Cover image URL' : key[0].toUpperCase() + key.slice(1)} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none" />)}
      </div>
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-slate-950"><Upload size={16} /> {uploadState === 'uploading' || uploadState === 'finalizing' ? `Uploading ${progress}%` : 'Upload track'}<input type="file" accept="audio/*" hidden onChange={handleUpload} disabled={uploadState === 'uploading' || uploadState === 'finalizing'} /></label>
      {(uploadState === 'uploading' || uploadState === 'finalizing') && <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full bg-emerald-400 transition-all duration-200" style={{ width: `${progress}%` }} /></div>}
      {uploadMessage && <p className={`mt-3 text-sm ${uploadState === 'error' ? 'text-rose-400' : uploadState === 'success' ? 'text-emerald-300' : 'text-slate-300'}`}>{uploadMessage}</p>}
    </section>{loading && <p className="mt-6 text-slate-400">Loading tracks…</p>}{error && <p className="mt-6 text-rose-400">{error}</p>}<div className="mt-6 space-y-3">{myTracks.map((track) => <TrackRow key={track.id} track={{ title: track.title, artist: track.artist, artworkGradient: '#0f172a,#334155', isUploaded: true }} meta={track.album || 'upload'} />)}</div></div></AppShell>;
}
