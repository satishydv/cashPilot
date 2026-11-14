import React, { useState } from 'react';
import { X, Check, Mail, UserPlus, FileSpreadsheet, FileText, Download } from 'lucide-react';

interface InviteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteManagerModal: React.FC<InviteManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Portfolio Manager');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
              Invite Manager
            </h3>
            <p className="text-xs text-gray-500">
              Grant team members access to cash flow and financial insights.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">Invitation Sent</h4>
            <p className="text-xs text-gray-500 mt-1">
              We've sent an access link to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Role & Permissions
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
              >
                <option value="Portfolio Manager">Portfolio Manager (Full view & export)</option>
                <option value="Financial Analyst">Financial Analyst (Insights only)</option>
                <option value="Operations Lead">Operations Lead (Audit & Reports)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-medium bg-gray-900 text-white hover:bg-black cursor-pointer shadow-xs"
              >
                Send Invite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      // Trigger simple download
      const csvContent =
        'data:text/csv;charset=utf-8,ID,Merchant,DateTime,Amount,Status\n' +
        'TXN-7G31L9,Spotify,MAY 19 2026 11:07 AM,-4.99,Completed\n' +
        'TXN-7G31L9,Apple,MAY 19 2026 9:42 AM,-18.45,Completed\n' +
        'TXN-7H84M4,Uber,MAY 18 2026 7:14 PM,3450.00,Scheduled\n' +
        'PAY-5J19N8,Amazon Prime,MAY 16 2026 9:00 AM,-1600.00,Completed\n' +
        'BILL-4K08Q2,Adidas,MAY 15 2026 8:00 AM,-153.99,Pending\n' +
        'TXN-3L57P6,Klarna,MAY 14 2026 2:42 PM,-89.31,Pending';
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `CashPilot_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
              Export Transactions
            </h3>
            <p className="text-xs text-gray-500">
              Download your recent ledger records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <button
            type="button"
            onClick={() => setFormat('csv')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              format === 'csv'
                ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <span className="text-xs font-semibold text-gray-900">CSV Sheet</span>
            <span className="text-[10px] text-gray-400">Excel / Sheets</span>
          </button>

          <button
            type="button"
            onClick={() => setFormat('pdf')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              format === 'pdf'
                ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="w-6 h-6 text-rose-500" />
            <span className="text-xs font-semibold text-gray-900">PDF Report</span>
            <span className="text-[10px] text-gray-400">Printable</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-gray-900 text-white hover:bg-black cursor-pointer shadow-xs disabled:opacity-50"
          >
            {downloading ? 'Preparing...' : 'Download File'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ManageForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageForecastModal: React.FC<ManageForecastModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
          Manage Cash Flow Forecast
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Adjust simulation parameters, income intervals, and forecast horizons.
        </p>

        <div className="flex flex-col gap-4 mt-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="font-semibold text-gray-900">Baseline Revenue Projection</div>
            <div className="text-gray-500 mt-0.5">₹45,820 expected mid-month settlement</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="font-semibold text-gray-900">Safety Buffer Sensitivity</div>
            <div className="text-gray-500 mt-0.5">Calculated at 15% discretionary holdback</div>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-gray-900 text-white hover:bg-black cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
