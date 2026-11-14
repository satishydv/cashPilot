import React, { useState } from 'react';
import { CashFlowForecast } from '../../components/CashFlowForecast';
import { AIInsights } from '../../components/AIInsights';
import { SpendingTrend } from '../../components/SpendingTrend';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, DollarSign, Calendar, Download, Sparkles } from 'lucide-react';

interface CashFlowPageProps {
  stats: any;
  onOpenManageModal?: () => void;
}

export const CashFlowPage: React.FC<CashFlowPageProps> = ({ stats, onOpenManageModal }) => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const totalInflow = Number(stats?.totalSales || 45820);
  const totalCommission = Number(stats?.totalCommissionDeducted || 1145);
  const netSettled = Number(stats?.settledPayouts || 38176);
  const pendingLiquidity = Number(stats?.pendingPayouts || 6499);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Header & Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Liquidity & Inflow Engine</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Cash Flow Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time breakdown of inflows, merchant net settlements, and working capital forecasting.</p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Exporting Cash Flow Statement...')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 text-white hover:bg-black text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 4 Cash Flow KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Inflow */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Inflow</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">₹{totalInflow.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">↑ 14.8% vs prior</span>
            <span className="text-slate-400">Gross customer orders</span>
          </div>
        </div>

        {/* Settled to Bank */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Settled to Bank</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">₹{netSettled.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
            <span className="text-blue-600 font-semibold">IMPS Verified</span>
            <span className="text-slate-400">In bank account</span>
          </div>
        </div>

        {/* Platform Deductions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Platform Fees</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">₹{totalCommission.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Dynamic Rate</span>
            <span className="text-slate-400">Automatic take-rate</span>
          </div>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">In Transit</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">₹{pendingLiquidity.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
            <span className="text-purple-600 font-semibold">Next batch</span>
            <span className="text-slate-400">T+1 Settlement</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Cash Flow Forecast Chart + Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <CashFlowForecast onManageClick={onOpenManageModal} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AIInsights />
          <SpendingTrend />
        </div>
      </div>
    </div>
  );
};

export default CashFlowPage;
