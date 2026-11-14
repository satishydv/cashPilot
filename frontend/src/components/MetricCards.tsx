import React, { useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { TimeFrame, MetricCardData } from '../types';
import { initialMetricCards } from '../data/mockData';

// Custom Detailed Gradient Squircle Icons matching screenshot
export const AvailableBalanceIcon: React.FC = () => (
  <div className="relative p-1 rounded-[18px] bg-[#eff6ff] shadow-xs shrink-0">
    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-[#60a5fa] via-[#3b82f6] to-[#2563eb] flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/50 relative overflow-hidden">
      {/* Top subtle gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/30 to-transparent rounded-t-[14px] pointer-events-none" />
      {/* 4-square grid matrix icon with rounded dots */}
      <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="3.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="11.5" y="3.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3.5" y="11.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="11.5" y="11.5" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    </div>
  </div>
);

export const IncomeMonthIcon: React.FC = () => (
  <div className="relative p-1 rounded-[18px] bg-[#ecfdf5] shadow-xs shrink-0">
    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-md shadow-emerald-500/25 ring-1 ring-white/50 relative overflow-hidden">
      {/* Top subtle gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/30 to-transparent rounded-t-[14px] pointer-events-none" />
      {/* Minimalist modern wallet outline */}
      <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 6.5V5C16 3.89543 15.1046 3 14 3H4C2.89543 3 2 3.89543 2 5V14.5C2 15.6046 2.89543 16.5 4 16.5H15C16.1046 16.5 17 15.6046 17 14.5V8.5C17 7.39543 16.1046 6.5 15 6.5H2.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="11.5" r="1.2" fill="currentColor" />
      </svg>
    </div>
  </div>
);

export const SpentMonthIcon: React.FC = () => (
  <div className="relative p-1 rounded-[18px] bg-[#fff7ed] shadow-xs shrink-0">
    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-[#fb923c] via-[#f97316] to-[#ea580c] flex items-center justify-center shadow-md shadow-orange-500/25 ring-1 ring-white/50 relative overflow-hidden">
      {/* Top subtle gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/30 to-transparent rounded-t-[14px] pointer-events-none" />
      {/* Card / terminal / spending device icon */}
      <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4.5" width="14" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 7V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12.5 8H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12.5 12H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

export const SafeToSpendIcon: React.FC = () => (
  <div className="relative p-1 rounded-[18px] bg-[#fdf2f8] shadow-xs shrink-0">
    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-[#f472b6] via-[#ec4899] to-[#db2777] flex items-center justify-center shadow-md shadow-pink-500/25 ring-1 ring-white/50 relative overflow-hidden">
      {/* Top subtle gloss highlight */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/30 to-transparent rounded-t-[14px] pointer-events-none" />
      {/* Coin purse / Money vault badge */}
      <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.5 7.5C4.5 6.39543 5.39543 5.5 6.5 5.5H13.5C14.6046 5.5 15.5 6.39543 15.5 7.5V13.5C15.5 14.6046 14.6046 15.5 13.5 15.5H6.5C5.39543 15.5 4.5 14.6046 4.5 13.5V7.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M8 5.5V4C8 3.44772 8.44772 3 9 3H11C11.5523 3 12 3.44772 12 4V5.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  </div>
);

interface MetricCardsProps {
  cards?: MetricCardData[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ cards: propCards }) => {
  const [cards, setCards] = useState<MetricCardData[]>(propCards || initialMetricCards);

  React.useEffect(() => {
    if (propCards) {
      setCards(propCards);
    }
  }, [propCards]);

  const handleTimeFrameChange = (cardId: string, tf: TimeFrame) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, activeTimeFrame: tf } : c))
    );
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'balance':
        return <AvailableBalanceIcon />;
      case 'income':
        return <IncomeMonthIcon />;
      case 'spent':
        return <SpentMonthIcon />;
      case 'safe':
        return <SafeToSpendIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 w-full">
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            id={`metric-card-${card.id}`}
            className="bg-white rounded-[22px] p-5 border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between"
          >
            {/* Top Row: Icon + Title & Subtitle + Arrow Action */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {renderIcon(card.type)}
                <div className="min-w-0">
                  <h3 className="text-[17px] font-serif font-bold text-slate-900 leading-snug truncate tracking-normal">
                    {card.title}
                  </h3>
                  <p
                    className={`text-[11px] mt-0.5 font-sans truncate ${
                      card.type === 'income'
                        ? 'text-emerald-500 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <button
                id={`expand-metric-${card.id}`}
                className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="View details"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>

            {/* Bottom Row: Amount + Growth Badge + Subtitle + Controls */}
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-[30px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-none">
                    {card.amount}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 font-sans ${
                      card.changeType === 'positive'
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100/80'
                        : 'text-pink-500 bg-pink-50 border border-pink-100/80'
                    }`}
                  >
                    {card.changeBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1.5">
                  {card.secondaryInfo}
                </p>
              </div>

              {/* Action / Segmented Controls on Right */}
              {card.timeFrames && (
                <div className="flex items-center bg-slate-50 border border-slate-200/70 rounded-full p-1 text-[11px] font-medium font-sans text-slate-400">
                  {card.timeFrames.map((tf) => (
                    <button
                      key={tf}
                      id={`timeframe-${card.id}-${tf}`}
                      onClick={() => handleTimeFrameChange(card.id, tf)}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        card.activeTimeFrame === tf
                          ? 'bg-white text-slate-900 font-semibold shadow-xs'
                          : 'hover:text-slate-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              )}

              {card.avatars && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 rounded-full py-0.5 px-1.5">
                  <button
                    id="add-member-safe-btn"
                    className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-semibold cursor-pointer shadow-2xs"
                    title="Add contributor"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                  <div className="flex items-center -space-x-1.5">
                    {card.avatars.map((av, i) => (
                      <img
                        key={i}
                        src={av}
                        alt="User"
                        className="w-5 h-5 rounded-full object-cover border border-white"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
