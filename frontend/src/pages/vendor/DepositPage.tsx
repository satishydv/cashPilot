import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowDownLeft,
  Search,
  RefreshCw,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  QrCode,
  Building,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Receipt,
  Download,
  ExternalLink,
  ArrowRight,
  Info,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';

interface DepositPageProps {
  onDepositSuccess?: () => void;
}

export const DepositPage: React.FC<DepositPageProps> = ({ onDepositSuccess }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');

  // Copy state for virtual account details
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Modals state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Active checkout data for simulation
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  // Deposit form state
  const commissionRate = user?.vendor?.commissionRate ?? 2;
  const [depositForm, setDepositForm] = useState({
    depositType: 'VENDOR_TOPUP' as 'VENDOR_TOPUP' | 'CUSTOMER_PAYMENT',
    amount: '5000',
    customerName: user?.vendor?.businessName || user?.name || 'Acme Store',
    customerPhone: user?.vendor?.phone || '9876543210',
    customerEmail: user?.vendor?.email || user?.email || 'vendor@example.com',
    note: 'Working capital reserve top-up',
    paymentMethod: 'UPI',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/vendor/transactions');
      if (res.data?.success) {
        setTransactions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load deposit transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Calculations
  const numericAmount = parseFloat(depositForm.amount) || 0;
  const estimatedCommission = (numericAmount * commissionRate) / 100;
  const estimatedNet = Math.max(0, numericAmount - estimatedCommission);

  // Aggregate Metrics
  const successfulDeposits = transactions.filter((t) => t.paymentStatus === 'SUCCESS');
  const pendingDeposits = transactions.filter((t) => t.paymentStatus === 'PENDING' || t.paymentStatus === 'CREATED');

  const totalDeposited = successfulDeposits.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalNetSettled = successfulDeposits.reduce((acc, t) => acc + (t.netPayoutAmount || 0), 0);
  const totalFeeDeducted = successfulDeposits.reduce((acc, t) => acc + (t.commissionAmount || 0), 0);
  const pendingAmount = pendingDeposits.reduce((acc, t) => acc + (t.amount || 0), 0);

  // Filtered transactions for the ledger
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.transactionReference?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.customerPhone?.includes(search) ||
      t.customerEmail?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Initiating New Deposit
  const handleInitiateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (numericAmount <= 0) {
      setFormError('Please enter a valid deposit amount greater than ₹0');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/vendor/deposit', {
        amount: numericAmount,
        customerName: depositForm.customerName,
        customerPhone: depositForm.customerPhone,
        customerEmail: depositForm.customerEmail,
        note: depositForm.note,
        depositType: depositForm.depositType,
      });

      if (res.data?.success) {
        setIsDepositModalOpen(false);
        setActiveSession(res.data.data);
        setIsCheckoutModalOpen(true);
        fetchTransactions();
      } else {
        setFormError(res.data?.message || 'Failed to initiate deposit');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Deposit initiation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Payment via Mock Webhook
  const handleSimulatePayment = async (status: 'SUCCESS' | 'FAILED') => {
    if (!activeSession?.payment?.providerPaymentId) return;

    setIsSimulating(true);
    setSimulationMessage(null);
    try {
      const res = await api.post('/webhooks/mock', {
        providerPaymentId: activeSession.payment.providerPaymentId,
        status,
      });

      if (res.data?.success) {
        setSimulationMessage(
          status === 'SUCCESS'
            ? '✓ Payment verified! Funds have been successfully credited to your settlement balance.'
            : '✕ Payment marked as FAILED.'
        );
        fetchTransactions();
        if (onDepositSuccess) onDepositSuccess();
        setTimeout(() => {
          setIsCheckoutModalOpen(false);
          setSimulationMessage(null);
          setActiveSession(null);
        }, 2200);
      }
    } catch (err: any) {
      setSimulationMessage(err.response?.data?.message || 'Simulation request failed');
    } finally {
      setIsSimulating(false);
    }
  };

  // Virtual Account Info derived for vendor
  const vendorCode = user?.vendor?._id ? user.vendor._id.slice(-6).toUpperCase() : '0040A2';
  const virtualVAN = `CPILOT${vendorCode}99`;
  const virtualIFSC = 'YESB0000001';
  const virtualUPI = `cashpilot.${user?.vendor?.businessName?.toLowerCase().replace(/\s+/g, '') || 'merchant'}@yesbank`;

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-1.5">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fund Inflow & Merchant Top-Up</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Deposits & Collections</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Collect customer order payments, top up working capital, and monitor real-time inflow settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={fetchTransactions}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh deposits"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDepositForm({
                depositType: 'VENDOR_TOPUP',
                amount: '5000',
                customerName: user?.vendor?.businessName || user?.name || 'Acme Store',
                customerPhone: user?.vendor?.phone || '9876543210',
                customerEmail: user?.vendor?.email || user?.email || 'vendor@example.com',
                note: 'Working capital reserve top-up',
                paymentMethod: 'UPI',
              });
              setFormError(null);
              setIsDepositModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate New Deposit</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Gross Inflow</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
              ↑ Active
            </span>
          </div>
          <div className="my-3">
            <div className="font-serif text-2xl font-bold text-slate-900">
              ₹{totalDeposited.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              From {successfulDeposits.length} approved deposits
            </div>
          </div>
          <div className="w-full h-1 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Net Balance Credited</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
              Payable
            </span>
          </div>
          <div className="my-3">
            <div className="font-serif text-2xl font-bold text-slate-900">
              ₹{totalNetSettled.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Available for IMPS disbursement
            </div>
          </div>
          <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-4/5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Platform Fee ({commissionRate}%)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">
              Auto Deduct
            </span>
          </div>
          <div className="my-3">
            <div className="font-serif text-2xl font-bold text-slate-900">
              ₹{totalFeeDeducted.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Processing & gateway charges
            </div>
          </div>
          <div className="w-full h-1 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-1/4" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Pending In-Flight</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">
              Awaiting
            </span>
          </div>
          <div className="my-3">
            <div className="font-serif text-2xl font-bold text-slate-900">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {pendingDeposits.length} deposit orders pending
            </div>
          </div>
          <div className="w-full h-1 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-1/2" />
          </div>
        </div>
      </div>

      {/* Dedicated Virtual Bank Account & UPI Wire Inflow Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-3xl shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Direct Wire & UPI Channel
              </span>
              <span className="text-xs text-slate-400">Instant RTGS / NEFT / IMPS Deposits</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Your Dedicated Virtual Collection Account
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transfer funds directly from any net-banking app or UPI application. Funds deposited to this virtual account are automatically credited to your CashPilot merchant balance in real time.
            </p>
          </div>

          {/* Account Detail Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            {/* VAN */}
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Virtual Account No.</span>
              <div className="flex items-center justify-between mt-1 gap-2">
                <span className="font-mono text-sm font-semibold text-white tracking-wider">{virtualVAN}</span>
                <button
                  onClick={() => handleCopy(virtualVAN, 'van')}
                  className="p-1 hover:bg-white/10 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy Account Number"
                >
                  {copiedField === 'van' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Yes Bank Ltd.</span>
            </div>

            {/* IFSC */}
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">IFSC Code</span>
              <div className="flex items-center justify-between mt-1 gap-2">
                <span className="font-mono text-sm font-semibold text-white tracking-wider">{virtualIFSC}</span>
                <button
                  onClick={() => handleCopy(virtualIFSC, 'ifsc')}
                  className="p-1 hover:bg-white/10 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy IFSC"
                >
                  {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Mumbai Central</span>
            </div>

            {/* UPI ID */}
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Dedicated UPI VPA</span>
              <div className="flex items-center justify-between mt-1 gap-2">
                <span className="font-mono text-xs font-semibold text-emerald-300 truncate max-w-[140px]">{virtualUPI}</span>
                <button
                  onClick={() => handleCopy(virtualUPI, 'upi')}
                  className="p-1 hover:bg-white/10 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy UPI VPA"
                >
                  {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Instant Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Deposits Ledger & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 flex flex-col gap-5">
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-fit">
            {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' && 'All Inflows'}
                {tab === 'SUCCESS' && 'Completed'}
                {tab === 'PENDING' && 'Pending'}
                {tab === 'FAILED' && 'Failed'}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reference, depositor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-sans"
            />
          </div>
        </div>

        {/* Ledger Table */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading deposit ledger...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold text-slate-800">No deposits found</span>
              <span className="text-xs text-slate-400 mt-0.5">
                {search ? 'Try adjusting your search query' : 'Initiate your first deposit or order collection above'}
              </span>
            </div>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              + Initiate Deposit Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Deposit Reference</th>
                  <th className="pb-3 font-semibold">Depositor / Payer</th>
                  <th className="pb-3 font-semibold">Channel</th>
                  <th className="pb-3 font-semibold text-right">Gross Amount</th>
                  <th className="pb-3 font-semibold text-right">Fee ({commissionRate}%)</th>
                  <th className="pb-3 font-semibold text-right">Net Credited</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredTransactions.map((item) => {
                  const isSuccess = item.paymentStatus === 'SUCCESS';
                  const isPending = item.paymentStatus === 'PENDING' || item.paymentStatus === 'CREATED';
                  const isFailed = item.paymentStatus === 'FAILED';

                  const dateFormatted = new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Ref */}
                      <td className="py-3.5 pr-3">
                        <div className="font-mono text-xs font-semibold text-slate-900">
                          {item.transactionReference}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>

                      {/* Depositor */}
                      <td className="py-3.5 pr-3">
                        <div className="font-semibold text-slate-900">{item.customerName || 'Vendor Top-Up'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.customerPhone || item.customerEmail || 'Self top-up'}
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 pr-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          <span>UPI / Gateway</span>
                        </span>
                      </td>

                      {/* Gross Amount */}
                      <td className="py-3.5 pr-3 text-right font-serif font-bold text-slate-900">
                        ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 pr-3 text-right text-purple-700 font-medium">
                        -₹{Number(item.commissionAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Net Credited */}
                      <td className="py-3.5 pr-3 text-right font-serif font-bold text-emerald-700">
                        ₹{Number(item.netPayoutAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 pr-3 text-center">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>COMPLETED</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>AWAITING PAYMENT</span>
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>FAILED</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => {
                                setActiveSession({
                                  transaction: item,
                                  payment: { providerPaymentId: `mock_pay_${item.transactionReference}` },
                                  order: { paymentUrl: 'mock' },
                                });
                                setIsCheckoutModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              Verify / Pay
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedReceipt(item);
                              setIsReceiptModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            title="View Receipt Slip"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Initiate New Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Initiate Deposit / Collection</h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate an instant UPI QR code or payment session to credit your account balance.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleInitiateDeposit} className="flex flex-col gap-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deposit Purpose</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDepositForm((prev) => ({
                        ...prev,
                        depositType: 'VENDOR_TOPUP',
                        customerName: user?.vendor?.businessName || 'Acme Store',
                        note: 'Working capital reserve top-up',
                      }))
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      depositForm.depositType === 'VENDOR_TOPUP'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Vendor Self Top-Up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDepositForm((prev) => ({
                        ...prev,
                        depositType: 'CUSTOMER_PAYMENT',
                        customerName: '',
                        note: 'Customer order deposit',
                      }))
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      depositForm.depositType === 'CUSTOMER_PAYMENT'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Customer Order</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deposit Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                    placeholder="5000"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>

                {/* Amount Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['1000', '2500', '5000', '10000', '25000', '50000'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setDepositForm({ ...depositForm, amount: chip })}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      +₹{Number(chip).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Fee & Net Calculation Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Gross Deposit Amount:</span>
                  <span className="font-semibold text-slate-800">₹{numericAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Platform Fee ({commissionRate}%):</span>
                  <span className="font-semibold text-purple-700">
                    -₹{estimatedCommission.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full h-px bg-slate-200 my-0.5" />
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Net Credited to Balance:</span>
                  <span className="text-emerald-700 font-serif text-sm">
                    ₹{estimatedNet.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Depositor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payer / Name</label>
                  <input
                    type="text"
                    required
                    value={depositForm.customerName}
                    onChange={(e) => setDepositForm({ ...depositForm, customerName: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payer Phone</label>
                  <input
                    type="text"
                    required
                    value={depositForm.customerPhone}
                    onChange={(e) => setDepositForm({ ...depositForm, customerPhone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={depositForm.note}
                  onChange={(e) => setDepositForm({ ...depositForm, note: e.target.value })}
                  placeholder="Optional reference memo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-70 transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Generate Deposit Session</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Checkout & QR Simulation Modal */}
      {isCheckoutModalOpen && activeSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setActiveSession(null);
                setSimulationMessage(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>Instant Payment Session</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Scan & Pay ₹{Number(activeSession.transaction?.amount || numericAmount).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ref: <span className="font-mono font-semibold">{activeSession.transaction?.transactionReference}</span>
              </p>
            </div>

            {/* Dynamic Simulated QR Box */}
            <div className="bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                {/* Visual SVG QR Code */}
                <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  {/* Top-left position box */}
                  <rect x="10" y="10" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="4" />
                  <rect x="17" y="17" width="12" height="12" rx="2" fill="#0f172a" />
                  {/* Top-right position box */}
                  <rect x="64" y="10" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="4" />
                  <rect x="71" y="17" width="12" height="12" rx="2" fill="#0f172a" />
                  {/* Bottom-left position box */}
                  <rect x="10" y="64" width="26" height="26" rx="4" stroke="#0f172a" strokeWidth="4" />
                  <rect x="17" y="71" width="12" height="12" rx="2" fill="#0f172a" />
                  {/* Dense pattern dots */}
                  <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="24" width="6" height="12" fill="#0f172a" />
                  <rect x="52" y="30" width="6" height="6" fill="#0f172a" />
                  <rect x="12" y="42" width="12" height="6" fill="#0f172a" />
                  <rect x="30" y="42" width="6" height="12" fill="#0f172a" />
                  <rect x="42" y="42" width="16" height="16" rx="3" fill="#059669" />
                  <circle cx="50" cy="50" r="3" fill="white" />
                  <rect x="64" y="42" width="12" height="6" fill="#0f172a" />
                  <rect x="82" y="42" width="6" height="12" fill="#0f172a" />
                  <rect x="64" y="54" width="6" height="12" fill="#0f172a" />
                  <rect x="76" y="60" width="12" height="6" fill="#0f172a" />
                  <rect x="42" y="64" width="16" height="6" fill="#0f172a" />
                  <rect x="42" y="76" width="6" height="12" fill="#0f172a" />
                  <rect x="54" y="82" width="12" height="6" fill="#0f172a" />
                  <rect x="70" y="76" width="18" height="12" fill="#0f172a" />
                </svg>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Supports GPay, PhonePe, Paytm, BHIM</span>
              </div>
            </div>

            {/* Simulation Status Feedback */}
            {simulationMessage && (
              <div
                className={`mt-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  simulationMessage.startsWith('✓')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <span>{simulationMessage}</span>
              </div>
            )}

            {/* Sandbox Simulation Buttons */}
            <div className="mt-5 flex flex-col gap-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Sandbox Simulator Controls
              </div>

              <button
                onClick={() => handleSimulatePayment('SUCCESS')}
                disabled={isSimulating}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSimulating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Instant Approval (Success)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSimulatePayment('FAILED')}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
              >
                Simulate Payment Failure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Verified Receipt Slip Modal */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setIsReceiptModalOpen(false);
                setSelectedReceipt(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Content */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Verified Deposit Slip
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-2">
                ₹{Number(selectedReceipt.amount || 0).toLocaleString('en-IN')}
              </h3>
              <span className="text-xs text-slate-400 mt-0.5">
                Ref: {selectedReceipt.transactionReference}
              </span>
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* Itemized Slip Lines */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Date & Time:</span>
                <span className="font-medium text-slate-800">
                  {new Date(selectedReceipt.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Depositor / Payer:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.customerName || 'Self Top-Up'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Status:</span>
                <span
                  className={`font-bold ${
                    selectedReceipt.paymentStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {selectedReceipt.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Gross Inflow:</span>
                <span className="font-semibold text-slate-800">
                  ₹{Number(selectedReceipt.amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Commission ({selectedReceipt.commissionRate || commissionRate}%):</span>
                <span className="font-medium text-purple-700">
                  -₹{Number(selectedReceipt.commissionAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-full h-px bg-slate-100 my-1" />
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <span>Net Credited to Merchant:</span>
                <span className="font-serif text-emerald-700">
                  ₹{Number(selectedReceipt.netPayoutAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => {
                  setIsReceiptModalOpen(false);
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPage;
