import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CashPilotLogo } from '../components/BrandIcons';
import { Lock, Mail, ArrowRight, AlertCircle, Store } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.role === 'VENDOR') {
        const from = (location.state as any)?.from?.pathname;
        navigate(from && !from.startsWith('/admin') ? from : '/dashboard', { replace: true });
      } else if (res.role === 'ADMIN') {
        // If an admin logs in here, redirect them to /admin
        navigate('/admin', { replace: true });
      }
    } else {
      setError(res.message || 'Invalid merchant credentials');
    }
  };

  const fillVendorDemo = () => {
    setEmail('acme@example.com');
    setPassword('Secret123!');
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f4f7] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <CashPilotLogo className="w-10 h-10" />
        <div className="flex flex-col">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#111827] leading-none">
            CashPilot
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">
            Merchant Portal
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600" />

        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            Merchant Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Sign in to track orders, manage settlements, and view your payout balance.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Merchant Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="acme@example.com"
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#111827] text-white hover:bg-black p-3 rounded-2xl text-sm font-semibold tracking-tight shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Merchant Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={fillVendorDemo}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left flex items-center justify-between text-xs text-slate-600 transition-colors cursor-pointer"
          >
            <div>
              <span className="font-semibold text-slate-800">Demo Merchant: </span>
              <span className="text-slate-600 text-[11px]">acme@example.com</span>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-semibold">
              Fill Demo
            </span>
          </button>

          <div className="text-center mt-2">
            <Link
              to="/admin"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Platform administrator?</span>
              <span className="text-slate-900 font-semibold underline">Go to Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
