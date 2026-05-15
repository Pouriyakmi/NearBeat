import { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import { useRealTimeSearch } from '../hooks/useRealTimeSearch';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const { results, loading, error } = useRealTimeSearch(q);

  return (
    <AppShell title="Search | NearBeat">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          eyebrow="Search"
          title="Find people"
          description="Search by display name, handle, or system ID. Real-time results."
        />

        <label className="mt-6 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.055] px-4 py-3 text-slate-400">
          <SearchIcon size={19} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Search NearBeat"
          />
        </label>

        <div className="mt-6 space-y-3">
          {loading && q && <p className="text-slate-400">Searching…</p>}
          {error && <p className="text-rose-400">{error}</p>}
          {!loading && !error && q && results.length === 0 && (
            <p className="text-slate-400">No users found.</p>
          )}
          {results.map((u) => (
            <Link
              key={u.id}
              href={`/profile/${u.uid}`}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3 transition hover:bg-white/8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-black font-black">
                {(u.displayName || 'NB').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold">{u.displayName}</p>
                <p className="text-sm text-slate-400">
                  @{u.username} · {u.systemId}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
