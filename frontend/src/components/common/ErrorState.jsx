import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

export const ErrorState = ({
  title = 'Unable to Load Data',
  message = 'An unexpected error occurred while communicating with the church server. Please verify your connection.',
  onRetry,
}) => {
  return (
    <div className="church-card error-state">
      <div className="error-state__icon">
        <AlertCircle className="icon-2xl" />
      </div>
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline">
          <RefreshCw className="icon-sm" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
