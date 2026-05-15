import { useState } from 'react';
import { AlertCircle, Lock, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [method, setMethod] = useState('phone');
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();

  const submitEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await loginWithEmail({ email, password });
      else await registerWithEmail({ email, password });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070910] px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">NearBeat access</p>
        <h1 className="mt-3 text-3xl font-black">Login or create account</h1>
        <p className="mt-3 text-sm text-slate-300">Modern auth with Firebase. Phone UX is ready; OTP backend can be connected next.</p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/30 p-1 text-sm">
          <button onClick={() => setMethod('phone')} className={`rounded-xl px-3 py-2 ${method === 'phone' ? 'bg-white text-black' : 'text-slate-300'}`}>Phone</button>
          <button onClick={() => setMethod('email')} className={`rounded-xl px-3 py-2 ${method === 'email' ? 'bg-white text-black' : 'text-slate-300'}`}>Email</button>
        </div>

        {method === 'phone' ? (
          <div className="mt-5 space-y-3">
            <label className="block text-sm text-slate-300">Phone number</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <MessageSquare size={17} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent outline-none" placeholder="+1 234 567 8901" />
            </div>
            <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">Phone OTP UI is ready. Firebase Email/Password is active now; phone auth can be enabled with Firebase SMS verifier next.</p>
            <button onClick={() => setMethod('email')} className="w-full rounded-2xl bg-emerald-300 px-4 py-3 font-bold text-black">Continue with Email for now</button>
          </div>
        ) : (
          <form className="mt-5 space-y-3" onSubmit={submitEmailAuth}>
            <button type="button" onClick={loginWithGoogle} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-bold">Continue with Google</button>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/25 p-1 text-xs">
              <button type="button" onClick={() => setMode('login')} className={`rounded-lg py-2 ${mode === 'login' ? 'bg-white text-black' : 'text-slate-300'}`}>Login</button>
              <button type="button" onClick={() => setMode('register')} className={`rounded-lg py-2 ${mode === 'register' ? 'bg-white text-black' : 'text-slate-300'}`}>Register</button>
            </div>
            <label className="block text-sm text-slate-300">Email address</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="you@example.com" required /></div>
            <label className="block text-sm text-slate-300">Password</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><Lock size={17} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none" placeholder="••••••••" required minLength={6} /></div>
            {error ? <p className="flex items-center gap-2 text-sm text-rose-300"><AlertCircle size={15} />{error}</p> : null}
            <button disabled={loading} className="w-full rounded-2xl bg-emerald-300 px-4 py-3 font-bold text-black disabled:opacity-60">{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}</button>
          </form>
        )}
      </section>
    </main>
  );
}
