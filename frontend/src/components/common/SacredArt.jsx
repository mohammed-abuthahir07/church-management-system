import React from 'react';
import './SacredArt.css';

export const SacredArt = ({ variant = 'cross', className = '' }) => {
  const cls = `sacred-art sacred-art--${variant} ${className}`.trim();

  if (variant === 'bible') {
    return (
      <svg className={cls} viewBox="0 0 200 160" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="bibleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4CC" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A680C" />
          </linearGradient>
        </defs>
        <path d="M100 28 L28 18 V128 L100 142 L172 128 V18 Z" fill="#FDF9EC" stroke="url(#bibleGold)" strokeWidth="3" />
        <path d="M100 28 V142" stroke="url(#bibleGold)" strokeWidth="3" />
        <path d="M46 46 H88 M46 62 H82 M46 78 H86" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" />
        <path d="M114 46 H154 M114 62 H148 M114 78 H152" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" />
        <rect x="92" y="52" width="16" height="48" rx="2" fill="url(#bibleGold)" />
        <rect x="80" y="68" width="40" height="10" rx="2" fill="url(#bibleGold)" />
      </svg>
    );
  }

  if (variant === 'christ') {
    return (
      <svg className={cls} viewBox="0 0 220 320" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="christGold" x1="40%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A680C" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="78" r="46" stroke="url(#christGold)" strokeWidth="1.5" opacity="0.45" />
        <circle cx="110" cy="78" r="34" stroke="url(#christGold)" strokeWidth="2" />
        <circle cx="110" cy="70" r="18" stroke="url(#christGold)" strokeWidth="2" />
        <path d="M92 92 Q110 108 128 92" stroke="url(#christGold)" strokeWidth="2" fill="none" />
        <path d="M70 150 Q110 128 150 150 L158 250 Q110 278 62 250 Z" stroke="url(#christGold)" strokeWidth="2.2" fill="rgba(212,175,55,0.06)" />
        <path d="M78 168 L42 198" stroke="url(#christGold)" strokeWidth="2" strokeLinecap="round" />
        <path d="M142 168 L178 198" stroke="url(#christGold)" strokeWidth="2" strokeLinecap="round" />
        <rect x="106" y="22" width="8" height="36" rx="2" fill="url(#christGold)" />
        <rect x="90" y="34" width="40" height="7" rx="2" fill="url(#christGold)" />
      </svg>
    );
  }

  if (variant === 'dove') {
    return (
      <svg className={cls} viewBox="0 0 100 80" fill="currentColor" aria-hidden="true">
        <path d="M18 48 C28 28 48 22 62 28 C70 16 86 18 90 30 C78 34 70 42 68 52 C58 48 42 50 32 58 C24 54 18 52 18 48 Z" opacity="0.9" />
        <circle cx="84" cy="28" r="2.2" />
      </svg>
    );
  }

  return (
    <svg className={cls} viewBox="0 0 80 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="crossGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4CC" />
          <stop offset="55%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A680C" />
        </linearGradient>
      </defs>
      <rect x="34" y="8" width="12" height="104" rx="3" fill="url(#crossGold)" />
      <rect x="10" y="32" width="60" height="12" rx="3" fill="url(#crossGold)" />
    </svg>
  );
};
