import Link from 'next/link';
import { ArrowLeft, Clock3, Headphones, Heart, MapPin, Music2, UserPlus } from 'lucide-react';
import AppShell from '../../components/AppShell';
import ProgressBar from '../../components/ProgressBar';
import TrackRow from '../../components/TrackRow';
import { getListenerById, playlists, sharedTracks, trendingTracks, nearbyListeners } from '../../data/mockUsers';

export default function ProfilePage({ listener }) {
  const track = listener.nowPlaying;
  const recentTracks = [track, ...trendingTracks.filter((item) => item.title !== track.title)].slice(0, 4);

  return (
    <AppShell title={`${listener.username} | NearBeat`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white">
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

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-2xl" style={{ backgroundImage: `linear-gradient(135deg, ${track.artworkGradient})` }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Currently listening</p>
                <h2 className="truncate text-xl font-black text-white">{track.title}</h2>
                <p className="truncate text-sm text-slate-400">{track.artist}</p>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={track.progress} subtle />
              <div className="mt-2 flex justify-between text-xs text-slate-500"><span>{track.currentTime}</span><span>{track.duration}</span></div>
            </div>
            <p className="mt-4 rounded-2xl bg-black/18 p-3 text-sm leading-6 text-slate-300">
              {track.isUploaded ? 'This track is shared/uploaded, so future listeners can play it inside NearBeat.' : 'This track is metadata-only, so future listeners can see the song but cannot stream the file yet.'}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-5">
            <h2 className="flex items-center gap-2 font-black text-white"><Music2 size={18} /> Playlists</h2>
            <div className="mt-4 space-y-3">
              {playlists.slice(0, 2).map((playlist) => (
                <div key={playlist.id} className="rounded-2xl bg-black/18 p-3">
                  <div className="h-16 rounded-xl" style={{ backgroundImage: `linear-gradient(135deg, ${playlist.gradient})` }} />
                  <p className="mt-3 font-bold text-white">{playlist.title}</p>
                  <p className="text-xs text-slate-400">{playlist.trackCount} tracks · playlist pages later</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-white"><Headphones size={18} /> Recently played</h2>
            <div className="space-y-3">{recentTracks.map((item) => <TrackRow key={item.id || item.title} track={item} meta="recent" />)}</div>
          </div>
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-white"><Music2 size={18} /> Shared tracks</h2>
            <div className="space-y-3">{sharedTracks.map((item) => <TrackRow key={item.id} track={item} meta={item.sharedBy} />)}</div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export function getStaticPaths() {
  return {
    paths: nearbyListeners.map((listener) => ({ params: { id: listener.id } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return {
    props: {
      listener: getListenerById(params.id),
    },
  };
}
