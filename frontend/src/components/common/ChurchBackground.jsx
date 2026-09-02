import React from 'react';
import { HeavenlyParticles } from './HeavenlyParticles';
import './ChurchBackground.css';

export const ChurchBackground = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`church-bg church-bg--${isDark ? 'dark' : 'light'}`}>
      <div className="church-bg__orb church-bg__orb--a animate-heavenly" />
      <div className="church-bg__orb church-bg__orb--b animate-heavenly" style={{ animationDelay: '2s' }} />
      <div className="church-bg__ray animate-light-ray" />

      <svg className="church-bg__cross" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
        <rect x="46" y="10" width="8" height="80" rx="2" />
        <rect x="25" y="30" width="50" height="8" rx="2" />
        <circle cx="50" cy="34" r="22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      </svg>

      <svg className="church-bg__dove animate-dove" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
        <path d="M50 30 C45 25 35 25 25 35 C20 40 18 50 20 60 C25 55 35 52 45 54 C55 56 60 62 70 65 C75 58 78 48 72 40 C65 32 55 32 50 30 Z" />
      </svg>

      {!isDark && <HeavenlyParticles />}
    </div>
  );
};
