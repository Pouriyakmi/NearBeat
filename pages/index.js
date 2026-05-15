import { useState } from 'react';
import { Lock, Mail, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [method, setMethod] = useState('phone');
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { login } = useAuth();

  const submitIdentity = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const submitOtp = (e) => {
    e.preventDefault();
    login({ identifier: identifier || 'demo-user', method });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070910] px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">NearBeat access</p>
        <h1 className="mt-3 text-3xl font-black">Login or create account</h1>
        <p className="mt-3 text-sm text-slate-300">Phone-first authentication with OTP flow (mock now, backend-ready later).</p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-black/30 p-1 text-sm">
          <button onClick={() => setMethod('phone')} className={`rounded-xl px-3 py-2 ${method === 'phone' ? 'bg-white text-black' : 'text-slate-300'}`}>Phone</button>
          <button onClick={() => setMethod('email')} className={`rounded-xl px-3 py-2 ${method === 'email' ? 'bg-white text-black' : 'text-slate-300'}`}>Email</button>
        </div>

        {!otpSent ? (
          <form className="mt-5 space-y-3" onSubmit={submitIdentity}>
            <label className="block text-sm text-slate-300">{method === 'phone' ? 'Phone number' : 'Email address'}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              {method === 'phone' ? <MessageSquare size={17} /> : <Mail size={17} />}
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-transparent outline-none" placeholder={method === 'phone' ? '+1 234 567 8901' : 'you@example.com'} />
            </div>
            <button className="w-full rounded-2xl bg-emerald-300 px-4 py-3 font-bold text-black">Send OTP (mock)</button>
          </form>
        ) : (
          <form className="mt-5 space-y-3" onSubmit={submitOtp}>
            <label className="block text-sm text-slate-300">Enter verification code</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <Lock size={17} />
              <input value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-transparent outline-none" placeholder="000000" />
            </div>
            <button className="w-full rounded-2xl bg-emerald-300 px-4 py-3 font-bold text-black">Verify & continue</button>
          </form>
        )}
      </section>
    </main>
  );
}
