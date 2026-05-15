import Link from 'next/link';
import { Radio } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-2xl sm:px-5">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pulse/15 text-pulse shadow-glow">
          <Radio size={20} />
        </span>
        <span>
          <span className="block text-sm font-semibold uppercase tracking-[0.34em] text-white">NearBeat</span>
          <span className="hidden text-xs text-slate-400 sm:block">social music presence</span>
        </span>
      </Link>
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Link href="/feed" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
          Nearby feed
        </Link>
        <Link href="/feed" className="rounded-full bg-white px-4 py-2 font-semibold text-night transition hover:bg-pulse">
          Open prototype
        </Link>
      </div>
    </nav>
  );
}
