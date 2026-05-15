import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { PrivacyProvider } from '../context/PrivacyContext';

const publicRoutes = ['/'];

function RouteGuard({ children }) {
  const router = useRouter();
  const { ready, isAuthed } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthed && !publicRoutes.includes(router.pathname)) router.replace('/');
    if (isAuthed && router.pathname === '/') router.replace('/feed');
  }, [isAuthed, ready, router]);

  if (!ready) return <main className="grid min-h-screen place-items-center bg-[#080a10] text-slate-300">Checking authentication…</main>;
  return children;
}

export default function App({ Component, pageProps }) {
  return <AuthProvider><PrivacyProvider><RouteGuard><Component {...pageProps} /></RouteGuard></PrivacyProvider></AuthProvider>;
}
