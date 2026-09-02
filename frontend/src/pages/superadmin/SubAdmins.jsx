import React, { useEffect, useState, useMemo } from 'react';
import './SubAdmins.css';
import {
  UserCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Church,
  Mail,
  Lock,
  Eye,
  EyeOff,
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

export const SubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch_id: '',
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [adminsRes, branchesRes] = await Promise.all([
        superAdminApi.getAllSubAdmins(),
        superAdminApi.getAllBranches(),
      ]);

      if (adminsRes.admins) {
        setSubAdmins(adminsRes.admins);
      }
      if (branchesRes.branches) {
        setBranches(branchesRes.branches);
      }
    } catch (err) {
      setError(err.message || 'Failed to load sub-admins and branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAdmins = useMemo(() => {
    if (!searchTerm.trim()) return subAdmins;
    const term = searchTerm.toLowerCase();
    return subAdmins.filter(
      (a) =>
        a.name?.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term) ||
        a.branch_name?.toLowerCase().includes(term)
    );
  }, [subAdmins, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
    setShowPassword(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      branch_id: branches.length > 0 ? branches[0].id : '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setShowPassword(false);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      password: '', // leave empty unless changing
      branch_id: admin.branch_id || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.branch_id) {
      toastError('Please fill in all required fields.');
      return;
    }

    if (!isEditing && !formData.password) {
      toastError('Password is required when creating a new branch admin.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        branch_id: Number(formData.branch_id),
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing && selectedAdmin) {
        await superAdminApi.updateSubAdmin(selectedAdmin.id, payload);
        success('Branch Admin updated', `${formData.name} details have been updated.`);
      } else {
        await superAdminApi.createSubAdmin(payload);
        success('Branch Admin appointed', `${formData.name} is now assigned to the selected branch.`);
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (admin) => {
    setAdminToDelete(admin);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    try {
      setDeleteLoading(true);
      await superAdminApi.deleteSubAdmin(adminToDelete.id);
      success('Branch Admin removed', `${adminToDelete.name} has been deleted.`);
      setIsDeleteOpen(false);
      setAdminToDelete(null);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Failed to delete branch admin');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Sub Admin Management"
        subtitle="Appoint and manage branch administrators responsible for local church parishes"
        icon={UserCheck}
        actionText="Appoint Sub Admin"
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
            placeholder="Search admins by name, email, branch..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{subAdmins.length}</strong> appointed admins
        </div>
      </div>

      {/* Main Table Area */}
      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filteredAdmins.length === 0 ? (
        <EmptyState
          type="pastors"
          title={searchTerm ? 'No matching Sub Admins' : 'No Sub Admins appointed yet'}
          description={
            searchTerm
              ? `No administrator matching "${searchTerm}".`
              : 'Create branch administrator accounts and assign them to active church branches.'
          }
          actionText="Appoint Sub Admin"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Assigned Branch</th>
                  <th>Status</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td data-label="Administrator">
                      <div className="row-name font-serif">
                        {admin.name}
                      </div>
                      <div className="contact-line">
                        <Mail className="icon-xs icon-muted" />
                        <span>{admin.email}</span>
                      </div>
                    </td>

                    <td data-label="Branch">
                      <div className="branch-tile">
                        <div className="branch-tile__icon">
                          <Church className="icon-sm" />
                        </div>
                        <div>
                          <span className="cell-name">
                            {admin.branch_name || `Branch #${admin.branch_id}`}
                          </span>
                          <span className="row-meta">
                            Branch ID: #{admin.branch_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td data-label="Status">
                      <StatusBadge status={admin.status} />
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="action-btn edit"
                          title="Edit Sub Admin"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(admin)}
                          className="action-btn danger"
                          title="Delete Sub Admin"
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
        title={isEditing ? 'Edit Branch Admin' : 'Appoint New Branch Admin'}
        subtitle="Assign a trusted servant to oversee parish records and local ministry"
        icon={UserCheck}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Trichy Branch Admin"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              Email Address (Login Username) *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="trichyadmin@church.com"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              {isEditing ? 'New Password (Leave blank to keep existing)' : 'Password *'}
            </label>
            <div className="input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!isEditing}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={isEditing ? 'Leave blank to keep unchanged' : '••••••••'}
                className="church-input has-icon-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-action"
              >
                {showPassword ? <EyeOff className="icon-md" /> : <Eye className="icon-md" />}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">
              Assign to Church Branch *
            </label>
            <select
              required
              value={formData.branch_id}
              onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
              className="church-input"
            >
              <option value="">Select a Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.location || 'Branch'} - #{b.id})
                </option>
              ))}
            </select>
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
                <span>{isEditing ? 'Update Admin' : 'Appoint Admin'}</span>
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
        title="Remove Branch Admin"
        message="Are you sure you want to remove this branch administrator account? They will no longer be able to log in."
        itemName={adminToDelete?.name}
        loading={deleteLoading}
      />
    </div>
  );
};
