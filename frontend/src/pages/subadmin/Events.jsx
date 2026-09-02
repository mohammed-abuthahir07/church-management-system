import React, { useEffect, useState, useMemo } from 'react';
import './Events.css';
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Loader2,
  Church,
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

export const SubAdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: formatDateForInput(new Date()),
    start_time: '09:00',
    end_time: '12:00',
    location: 'Main Sanctuary Hall',
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subAdminApi.getAllEvents();
      if (res.events) {
        setEvents(res.events);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch church events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    const term = searchTerm.toLowerCase();
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(term) ||
        e.location?.toLowerCase().includes(term) ||
        e.description?.toLowerCase().includes(term)
    );
  }, [events, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: formatDateForInput(new Date()),
      start_time: '09:00',
      end_time: '12:00',
      location: 'Main Sanctuary Hall',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setIsEditing(true);
    setSelectedEvent(evt);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      event_date: formatDateForInput(evt.event_date),
      start_time: evt.start_time ? evt.start_time.substring(0, 5) : '09:00',
      end_time: evt.end_time ? evt.end_time.substring(0, 5) : '12:00',
      location: evt.location || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.event_date) {
      toastError('Event title and date are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        event_date: formData.event_date,
        start_time: formData.start_time ? (formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time) : null,
        end_time: formData.end_time ? (formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time) : null,
        location: formData.location?.trim() || 'Main Sanctuary Hall',
      };

      if (isEditing && selectedEvent) {
        await subAdminApi.updateEvent(selectedEvent.id, payload);
        success('Event updated', `${formData.title} event details updated.`);
      } else {
        await subAdminApi.createEvent(payload);
        success('Church Event created', `${formData.title} has been scheduled.`);
      }

      setIsFormOpen(false);
      fetchEvents();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (evt) => {
    setEventToDelete(evt);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      setDeleteLoading(true);
      await subAdminApi.deleteEvent(eventToDelete.id);
      success('Event deleted', 'The event has been removed.');
      setIsDeleteOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (err) {
      toastError(err.message || 'Failed to delete event');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Parish Events & Gatherings"
        subtitle="Organize Sunday services, youth conferences, baptism ceremonies, and gospel fellowships"
        icon={Calendar}
        actionText="Schedule Event"
        onAction={handleOpenAdd}
      />

      {/* Search Bar */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search event title, venue location..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{events.length}</strong> events scheduled
        </div>
      </div>

      {/* Main Content: Event Cards Grid */}
      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          type="events"
          title={searchTerm ? 'No matching events found' : 'No church events scheduled'}
          description={
            searchTerm
              ? `No event matching "${searchTerm}".`
              : 'Create your next church event or fellowship.'
          }
          actionText="Create First Event"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="event-grid">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="church-card event-card"
            >
              <div>
                {/* Header Date Pill & Actions */}
                <div className="event-card__top">
                  <div className="event-date">
                    <Calendar className="icon-sm" />
                    <span>{formatDate(evt.event_date)}</span>
                  </div>

                  <div className="row-actions">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="action-btn edit"
                      title="Edit Event"
                    >
                      <Edit2 className="icon-md" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(evt)}
                      className="action-btn danger"
                      title="Delete Event"
                    >
                      <Trash2 className="icon-md" />
                    </button>
                  </div>
                </div>

                <h3 className="event-title font-serif">
                  {evt.title}
                </h3>

                {evt.description && (
                  <p className="event-desc line-clamp-3">
                    {evt.description}
                  </p>
                )}
              </div>

              {/* Time & Venue Footer */}
              <div className="event-foot">
                {evt.start_time && (
                  <div className="date-cell cell-name">
                    <Clock className="icon-sm icon-amber" />
                    <span>
                      {formatTime(evt.start_time)}
                      {evt.end_time ? ` - ${formatTime(evt.end_time)}` : ''}
                    </span>
                  </div>
                )}
                {evt.location && (
                  <div className="date-cell">
                    <MapPin className="icon-sm icon-muted" />
                    <span className="line-clamp-1">{evt.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Church Event' : 'Schedule Church Event'}
        subtitle="Set event timing, sanctuary venue, and service agenda"
        icon={Calendar}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sunday Morning Worship, Youth Fellowship Crusade"
              className="church-input"
            />
          </div>

          <div className="form-grid-3">
            <div>
              <label className="form-label">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                Start Time
              </label>
              <input
                type="time"
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
              Sanctuary / Venue Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Main Church Hall, Fellowship Lawn"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              Event Description & Program
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide event details, guest speaker names, choir schedule, etc..."
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
                <span>{isEditing ? 'Save Changes' : 'Schedule Event'}</span>
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
        title="Delete Church Event"
        message="Are you sure you want to remove this event from the calendar?"
        itemName={eventToDelete?.title}
        loading={deleteLoading}
      />
    </div>
  );
};
