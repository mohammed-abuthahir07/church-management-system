import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';
import './ProtectedRoute.css';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-loading__inner">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (allowedRole === 'SUB_ADMIN' || location.pathname.startsWith('/subadmin')) {
      return <Navigate to="/subadmin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'SUB_ADMIN') {
      return <Navigate to="/subadmin/dashboard" replace />;
    } else if (role === 'SUPER_ADMIN') {
      return <Navigate to="/superadmin/dashboard" replace />;
    }
  }

  return children;
};
