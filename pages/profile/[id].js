import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../../components/AppShell';
import TrackRow from '../../components/TrackRow';
import { useFeed } from '../../hooks/useFeed';
import { getUserProfile } from '../../services/firestore';

export default function ProfilePage() {
  const { id } = useRouter().query;
  const [user, setUser] = useState(null); const [loadingUser, setLoadingUser] = useState(true); const [err, setErr] = useState('');
  const { items } = useFeed();
  useEffect(() => { if (!id || typeof id !== 'string') return; setLoadingUser(true); getUserProfile(id).then(setUser).catch((e) => setErr(e.message)).finally(() => setLoadingUser(false)); }, [id]);
  const uploads = useMemo(() => items.filter((item) => item.ownerUid === id), [id, items]);

  return <AppShell title="Profile | NearBeat"><div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8"><Link href="/feed" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400"><ArrowLeft size={16} />Back to feed</Link>{loadingUser && <p className="text-slate-400">Loading profile…</p>}{err && <p className="text-rose-400">{err}</p>}{!loadingUser && !user && <p className="text-slate-400">User not found.</p>}{user && <><section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"><h1 className="text-3xl font-black">{user.displayName}</h1><p className="text-slate-400">@{user.username} · {user.systemId}</p><p className="mt-3 text-slate-300">{user.bio || 'No bio yet.'}</p><p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"><MapPin size={14} />{user.location || 'Location unavailable'}</p></section><section className="mt-6"><h2 className="mb-3 text-lg font-black">Uploaded tracks</h2>{uploads.length===0 ? <p className="text-slate-500">No uploads yet.</p> : <div className="space-y-3">{uploads.map((track) => <TrackRow key={track.id} track={{ title: track.title, artist: track.artist, artworkGradient: '#0f172a,#334155', isUploaded: true }} meta="upload" />)}</div>}</section></>}</div></AppShell>;
}
