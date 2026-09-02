import React, { useEffect, useState, useMemo } from 'react';
import './Members.css';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  MapPin,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatIndianCurrency } from '../../utils/currency';
import { formatDate, formatDateForInput } from '../../utils/date';

export const SubAdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State (Add / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: 'MALE',
    joined_date: formatDateForInput(new Date()),
    amount: '',
  });

  // View Modal State (With Payments)
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [memberPayments, setMemberPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Record Payment Sub-form in View Modal
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(formatDateForInput(new Date()));
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subAdminApi.getAllMembers();
      if (res.members) {
        setMembers(res.members);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch parish members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    const term = searchTerm.toLowerCase();
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.phone?.includes(term) ||
        m.address?.toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      date_of_birth: '',
      gender: 'MALE',
      joined_date: formatDateForInput(new Date()),
      amount: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member) => {
    setIsEditing(true);
    setSelectedMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      date_of_birth: formatDateForInput(member.date_of_birth),
      gender: member.gender || 'MALE',
      joined_date: formatDateForInput(member.joined_date),
      amount: member.amount || '',
    });
    setIsFormOpen(true);
  };

  const handleOpenView = async (member) => {
    setViewMember(member);
    setIsViewOpen(true);
    setPaymentAmount('');
    setPaymentNotes('');
    setPaymentDate(formatDateForInput(new Date()));

    // Fetch payments for this member
    try {
      setPaymentsLoading(true);
      const res = await subAdminApi.getMemberPayments(member.id);
      if (res.payments) {
        setMemberPayments(res.payments);
      } else {
        setMemberPayments([]);
      }
    } catch (err) {
      setMemberPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError('Member name is required.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        joined_date: formData.joined_date || null,
        amount: formData.amount ? Number(formData.amount) : 0,
      };

      if (isEditing && selectedMember) {
        await subAdminApi.updateMember(selectedMember.id, payload);
        success('Member record updated', `${formData.name} details have been updated.`);
      } else {
        await subAdminApi.createMember(payload);
        success('Member added successfully', `Welcome ${formData.name} to the church community.`);
      }

      setIsFormOpen(false);
      fetchMembers();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!viewMember || !paymentAmount || Number(paymentAmount) <= 0) {
      toastError('Please enter a valid payment amount.');
      return;
    }

    try {
      setPaymentSubmitting(true);
      await subAdminApi.recordMemberPayment(viewMember.id, {
        amount: Number(paymentAmount),
        payment_date: paymentDate,
        notes: paymentNotes || 'Tithe / Offering',
      });

      success('Payment recorded', `${formatIndianCurrency(paymentAmount)} recorded for ${viewMember.name}.`);
      setPaymentAmount('');
      setPaymentNotes('');

      // Refresh payment list
      const res = await subAdminApi.getMemberPayments(viewMember.id);
      if (res.payments) {
        setMemberPayments(res.payments);
      }
      fetchMembers();
    } catch (err) {
      toastError(err.message || 'Failed to record payment');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleOpenDelete = (member) => {
    setMemberToDelete(member);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      setDeleteLoading(true);
      await subAdminApi.deleteMember(memberToDelete.id);
      success('Member deleted', `${memberToDelete.name} has been removed.`);
      setIsDeleteOpen(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch (err) {
      toastError(err.message || 'Failed to delete member');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Parish Membership Directory"
        subtitle="Manage registered congregation members, contact details, and contribution records"
        icon={Users}
        actionText="Add New Member"
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
            placeholder="Search by name, email, phone, address..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{members.length}</strong> congregation members
        </div>
      </div>

      {/* Members Table */}
      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMembers} />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          type="members"
          title={searchTerm ? 'No matching members found' : 'No members yet'}
          description={
            searchTerm
              ? `No member matching "${searchTerm}".`
              : 'Your church community will appear here once members are added.'
          }
          actionText="Add First Member"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Contact Info</th>
                  <th>Gender & Age</th>
                  <th>Joined Date</th>
                  <th>Initial Tithe</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td data-label="Member">
                      <div className="row-name font-serif">
                        {member.name}
                      </div>
                      {member.address && (
                        <div className="contact-line row-meta">
                          <MapPin className="icon-xs icon-muted" />
                          <span className="line-clamp-1">{member.address}</span>
                        </div>
                      )}
                    </td>

                    <td data-label="Contact">
                      <div className="contact-stack">
                        {member.phone && (
                          <div className="contact-line">
                            <Phone className="icon-xs icon-muted" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="contact-line">
                            <Mail className="icon-xs icon-muted" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        {!member.phone && !member.email && <span className="muted">—</span>}
                      </div>
                    </td>

                    <td data-label="Gender">
                      <span className="soft-chip">
                        {member.gender || 'MALE'}
                      </span>
                    </td>

                    <td data-label="Joined">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-amber" />
                        <span>{formatDate(member.joined_date)}</span>
                      </div>
                    </td>

                    <td data-label="Tithe">
                      <span className="cell-amount">
                        {formatIndianCurrency(member.amount || 0)}
                      </span>
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenView(member)}
                          className="action-btn"
                          title="View Profile & Payments"
                        >
                          <Eye className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="action-btn edit"
                          title="Edit Member"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(member)}
                          className="action-btn danger"
                          title="Delete Member"
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

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Member Information' : 'Register Church Member'}
        subtitle="Record congregation member details for pastoral care and tithe tracking"
        icon={Users}
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
              placeholder="e.g. Mohammed Abuthahir"
              className="church-input"
            />
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
                placeholder="member@example.com"
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
                <option value="OTHER">Other</option>
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
                Joined Date
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
              Initial Offering / Amount (₹)
            </label>
            <div className="input-wrap">
              <IndianRupee className="icon-md input-icon" />
              <input
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="1000"
                className="church-input has-icon"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Residential Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Residential address..."
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
                <span>{isEditing ? 'Save Changes' : 'Welcome Member'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Member Details & Payments Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={viewMember?.name || 'Member Details'}
        subtitle={`Parish Member #${viewMember?.id}`}
        icon={Users}
        maxWidth="max-w-2xl"
      >
        {viewMember && (
          <div className="view-details">
            {/* Member Profile Summary */}
            <div className="view-box">
              <div className="detail-grid">
                <div className="view-row">
                  <span className="muted">Phone:</span>
                  <span className="cell-name">{viewMember.phone || '—'}</span>
                </div>
                <div className="view-row">
                  <span className="muted">Email:</span>
                  <span className="cell-name">{viewMember.email || '—'}</span>
                </div>
                <div className="view-row">
                  <span className="muted">Gender:</span>
                  <span className="cell-name">{viewMember.gender || 'MALE'}</span>
                </div>
                <div className="view-row">
                  <span className="muted">Joined Date:</span>
                  <span className="cell-name">{formatDate(viewMember.joined_date)}</span>
                </div>
              </div>
              {viewMember.address && (
                <div className="view-address">
                  <span className="muted">Address:</span> {viewMember.address}
                </div>
              )}
            </div>

            {/* Record New Payment Form */}
            <div className="profile-tile">
              <h4 className="detail-head">
                <CreditCard className="icon-sm icon-amber" />
                <span>Record New Tithe / Offering for this Member</span>
              </h4>

              <form onSubmit={handleRecordPayment} className="pay-form">
                <div>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Amount (₹)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="church-input"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="church-input"
                  />
                </div>
                <div className="pay-actions">
                  <input
                    type="text"
                    placeholder="Notes (e.g. Monthly)"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="church-input"
                  />
                  <button
                    type="submit"
                    disabled={paymentSubmitting}
                    className="btn-gold"
                  >
                    {paymentSubmitting ? <Loader2 className="icon-sm icon-spin" /> : 'Record'}
                  </button>
                </div>
              </form>
            </div>

            {/* Payment History Table */}
            <div>
              <h4 className="detail-head font-cinzel">
                Payment & Tithe History
              </h4>
              {paymentsLoading ? (
                <div className="table-empty">Loading payments...</div>
              ) : memberPayments.length > 0 ? (
                <div className="pay-scroll table-scroll">
                  <table className="church-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberPayments.map((p, idx) => (
                        <tr key={idx}>
                          <td data-label="Date" className="muted">{formatDate(p.payment_date)}</td>
                          <td data-label="Amount" className="cell-amount">
                            {formatIndianCurrency(p.amount)}
                          </td>
                          <td data-label="Notes" className="count-text">{p.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="pay-empty">
                  No individual payment records for this member yet.
                </p>
              )}
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

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Church Member"
        message="Are you sure you want to remove this member from the parish directory?"
        itemName={memberToDelete?.name}
        loading={deleteLoading}
      />
    </div>
  );
};
