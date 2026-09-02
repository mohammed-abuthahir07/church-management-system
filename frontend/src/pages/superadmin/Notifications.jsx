import React, { useEffect, useState, useMemo } from 'react';
import './Notifications.css';
import {
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Church,
  Calendar,
  Send,
  Loader2,
  Globe,
  Radio,
} from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate } from '../../utils/date';

export const SuperAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'GENERAL',
    target_type: 'ALL',
    branch_id: '',
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notifRes, branchesRes] = await Promise.all([
        superAdminApi.getAllNotifications(),
        superAdminApi.getAllBranches(),
      ]);

      if (notifRes.notifications) {
        setNotifications(notifRes.notifications);
      }
      if (branchesRes.branches) {
        setBranches(branchesRes.branches);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (!searchTerm.trim()) return notifications;
    const term = searchTerm.toLowerCase();
    return notifications.filter(
      (n) =>
        n.title?.toLowerCase().includes(term) ||
        n.message?.toLowerCase().includes(term) ||
        n.branch_name?.toLowerCase().includes(term) ||
        n.target_type?.toLowerCase().includes(term)
    );
  }, [notifications, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedNotif(null);
    setFormData({
      title: '',
      message: '',
      type: 'GENERAL',
      target_type: 'ALL',
      branch_id: branches.length > 0 ? branches[0].id : '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (notif) => {
    setIsEditing(true);
    setSelectedNotif(notif);
    setFormData({
      title: notif.title || '',
      message: notif.message || '',
      type: notif.type || 'GENERAL',
      target_type: notif.target_type || 'ALL',
      branch_id: notif.branch_id || (branches.length > 0 ? branches[0].id : ''),
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toastError('Title and message are required.');
      return;
    }

    if (formData.target_type === 'BRANCH' && !formData.branch_id) {
      toastError('Please select a target branch.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type || 'GENERAL',
        target_type: formData.target_type,
        branch_id: formData.target_type === 'BRANCH' ? Number(formData.branch_id) : null,
      };

      if (isEditing && selectedNotif) {
        await superAdminApi.updateNotification(selectedNotif.id, payload);
        success('Notification updated', 'The message has been updated in the history.');
      } else {
        await superAdminApi.createNotification(payload);
        success(
          'Notification dispatched',
          payload.target_type === 'ALL'
            ? 'Broadcast sent to all church branches.'
            : 'Notification sent to the selected branch.'
        );
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (notif) => {
    setNotifToDelete(notif);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!notifToDelete) return;
    try {
      setDeleteLoading(true);
      await superAdminApi.deleteNotification(notifToDelete.id);
      success('Notification deleted', 'The notification has been removed.');
      setIsDeleteOpen(false);
      setNotifToDelete(null);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Failed to delete notification');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Broadcast Notifications"
        subtitle="Publish diocesan announcements and alerts to all branches or a specific parish"
        icon={Bell}
        actionText="Send Notification"
        onAction={handleOpenAdd}
        actionIcon={Send}
      />

      {/* Search Bar */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications by title, branch..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{notifications.length}</strong> broadcasts recorded
        </div>
      </div>

      {/* Notifications Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          type="notifications"
          title={searchTerm ? 'No matching notifications' : 'No notifications sent yet'}
          description={
            searchTerm
              ? `No broadcasts matching "${searchTerm}".`
              : 'Send your first notification to communicate with branches across the network.'
          }
          actionText="Send First Notification"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Notification Message</th>
                  <th>Target Audience</th>
                  <th>Type</th>
                  <th>Date Sent</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id}>
                    <td data-label="Message">
                      <div className="row-name font-serif">
                        {notif.title}
                      </div>
                      <p className="muted line-clamp-2">
                        {notif.message}
                      </p>
                    </td>

                    <td data-label="Audience">
                      {notif.target_type === 'ALL' ? (
                        <span className="pill-navy">
                          <Globe className="icon-sm" />
                          <span>All Branches</span>
                        </span>
                      ) : (
                        <div className="branch-tile">
                          <Church className="icon-sm icon-amber" />
                          <span className="cell-name">
                            {notif.branch_name || `Branch #${notif.branch_id}`}
                          </span>
                        </div>
                      )}
                    </td>

                    <td data-label="Type">
                      <span className="soft-chip">
                        {notif.type || 'GENERAL'}
                      </span>
                    </td>

                    <td data-label="Date">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-muted" />
                        <span>{formatDate(notif.created_at)}</span>
                      </div>
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenEdit(notif)}
                          className="action-btn edit"
                          title="Edit Notification"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(notif)}
                          className="action-btn danger"
                          title="Delete Notification"
                        >
                          <Trash2 className="icon-md" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Notification' : 'Send Broadcast Notification'}
        subtitle="Deliver pastoral messages and important diocese alerts"
        icon={Bell}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Target Audience *
            </label>
            <div className="target-choice">
              <label
                className={formData.target_type === 'ALL' ? 'is-on' : undefined}
              >
                <input
                  type="radio"
                  name="target_type"
                  value="ALL"
                  checked={formData.target_type === 'ALL'}
                  onChange={() => setFormData({ ...formData, target_type: 'ALL' })}
                  className="visually-hidden"
                />
                <Globe className="icon-md icon-amber" />
                <span>All Branches</span>
              </label>

              <label
                className={formData.target_type === 'BRANCH' ? 'is-on' : undefined}
              >
                <input
                  type="radio"
                  name="target_type"
                  value="BRANCH"
                  checked={formData.target_type === 'BRANCH'}
                  onChange={() => setFormData({ ...formData, target_type: 'BRANCH' })}
                  className="visually-hidden"
                />
                <Church className="icon-md icon-amber" />
                <span>Specific Branch</span>
              </label>
            </div>

            {/* Conditional Branch Dropdown */}
            {formData.target_type === 'BRANCH' && (
              <div>
                <label className="form-label">
                  Select Specific Branch *
                </label>
                <select
                  required
                  value={formData.branch_id}
                  onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                  className="church-input"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.location || 'Branch'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="form-label">
              Notification Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sunday Prayer Gathering, Annual Synod Meeting"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              Notification Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="church-input"
            >
              <option value="GENERAL">General Notice</option>
              <option value="PRAYER">Prayer Request / Alert</option>
              <option value="EVENT">Special Event</option>
              <option value="URGENT">Urgent Announcement</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Message Content *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter the full message text for the congregation and ministers..."
              className="church-input"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={formSubmitting}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="btn-gold"
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="icon-md icon-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="icon-sm" />
                  <span>{isEditing ? 'Update Notice' : 'Send Broadcast'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification record from the diocesan log?"
        itemName={notifToDelete?.title}
        loading={deleteLoading}
      />
    </div>
  );
};
