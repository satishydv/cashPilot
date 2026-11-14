import React from 'react';

// CashPilot 4-quadrant propeller brand mark
export const CashPilotLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* 4 propeller petals */}
    <path
      d="M19 6C19 3.79086 17.2091 2 15 2C12.7909 2 11 3.79086 11 6V19H19V6Z"
      fill="#111827"
    />
    <path
      d="M34 19C36.2091 19 38 17.2091 38 15C38 12.7909 36.2091 11 34 11H21V19H34Z"
      fill="#111827"
    />
    <path
      d="M21 34C21 36.2091 22.7909 38 25 38C27.2091 38 29 36.2091 29 34V21H21V34Z"
      fill="#111827"
    />
    <path
      d="M6 21C3.79086 21 2 22.7909 2 25C2 27.2091 3.79086 29 6 29H19V21H6Z"
      fill="#111827"
    />
    {/* Central connection subtleties */}
    <circle cx="20" cy="20" r="2.5" fill="#111827" />
  </svg>
);

// Merchant Brand Logos
export const SpotifyIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-full bg-[#1DB954] flex items-center justify-center text-white shrink-0 ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm5.496 17.306c-.216.353-.674.464-1.027.249-2.812-1.718-6.35-2.107-10.52-1.155-.403.092-.803-.16-.895-.563-.092-.403.16-.803.563-.895 4.571-1.044 8.492-.599 11.63 1.337.354.216.465.674.249 1.027zm1.468-3.262c-.272.441-.85.58-1.291.309-3.218-1.977-8.125-2.55-11.932-1.394-.497.151-1.025-.133-1.176-.63-.151-.497.133-1.025.63-1.176 4.354-1.321 9.774-.68 13.46 1.589.442.272.58.85.309 1.302zm.126-3.41c-3.858-2.29-10.222-2.502-13.896-1.387-.591.179-1.222-.158-1.401-.749-.179-.591.158-1.222.749-1.401 4.231-1.285 11.261-1.036 15.688 1.593.531.315.706 1.004.391 1.535-.315.531-1.004.706-1.531.409z" />
    </svg>
  </div>
);

export const AppleIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.57-.69.96-1.65.85-2.61-.83.03-1.84.55-2.43 1.25-.53.61-.99 1.59-.87 2.53 1 .08 1.88-.48 2.45-1.17z" />
    </svg>
  </div>
);

export const UberIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-full bg-black flex items-center justify-center text-white font-black text-[11px] shrink-0 tracking-tighter ${className}`}>
    UBER
  </div>
);

export const AmazonIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-full bg-[#00A8E8] flex items-center justify-center text-white shrink-0 ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M13.9 11.2c-1.7-.1-3.3.4-3.3 2.1 0 1.2.8 1.9 2 1.9 1.5 0 2.5-.9 2.8-1.8v-1.9c-.5-.2-1-.3-1.5-.3zm2.5 5.5h-1.6v-1.2c-.7.9-1.8 1.4-3.1 1.4-2.1 0-3.6-1.3-3.6-3.5 0-2.6 2.1-3.7 4.9-3.7.8 0 1.5.1 1.9.2v-.8c0-1.2-.8-1.9-2.2-1.9-1.1 0-2.2.4-3.1 1l-.8-1.3c1.2-.8 2.6-1.3 4.2-1.3 2.6 0 3.7 1.4 3.7 3.6v7.5zM22 17.5c-3.7 2.7-8.6 4.1-13.3 4.1-6.3 0-11.9-2.6-16.2-7 .3-.3.9-.2 1.3.1 3.9 3.9 8.9 6.1 14.6 6.1 4.2 0 8.5-1.3 11.9-3.7.6-.4 1.4-.1 1.7.4z" />
    </svg>
  </div>
);

export const AdidasIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-full bg-black flex items-center justify-center text-white shrink-0 ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M4 17l4.5-9h2.5L6.5 17H4zm6 0l4.5-9h2.5L12.5 17H10zm6 0l4.5-9h2.5L18.5 17H16z" />
    </svg>
  </div>
);

export const KlarnaIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <div className={`rounded-full bg-[#FFB3C7] text-slate-900 font-bold flex items-center justify-center text-[12px] shrink-0 font-serif ${className}`}>
    K.
  </div>
);

export const MerchantLogoRenderer: React.FC<{ logo: string }> = ({ logo }) => {
  switch (logo) {
    case 'spotify':
      return <SpotifyIcon />;
    case 'apple':
      return <AppleIcon />;
    case 'uber':
      return <UberIcon />;
    case 'amazon':
      return <AmazonIcon />;
    case 'adidas':
      return <AdidasIcon />;
    case 'klarna':
      return <KlarnaIcon />;
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
          {logo.charAt(0).toUpperCase()}
        </div>
      );
  }
};
