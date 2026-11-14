import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CashPilotLogo } from '../components/BrandIcons';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        setError('Access denied: This portal is restricted to platform administrators. Merchants please sign in at the Merchant Portal.');
      }
    } else {
      setError(res.message || 'Invalid administrator credentials');
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@cashpilot.com');
    setPassword('AdminSecret123!');
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <CashPilotLogo className="w-10 h-10" />
        <div className="flex flex-col">
          <span className="font-serif text-3xl font-bold tracking-tight text-white leading-none">
            CashPilot
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mt-1">
            Admin Governance Portal
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#131926] rounded-3xl shadow-2xl shadow-black/80 border border-slate-800 p-8 sm:p-10 relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
            Administrator Access
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Authorized personnel only. Manage platform merchants, commissions, and payouts.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/80 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cashpilot.com"
                className="w-full bg-[#1b2234] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Master Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1b2234] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-2xl text-sm font-semibold tracking-tight shadow-lg shadow-violet-600/30 transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={fillAdminDemo}
            className="w-full py-2.5 px-3.5 rounded-xl bg-violet-950/40 hover:bg-violet-950/70 border border-violet-800/50 text-left flex items-center justify-between text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <div>
              <span className="font-semibold text-violet-300">Admin Account: </span>
              <span className="text-slate-400 text-[11px]">admin@cashpilot.com</span>
            </div>
            <span className="text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded-md font-semibold">
              Fill Demo
            </span>
          </button>

          <div className="text-center mt-2">
            <Link
              to="/login"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Are you a merchant?</span>
              <span className="text-violet-400 font-semibold underline">Go to Merchant Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
