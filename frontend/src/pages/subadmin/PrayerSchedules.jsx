import React, { useEffect, useState, useMemo } from 'react';
import './PrayerSchedules.css';
import {
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  List,
  CalendarDays,
  Loader2,
  Heart,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate, formatTime, formatDateForInput } from '../../utils/date';

export const SubAdminPrayerSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'cards'

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prayer_date: formatDateForInput(new Date()),
    start_time: '06:00',
    end_time: '07:00',
    location: 'Main Sanctuary',
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subAdminApi.getAllPrayerSchedules();
      if (res.prayer_schedules) {
        setSchedules(res.prayer_schedules);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch prayer schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const filteredSchedules = useMemo(() => {
    if (!searchTerm.trim()) return schedules;
    const term = searchTerm.toLowerCase();
    return schedules.filter(
      (s) =>
        s.title?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term)
    );
  }, [schedules, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedSchedule(null);
    setFormData({
      title: '',
      description: '',
      prayer_date: formatDateForInput(new Date()),
      start_time: '06:00',
      end_time: '07:00',
      location: 'Main Sanctuary',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sched) => {
    setIsEditing(true);
    setSelectedSchedule(sched);
    setFormData({
      title: sched.title || '',
      description: sched.description || '',
      prayer_date: formatDateForInput(sched.prayer_date),
      start_time: sched.start_time ? sched.start_time.substring(0, 5) : '06:00',
      end_time: sched.end_time ? sched.end_time.substring(0, 5) : '07:00',
      location: sched.location || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.prayer_date || !formData.start_time) {
      toastError('Title, date, and start time are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        prayer_date: formData.prayer_date,
        start_time: formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time,
        end_time: formData.end_time ? (formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time) : null,
        location: formData.location?.trim() || 'Main Sanctuary',
      };

      if (isEditing && selectedSchedule) {
        await subAdminApi.updatePrayerSchedule(selectedSchedule.id, payload);
        success('Prayer schedule updated', `${formData.title} schedule has been modified.`);
      } else {
        await subAdminApi.createPrayerSchedule(payload);
        success('Prayer schedule created', `${formData.title} is now scheduled for prayer.`);
      }

      setIsFormOpen(false);
      fetchSchedules();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (sched) => {
    setScheduleToDelete(sched);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!scheduleToDelete) return;
    try {
      setDeleteLoading(true);
      await subAdminApi.deletePrayerSchedule(scheduleToDelete.id);
      success('Prayer schedule deleted', 'The schedule has been removed.');
      setIsDeleteOpen(false);
      setScheduleToDelete(null);
      fetchSchedules();
    } catch (err) {
      toastError(err.message || 'Failed to delete prayer schedule');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Parish Prayer Schedules"
        subtitle="Unite the congregation in daily morning devotions, fasting prayer, and vigils"
        icon={Sparkles}
        actionText="Schedule Prayer"
        onAction={handleOpenAdd}
      />

      <div className="prayer-banner prayer-surface">
        <svg className="prayer-banner__dove animate-dove" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
          <path d="M50 30 C45 25 35 25 25 35 C20 40 18 50 20 60 C25 55 35 52 45 54 C55 56 60 62 70 65 C75 58 78 48 72 40 C65 32 55 32 50 30 Z" />
        </svg>
        <p className="prayer-banner__verse font-serif">
          “Pray without ceasing.” — 1 Thessalonians 5:17
        </p>
        <p className="prayer-banner__copy">
          A peaceful space to schedule vigils, morning prayer, and intercession for the parish.
        </p>
      </div>

      {/* Search & View Switcher */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prayer title, sanctuary location..."
            className="church-input"
          />
        </div>

        <div className="view-toggle">
          <button
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'is-on' : undefined}
          >
            <List className="icon-sm" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={viewMode === 'cards' ? 'is-on' : undefined}
          >
            <CalendarDays className="icon-sm" />
            <span>Cards View</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSchedules} />
      ) : filteredSchedules.length === 0 ? (
        <EmptyState
          type="prayer"
          title={searchTerm ? 'No matching prayer schedules' : 'No prayer schedules yet'}
          description={
            searchTerm
              ? `No schedule matching "${searchTerm}".`
              : 'Create a prayer schedule to bring the community together in prayer.'
          }
          actionText="Schedule First Prayer"
          onAction={handleOpenAdd}
        />
      ) : viewMode === 'list' ? (
        <div className="church-card table-panel prayer-surface">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Prayer Title & Notes</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Sanctuary Location</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((sched) => (
                  <tr key={sched.id}>
                    <td data-label="Prayer">
                      <div className="row-name font-serif">
                        {sched.title}
                      </div>
                      {sched.description && (
                        <p className="muted line-clamp-1">
                          {sched.description}
                        </p>
                      )}
                    </td>

                    <td data-label="Date">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-amber" />
                        <span>{formatDate(sched.prayer_date)}</span>
                      </div>
                    </td>

                    <td data-label="Time">
                      <div className="date-cell cell-name">
                        <Clock className="icon-sm icon-amber" />
                        <span>
                          {formatTime(sched.start_time)} - {formatTime(sched.end_time)}
                        </span>
                      </div>
                    </td>

                    <td data-label="Location">
                      <div className="date-cell">
                        <MapPin className="icon-sm icon-muted" />
                        <span>{sched.location || 'Main Sanctuary'}</span>
                      </div>
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenEdit(sched)}
                          className="action-btn edit"
                          title="Edit Schedule"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(sched)}
                          className="action-btn danger"
                          title="Delete Schedule"
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
      ) : (
        /* Cards View */
        <div className="event-grid">
          {filteredSchedules.map((sched) => (
            <div
              key={sched.id}
              className="church-card event-card prayer-surface"
            >
              <div>
                <div className="event-card__top">
                  <div className="icon-tile icon-tile--gold">
                    <Sparkles className="icon-lg" />
                  </div>
                  <div className="row-actions">
                    <button
                      onClick={() => handleOpenEdit(sched)}
                      className="action-btn edit"
                    >
                      <Edit2 className="icon-sm" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(sched)}
                      className="action-btn danger"
                    >
                      <Trash2 className="icon-sm" />
                    </button>
                  </div>
                </div>

                <h3 className="event-title font-serif">
                  {sched.title}
                </h3>
                {sched.description && (
                  <p className="event-desc line-clamp-2">
                    {sched.description}
                  </p>
                )}
              </div>

              <div className="event-foot">
                <div className="date-cell">
                  <Calendar className="icon-sm icon-amber" />
                  <span>{formatDate(sched.prayer_date)}</span>
                </div>
                <div className="date-cell cell-name">
                  <Clock className="icon-sm icon-amber" />
                  <span>
                    {formatTime(sched.start_time)} - {formatTime(sched.end_time)}
                  </span>
                </div>
                <div className="date-cell">
                  <MapPin className="icon-sm icon-muted" />
                  <span>{sched.location || 'Main Sanctuary'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Prayer Schedule' : 'Schedule Prayer Gathering'}
        subtitle="Organize times of devotion, intercession, and fellowship for the congregation"
        icon={Sparkles}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Prayer Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Early Morning Intercession, Fasting Prayer"
              className="church-input"
            />
          </div>

          <div className="form-grid-3">
            <div>
              <label className="form-label">
                Prayer Date *
              </label>
              <input
                type="date"
                required
                value={formData.prayer_date}
                onChange={(e) => setFormData({ ...formData, prayer_date: e.target.value })}
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                End Time
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="church-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Sanctuary / Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Main Church Hall, Prayer Room"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              Description / Prayer Focus Points
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline scripture themes, intercession topics, or minister leading prayer..."
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Confirm Schedule'}</span>
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
        title="Delete Prayer Schedule"
        message="Are you sure you want to delete this prayer gathering schedule?"
        itemName={scheduleToDelete?.title}
        loading={deleteLoading}
      />
    </div>
  );
};
