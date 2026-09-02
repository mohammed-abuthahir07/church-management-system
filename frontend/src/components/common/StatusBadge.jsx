import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './StatusBadge.css';

export const StatusBadge = ({ status = 'ACTIVE' }) => {
  const isActive = String(status).toUpperCase() === 'ACTIVE';

  if (isActive) {
    return (
      <span className="badge-active">
        <CheckCircle className="icon-xs status-badge__icon status-badge__icon--on" />
        <span>Active</span>
      </span>
    );
  }

  return (
    <span className="badge-inactive">
      <XCircle className="icon-xs status-badge__icon" />
      <span>Inactive</span>
    </span>
  );
};
