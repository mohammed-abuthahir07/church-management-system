import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  icon: Icon,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClass =
    maxWidth === 'max-w-md' ? 'modal-card--md' : maxWidth === 'max-w-2xl' ? 'modal-card--xl' : 'modal-card--lg';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-root">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="modal-backdrop"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`modal-card ${sizeClass}`}
          >
            <div className="modal-header">
              <div className="modal-header__left">
                {Icon && (
                  <div className="modal-header__icon">
                    <Icon className="icon-lg" />
                  </div>
                )}
                <div>
                  <h3 className="modal-header__title font-serif">{title}</h3>
                  {subtitle && <p className="modal-header__sub">{subtitle}</p>}
                </div>
              </div>

              <button
                onClick={onClose}
                className="icon-btn modal-close"
                aria-label="Close dialog"
              >
                <X className="icon-lg" />
              </button>
            </div>

            <div className="modal-body">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
