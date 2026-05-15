import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserProfile } from '../../services/firestore';
import { useFeed } from '../../hooks/useFeed';
import TrackRow from '../../components/TrackRow';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const { items } = useFeed();

  return (
    <AppShell title={`${user.username || 'user'} | NearBeat`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/feed" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white">
          <ArrowLeft size={16} /> Back to feed
        </Link>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <h1 className="text-3xl font-black">{user.displayName}</h1>
          <p className="text-slate-400">@{user.username} · ID: {user.uid}</p>
          <p className="mt-3 text-slate-300">{user.bio}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
            <MapPin size={14} /> {user.approximateLocation || 'Nearby'}
          </p>
        </section>

  const uploads = items.filter((x) => x.ownerUid === id);

  if (!user) return <AppShell title="Profile | NearBeat"><div className="p-6 text-slate-400">Loading profile...</div></AppShell>;

  return (
    <AppShell title={`${user.username || 'user'} | NearBeat`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/feed" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"><ArrowLeft size={16} /> Back to feed</Link>
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6"><h1 className="text-3xl font-black">{user.displayName}</h1><p className="text-slate-400">@{user.username} · ID: {user.uid}</p><p className="mt-3 text-slate-300">{user.bio}</p><p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm"><MapPin size={14} /> {user.approximateLocation || 'Nearby'}</p></section>
        <section className="mt-6"><h2 className="mb-3 text-lg font-black">Uploaded tracks</h2>{uploads.length===0 ? <p className="text-slate-500">No uploads yet.</p> : <div className="space-y-3">{uploads.map((track)=><TrackRow key={track.id} track={{title:track.title,artist:track.artist,artworkGradient:track.artworkGradient || '#0f172a,#334155',isUploaded:true}} meta="upload"/>)}</div>}</section>
      </div>
    </AppShell>
  );
}
