import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await loginWithEmail(email, password);
      else await signupWithEmail(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-[#070910] px-4 text-white"><section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">NearBeat access</p><h1 className="mt-3 text-3xl font-black">{mode === 'login' ? 'Login' : 'Create account'}</h1><div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/30 p-1 text-sm"><button onClick={() => setMode('login')} className={`rounded-xl px-3 py-2 ${mode === 'login' ? 'bg-white text-black' : 'text-slate-300'}`}>Login</button><button onClick={() => setMode('signup')} className={`rounded-xl px-3 py-2 ${mode === 'signup' ? 'bg-white text-black' : 'text-slate-300'}`}>Sign up</button></div><form className="mt-5 space-y-3" onSubmit={onSubmit}><label className="block text-sm text-slate-300">Email address</label><div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><Mail size={17} /><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="you@example.com" required /></div><label className="block text-sm text-slate-300">Password</label><input value={password} type="password" minLength={6} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 outline-none" placeholder="******" required />{error && <p className="text-sm text-rose-400">{error}</p>}<button disabled={loading} className="w-full rounded-2xl bg-emerald-300 px-4 py-3 font-bold text-black">{loading ? 'Please wait...' : mode === 'login' ? 'Login with email' : 'Create account'}</button></form><button onClick={loginWithGoogle} className="mt-3 w-full rounded-2xl border border-white/20 px-4 py-3 font-bold">Continue with Google</button></section></main>;
}
