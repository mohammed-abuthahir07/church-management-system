import React, { useEffect, useState, useMemo } from 'react';
import './Pastors.css';
import {
  Church,
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  Mail,
  Phone,
  Calendar,
  Award,
  Loader2,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorState } from '../../components/common/ErrorState';
import { formatDate, formatDateForInput } from '../../utils/date';

export const SubAdminPastors = () => {
  const [pastors, setPastors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPastor, setSelectedPastor] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: 'MALE',
    joined_date: formatDateForInput(new Date()),
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pastorToDelete, setPastorToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchPastors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subAdminApi.getAllPastors();
      if (res.pastors) {
        setPastors(res.pastors);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pastors / leaders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastors();
  }, []);

  const filteredPastors = useMemo(() => {
    if (!searchTerm.trim()) return pastors;
    const term = searchTerm.toLowerCase();
    return pastors.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.designation?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term) ||
        p.phone?.includes(term)
    );
  }, [pastors, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedPastor(null);
    setFormData({
      name: '',
      designation: '',
      email: '',
      phone: '',
      address: '',
      date_of_birth: '',
      gender: 'MALE',
      joined_date: formatDateForInput(new Date()),
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pastor) => {
    setIsEditing(true);
    setSelectedPastor(pastor);
    setFormData({
      name: pastor.name || '',
      designation: pastor.designation || '',
      email: pastor.email || '',
      phone: pastor.phone || '',
      address: pastor.address || '',
      date_of_birth: formatDateForInput(pastor.date_of_birth),
      gender: pastor.gender || 'MALE',
      joined_date: formatDateForInput(pastor.joined_date),
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      toastError('Name and designation are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        joined_date: formData.joined_date || null,
      };

      if (isEditing && selectedPastor) {
        await subAdminApi.updatePastor(selectedPastor.id, payload);
        success('Pastor record updated', `${formData.name} details have been updated.`);
      } else {
        await subAdminApi.createPastor(payload);
        success('Pastor / Leader added', `${formData.name} is now registered in the pastoral directory.`);
      }

      setIsFormOpen(false);
      fetchPastors();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (pastor) => {
    const nextStatus = pastor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await subAdminApi.updatePastorStatus(pastor.id, nextStatus);
      success(
        `Pastor ${nextStatus === 'ACTIVE' ? 'Activated' : 'Deactivated'}`,
        `${pastor.name} status updated to ${nextStatus}.`
      );
      setPastors((prev) =>
        prev.map((p) => (p.id === pastor.id ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      toastError(err.message || 'Failed to update status');
    }
  };

  const handleOpenDelete = (pastor) => {
    setPastorToDelete(pastor);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pastorToDelete) return;
    try {
      setDeleteLoading(true);
      await subAdminApi.deletePastor(pastorToDelete.id);
      success('Pastor record deleted', `${pastorToDelete.name} has been removed.`);
      setIsDeleteOpen(false);
      setPastorToDelete(null);
      fetchPastors();
    } catch (err) {
      toastError(err.message || 'Failed to delete pastor');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Pastors & Ministry Leaders"
        subtitle="Manage church ministers, associate pastors, deacons, and pastoral staff"
        icon={Church}
        actionText="Add Pastor / Leader"
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
            placeholder="Search by name, designation, contact..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{pastors.length}</strong> appointed leaders
        </div>
      </div>

      {/* Pastors Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPastors} />
      ) : filteredPastors.length === 0 ? (
        <EmptyState
          type="pastors"
          title={searchTerm ? 'No matching pastors found' : 'No pastors listed yet'}
          description={
            searchTerm
              ? `No minister matching "${searchTerm}".`
              : 'Register pastors and ministry leadership in your parish.'
          }
          actionText="Add Pastor / Leader"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Minister Name</th>
                  <th>Designation / Role</th>
                  <th>Contact Info</th>
                  <th>Ministry Joined</th>
                  <th>Status</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPastors.map((pastor) => (
                  <tr key={pastor.id}>
                    <td data-label="Minister">
                      <div className="row-name font-serif">
                        {pastor.name}
                      </div>
                      <div className="row-meta">ID: #{pastor.id}</div>
                    </td>

                    <td data-label="Role">
                      <span className="role-chip">
                        <Award className="icon-sm icon-gold" />
                        <span>{pastor.designation}</span>
                      </span>
                    </td>

                    <td data-label="Contact">
                      <div className="contact-stack">
                        {pastor.phone && (
                          <div className="contact-line">
                            <Phone className="icon-xs icon-muted" />
                            <span>{pastor.phone}</span>
                          </div>
                        )}
                        {pastor.email && (
                          <div className="contact-line">
                            <Mail className="icon-xs icon-muted" />
                            <span>{pastor.email}</span>
                          </div>
                        )}
                        {!pastor.phone && !pastor.email && <span className="muted">—</span>}
                      </div>
                    </td>

                    <td data-label="Joined">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-amber" />
                        <span>{formatDate(pastor.joined_date)}</span>
                      </div>
                    </td>

                    <td data-label="Status">
                      <StatusBadge status={pastor.status} />
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenEdit(pastor)}
                          className="action-btn edit"
                          title="Edit Pastor"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(pastor)}
                          className={pastor.status === 'ACTIVE' ? 'action-btn power-on' : 'action-btn power-off'}
                          title={pastor.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(pastor)}
                          className="action-btn danger"
                          title="Delete Pastor"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Pastor / Leader' : 'Register Pastor / Ministry Leader'}
        subtitle="Ordained and designated ministers serving the local church parish"
        icon={Church}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div className="form-grid-2">
            <div>
              <label className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pastor John David"
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                Designation / Ministry Title *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior Pastor, Youth Pastor, Deacon"
                className="church-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div>
              <label className="form-label">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="pastor@church.com"
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
                className="church-input"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div>
              <label className="form-label">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="church-input"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                Ministry Joined Date
              </label>
              <input
                type="date"
                value={formData.joined_date}
                onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
                className="church-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Residential / Office Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address..."
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
                <span>{isEditing ? 'Save Changes' : 'Register Leader'}</span>
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
        title="Delete Pastor Record"
        message="Are you sure you want to remove this pastor / leader from the parish directory?"
        itemName={pastorToDelete?.name}
        loading={deleteLoading}
      />
    </div>
  );
};
