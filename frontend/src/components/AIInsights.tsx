import React, { useState } from 'react';
import { Sparkles, CreditCard, Landmark, Utensils, Check } from 'lucide-react';
import { initialAIInsights } from '../data/mockData';

export const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState(initialAIInsights);
  const [appliedInsightId, setAppliedInsightId] = useState<string | null>(null);

  const handleApply = (id: string) => {
    setAppliedInsightId(id);
    setTimeout(() => {
      setAppliedInsightId(null);
    }, 2500);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
        );
      case 'savings':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Landmark className="w-5 h-5" />
          </div>
        );
      case 'dining':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#ec4899] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Utensils className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between h-full">
      {/* Header with Sparkle */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 font-sans tracking-tight">
          <Sparkles className="w-4 h-4 text-[#111827]" />
          <span>AI Insight</span>
        </div>

        {/* Heading in Instrument Serif */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111827] mt-2 leading-snug tracking-tight">
          This actions can improve your cash position this month.
        </h3>
      </div>

      {/* Action Recommendation Rows */}
      <div className="mt-5 flex flex-col gap-3">
        {insights.map((item) => {
          const isApplied = appliedInsightId === item.id;
          return (
            <div
              key={item.id}
              id={`insight-item-${item.id}`}
              onClick={() => handleApply(item.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isApplied
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-[#fcfdfe] hover:bg-[#f8fafc] border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Left Icon + Text */}
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {getInsightIcon(item.type)}
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate font-sans">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Right: Amount & Likelihood */}
              <div className="text-right shrink-0">
                {isApplied ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 font-sans">
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </div>
                ) : (
                  <>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 font-sans">
                      {item.amount}
                    </div>
                    <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                      {item.likelihood}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
