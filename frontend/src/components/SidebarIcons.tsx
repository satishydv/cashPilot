import React from 'react';

// Custom SVG Icons matching the exact linework from the 1st reference image

export const NavDashboardIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tag / home badge shape with inverted center circle */}
    <path
      d="M4 8L10 3.5L16 8V15C16 15.8284 15.3284 16.5 14.5 16.5H5.5C4.67157 16.5 4 15.8284 4 15V8Z"
      fill="currentColor"
    />
    <circle cx="10" cy="11" r="1.8" fill="#0f172a" />
  </svg>
);

export const NavCashFlowIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stacked 3 cylindrical coin discs */}
    <ellipse cx="10" cy="5.2" rx="6" ry="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 5.2V9.2C4 10.4 6.7 11.4 10 11.4C13.3 11.4 16 10.4 16 9.2V5.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 9.2V13.5C4 14.7 6.7 15.7 10 15.7C13.3 15.7 16 14.7 16 13.5V9.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const NavDepositIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Vault box with inward deposit arrow */}
    <rect x="2.5" y="4" width="15" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10 2V9M10 9L7.5 6.5M10 9L12.5 6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="12.5" r="1.2" fill="currentColor" />
  </svg>
);

export const NavAllCardsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Credit card outline with magnetic stripe */}
    <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <line x1="2.5" y1="8.5" x2="17.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="12.5" r="1" fill="currentColor" />
  </svg>
);

export const NavBalanceInsightsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Line graph inside a rounded container */}
    <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M5.5 12L8.5 8.5L11.5 11.5L14.5 6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NavBalanceReportsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Computer monitor/display with vertical chart bars */}
    <rect x="2.5" y="3.5" width="15" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <line x1="6.5" y1="10.5" x2="6.5" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="10" y1="10.5" x2="10" y2="6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.5" y1="10.5" x2="13.5" y2="7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10 14V16.5M7 16.5H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const NavSettingsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Slider switches in a rounded frame */}
    <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <line x1="5.5" y1="7.5" x2="14.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8" cy="7.5" r="1.6" fill="currentColor" />
    <line x1="5.5" y1="12.5" x2="14.5" y2="12.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="12" cy="12.5" r="1.6" fill="currentColor" />
  </svg>
);

export const NavSecurityIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Authentic Fingerprint scanner ridges icon from 1st image */}
    <path
      d="M10 2.8C6.5 2.8 3.8 5.5 3.8 9C3.8 11.2 4.8 13.1 6.3 14.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M16.2 9C16.2 5.5 13.5 2.8 10 2.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M16.2 11.5C16 13.2 15 14.8 13.5 15.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M6.5 9C6.5 7.1 8.1 5.5 10 5.5C11.9 5.5 13.5 7.1 13.5 9C13.5 11.8 12.2 14.2 10.2 16.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M10 8.2C9.5 8.2 9.2 8.5 9.2 9C9.2 11.2 8.5 12.8 7.5 14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M10.8 10.5C10.8 12 10.2 13.5 9.5 14.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const NavSupportIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Headset icon from 1st image */}
    <path
      d="M3.5 10C3.5 6.4 6.4 3.5 10 3.5C13.6 3.5 16.5 6.4 16.5 10V13.5C16.5 14.6 15.6 15.5 14.5 15.5H14C13.4 15.5 13 15.1 13 14.5V11C13 10.4 13.4 10 14 10H16.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M3.5 10H6C6.6 10 7 10.4 7 11V14.5C7 15.1 6.6 15.5 6 15.5H5.5C4.4 15.5 3.5 14.6 3.5 13.5V10Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NavLogoutIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circle with rightward exit arrow as shown in image 1 */}
    <path
      d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C12.4 16 14.4 14.6 15.3 12.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M10 10H17M14.5 7.5L17 10L14.5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ProGridDotsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="1.3" fill="currentColor" />
    <circle cx="11" cy="5" r="1.3" fill="currentColor" />
    <circle cx="5" cy="11" r="1.3" fill="currentColor" />
    <circle cx="11" cy="11" r="1.3" fill="currentColor" />
  </svg>
);
