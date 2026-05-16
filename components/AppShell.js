import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, Home, LogOut, Music2, Radio, Search, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/music', label: 'Music', icon: Music2 },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children, title = 'NearBeat' }) {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const [online, setOnline] = useState(true);
  const [weather, setWeather] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setOnline(navigator.onLine);
    const onState = () => setOnline(navigator.onLine);
    window.addEventListener('online', onState);
    window.addEventListener('offline', onState);

    navigator.geolocation?.getCurrentPosition(async (p) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}&current=temperature_2m`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.current) setWeather(`${data.current.temperature_2m}°C`);
      } catch {
        setWeather('');
      }
    });

    return () => {
      window.removeEventListener('online', onState);
      window.removeEventListener('offline', onState);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-[#080a10] text-slate-100">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(29,185,84,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_26%),linear-gradient(180deg,#080a10_0%,#0d111a_52%,#080a10_100%)]" />

        <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[248px_1fr]">
          <aside className="sticky top-0 hidden h-screen border-r border-white/8 bg-black/20 px-4 py-5 backdrop-blur-xl lg:block">
            <Link href="/feed" className="flex items-center gap-3 rounded-3xl px-3 py-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <Radio size={22} />
              </span>
              <span>
                <span className="block text-lg font-black tracking-tight">NearBeat</span>
                <span className="text-xs text-slate-400">{weather ? `Weather ${weather}` : 'live music nearby'}</span>
              </span>
            </Link>

            <nav className="mt-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <motion.div key={item.href} whileHover={{ x: 3 }}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}
                    >
                      <Icon size={19} />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="absolute bottom-5 left-4 right-4 rounded-3xl border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <UserCircle className="text-emerald-300" size={24} />
                <div>
                  <p className="text-sm font-bold">{profile?.displayName || 'NearBeat User'}</p>
                  <p className="text-xs text-slate-400">{profile?.systemId || ''}</p>
                </div>
              </div>
              <button onClick={logout} className="mt-3 inline-flex items-center gap-2 text-xs text-slate-300">
                <LogOut size={14} />Sign out
              </button>
            </div>
          </aside>

          <section className="min-w-0 pb-24 lg:pb-0">
            <header className="sticky top-0 z-30 border-b border-white/8 bg-[#080a10]/82 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
              <div className="flex items-center justify-between">
                <Link href="/feed" className="font-black tracking-tight">
                  {online ? (
                    <span className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                        <Radio size={19} />
                      </span>
                      NearBeat
                    </span>
                  ) : (
                    'Connection…'
                  )}
                </Link>
                <Link href="/search" className="rounded-full bg-white/8 p-2 text-slate-200" aria-label="Open search">
                  <Compass size={19} />
                </Link>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div key={router.asPath} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {children}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0b0d13]/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-semibold transition ${active ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </>
  );
}
