import Link from 'next/link';
import { Radio } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between rounded-3xl border border-white/8 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
          <Radio size={20} />
        </span>
        <span className="font-black tracking-tight text-white">NearBeat</span>
      </Link>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Link href="/music" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Music</Link>
        <Link href="/" className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950">Live feed</Link>
      </div>
    </nav>
  );
}
