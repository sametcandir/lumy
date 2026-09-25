'use client';

import React from 'react';

interface LumyLogoProps {
  variant?: 'light' | 'dark';
  logoUrl?: string;
  brandName?: string;
  className?: string;
  showText?: boolean;
}

export function isDarkColor(color?: string): boolean {
  if (!color) return false;
  const hex = color.replace('#', '').trim();
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  }
  return false;
}

export default function LumyLogo({
  variant = 'light',
  logoUrl,
  brandName = 'lumy TOYS',
  className = '',
}: LumyLogoProps) {
  // If user has uploaded a custom logo from admin (and it is not the old legacy green box)
  if (logoUrl && !logoUrl.includes('pelus-1789') && !logoUrl.includes('data:image')) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img
          src={logoUrl}
          alt={brandName}
          className="h-10 sm:h-12 w-auto max-w-[180px] object-contain"
        />
      </div>
    );
  }

  const isDark = variant === 'dark';
  const logoSrc = isDark ? '/images/lumy_logo_lime.png' : '/images/lumy_logo_dark.png';

  return (
    <div className={`flex items-center select-none group ${className}`}>
      <img
        src={logoSrc}
        alt={brandName}
        className="h-11 sm:h-13 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
