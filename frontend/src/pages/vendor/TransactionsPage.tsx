import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  RefreshCw,
  ReceiptText,
} from 'lucide-react';

interface TransactionsPageProps {
  externalSearch?: string;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ externalSearch = '' }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(externalSearch);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/vendor/transactions');
      if (res.data?.success) {
        setTransactions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (externalSearch) setSearch(externalSearch);
  }, [externalSearch]);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.transactionReference?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerPhone?.includes(search) ||
      t.customerEmail?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = transactions
    .filter((t) => t.paymentStatus === 'SUCCESS')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const totalCommission = transactions
    .filter((t) => t.paymentStatus === 'SUCCESS')
    .reduce((acc, t) => acc + (t.commissionAmount || 0), 0);

  const totalNet = transactions
    .filter((t) => t.paymentStatus === 'SUCCESS')
    .reduce((acc, t) => acc + (t.netPayoutAmount || 0), 0);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit mb-1.5">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Ledger & Reconciliation</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Transactions Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live log of customer orders, commission deductions, and net amounts receivable.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={fetchTransactions}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh transactions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Exporting transaction CSV...')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-black text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Settled Volume</span>
          <span className="font-serif text-xl font-bold text-slate-900 mt-0.5 block">
            ₹{totalVolume.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Platform Commission</span>
          <span className="font-serif text-xl font-bold text-orange-600 mt-0.5 block">
            -₹{totalCommission.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Net Earnings Due</span>
          <span className="font-serif text-xl font-bold text-emerald-600 mt-0.5 block">
            ₹{totalNet.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, customer name, phone..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-800"
            />
          </div>

          {/* Status Filter Tabs */}
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

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Transaction Reference</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Gross Amount</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4">Net Payout</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Loading transactions...</span>
                      </div>
                    ) : (
                      'No transactions matching your criteria.'
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {txn.transactionReference}
                      </span>
                      <span className="text-[10px] text-slate-400">ID: {txn._id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{txn.customerName}</div>
                      <div className="text-[10px] text-slate-400">
                        {txn.customerPhone} • {txn.customerEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                      ₹{Number(txn.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-orange-600 font-semibold block">
                        -₹{Number(txn.commissionAmount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({txn.commissionRate}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-emerald-600">
                      ₹{Number(txn.netPayoutAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          txn.paymentStatus === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : txn.paymentStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        {txn.paymentStatus === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : txn.paymentStatus === 'PENDING' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{txn.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-slate-400">
                      {new Date(txn.createdAt).toLocaleDateString('en-IN', {
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

export default TransactionsPage;
