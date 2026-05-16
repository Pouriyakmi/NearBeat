import Link from 'next/link';
import { ArrowLeft, MapPin, Pin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../../components/AppShell';
import TrackRow from '../../components/TrackRow';
import { useFeed } from '../../hooks/useFeed';
import { createPlaylist, getUserProfile, listFavoriteTracks, setFavoriteTrack, updateUserProfile } from '../../services/firestore';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { id } = useRouter().query;
  const [tab, setTab] = useState('profile');
  const [user, setUser] = useState(null); const [loadingUser, setLoadingUser] = useState(true); const [err, setErr] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const { items } = useFeed();
  const { user: authUser } = useAuth();
  const mine = authUser?.uid === id;

  useEffect(() => { if (!id || typeof id !== 'string') return; setLoadingUser(true); getUserProfile(id).then(setUser).catch((e) => setErr(e.message)).finally(() => setLoadingUser(false)); listFavoriteTracks(id).then(setFavorites).catch(() => {}); }, [id]);
  const uploads = useMemo(() => items.filter((item) => item.ownerUid === id), [id, items]);

  const pinTrack = async (track) => {
    if (!mine) return;
    await setFavoriteTrack(id, track.id, { title: track.title, artist: track.artist });
    setFavorites((f) => [...f, { id: track.id, title: track.title, artist: track.artist }]);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    if (!mine) return;
    const fd = new FormData(e.currentTarget);
    await updateUserProfile(id, Object.fromEntries(fd.entries()));
    alert('Saved');
  };

  const makePlaylist = async () => {
    if (!mine || !playlistName.trim()) return;
    await createPlaylist(id, { name: playlistName.trim(), tracks: favorites.map((f) => f.id) });
    setPlaylistName('');
    alert('Playlist created');
  };

  return <AppShell title="Profile | NearBeat"><div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8"><Link href="/feed" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400"><ArrowLeft size={16} />Back to feed</Link>{loadingUser && <p className="text-slate-400">Loading profile…</p>}{err && <p className="text-rose-400">{err}</p>}{!loadingUser && !user && <p className="text-slate-400">User not found.</p>}{user && <><section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"><h1 className="text-3xl font-black">{user.displayName}</h1><p className="text-slate-400">@{user.username} · {user.systemId}</p><p className="mt-3 text-slate-300">{user.bio || 'No bio yet.'}</p><p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"><MapPin size={14} />{user.location || 'Location unavailable'}</p></section>
      <div className="mt-5 flex gap-2">{['profile', 'settings'].map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm ${tab===t?'bg-white text-black':'bg-white/10'}`}>{t}</button>)}</div>
      {tab === 'profile' ? <><section className="mt-6"><h2 className="mb-3 text-lg font-black">Uploaded tracks</h2>{uploads.length===0 ? <p className="text-slate-500">No uploads yet.</p> : <div className="space-y-3">{uploads.map((track) => <div key={track.id} className="rounded-2xl border border-white/10 p-2"><TrackRow track={{ title: track.title, artist: track.artist, artworkGradient: '#0f172a,#334155', isUploaded: true }} meta="upload" />{mine && <button onClick={() => pinTrack(track)} className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs"><Pin size={12}/>Pin</button>}</div>)}</div>}</section>
      <section className="mt-6 rounded-2xl border border-white/10 p-4"><h3 className="font-bold">Pinned favorites</h3><div className="mt-2 space-y-2">{favorites.map((f) => <p key={f.id} className="text-sm text-slate-300">• {f.title} — {f.artist}</p>)}</div><div className="mt-3 flex gap-2"><input value={playlistName} onChange={(e)=>setPlaylistName(e.target.value)} placeholder="New playlist name" className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm"/><button onClick={makePlaylist} className="rounded-xl bg-emerald-300 px-3 py-2 text-sm font-bold text-black">Create playlist</button></div></section></> :
      <form onSubmit={saveSettings} className="mt-6 space-y-2 rounded-2xl border border-white/10 p-4"><input name="displayName" defaultValue={user.displayName} placeholder="Display name" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"/><input name="username" defaultValue={user.username} placeholder="Username" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"/><input name="photoURL" defaultValue={user.photoURL||''} placeholder="Photo URL" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"/><textarea name="bio" defaultValue={user.bio||''} placeholder="Bio" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"/><button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black">Save profile settings</button></form>}</>}</div></AppShell>;
}
