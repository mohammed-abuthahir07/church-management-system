import React, { useEffect, useState } from 'react';
import './Profile.css';
import { User, Mail, Church, Phone, MapPin, Calendar, ShieldCheck, CheckCircle } from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate } from '../../utils/date';

export const SubAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subAdminApi.getProfile();
      if (res.user) {
        setProfile(res.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch branch admin profile');
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
        title="Branch Admin Profile"
        subtitle="Parish leadership account and assigned church branch information"
        icon={User}
      />

      <div className="church-card table-panel">
        {/* Profile Header Banner */}
        <div className="profile-banner sanctuary-banner">
          <div className="profile-banner__row">
            {/* Avatar */}
            <div className="profile-avatar font-serif">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
            </div>

            <div className="profile-text">
              <h2 className="profile-name font-serif">
                {profile?.name || 'Branch Administrator'}
              </h2>
              <p className="profile-email">
                <Mail className="icon-sm icon-gold-soft" />
                <span>{profile?.email}</span>
              </p>
              <div className="profile-badges">
                <span className="profile-role">
                  Branch Administrator
                </span>
                <StatusBadge status={profile?.status || 'ACTIVE'} />
              </div>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div className="profile-body">
          {/* Assigned Branch Details Card */}
          <div className="profile-branch">
            <div className="profile-branch__head">
              <h3 className="profile-branch__title font-serif">
                <Church className="icon-lg icon-gold" />
                Assigned Parish Branch
              </h3>
              <StatusBadge status={profile?.branch_status || 'ACTIVE'} />
            </div>

            <div className="profile-grid">
              <div>
                <span className="profile-field-label">Branch Name</span>
                <span className="profile-field-value profile-field-value--serif font-serif">
                  {profile?.branch_name || `Branch #${profile?.branch_id}`}
                </span>
              </div>

              <div>
                <span className="profile-field-label">Branch ID</span>
                <span className="profile-field-value">
                  {profile?.branch_id}
                </span>
              </div>

              {profile?.branch_phone && (
                <div>
                  <span className="profile-field-label">Branch Phone</span>
                  <span className="profile-field-value contact-line">
                    <Phone className="icon-sm icon-muted" />
                    {profile.branch_phone}
                  </span>
                </div>
              )}

              {profile?.branch_email && (
                <div>
                  <span className="profile-field-label">Branch Email</span>
                  <span className="profile-field-value contact-line">
                    <Mail className="icon-sm icon-muted" />
                    {profile.branch_email}
                  </span>
                </div>
              )}

              {profile?.branch_address && (
                <div className="profile-span-2">
                  <span className="profile-field-label">Physical Address</span>
                  <span className="profile-field-value contact-line">
                    <MapPin className="icon-sm icon-amber" />
                    {profile.branch_address}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-note">
            <ShieldCheck className="icon-lg icon-gold" />
            <span>
              This account has exclusive administrative jurisdiction over this parish branch. Data isolation ensures you only access records for your church.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
