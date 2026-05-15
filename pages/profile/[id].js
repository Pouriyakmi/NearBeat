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
    <AppShell title={`${listener.username} | NearBeat`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/feed" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white">
          <ArrowLeft size={16} /> Back to feed
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05]">
          <div className="h-28 bg-gradient-to-r from-emerald-400/25 via-sky-500/20 to-fuchsia-500/20" />
          <div className="px-5 pb-5 sm:px-6">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.7rem] border-4 border-[#11141d] text-2xl font-black text-white" style={{ backgroundImage: `linear-gradient(135deg, ${listener.avatarGradient})` }}>
                  {listener.avatar}
                </div>
                <div className="pb-1">
                  <h1 className="text-3xl font-black tracking-tight text-white">{listener.displayName}</h1>
                  <p className="text-slate-400">@{listener.username}</p>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950" type="button">
                <UserPlus size={17} /> Follow later
              </button>
            </div>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">{listener.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
              <span className="rounded-full bg-white/8 px-3 py-1.5"><MapPin size={14} className="mr-1 inline text-emerald-300" /> {listener.distance} away</span>
              <span className="rounded-full bg-white/8 px-3 py-1.5"><Clock3 size={14} className="mr-1 inline text-sky-300" /> {listener.lastActive}</span>
              <span className="rounded-full bg-white/8 px-3 py-1.5"><Heart size={14} className="mr-1 inline text-pink-300" /> {listener.note}</span>
            </div>
          </div>
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
