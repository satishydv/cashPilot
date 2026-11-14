import React, { useState } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { CashPilotLogo } from './BrandIcons';
import { teamMembers } from '../data/mockData';

interface NavbarProps {
  onOpenInviteModal?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenInviteModal,
  searchQuery,
  setSearchQuery,
}) => {
  const [isFilterActive, setIsFilterActive] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between py-4 px-6 md:px-8 border-b border-gray-100/80 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Left: Brand Logo */}
      <div className="flex items-center gap-3">
        <CashPilotLogo className="w-8 h-8" />
        <span className="font-serif text-2xl font-bold tracking-tight text-[#111827]">
          CashPilot
        </span>
      </div>

      {/* Center: Search & Filter */}
      <div className="hidden md:flex items-center gap-2 max-w-md w-full mx-6">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here..."
            className="w-full bg-[#f8fafc] border border-gray-200/90 rounded-full pl-9 pr-12 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all font-sans"
          />
          <div className="absolute right-3 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-gray-400 bg-white border border-gray-200/80 rounded shadow-2xs">
              ⌘S
            </kbd>
          </div>
        </div>

        {/* Filter button */}
        <button
          id="toggle-filter-btn"
          onClick={() => setIsFilterActive(!isFilterActive)}
          className={`p-2 rounded-full border transition-all cursor-pointer ${
            isFilterActive
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-[#f8fafc] text-gray-600 border-gray-200/90 hover:bg-gray-100 hover:text-gray-900'
          }`}
          title="Filter preferences"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Team Stack & Invite Manager */}
      <div className="flex items-center gap-3">
        {/* Team Avatars Stack */}
        <div className="flex items-center -space-x-2 mr-1">
          {teamMembers.map((member, index) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              title={`${member.name} (${member.role})`}
              className="w-7 h-7 rounded-full object-cover border-2 border-white ring-1 ring-gray-100 shadow-2xs hover:scale-110 hover:z-10 transition-transform cursor-pointer"
              style={{ zIndex: 10 - index }}
            />
          ))}
        </div>

        {/* Invite Manager Button */}
        <button
          id="invite-manager-btn"
          onClick={onOpenInviteModal}
          className="flex items-center gap-1.5 bg-[#111827] text-white hover:bg-black px-4 py-2 rounded-full text-xs font-medium tracking-tight shadow-sm transition-all duration-150 active:scale-95 cursor-pointer font-sans"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Invite Manager</span>
        </button>
      </div>
    </header>
  );
};
