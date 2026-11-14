import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  Zap,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';

interface PayoutsPageProps {
  bankAccount: any;
  onNavigateToBank: () => void;
}

export const PayoutsPage: React.FC<PayoutsPageProps> = ({ bankAccount, onNavigateToBank }) => {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/vendor/payouts');
      if (res.data?.success) {
        setPayouts(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load payouts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const filtered = payouts.filter((p) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return p.status === 'PENDING' || p.status === 'PROCESSING' || p.status === 'NOT_INITIATED';
    return p.status === statusFilter;
  });

  const totalSettled = payouts
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalPending = payouts
    .filter((p) => p.status !== 'SUCCESS' && p.status !== 'FAILED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Automated Settlement Dispatcher</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Settlement Payouts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track bank account disbursements, IMPS batches, and settlement lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={fetchPayouts}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh payouts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Exporting payout statement...')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-black text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Linked Bank Alert if missing */}
      {!bankAccount && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Settlement bank account is not linked. Payouts will remain queued until an account is added.</span>
          </div>
          <button
            onClick={onNavigateToBank}
            className="px-3 py-1.5 bg-amber-900 text-white font-semibold rounded-xl text-xs hover:bg-black shrink-0 cursor-pointer"
          >
            Link Account Now
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Settled */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Settled (Life-to-Date)</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                ₹{totalSettled.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
            <span>Direct IMPS Transfers</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* In Queue / Pending */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Pending Clearance</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                ₹{totalPending.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Dispatched via next window</span>
            <span>T+1</span>
          </div>
        </div>

        {/* Registered Bank Account Info */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Primary Bank</span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mt-1 truncate">
                {bankAccount?.bankName || 'Not Linked'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-600">
              {bankAccount?.accountNumber ? `•••• ${bankAccount.accountNumber.slice(-4)}` : 'No Account'}
            </span>
            <button
              onClick={onNavigateToBank}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h4 className="font-serif text-base font-bold text-slate-900 self-start sm:self-auto">
            Disbursement History
          </h4>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Payout Reference</th>
                <th className="py-3.5 px-4">Linked Order</th>
                <th className="py-3.5 px-4">Transfer Mode</th>
                <th className="py-3.5 px-4">Disbursed Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Loading settlement records...</span>
                      </div>
                    ) : (
                      'No payouts recorded yet. Payouts are generated automatically when payments succeed.'
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((payout) => (
                  <tr key={payout._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {payout.providerPayoutId || `PAYOUT_${payout._id.slice(-6)}`}
                      </span>
                      <span className="text-[10px] text-slate-400">ID: {payout._id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-700 block">
                        {payout.transactionId?.transactionReference || 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {payout.transactionId?.customerName || ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px]">
                        {payout.payoutMode || 'IMPS'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-slate-900 text-sm">
                      ₹{Number(payout.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          payout.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : payout.status === 'PROCESSING' || payout.status === 'PENDING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : payout.status === 'NOT_INITIATED'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        {payout.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : payout.status === 'FAILED' ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{payout.status}</span>
                      </span>
                      {payout.failureReason && (
                        <span className="block text-[10px] text-rose-600 mt-0.5">
                          {payout.failureReason}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-slate-400">
                      {new Date(payout.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
