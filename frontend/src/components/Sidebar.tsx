import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  NavDashboardIcon,
  NavCashFlowIcon,
  NavDepositIcon,
  NavAllCardsIcon,
  NavBalanceInsightsIcon,
  NavBalanceReportsIcon,
  NavSettingsIcon,
  NavSecurityIcon,
  NavSupportIcon,
  NavLogoutIcon,
  ProGridDotsIcon,
} from './SidebarIcons';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  const mainMenu = isAdmin
    ? [
        { id: 'Dashboard', label: 'Platform Overview', icon: NavDashboardIcon },
        { id: 'Vendors', label: 'Vendor Directory', icon: NavAllCardsIcon },
        { id: 'Transactions', label: 'All Transactions', icon: NavCashFlowIcon },
        { id: 'Payouts', label: 'Payout Approvals', icon: NavBalanceInsightsIcon },
        { id: 'Audit Logs', label: 'Audit Trail', icon: NavBalanceReportsIcon },
      ]
    : [
        { id: 'Dashboard', label: 'Dashboard', icon: NavDashboardIcon },
        { id: 'Deposits', label: 'Deposits & Inflow', icon: NavDepositIcon },
        { id: 'Cash Flow', label: 'Cash Flow', icon: NavCashFlowIcon },
        { id: 'Bank Account', label: 'Bank Account', icon: NavAllCardsIcon },
        { id: 'Transactions', label: 'Transactions', icon: NavBalanceInsightsIcon },
        { id: 'Payouts', label: 'Settlement Payouts', icon: NavBalanceReportsIcon },
      ];

  const projectsMenu = [
    { id: 'Settings', label: 'Settings', icon: NavSettingsIcon },
    { id: 'Security', label: 'Security', icon: NavSecurityIcon },
    { id: 'Support', label: 'Support', icon: NavSupportIcon },
    { id: 'Logout', label: 'Logout', icon: NavLogoutIcon, isAction: true },
  ];

  const displayName = user?.vendor?.businessName || user?.name || 'CashPilot User';
  const displayRole = user?.role === 'ADMIN' ? 'SUPER ADMIN' : 'VERIFIED VENDOR';
  const avatarUrl =
    user?.role === 'ADMIN'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';

  return (
    <aside className="w-60 shrink-0 flex flex-col justify-between p-5 lg:p-6 border-r border-slate-100/90 bg-white lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto z-20">
      {/* Top Section */}
      <div className="flex flex-col gap-5">
        {/* Welcome greeting */}
        <div className="pt-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium tracking-wide">
            <span>Welcome</span>
            <span className="text-sm">🖐️</span>
            <span>,</span>
          </div>
          <h2 className="font-serif text-[24px] font-bold text-slate-900 leading-tight tracking-tight mt-0.5 truncate" title={displayName}>
            {displayName}
          </h2>
          {user?.vendor && (
            <div className="mt-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              Commission Rate: {user.vendor.commissionRate}%
            </div>
          )}
        </div>

        <div className="w-full h-px bg-slate-100 my-1" />

        {/* MAIN MENU */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-sans">
            MAIN MENU
          </div>
          <nav className="flex flex-col gap-1">
            {mainMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer font-sans text-left ${
                    isActive
                      ? 'bg-[#0f172a] text-white shadow-sm'
                      : 'text-slate-900 hover:text-black hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-900'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="w-full h-px bg-slate-100 my-1" />

        {/* Submenu Section */}
        <div>
          <nav className="flex flex-col gap-1">
            {projectsMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    if (item.isAction) {
                      handleLogout();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer font-sans text-left ${
                    isActive
                      ? 'bg-[#0f172a] text-white'
                      : 'text-slate-900 hover:text-black hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-900" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile Pill */}
      <div className="pt-4 mt-auto">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#f8fafc] border border-slate-200/70 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-2xs shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className={`inline-flex items-center w-fit text-[8px] font-bold tracking-wider uppercase text-white px-1.5 py-0.5 rounded-md font-sans leading-none ${
                isAdmin ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-gradient-to-r from-fuchsia-500 to-pink-500'
              }`}>
                {displayRole}
              </span>
              <span className="font-serif text-sm font-bold text-slate-900 leading-tight mt-0.5 truncate">
                {displayName}
              </span>
            </div>
          </div>
          <button
            id="profile-options-btn"
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0 transition-colors"
            title="Sign out"
          >
            <ProGridDotsIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
