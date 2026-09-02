import React from 'react';
import { motion } from 'framer-motion';
import './ChartCard.css';

export const ChartCard = ({ title, subtitle, icon: Icon, children, action, height = 'h-72' }) => {
  const heightClass =
    height === 'h-64' ? 'chart-card__body--sm' : height === 'h-80' ? 'chart-card__body--lg' : 'chart-card__body--md';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="church-card chart-card"
    >
      <div className="chart-card__head">
        <div className="chart-card__title-row">
          {Icon && (
            <div className="chart-card__icon">
              <Icon className="icon-md" />
            </div>
          )}
          <div>
            <h3 className="chart-card__title font-serif">{title}</h3>
            {subtitle && <p className="chart-card__sub">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={`chart-card__body ${heightClass}`}>{children}</div>
    </motion.div>
  );
};
