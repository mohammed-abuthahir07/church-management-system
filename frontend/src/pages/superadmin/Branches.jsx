import React, { useEffect, useState, useMemo } from 'react';
import './Branches.css';
import {
  Church,
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  Eye,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorState } from '../../components/common/ErrorState';

export const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal State (Add / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: '',
    phone: '',
    email: '',
  });

  // View Modal State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewBranch, setViewBranch] = useState(null);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await superAdminApi.getAllBranches();
      if (res.branches) {
        setBranches(res.branches);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Filtered branches by search
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return branches;
    const term = searchTerm.toLowerCase();
    return branches.filter(
      (b) =>
        b.name?.toLowerCase().includes(term) ||
        b.location?.toLowerCase().includes(term) ||
        b.address?.toLowerCase().includes(term) ||
        b.phone?.includes(term) ||
        b.email?.toLowerCase().includes(term)
    );
  }, [branches, searchTerm]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedBranch(null);
    setFormData({
      name: '',
      address: '',
      location: '',
      phone: '',
      email: '',
    });
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (branch) => {
    setIsEditing(true);
    setSelectedBranch(branch);
    setFormData({
      name: branch.name || '',
      address: branch.address || '',
      location: branch.location || '',
      phone: branch.phone || '',
      email: branch.email || '',
    });
    setIsFormOpen(true);
  };

  // Open View Modal
  const handleOpenView = (branch) => {
    setViewBranch(branch);
    setIsViewOpen(true);
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError('Branch name is required');
      return;
    }

    try {
      setFormSubmitting(true);
      if (isEditing && selectedBranch) {
        await superAdminApi.updateBranch(selectedBranch.id, formData);
        success('Branch updated successfully', `${formData.name} details have been updated.`);
      } else {
        await superAdminApi.createBranch(formData);
        success('Branch created successfully', `${formData.name} is now registered in the church network.`);
      }
      setIsFormOpen(false);
      fetchBranches();
    } catch (err) {
      toastError(err.message || 'Operation failed. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Branch Status (Activate / Deactivate)
  const handleToggleStatus = async (branch) => {
    const nextStatus = branch.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await superAdminApi.updateBranchStatus(branch.id, nextStatus);
      success(
        `Branch ${nextStatus === 'ACTIVE' ? 'Activated' : 'Deactivated'}`,
        `${branch.name} status updated to ${nextStatus}.`
      );
      setBranches((prev) =>
        prev.map((b) => (b.id === branch.id ? { ...b, status: nextStatus } : b))
      );
    } catch (err) {
      toastError(err.message || 'Failed to update branch status');
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (branch) => {
    setBranchToDelete(branch);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!branchToDelete) return;
    try {
      setDeleteLoading(true);
      await superAdminApi.deleteBranch(branchToDelete.id);
      success('Branch deleted successfully', `${branchToDelete.name} has been removed.`);
      setIsDeleteOpen(false);
      setBranchToDelete(null);
      fetchBranches();
    } catch (err) {
      toastError(err.message || 'Failed to delete branch');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Branch Management"
        subtitle="Manage diocese regional branches, contact directories, and active status"
        icon={Church}
        actionText="Add New Branch"
        onAction={handleOpenAdd}
      />

      {/* Search Bar & Stats */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search branches by name, location, phone..."
            className="church-input"
          />
        </div>

        <div className="count-text">
          <span>Total: <strong className="cell-name">{branches.length}</strong> branches</span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBranches} />
      ) : filteredBranches.length === 0 ? (
        <EmptyState
          type="branches"
          title={searchTerm ? 'No matching branches found' : 'No branches created yet'}
          description={
            searchTerm
              ? `No branch matching "${searchTerm}". Try a different keyword.`
              : 'Add your first church branch to expand your diocese network.'
          }
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Branch Details</th>
                  <th>Location / Address</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranches.map((branch) => (
                  <tr key={branch.id}>
                    <td data-label="Branch">
                      <div className="row-name font-serif">
                        <p> {branch.name} : {branch.id}</p> 
                      </div>
  
                    </td>

                    <td data-label="Location">
                      <div className="date-cell">
                        <MapPin className="icon-sm icon-amber" />
                        <span>{branch.location || branch.address || '—'}</span>
                      </div>
                      {branch.location && branch.address && (
                        <div className="addr-indent">{branch.address}</div>
                      )}
                    </td>

                    <td data-label="Contact">
                      <div className="contact-stack">
                        {branch.phone && (
                          <div className="contact-line">
                            <Phone className="icon-xs icon-muted" />
                            <span>{branch.phone}</span>
                          </div>
                        )}
                        {branch.email && (
                          <div className="contact-line">
                            <Mail className="icon-xs icon-muted" />
                            <span>{branch.email}</span>
                          </div>
                        )}
                        {!branch.phone && !branch.email && <span className="muted">—</span>}
                      </div>
                    </td>

                    <td data-label="Status">
                      <StatusBadge status={branch.status} />
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenView(branch)}
                          className="action-btn"
                          title="View Details"
                        >
                          <Eye className="icon-md" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(branch)}
                          className="action-btn edit"
                          title="Edit Branch"
                        >
                          <Edit2 className="icon-md" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(branch)}
                          className={branch.status === 'ACTIVE' ? 'action-btn power-on' : 'action-btn power-off'}
                          title={branch.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="icon-md" />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(branch)}
                          className="action-btn danger"
                          title="Delete Branch"
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

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Church Branch' : 'Register New Church Branch'}
        subtitle="Ensure accurate contact and address details for diocesan records"
        icon={Church}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Branch Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Trichy Main Branch"
              className="church-input"
            />
          </div>

          <div className="form-grid-2">
            <div>
              <label className="form-label">
                City / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Trichy"
                className="church-input"
              />
            </div>

            <div>
              <label className="form-label">
                Contact Phone
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

          <div>
            <label className="form-label">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="trichy@church.com"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              Full Physical Address
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full church sanctuary address..."
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
                <span>{isEditing ? 'Save Changes' : 'Create Branch'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Branch Detail Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={viewBranch?.name || 'Branch Details'}
        subtitle={`Branch ID: #${viewBranch?.id || ''}`}
        icon={Church}
      >
        {viewBranch && (
          <div className="view-details">
            <div className="view-box">
              <div className="view-row">
                <span className="muted">Status:</span>
                <StatusBadge status={viewBranch.status} />
              </div>
              <div className="view-row">
                <span className="muted">Location:</span>
                <span className="cell-name">{viewBranch.location || '—'}</span>
              </div>
              <div className="view-row">
                <span className="muted">Phone:</span>
                <span className="cell-name">{viewBranch.phone || '—'}</span>
              </div>
              <div className="view-row">
                <span className="muted">Email:</span>
                <span className="cell-name">{viewBranch.email || '—'}</span>
              </div>
            </div>

            <div>
              <p className="form-label">
                Full Address
              </p>
              <p className="view-address">
                {viewBranch.address || 'No full address provided.'}
              </p>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Church Branch"
        message="Are you sure you want to delete this branch? All associated sub-admins, ministers, and local records may be impacted."
        itemName={branchToDelete?.name}
        loading={deleteLoading}
      />
    </div>
  );
};
