import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Church,
  UserCheck,
  HeartHandshake,
  Bell,
  BarChart3,
  User,
  LogOut,
  Users,
  Calendar,
  Sparkles,
  X,
} from 'lucide-react';
import { ChurchLogo } from '../common/ChurchLogo';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, isSuperAdmin, logout } = useAuth();
  const reduceMotion = useReducedMotion();

  const superAdminNav = [
    { to: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/superadmin/branches', label: 'Branches', icon: Church },
    { to: '/superadmin/subadmins', label: 'Sub Admins', icon: UserCheck },
    { to: '/superadmin/funds', label: 'Funds Allocation', icon: HeartHandshake },
    { to: '/superadmin/notifications', label: 'Notifications', icon: Bell },
    { to: '/superadmin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/superadmin/profile', label: 'Profile', icon: User },
  ];

  const subAdminNav = [
    { to: '/subadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/subadmin/members', label: 'Members', icon: Users },
    { to: '/subadmin/pastors', label: 'Pastor', icon: Church },
    { to: '/subadmin/prayer-schedules', label: 'Prayer Schedule', icon: Sparkles },
    { to: '/subadmin/events', label: 'Events', icon: Calendar },
    { to: '/subadmin/donations', label: 'Donations', icon: HeartHandshake },
    { to: '/subadmin/funds', label: 'Funds Received', icon: HeartHandshake },
    { to: '/subadmin/notifications', label: 'Notifications', icon: Bell },
    { to: '/subadmin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/subadmin/profile', label: 'Profile', icon: User },
  ];

  const navItems = isSuperAdmin ? superAdminNav : subAdminNav;

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = (
    <div className="sidebar-panel">
      <div className="sidebar-glow-top" />
      <div className="sidebar-glow-bottom" />

      <div className="sidebar-brand">
        <ChurchLogo size="md" light={true} />
        {isMobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="icon-btn sidebar-close"
            aria-label="Close menu"
          >
            <X className="icon-lg" />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => isMobileOpen && onCloseMobile()}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' is-active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="icon-md sidebar-link__icon" />
                  <span className="sidebar-link__label">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId={reduceMotion ? undefined : 'activeIndicator'}
                      className="sidebar-link__dot"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="sidebar-user__meta">
            <p className="sidebar-user__name">{user?.name || 'Admin'}</p>
            <p className="sidebar-user__email">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="icon-md" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sidebar-desktop">{SidebarContent}</aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="sidebar-mobile">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
              onClick={onCloseMobile}
              className="sidebar-overlay"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { type: 'spring', damping: 28, stiffness: 260 }
              }
              className="sidebar-drawer"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
