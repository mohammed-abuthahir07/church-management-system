import React, { useEffect, useState } from 'react';
import './Profile.css';
import { User, Mail, ShieldCheck, Calendar, Church, CheckCircle, RefreshCw } from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate } from '../../utils/date';

export const SuperAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await superAdminApi.getProfile();
      if (res.user) {
        setProfile(res.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch administrator profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="church-card profile-skel">
        <div className="profile-skel__row">
          <div className="profile-skel__avatar skeleton-shimmer" />
          <div className="profile-skel__lines">
            <div className="profile-skel__line skeleton-shimmer" />
            <div className="profile-skel__line--sm skeleton-shimmer" />
          </div>
        </div>
        <div className="profile-skel__block skeleton-shimmer" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchProfile} />;
  }

  return (
    <div className="page page-narrow">
      <PageHeader
        title="Super Admin Profile"
        subtitle="Central Diocese Headquarters administrative account credentials"
        icon={User}
      />

      <div className="church-card table-panel">
        {/* Profile Header Banner */}
        <div className="profile-banner sanctuary-banner">
          <div className="profile-banner__row">
            {/* Avatar Circle */}
            <div className="profile-avatar font-serif">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>

            <div className="profile-text">
              <h2 className="profile-name font-serif">
                {profile?.name || 'Super Administrator'}
              </h2>
              <p className="profile-email">
                <Mail className="icon-sm icon-gold-soft" />
                <span>{profile?.email}</span>
              </p>
              <div className="profile-badges">
                <span className="profile-role">
                  {profile?.role}
                </span>
                <StatusBadge status={profile?.status || 'ACTIVE'} />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="profile-body">
          <div className="form-grid-2">
            <div className="profile-tile">
              <div className="profile-tile__label">
                Account ID
              </div>
              <div className="profile-tile__value">
                {profile?.id}
              </div>
            </div>

            <div className="profile-tile">
              <div className="profile-tile__label">
                Authority Scope
              </div>
              <div className="profile-tile__value">
                <Church className="icon-md icon-amber" />
                <span>All Church Branches (Global)</span>
              </div>
            </div>

            <div className="profile-tile">
              <div className="profile-tile__label">
                Account Created
              </div>
              <div className="profile-tile__value">
                <Calendar className="icon-md icon-muted" />
                <span>{profile?.created_at ? formatDate(profile.created_at) : '—'}</span>
              </div>
            </div>

            <div className="profile-tile">
              <div className="profile-tile__label">
                Last Profile Update
              </div>
              <div className="profile-tile__value">
                <Calendar className="icon-md icon-muted" />
                <span>{profile?.updated_at ? formatDate(profile.updated_at) : '—'}</span>
              </div>
            </div>
          </div>

          <div className="profile-note">
            <ShieldCheck className="icon-lg icon-gold" />
            <span>
              This account holds top-level Super Administrator permissions with full diocesan authority across branches, fund allocations, and pastoral appointments.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
