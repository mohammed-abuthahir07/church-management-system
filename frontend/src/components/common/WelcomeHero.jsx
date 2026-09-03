import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Calendar, Church } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { HeavenlyParticles } from './HeavenlyParticles';
import './WelcomeHero.css';

export const WelcomeHero = ({
  userName = 'Admin',
  role = 'SUPER_ADMIN',
  branchName = null,
  scripture = '"Serve one another in love." — Galatians 5:13',
}) => {
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const todayStr = formatDate(new Date());
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="welcome-hero hero-living-gradient"
    >
      <div className="welcome-hero__glow-a animate-pulse-glow" />
      <div className="welcome-hero__glow-b" />
      <HeavenlyParticles />

      <div className="welcome-hero__art">
        <svg viewBox="0 0 200 200" className="welcome-hero__svg animate-float" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="heroArtGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4CC" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A680C" />
            </linearGradient>
          </defs>
          <path d="M40 190 L40 90 Q100 20 160 90 L160 190 Z" stroke="url(#heroArtGold)" strokeWidth="3" fill="rgba(212, 175, 55, 0.05)" />
          <path d="M60 190 L60 105 Q100 50 140 105 L140 190" stroke="url(#heroArtGold)" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="96" y="60" width="8" height="70" rx="2" fill="url(#heroArtGold)" />
          <rect x="75" y="80" width="50" height="8" rx="2" fill="url(#heroArtGold)" />
          <circle cx="100" cy="84" r="28" stroke="url(#heroArtGold)" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      <div className="welcome-hero__content">
        <div className="welcome-hero__meta">
          <div className="welcome-hero__pill">
            <Church className="icon-sm" />
            <span>{isSuperAdmin ? 'Global Church Network' : branchName || 'Parish Branch'}</span>
          </div>
          <div className="welcome-hero__date">
            <Calendar className="icon-sm" />
            <span>{todayStr}</span>
          </div>
        </div>

        <h1 className="welcome-hero__title font-serif">
          Welcome back, <span className="gold-gradient-text-light font-cinzel">{userName}</span>
        </h1>

        <p className="welcome-hero__copy">
          {isSuperAdmin
            ? 'Overseeing branches, faithful ministers, stewardship of funds, and global prayer across the church network.'
            : `Faithfully shepherding , serving members, and walking in Christ's grace.`}
        </p>

        <div className="welcome-hero__verse font-serif">
          <Sparkles className="icon-md" />
          <span>{scripture}</span>
        </div>
      </div>
    </motion.div>
  );
};
