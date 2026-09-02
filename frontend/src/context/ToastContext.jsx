import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', subtitle = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, subtitle }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, subtitle = '') => showToast(message, 'success', subtitle),
    [showToast]
  );
  const error = useCallback(
    (message, subtitle = '') => showToast(message, 'error', subtitle, 5000),
    [showToast]
  );
  const info = useCallback(
    (message, subtitle = '') => showToast(message, 'info', subtitle),
    [showToast]
  );
  const warning = useCallback(
    (message, subtitle = '') => showToast(message, 'warning', subtitle),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="toast-stack">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';
            const tone = isSuccess ? 'success' : isError ? 'error' : isWarning ? 'warning' : 'info';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={`toast toast--${tone}`}
              >
                <div className="toast__icon">
                  {isSuccess && <CheckCircle2 className="icon-lg" />}
                  {isError && <AlertCircle className="icon-lg" />}
                  {isWarning && <AlertTriangle className="icon-lg" />}
                  {!isSuccess && !isError && !isWarning && <Info className="icon-lg" />}
                </div>

                <div className="toast__body">
                  <div className="toast__title">{toast.message}</div>
                  {toast.subtitle && <div className="toast__sub">{toast.subtitle}</div>}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="toast__close"
                >
                  <X className="icon-md" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
