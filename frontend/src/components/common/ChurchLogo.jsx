import React from 'react';
import './ChurchLogo.css';

export const ChurchLogo = ({ size = 'md', light = false, showSubtitle = true }) => {
  const tone = light ? 'light' : 'dark';

  return (
    <div className={`church-logo church-logo--${size} church-logo--${tone}`}>
      <div className={`church-logo__mark church-logo__mark--${size}`}>
        <div className="church-logo__halo" />
        <svg viewBox="0 0 40 40" className="church-logo__svg" fill="none">
          <defs>
            <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#9E7611" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="16" r="10" stroke="url(#logoGold)" strokeWidth="0.75" strokeDasharray="1.5 2" opacity="0.6" />
          <rect x="18" y="6" width="4" height="28" rx="1.5" fill="url(#logoGold)" />
          <rect x="8" y="13" width="24" height="4" rx="1.5" fill="url(#logoGold)" />
          <polygon points="20,13 22.5,15 20,17 17.5,15" fill="#FFFDF5" />
        </svg>
      </div>

      <div>
        <div className="church-logo__row">
          <span className="church-logo__grace font-cinzel">GRACE</span>
          <span className="church-logo__church font-serif">Church</span>
        </div>
        {showSubtitle && (
          <p className="church-logo__sub">Management System</p>
        )}
      </div>
    </div>
  );
};
