import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, Home, Music2, Radio, Search, Settings, UserCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Feed', icon: Home },
  { href: '/music', label: 'Music', icon: Music2 },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children, title = 'NearBeat' }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="NearBeat is a real-time social music presence prototype for nearby listeners." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-[#080a10] text-slate-100">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(29,185,84,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_26%),linear-gradient(180deg,#080a10_0%,#0d111a_52%,#080a10_100%)]" />
        <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[248px_1fr]">
          <aside className="sticky top-0 hidden h-screen border-r border-white/8 bg-black/20 px-4 py-5 backdrop-blur-xl lg:block">
            <Link href="/" className="flex items-center gap-3 rounded-3xl px-3 py-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 shadow-[0_18px_60px_rgba(29,185,84,0.22)]">
                <Radio size={22} />
              </span>
              <span>
                <span className="block text-lg font-black tracking-tight">NearBeat</span>
                <span className="text-xs text-slate-400">live music nearby</span>
              </span>
            </Link>
            <nav className="mt-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-5 left-4 right-4 rounded-3xl border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <UserCircle className="text-emerald-300" size={24} />
                <div>
                  <p className="text-sm font-bold">Phase 1 mock app</p>
                  <p className="text-xs leading-5 text-slate-400">Ready for auth, realtime, uploads, and location later.</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 pb-24 lg:pb-0">
            <header className="sticky top-0 z-30 border-b border-white/8 bg-[#080a10]/82 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                    <Radio size={19} />
                  </span>
                  NearBeat
                </Link>
                <Link href="/search" className="rounded-full bg-white/8 p-2 text-slate-200" aria-label="Open search">
                  <Compass size={19} />
                </Link>
              </div>
            </header>
            {children}
          </section>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0b0d13]/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-semibold transition ${active ? 'bg-white text-slate-950' : 'text-slate-400'}`}>
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
