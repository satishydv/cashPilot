import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { TimeFrame } from '../types';

export const FinancialHealth: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('D');

  return (
    <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-gray-700" />
        <h3 className="text-sm font-semibold text-gray-900 font-sans">
          Financial health
        </h3>
      </div>

      {/* Main Content: Numbers + Stepped Line Chart */}
      <div className="mt-3 flex items-end justify-between gap-4">
        {/* Left Side Stat & Controls */}
        <div>
          <div className="font-serif text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
            ₹38,176
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            <span className="text-[11px] font-semibold text-pink-500 font-sans">
              +12% increase
            </span>
          </div>

          {/* D | W | M Toggles */}
          <div className="mt-3 flex items-center bg-[#f8fafc] border border-gray-200/80 rounded-lg p-0.5 text-[10px] font-medium font-sans text-gray-400 w-fit">
            {(['D', 'W', 'M'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                id={`financial-health-tf-${tf}`}
                onClick={() => setTimeFrame(tf)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  timeFrame === tf
                    ? 'bg-white text-gray-900 font-semibold shadow-2xs'
                    : 'hover:text-gray-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Stepped Line Graphic */}
        <div className="flex-1 max-w-[170px] h-18 relative">
          <svg
            viewBox="0 0 160 70"
            className="w-full h-full overflow-visible"
            fill="none"
          >
            {/* Stepped outline matching screenshot */}
            <path
              d="M 5 55 L 20 55 L 20 48 L 35 48 L 35 52 L 45 52 L 45 32 L 60 32 L 60 18 L 75 18 L 75 25 L 90 25 L 90 20 L 105 20 L 105 28 L 120 28 L 120 40 L 135 40 L 135 46 L 155 46"
              stroke="#ec4899"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="miter"
            />
            {/* Soft pink fill underneath */}
            <path
              d="M 5 55 L 20 55 L 20 48 L 35 48 L 35 52 L 45 52 L 45 32 L 60 32 L 60 18 L 75 18 L 75 25 L 90 25 L 90 20 L 105 20 L 105 28 L 120 28 L 120 40 L 135 40 L 135 46 L 155 46 L 155 65 L 5 65 Z"
              fill="url(#pinkGradient)"
              opacity="0.12"
            />
            <defs>
              <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};
