import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MetricCards } from '../components/MetricCards';
import api from '../services/api';
import { MetricCardData } from '../types';
import {
  Users,
  Percent,
  TrendingUp,
  CreditCard,
  Plus,
  CheckCircle,
  XCircle,
  Edit2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Vendor Modal
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    commissionRate: '2.5',
    password: '',
  });

  // Edit Commission Modal
  const [editCommissionVendor, setEditCommissionVendor] = useState<any | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, vendorsRes] = await Promise.allSettled([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/vendors'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }

      if (vendorsRes.status === 'fulfilled' && vendorsRes.value.data?.success) {
        setVendors(vendorsRes.value.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRegisterVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/vendors', {
        ...vendorForm,
        commissionRate: Number(vendorForm.commissionRate),
      });

      if (res.data?.success) {
        setNotification(`Vendor ${vendorForm.businessName} onboarded successfully!`);
        setIsAddVendorOpen(false);
        setVendorForm({
          businessName: '',
          email: '',
          phone: '',
          commissionRate: '2.5',
          password: '',
        });
        fetchAdminData();
      }
    } catch (err: any) {
      setNotification(err.response?.data?.message || 'Failed to onboard vendor');
    }
  };

  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommissionVendor) return;

    try {
      const res = await api.patch(`/admin/vendors/${editCommissionVendor._id}/commission`, {
        commissionRate: Number(newCommissionRate),
      });

      if (res.data?.success) {
        setNotification(`Commission rate updated to ${newCommissionRate}% for ${editCommissionVendor.businessName}`);
        setEditCommissionVendor(null);
        fetchAdminData();
      }
    } catch (err: any) {
      setNotification(err.response?.data?.message || 'Failed to update commission rate');
    }
  };

  const handleToggleStatus = async (vendor: any) => {
    const newStatus = vendor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await api.patch(`/admin/vendors/${vendor._id}/status`, {
        status: newStatus,
      });

      if (res.data?.success) {
        setNotification(`Vendor status updated to ${newStatus}`);
        fetchAdminData();
      }
    } catch (err: any) {
      setNotification(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  // Convert Admin stats to MetricCardData
  const adminCards: MetricCardData[] | undefined = stats
    ? [
        {
          id: 'admin-gmv',
          title: 'Total Platform GMV',
          subtitle: 'Gross payment volume',
          amount: `₹${Number(stats.totalVolume || 0).toLocaleString('en-IN')}`,
          changeBadge: '↑ Platform',
          changeType: 'positive',
          secondaryInfo: `${stats.totalTransactions || 0} successful orders`,
          timeFrames: ['D', 'W', 'M'],
          activeTimeFrame: 'W',
          type: 'balance',
        },
        {
          id: 'admin-commission',
          title: 'Commission Earned',
          subtitle: 'Platform revenue fee',
          amount: `₹${Number(stats.totalCommissionEarned || 0).toLocaleString('en-IN')}`,
          changeBadge: 'Net Revenue',
          changeType: 'positive',
          secondaryInfo: 'Direct platform profit',
          timeFrames: ['W', 'M'],
          activeTimeFrame: 'W',
          type: 'income',
        },
        {
          id: 'admin-disbursed',
          title: 'Payouts Disbursed',
          subtitle: 'Settled to merchant banks',
          amount: `₹${Number(stats.totalPayoutsDisbursed || 0).toLocaleString('en-IN')}`,
          changeBadge: 'Settled',
          changeType: 'positive',
          secondaryInfo: 'Instant IMPS transfers',
          timeFrames: ['D', 'W', 'M'],
          activeTimeFrame: 'W',
          type: 'spent',
        },
        {
          id: 'admin-vendors',
          title: 'Active Vendors',
          subtitle: 'Onboarded merchants',
          amount: `${stats.activeVendors || 0} / ${stats.totalVendors || 0}`,
          changeBadge: 'Merchants',
          changeType: 'positive',
          secondaryInfo: 'Dynamic commission enabled',
          timeFrames: ['W', 'M'],
          activeTimeFrame: 'W',
          type: 'safe',
        },
      ]
    : undefined;

  const filteredVendors = vendors.filter(
    (v) =>
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen w-full bg-[#f2f4f7] text-gray-800 flex flex-col font-sans antialiased">
      <Navbar
        onOpenInviteModal={() => setIsAddVendorOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-col lg:flex-row flex-1 w-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 bg-[#f2f4f7] p-4 sm:p-6 lg:p-7 flex flex-col gap-6 overflow-x-hidden min-w-0">
          {notification && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <span>{notification}</span>
              <button
                onClick={() => setNotification(null)}
                className="text-blue-500 hover:text-blue-800 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* KPI Cards Row */}
          <section aria-label="Admin Platform Statistics">
            <MetricCards cards={adminCards} />
          </section>

          {/* Vendor Management Section */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Registered Merchants & Commission Settings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure dynamic platform fee percentages and manage merchant accounts
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
                <button
                  onClick={fetchAdminData}
                  className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Refresh vendors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddVendorOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-black px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Vendor</span>
                </button>
              </div>
            </div>

            {/* Vendors Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Merchant Name</th>
                    <th className="py-3.5 px-4">Email & Phone</th>
                    <th className="py-3.5 px-4">Commission Rate</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No vendors found. Click "Onboard New Vendor" to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 font-serif text-sm">
                            {vendor.businessName}
                          </div>
                          <div className="text-[10px] text-slate-400">ID: {vendor._id}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800">{vendor.email}</div>
                          <div className="text-slate-400 text-[11px]">{vendor.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 font-bold px-2.5 py-1 rounded-xl border border-violet-100">
                            <span>{vendor.commissionRate}%</span>
                            <span className="text-[10px] font-normal text-violet-500">take-rate</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                              vendor.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {vendor.status === 'ACTIVE' ? (
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-slate-400" />
                            )}
                            {vendor.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditCommissionVendor(vendor);
                                setNewCommissionRate(vendor.commissionRate.toString());
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Update commission rate"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Set Rate</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(vendor)}
                              className="px-2 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              {vendor.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Onboard Vendor Modal */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">Onboard New Merchant</h3>
            <p className="text-xs text-slate-500 mb-5">
              Creates the merchant profile and initial login credentials
            </p>

            <form onSubmit={handleRegisterVendor} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={vendorForm.businessName}
                  onChange={(e) => setVendorForm({ ...vendorForm, businessName: e.target.value })}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Merchant Email</label>
                <input
                  type="email"
                  required
                  value={vendorForm.email}
                  onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                  placeholder="merchant@acme.com"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={vendorForm.commissionRate}
                  onChange={(e) => setVendorForm({ ...vendorForm, commissionRate: e.target.value })}
                  placeholder="2.5"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={vendorForm.password}
                  onChange={(e) => setVendorForm({ ...vendorForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Commission Modal */}
      {editCommissionVendor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
              Adjust Commission Rate
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set dynamic commission fee for <span className="font-semibold text-slate-800">{editCommissionVendor.businessName}</span>
            </p>

            <form onSubmit={handleUpdateCommission} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-slate-900 font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditCommissionVendor(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Update Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
