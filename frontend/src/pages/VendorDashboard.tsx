import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MetricCards } from '../components/MetricCards';
import { CashFlowForecast } from '../components/CashFlowForecast';
import { AIInsights } from '../components/AIInsights';
import { FinancialHealth } from '../components/FinancialHealth';
import { SpendingTrend } from '../components/SpendingTrend';
import { RecentTransactions } from '../components/RecentTransactions';
import {
  InviteManagerModal,
  ExportModal,
  ManageForecastModal,
} from '../components/Modals';
import api from '../services/api';
import { MetricCardData } from '../types';
import { Building, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

// Dedicated Sub-Pages for Main Menu
import { DepositPage } from './vendor/DepositPage';
import { CashFlowPage } from './vendor/CashFlowPage';
import { BankAccountPage } from './vendor/BankAccountPage';
import { TransactionsPage } from './vendor/TransactionsPage';
import { PayoutsPage } from './vendor/PayoutsPage';

export const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const [stats, setStats] = useState<any>(null);
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
  });
  const [bankMessage, setBankMessage] = useState<string | null>(null);

  // Fetch Vendor Stats and Bank Account
  const fetchData = async () => {
    try {
      const [statsRes, bankRes] = await Promise.allSettled([
        api.get('/vendor/dashboard-stats'),
        api.get('/vendor/bank-account'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }

      if (bankRes.status === 'fulfilled' && bankRes.value.data?.success && bankRes.value.data.data) {
        setBankAccount(bankRes.value.data.data);
        setBankForm({
          accountHolderName: bankRes.value.data.data.accountHolderName || '',
          accountNumber: bankRes.value.data.data.accountNumber || '',
          ifsc: bankRes.value.data.data.ifsc || '',
          bankName: bankRes.value.data.data.bankName || '',
        });
      }
    } catch (err) {
      console.error('Error loading vendor dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/vendor/bank-account', bankForm);
      if (res.data?.success) {
        setBankAccount(res.data.data);
        setBankMessage('Bank account saved successfully!');
        setTimeout(() => {
          setIsBankModalOpen(false);
          setBankMessage(null);
        }, 1500);
      }
    } catch (err: any) {
      setBankMessage(err.response?.data?.message || 'Failed to save bank account');
    }
  };

  // Convert real stats to MetricCardData format
  const dynamicCards: MetricCardData[] | undefined = stats
    ? [
        {
          id: 'available-balance',
          title: 'Net Payout Balance',
          subtitle: 'Available for settlement',
          amount: `₹${Number(stats.totalNetEarnings || 0).toLocaleString('en-IN')}`,
          changeBadge: '↑ Live',
          changeType: 'positive',
          secondaryInfo: `From ${stats.totalOrders || 0} total transactions`,
          timeFrames: ['D', 'W', 'M'],
          activeTimeFrame: 'W',
          type: 'balance',
        },
        {
          id: 'income-month',
          title: 'Gross Sales Volume',
          subtitle: 'Total customer payments',
          amount: `₹${Number(stats.totalSales || 0).toLocaleString('en-IN')}`,
          changeBadge: '↑ Total',
          changeType: 'positive',
          secondaryInfo: 'Direct customer orders',
          timeFrames: ['W', 'M'],
          activeTimeFrame: 'W',
          type: 'income',
        },
        {
          id: 'spent-month',
          title: 'Platform Commission',
          subtitle: 'Deducted as per rate',
          amount: `₹${Number(stats.totalCommissionDeducted || 0).toLocaleString('en-IN')}`,
          changeBadge: 'Admin Fee',
          changeType: 'negative',
          secondaryInfo: 'Auto-calculated server-side',
          timeFrames: ['D', 'W', 'M'],
          activeTimeFrame: 'W',
          type: 'spent',
        },
        {
          id: 'safe-to-spend',
          title: 'Pending Settlements',
          subtitle: 'Ready for IMPS payout',
          amount: `₹${Number(stats.pendingPayouts || 0).toLocaleString('en-IN')}`,
          changeBadge: 'Pending',
          changeType: 'negative',
          secondaryInfo: bankAccount ? 'Bank account linked' : 'No bank account linked',
          timeFrames: ['W', 'M'],
          activeTimeFrame: 'W',
          type: 'safe',
        },
      ]
    : undefined;

  // Render content based on current active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Deposits':
        return (
          <DepositPage
            onDepositSuccess={() => {
              fetchData();
            }}
          />
        );

      case 'Cash Flow':
        return (
          <CashFlowPage
            stats={stats}
            onOpenManageModal={() => setIsManageModalOpen(true)}
          />
        );

      case 'Bank Account':
        return (
          <BankAccountPage
            bankAccount={bankAccount}
            onAccountUpdated={(updated) => setBankAccount(updated)}
          />
        );

      case 'Transactions':
        return <TransactionsPage externalSearch={searchQuery} />;

      case 'Payouts':
        return (
          <PayoutsPage
            bankAccount={bankAccount}
            onNavigateToBank={() => setActiveTab('Bank Account')}
          />
        );

      case 'Dashboard':
      default:
        return (
          <>
            {/* Bank Account Notification Banner if not linked */}
            {!bankAccount && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Add your settlement bank account</h4>
                    <p className="text-xs text-amber-700">Link your account number and IFSC code to receive automated IMPS payouts.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('Bank Account')}
                  className="px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Add Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Row 1: Top 4 KPI Metrics */}
            <section aria-label="Key Performance Indicators">
              <MetricCards cards={dynamicCards} />
            </section>

            {/* Row 2: Cash Flow Forecast (Left) & AI Insights (Right) */}
            <section
              aria-label="Cash Flow and Insights"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-7 flex flex-col">
                <CashFlowForecast
                  onManageClick={() => setIsManageModalOpen(true)}
                />
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <AIInsights />
              </div>
            </section>

            {/* Row 3: Financial Health & Spending Trend (Left) + Recent Transactions (Right) */}
            <section
              aria-label="Health, Trends, and Transactions"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                <FinancialHealth />
                <SpendingTrend />
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <RecentTransactions
                  onExportClick={() => setIsExportModalOpen(true)}
                  externalSearch={searchQuery}
                />
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f2f4f7] text-gray-800 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Dashboard Body */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-[#f2f4f7] p-4 sm:p-6 lg:p-7 flex flex-col gap-5 overflow-x-hidden min-w-0">
          {renderTabContent()}
        </main>
      </div>

      {/* Interactive Modals */}
      <InviteManagerModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
      <ManageForecastModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />
    </div>
  );
};

export default VendorDashboard;
