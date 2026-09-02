import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import { SuperAdminLogin } from '../pages/auth/SuperAdminLogin';
import { SubAdminLogin } from '../pages/auth/SubAdminLogin';
import { Landing } from '../pages/public/Landing';

// Super Admin Pages
import { SuperAdminDashboard } from '../pages/superadmin/Dashboard';
import { Branches } from '../pages/superadmin/Branches';
import { SubAdmins } from '../pages/superadmin/SubAdmins';
import { SuperAdminFunds } from '../pages/superadmin/Funds';
import { SuperAdminNotifications } from '../pages/superadmin/Notifications';
import { SuperAdminAnalytics } from '../pages/superadmin/Analytics';
import { SuperAdminProfile } from '../pages/superadmin/Profile';

// Sub Admin Pages
import { SubAdminDashboard } from '../pages/subadmin/Dashboard';
import { SubAdminMembers } from '../pages/subadmin/Members';
import { SubAdminPastors } from '../pages/subadmin/Pastors';
import { SubAdminPrayerSchedules } from '../pages/subadmin/PrayerSchedules';
import { SubAdminEvents } from '../pages/subadmin/Events';
import { SubAdminDonations } from '../pages/subadmin/Donations';
import { SubAdminFunds } from '../pages/subadmin/Funds';
import { SubAdminNotifications } from '../pages/subadmin/Notifications';
import { SubAdminAnalytics } from '../pages/subadmin/Analytics';
import { SubAdminProfile } from '../pages/subadmin/Profile';

const UnknownRoute = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    if (role === 'SUB_ADMIN') {
      return <Navigate to="/subadmin/dashboard" replace />;
    }
    return <Navigate to="/superadmin/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Public Auth Routes */}
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route path="/subadmin/login" element={<SubAdminLogin />} />

      {/* Super Admin Protected Routes */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRole="SUPER_ADMIN">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="branches" element={<Branches />} />
        <Route path="subadmins" element={<SubAdmins />} />
        <Route path="funds" element={<SuperAdminFunds />} />
        <Route path="notifications" element={<SuperAdminNotifications />} />
        <Route path="analytics" element={<SuperAdminAnalytics />} />
        <Route path="profile" element={<SuperAdminProfile />} />
      </Route>

      {/* Sub Admin Protected Routes */}
      <Route
        path="/subadmin"
        element={
          <ProtectedRoute allowedRole="SUB_ADMIN">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/subadmin/dashboard" replace />} />
        <Route path="dashboard" element={<SubAdminDashboard />} />
        <Route path="members" element={<SubAdminMembers />} />
        <Route path="pastors" element={<SubAdminPastors />} />
        <Route path="prayer-schedules" element={<SubAdminPrayerSchedules />} />
        <Route path="events" element={<SubAdminEvents />} />
        <Route path="donations" element={<SubAdminDonations />} />
        <Route path="funds" element={<SubAdminFunds />} />
        <Route path="notifications" element={<SubAdminNotifications />} />
        <Route path="analytics" element={<SubAdminAnalytics />} />
        <Route path="profile" element={<SubAdminProfile />} />
      </Route>

      <Route path="*" element={<UnknownRoute />} />
    </Routes>
  );
};
