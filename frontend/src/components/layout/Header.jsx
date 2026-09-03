import React from 'react';
import { Menu, Church, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/date';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const PAGE_TITLES = {
  '/superadmin/dashboard': 'Dashboard',
  '/superadmin/branches': 'Branches',
  '/superadmin/subadmins': 'Sub Admins',
  '/superadmin/funds': 'Funds',
  '/superadmin/notifications': 'Notifications',
  '/superadmin/analytics': 'Analytics',
  '/superadmin/profile': 'Profile',
  '/subadmin/dashboard': 'Dashboard',
  '/subadmin/members': 'Members',
  '/subadmin/pastors': 'Pastors',
  '/subadmin/prayer-schedules': 'Prayer',
  '/subadmin/events': 'Events',
  '/subadmin/donations': 'Donations',
  '/subadmin/funds': 'Funds',
  '/subadmin/notifications': 'Notices',
  '/subadmin/analytics': 'Analytics',
  '/subadmin/profile': 'Profile',
};

export const Header = ({ onOpenMobile }) => {
  const { user, isSuperAdmin, branchName } = useAuth();
  const todayStr = formatDate(new Date());
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Grace Church';

  const profileLink = isSuperAdmin ? '/superadmin/profile' : '/subadmin/profile';
  const notifLink = isSuperAdmin ? '/superadmin/notifications' : '/subadmin/notifications';

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button
          type="button"
          onClick={onOpenMobile}
          className="icon-btn app-header__menu"
          aria-label="Open menu"
        >
          <Menu className="icon-lg" />
        </button>

        <div className="app-header__brand">
          <div className="app-header__icon">
            <Church className="icon-md" />
          </div>
          <div>
            <h2 className="app-header__title font-serif">
              <span className="app-header__title-mobile">{pageTitle}</span>
              <span className="app-header__title-desktop">
                {isSuperAdmin ? 'Grace Church Headquarters' : branchName || 'Parish Branch'}
              </span>
            </h2>
            <p className="app-header__subtitle">
              {isSuperAdmin ? 'Central Diocese Administration' : 'Local Church Administration'}
            </p>
          </div>
        </div>
      </div>

      <div className="app-header__right">
        <div className="app-header__date">
          <Sparkles className="icon-sm app-header__date-icon" />
          <span>{todayStr}</span>
        </div>

        <Link
          to={notifLink}
          className="icon-btn app-header__bell"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="icon-lg" />
          <span className="app-header__dot animate-icon-soft" />
        </Link>

        <Link to={profileLink} className="app-header__profile">
          <div className="app-header__avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="app-header__name">{user?.name || 'Admin'}</span>
        </Link>
      </div>
    </header>
  );
};
