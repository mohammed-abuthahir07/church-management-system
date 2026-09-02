import React from 'react';
import './HeavenlyParticles.css';

const PARTICLES = [
  { top: '12%', left: '8%', delay: '0s', size: 'sm' },
  { top: '22%', left: '78%', delay: '1.4s', size: 'xs' },
  { top: '38%', left: '18%', delay: '2.2s', size: 'sm' },
  { top: '48%', left: '88%', delay: '0.8s', size: 'xs' },
  { top: '64%', left: '12%', delay: '3s', size: 'xs' },
  { top: '70%', left: '62%', delay: '1.8s', size: 'sm' },
  { top: '82%', left: '30%', delay: '2.6s', size: 'xs' },
  { top: '18%', left: '46%', delay: '3.4s', size: 'xs' },
];

export const HeavenlyParticles = ({ className = '' }) => {
  return (
    <div className={`heavenly-particles ${className}`.trim()} aria-hidden="true">
      {PARTICLES.map((p, idx) => (
        <span
          key={idx}
          className={`heavenly-particle heavenly-particle--${p.size} animate-particle`}
          style={{ top: p.top, left: p.left, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
};
