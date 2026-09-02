import React, { useEffect, useState, useMemo } from 'react';
import './Notifications.css';
import {
  Bell,
  Search,
  Eye,
  Calendar,
  Globe,
  Church,
  Info,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate } from '../../utils/date';

export const SubAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // View Detail State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subAdminApi.getAllNotifications();
      if (res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (!searchTerm.trim()) return notifications;
    const term = searchTerm.toLowerCase();
    return notifications.filter(
      (n) =>
        n.title?.toLowerCase().includes(term) ||
        n.message?.toLowerCase().includes(term) ||
        n.target_type?.toLowerCase().includes(term)
    );
  }, [notifications, searchTerm]);

  const handleOpenView = (notif) => {
    setSelectedNotif(notif);
    setIsViewOpen(true);
  };

  return (
    <div className="page">
      <PageHeader
        title="Parish Notices & Broadcasts"
        subtitle="Diocesan communications, prayer alerts, and pastoral notices delivered to your branch"
        icon={Bell}
      />

      {/* Search Bar */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{notifications.length}</strong> notices received
        </div>
      </div>

      {/* Main Content: Notification List */}
      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchNotifications} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          type="notifications"
          title={searchTerm ? 'No matching notices found' : 'No notifications received'}
          description={
            searchTerm
              ? `No notice matching "${searchTerm}".`
              : 'Communications sent by the Central Diocese will appear here.'
          }
          actionText={null}
        />
      ) : (
        <div className="form-stack">
          {filteredNotifications.map((notif) => {
            const isBroadcast = notif.target_type === 'ALL';
            return (
              <div
                key={notif.id}
                onClick={() => handleOpenView(notif)}
                className="church-card notice-card"
              >
                <div className="notice-card__left">
                  <div
                    className={`notice-icon ${isBroadcast ? 'notice-icon--all' : 'notice-icon--branch'}`}
                  >
                    {isBroadcast ? <Globe className="icon-lg" /> : <Church className="icon-lg" />}
                  </div>

                  <div>
                    <div className="meta-row">
                      <h3 className="card-h font-serif">
                        {notif.title}
                      </h3>
                      <span
                        className={isBroadcast ? 'chip-mini chip-mini--navy' : 'chip-mini chip-mini--gold'}
                      >
                        {isBroadcast ? 'All Diocese Branches' : 'Direct Branch Notice'}
                      </span>
                      {notif.type && (
                        <span className="chip-mini chip-mini--slate">
                          {notif.type}
                        </span>
                      )}
                    </div>

                    <p className="muted line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="date-cell">
                      <Calendar className="icon-sm icon-muted" />
                      <span>{formatDate(notif.created_at)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenView(notif);
                  }}
                  className="btn-outline"
                >
                  <Eye className="icon-sm" />
                  <span>Read Notice</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={selectedNotif?.title || 'Diocesan Notice'}
        subtitle={`Sent on ${formatDate(selectedNotif?.created_at)}`}
        icon={Bell}
      >
        {selectedNotif && (
          <div className="view-details">
            <div className="view-meta">
              <span className="muted">Target:</span>
              <span className="cell-name">
                {selectedNotif.target_type === 'ALL'
                  ? 'Broadcast to All Church Branches'
                  : 'Direct Branch Communication'}
              </span>
              <span className="soft-chip">
                {selectedNotif.type || 'GENERAL'}
              </span>
            </div>

            <div className="notice-body">
              {selectedNotif.message}
            </div>

            <div className="form-end">
              <button
                type="button"
                onClick={() => setIsViewOpen(false)}
                className="btn-navy"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
