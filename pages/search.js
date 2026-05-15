import { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/PageHeader';
import { searchUsers } from '../services/firestore';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const onSearch = async (value) => {
    setQ(value); setError('');
    if (!value.trim()) return setRows([]);
    setLoading(true);
    try { setRows(await searchUsers(value)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return <AppShell title="Search | NearBeat"><div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8"><PageHeader eyebrow="Search" title="Find people" description="Search by display name, handle, or system ID." /><label className="mt-6 flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.055] px-4 py-3 text-slate-400"><SearchIcon size={19} /><input value={q} onChange={(e) => onSearch(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search NearBeat" /></label><div className="mt-6 space-y-3">{loading && <p className="text-slate-400">Searching…</p>}{error && <p className="text-rose-400">{error}</p>}{!loading && !error && q && rows.length === 0 && <p className="text-slate-400">No users found.</p>}{rows.map((u) => <Link key={u.id} href={`/profile/${u.uid}`} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-black font-black">{(u.displayName || 'NB').slice(0,2).toUpperCase()}</div><div><p className="font-bold">{u.displayName}</p><p className="text-sm text-slate-400">@{u.username} · {u.systemId}</p></div></Link>)}</div></div></AppShell>;
}
