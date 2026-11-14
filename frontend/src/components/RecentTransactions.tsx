import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Download,
} from 'lucide-react';
import { Transaction } from '../types';
import { initialTransactions } from '../data/mockData';
import { MerchantLogoRenderer } from './BrandIcons';

interface RecentTransactionsProps {
  onExportClick?: () => void;
  externalSearch?: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onExportClick,
  externalSearch = '',
}) => {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [localSearch, setLocalSearch] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredTransactions = useMemo(() => {
    const query = (externalSearch || localSearch).trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        !query ||
        t.transactionId.toLowerCase().includes(query) ||
        t.merchant.toLowerCase().includes(query) ||
        t.dateTime.toLowerCase().includes(query) ||
        t.status.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, externalSearch, localSearch, statusFilter]);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 font-sans">
            Completed
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/60 font-sans">
            Scheduled
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 font-sans">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between h-full">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-2 text-gray-900">
          <Clock className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-900 font-sans">
            Recent transactions
          </h3>
        </div>

        {/* Action icons & Export button */}
        <div className="flex items-center gap-2">
          {showSearchInput ? (
            <div className="relative flex items-center animate-fadeIn">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter table..."
                autoFocus
                className="text-xs bg-[#f8fafc] border border-gray-200 rounded-full pl-3 pr-7 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button
                onClick={() => {
                  setShowSearchInput(false);
                  setLocalSearch('');
                }}
                className="absolute right-2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              id="search-transactions-btn"
              onClick={() => setShowSearchInput(true)}
              className="w-7 h-7 rounded-full border border-gray-200/80 bg-[#f8fafc] text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Search transactions"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Filter dropdown button */}
          <div className="relative">
            <button
              id="filter-transactions-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`w-7 h-7 rounded-full border border-gray-200/80 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer ${
                statusFilter !== 'All' ? 'bg-gray-900 text-white' : 'bg-[#f8fafc] hover:bg-gray-100'
              }`}
              title="Filter by status"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                {['All', 'Completed', 'Scheduled', 'Pending'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between ${
                      statusFilter === st ? 'font-bold text-gray-900 bg-gray-50' : 'text-gray-600'
                    }`}
                  >
                    <span>{st}</span>
                    {statusFilter === st && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="more-transactions-btn"
            className="w-7 h-7 rounded-full border border-gray-200/80 bg-[#f8fafc] text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            title="More actions"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Export Button */}
          <button
            id="export-transactions-btn"
            onClick={onExportClick}
            className="flex items-center gap-1.5 bg-[#111827] text-white hover:bg-black px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all cursor-pointer font-sans shadow-2xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto w-full mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100/80 text-[10px] font-semibold text-gray-400 uppercase tracking-widest font-sans">
              <th className="pb-3 pt-1 font-medium pl-1">TRANSACTION ID</th>
              <th className="pb-3 pt-1 font-medium px-4">MERCHANT</th>
              <th className="pb-3 pt-1 font-medium px-4">DATE & TIME</th>
              <th className="pb-3 pt-1 font-medium px-4 text-right">AMOUNT</th>
              <th className="pb-3 pt-1 font-medium pr-1 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-sans">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  id={`transaction-row-${tx.id}`}
                  className="hover:bg-[#fcfdfe] transition-colors group"
                >
                  {/* Transaction ID */}
                  <td className="py-3 pl-1 text-[11px] font-medium text-gray-500 font-mono tracking-tight">
                    {tx.transactionId}
                  </td>

                  {/* Merchant with Icon */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <MerchantLogoRenderer logo={tx.merchantLogo} />
                      <span className="font-semibold text-gray-900 text-xs">
                        {tx.merchant}
                      </span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-4 text-[11px] text-gray-400 font-medium whitespace-nowrap">
                    {tx.dateTime}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-bold text-xs whitespace-nowrap">
                    <span
                      className={
                        tx.amount > 0 ? 'text-gray-900' : 'text-gray-900'
                      }
                    >
                      {tx.amount > 0
                        ? `+₹${tx.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}`
                        : `-₹${Math.abs(tx.amount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}`}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 pr-1 text-center whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
