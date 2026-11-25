import React from 'react';
import { Platform } from '../types/content';

interface PlatformIconProps {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  }[size];

  const iconScale = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  }[size];

  if (platform === 'Instagram') {
    return (
      <div
        className={`${sizeClasses} ${className} shrink-0 flex items-center justify-center bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm`}
        aria-label="Instagram"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconScale}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      </div>
    );
  }

  if (platform === 'TikTok') {
    return (
      <div
        className={`${sizeClasses} ${className} shrink-0 flex items-center justify-center bg-slate-900 text-white shadow-sm`}
        aria-label="TikTok"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconScale}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" />
        </svg>
      </div>
    );
  }

  if (platform === 'YouTube') {
    return (
      <div
        className={`${sizeClasses} ${className} shrink-0 flex items-center justify-center bg-[#DC2626] text-white shadow-sm`}
        aria-label="YouTube"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconScale}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }

  if (platform === 'X') {
    return (
      <div
        className={`${sizeClasses} ${className} shrink-0 flex items-center justify-center bg-slate-800 text-white shadow-sm`}
        aria-label="X"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconScale}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }

  if (platform === 'LinkedIn') {
    return (
      <div
        className={`${sizeClasses} ${className} shrink-0 flex items-center justify-center bg-[#0A66C2] text-white shadow-sm`}
        aria-label="LinkedIn"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconScale}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} ${className} shrink-0 flex items-center justify-center bg-[#1877F2] text-white shadow-sm`}
      aria-label="Facebook"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconScale}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
      </svg>
    </div>
  );
};
