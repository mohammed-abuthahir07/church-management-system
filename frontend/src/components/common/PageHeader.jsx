import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import './PageHeader.css';

export const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  actionText,
  onAction,
  actionIcon: ActionIcon = Plus,
  secondaryAction,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="page-header"
    >
      <div className="page-header__left">
        {Icon && (
          <div className="page-header__icon">
            <Icon className="icon-xl" />
          </div>
        )}
        <div>
          <h1 className="page-header__title font-serif">{title}</h1>
          {subtitle && <p className="page-header__sub">{subtitle}</p>}
        </div>
      </div>

      <div className="page-header__actions">
        {secondaryAction}
        {actionText && onAction && (
          <button onClick={onAction} className="btn-gold">
            <ActionIcon className="icon-md" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
