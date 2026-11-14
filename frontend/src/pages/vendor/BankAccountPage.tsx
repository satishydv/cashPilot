import React, { useState } from 'react';
import api from '../../services/api';
import {
  Building2,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Save,
  Zap,
} from 'lucide-react';

interface BankAccountPageProps {
  bankAccount: any;
  onAccountUpdated: (updated: any) => void;
}

export const BankAccountPage: React.FC<BankAccountPageProps> = ({
  bankAccount,
  onAccountUpdated,
}) => {
  const [formData, setFormData] = useState({
    accountHolderName: bankAccount?.accountHolderName || '',
    bankName: bankAccount?.bankName || '',
    accountNumber: bankAccount?.accountNumber || '',
    ifsc: bankAccount?.ifsc || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await api.post('/vendor/bank-account', formData);
      if (res.data?.success) {
        onAccountUpdated(res.data.data);
        setNotification({
          type: 'success',
          message: 'Bank account details updated and verified successfully!',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update bank account.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant IMPS Rails Active</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Settlement Bank Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the verified bank account where your net earnings will be disbursed automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-2xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bank Verification: Active</span>
          </span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Grid: Card Preview (Left) & Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Bank Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/20 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between min-h-[230px]">
            {/* Holographic Sheen */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-slate-400 font-bold block leading-none">
                    Settlement Account
                  </span>
                  <span className="font-serif font-bold text-sm text-white mt-0.5 block">
                    {formData.bankName || 'Bank Name Not Linked'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-600/40 px-2 py-0.5 rounded-full uppercase">
                {bankAccount ? 'Verified' : 'Pending'}
              </span>
            </div>

            {/* Account Number Display */}
            <div className="my-6 relative z-10">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
                Account Number
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-slate-100">
                {formData.accountNumber
                  ? formData.accountNumber.replace(/(\d{4})/g, '$1 ').trim()
                  : '•••• •••• •••• ••••'}
              </div>
            </div>

            {/* Card Footer: Holder Name & IFSC */}
            <div className="flex items-end justify-between relative z-10 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">
                  Beneficiary Holder
                </span>
                <span className="font-serif font-bold text-slate-200 uppercase tracking-wide truncate block max-w-[160px]">
                  {formData.accountHolderName || 'Merchant Name'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">
                  IFSC Code
                </span>
                <span className="font-mono font-bold text-slate-200 uppercase">
                  {formData.ifsc || 'HDFC0000000'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Automated IMPS Settlements</span>
              <span>
                Funds are credited directly to this account as soon as customer payments succeed and are approved by the gateway.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Account Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs">
          <div className="mb-5">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              {bankAccount ? 'Update Bank Details' : 'Link New Bank Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Please enter the correct account details matching your business legal entity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Holder Name (Beneficiary)
              </label>
              <input
                type="text"
                required
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                placeholder="e.g. Acme Store Pvt Ltd"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. HDFC Bank / ICICI Bank"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                  placeholder="e.g. HDFC0001234"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bank Account Number
              </label>
              <input
                type="text"
                required
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="e.g. 50100456789123"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-mono"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-black transition-colors cursor-pointer shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Update Bank Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankAccountPage;
