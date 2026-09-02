import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import './StatCard.css';

export const StatCard = ({
  title,
  value = 0,
  icon: Icon,
  isCurrency = false,
  subtitle,
  badges = [],
  color = 'gold',
  onClick,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
      }}
      initial="initial"
      animate="animate"
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.28 }}
      onClick={onClick}
      className={`church-card stat-card stat-card--${color}${onClick ? ' clickable' : ''}`}
    >
      <svg className="stat-card__cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="10.5" y="2" width="3" height="20" rx="1" />
        <rect x="4" y="7" width="16" height="3" rx="1" />
      </svg>

      <div className="stat-card__top">
        <div>
          <p className="stat-card__label">{title}</p>
          <div className="stat-card__value">
            <AnimatedCounter value={value} isCurrency={isCurrency} />
          </div>
        </div>

        {Icon && (
          <div className="stat-card__icon">
            <Icon className="icon-xl" />
          </div>
        )}
      </div>

      {subtitle && <p className="stat-card__sub">{subtitle}</p>}

      {badges.length > 0 && (
        <div className="stat-card__badges">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`stat-card__badge stat-card__badge--${b.color || color}`}
            >
              <span>{b.label}:</span>
              <strong>{b.value}</strong>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
