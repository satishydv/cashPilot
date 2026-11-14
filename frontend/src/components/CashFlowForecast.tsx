import React, { useState } from 'react';
import { Layers, SlidersHorizontal } from 'lucide-react';
import { initialCashFlowBars } from '../data/mockData';

interface CashFlowForecastProps {
  onManageClick?: () => void;
}

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({
  onManageClick,
}) => {
  const [bars] = useState(initialCashFlowBars);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const yAxisTicks = ['50k', '40k', '30k', '20k', '10k', '0k'];

  return (
    <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900">
          <Layers className="w-4 h-4 text-gray-700" />
          <h3 className="text-sm font-semibold text-gray-900 font-sans">
            Cash flow forecast
          </h3>
        </div>

        <button
          id="manage-cashflow-btn"
          onClick={onManageClick}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer font-sans"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <span>Manage</span>
        </button>
      </div>

      {/* Main Forecast Figure */}
      <div className="mt-3">
        <div className="font-serif text-3xl sm:text-[38px] font-bold text-[#111827] tracking-tight leading-none">
          ₹41,820
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          <span className="text-xs text-gray-500 font-sans">
            12% stronger than last month
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 relative h-48 sm:h-52 w-full flex items-end">
        {/* Y Axis Labels & Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 text-[11px] text-gray-400 font-sans">
          {yAxisTicks.map((tick, i) => (
            <div key={tick} className="w-full flex items-center gap-2">
              <span className="w-6 text-right shrink-0">{tick}</span>
              <div
                className={`flex-1 border-b ${
                  i === yAxisTicks.length - 1
                    ? 'border-gray-200'
                    : 'border-dashed border-gray-100'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 w-full pl-9 pr-2 h-full flex items-end justify-between gap-2 sm:gap-4 pb-0.5">
          {bars.map((bar) => {
            const heightPercent = (bar.value / 50) * 100;
            const isHovered = hoveredBar === bar.id;

            return (
              <div
                key={bar.id}
                onMouseEnter={() => setHoveredBar(bar.id)}
                onMouseLeave={() => setHoveredBar(null)}
                className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Bar Value / Tag on Top */}
                <div className="mb-2 text-center transition-transform group-hover:-translate-y-1 duration-150">
                  {bar.highlightLabel && (
                    <div className="text-[10px] text-gray-400 font-medium tracking-tight">
                      {bar.highlightLabel}
                    </div>
                  )}
                  <div
                    className={`font-sans text-xs tracking-tight ${
                      bar.isPeak
                        ? 'font-bold text-gray-900 text-sm'
                        : 'font-medium text-gray-500'
                    }`}
                  >
                    {bar.amount}
                  </div>
                </div>

                {/* The Bar */}
                <div
                  className={`w-full max-w-[68px] rounded-t-2xl transition-all duration-300 relative overflow-hidden ${
                    bar.isPeak
                      ? 'bg-gradient-to-t from-[#f43f5e] via-[#ec4899] to-[#fb7185] glow-pink'
                      : 'bg-gradient-to-t from-[#6366f1] via-[#818cf8] to-[#93c5fd] hover:from-[#4f46e5] hover:to-[#60a5fa]'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                  }}
                >
                  {/* Subtle woven micro texture overlay */}
                  <div className="absolute inset-0 bar-texture opacity-35" />
                  <div className="absolute inset-x-0 top-0 h-2 bg-white/20 rounded-t-2xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
