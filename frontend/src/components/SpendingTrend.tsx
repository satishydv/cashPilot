import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { TimeFrame } from '../types';

export const SpendingTrend: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('D');

  return (
    <div className="bg-white rounded-[22px] p-5 border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-700" />
        <h3 className="text-sm font-semibold text-gray-900 font-sans">
          Spending trend
        </h3>
      </div>

      {/* Main Content: Numbers + Smooth Area Wave Chart with Tooltip */}
      <div className="mt-3 flex items-end justify-between gap-4">
        {/* Left Side Stat & Controls */}
        <div>
          <div className="font-serif text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
            ₹5,230
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-semibold text-emerald-600 font-sans">
              ↑ 6.4% vs last month
            </span>
          </div>

          {/* D | W | M Toggles */}
          <div className="mt-3 flex items-center bg-[#f8fafc] border border-gray-200/80 rounded-lg p-0.5 text-[10px] font-medium font-sans text-gray-400 w-fit">
            {(['D', 'W', 'M'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                id={`spending-trend-tf-${tf}`}
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

        {/* Right Side: Smooth Wave Chart with Annotation */}
        <div className="flex-1 max-w-[200px] h-20 relative flex items-end">
          {/* Tooltip Tag pointing to peak */}
          <div className="absolute left-[38%] -top-1 -translate-x-1/2 bg-white/95 border border-gray-200 rounded-full px-2 py-0.5 shadow-2xs z-10 pointer-events-none flex flex-col items-center">
            <span className="text-[8px] text-gray-400 leading-none">Product sales</span>
            <span className="text-[9px] font-bold text-gray-800 leading-tight">₹635.23k</span>
          </div>

          <svg
            viewBox="0 0 200 80"
            className="w-full h-full overflow-visible"
            fill="none"
          >
            <defs>
              {/* Vertical line hatch pattern */}
              <pattern
                id="verticalLines"
                width="4"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="80"
                  stroke="#818cf8"
                  strokeWidth="0.8"
                  strokeOpacity="0.25"
                />
              </pattern>
            </defs>

            {/* Shaded wave area with line texture */}
            <path
              d="M 5 60 C 25 60, 35 72, 50 72 C 65 72, 70 50, 90 20 C 105 -5, 115 50, 135 62 C 150 70, 165 70, 195 65 L 195 80 L 5 80 Z"
              fill="url(#verticalLines)"
            />

            {/* Main wave curve stroke */}
            <path
              d="M 5 60 C 25 60, 35 72, 50 72 C 65 72, 70 50, 90 20 C 105 -5, 115 50, 135 62 C 150 70, 165 70, 195 65"
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Peak anchor point */}
            <circle cx="90" cy="20" r="2.5" fill="#6366f1" />
          </svg>
        </div>
      </div>
    </div>
  );
};
