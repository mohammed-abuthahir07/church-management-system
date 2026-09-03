import React, { useEffect, useState, useMemo } from 'react';
import './Donations.css';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  IndianRupee,
  User,
  Loader2,
  TrendingUp,
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

export const SubAdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [donationDashboard, setDonationDashboard] = useState({ this_month: 0, this_year: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    amount: '',
    payment_date: formatDateForInput(new Date()),
    purpose: 'Monthly Offering',
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [donationsRes, membersRes, dashRes] = await Promise.all([
        subAdminApi.getAllDonations(),
        subAdminApi.getAllMembers(),
        subAdminApi.getDonationDashboard(),
      ]);

      if (donationsRes.donations) {
        setDonations(donationsRes.donations);
      }
      if (membersRes.members) {
        setMembers(membersRes.members);
      }
      if (dashRes.donation) {
        setDonationDashboard(dashRes.donation);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDonations = useMemo(() => {
    if (!searchTerm.trim()) return donations;
    const term = searchTerm.toLowerCase();
    return donations.filter(
      (d) =>
        d.member_name?.toLowerCase().includes(term) ||
        d.purpose?.toLowerCase().includes(term) ||
        String(d.amount).includes(term)
    );
  }, [donations, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedDonation(null);
    setFormData({
      member_id: members.length > 0 ? members[0].id : '',
      amount: '',
      payment_date: formatDateForInput(new Date()),
      purpose: 'Monthly Offering',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (donation) => {
    setIsEditing(true);
    setSelectedDonation(donation);
    setFormData({
      member_id: donation.member_id || '',
      amount: donation.amount || '',
      payment_date: formatDateForInput(donation.payment_date),
      purpose: donation.purpose || 'Monthly Offering',
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.member_id || !formData.amount || Number(formData.amount) <= 0 || !formData.payment_date) {
      toastError('Please provide member, amount, and date.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        member_id: Number(formData.member_id),
        amount: Number(formData.amount),
        payment_date: formData.payment_date,
        purpose: formData.purpose.trim() || 'General Offering',
      };

      if (isEditing && selectedDonation) {
        await subAdminApi.updateDonation(selectedDonation.id, payload);
        success('Donation record updated', `${formatIndianCurrency(payload.amount)} updated.`);
      } else {
        await subAdminApi.createDonation(payload);
        success('Donation recorded successfully', `Thank you for supporting the church (${formatIndianCurrency(payload.amount)}).`);
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (donation) => {
    setDonationToDelete(donation);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!donationToDelete) return;
    try {
      setDeleteLoading(true);
      await subAdminApi.deleteDonation(donationToDelete.id);
      success('Donation record deleted', 'The record has been removed.');
      setIsDeleteOpen(false);
      setDonationToDelete(null);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Failed to delete donation');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Tithes & Donations"
        subtitle="Faithful financial stewardship, member contributions, and church ministry offerings"
        icon={HeartHandshake}
        actionText="Record Donation"
        onAction={handleOpenAdd}
      />

      {/* Summary Stat Cards */}
      <div className="grid-3">
        <div className="church-card metric-card metric-card--emerald donation-surface">
          <span className="kicker kicker--emerald font-cinzel">
            This Month Giving
          </span>
          <div className="metric-value metric-value--emerald font-sans">
            {formatIndianCurrency(donationDashboard.this_month)}
          </div>
          <p className="muted">Parish contributions this month</p>
        </div>

        <div className="church-card metric-card metric-card--gold">
          <span className="kicker kicker--gold font-cinzel">
            This Year Giving
          </span>
          <div className="metric-value metric-value--gold font-sans">
            {formatIndianCurrency(donationDashboard.this_year)}
          </div>
          <p className="muted">Total parish offerings this year</p>
        </div>

        {/* <div className="church-card metric-card metric-card--navy">
          <span className="kicker kicker--navy font-cinzel">
            All-Time Total
          </span>
          <div className="metric-value metric-value--navy font-sans">
            {formatIndianCurrency(donationDashboard.total)}
          </div>
          <p className="muted">Historical church donations</p>
        </div> */}
      </div>

      {/* Search Bar */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by member name, purpose..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{donations.length}</strong> recorded gifts
        </div>
      </div>

      {/* Donations Table */}
      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filteredDonations.length === 0 ? (
        <EmptyState
          type="donations"
          title={searchTerm ? 'No matching donations found' : 'No donations recorded yet'}
          description={
            searchTerm
              ? `No gift matching "${searchTerm}".`
              : 'Record generous tithes and gifts from congregation members.'
          }
          actionText="Record First Donation"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Contributor</th>
                  <th>Amount (₹)</th>
                  <th>Purpose</th>
                  <th>Payment Date</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td data-label="Contributor">
                      <div className="branch-tile">
                        <div className="avatar-circle font-serif">
                          {donation.member_name ? donation.member_name.charAt(0) : 'M'}
                        </div>
                        <div>
                          <div className="row-name font-serif">
                            {donation.member_name || 'Anonymous Member'}
                          </div>
                          <div className="row-meta">
                            Member #{donation.member_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td data-label="Amount">
                      <span className="cell-amount">
                        {formatIndianCurrency(donation.amount)}
                      </span>
                    </td>

                    <td data-label="Purpose">
                      <span className="soft-chip">
                        {donation.purpose || 'General Offering'}
                      </span>
                    </td>

                    <td data-label="Date">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-amber" />
                        <span>{formatDate(donation.payment_date)}</span>
                      </div>
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenEdit(donation)}
                          className="action-btn edit"
                          title="Edit Donation"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(donation)}
                          className="action-btn danger"
                          title="Delete Donation"
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
        title={isEditing ? 'Edit Donation Record' : 'Record Parish Donation / Tithe'}
        subtitle="Maintain accurate stewardship records for congregation offerings"
        icon={HeartHandshake}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Select Member *
            </label>
            <select
              required
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
              className="church-input"
            >
              <option value="">Select Congregation Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone || m.email || `#${m.id}`})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div>
              <label className="form-label">
                Donation Amount (₹) *
              </label>
              <div className="input-wrap">
                <IndianRupee className="icon-md input-icon" />
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="1000"
                  className="church-input has-icon"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                className="church-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Purpose / Offering Category *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="church-input"
            >
              <option value="Monthly Offering">Monthly Offering</option>
              <option value="Tithe">Tithe (10%)</option>
              <option value="Building Fund">Church Building / Sanctuary Fund</option>
              <option value="Missions & Outreach">Missions & Gospel Outreach</option>
              <option value="Thanksgiving Offering">Thanksgiving Offering</option>
              <option value="Special Gift">Special Gift</option>
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
                <span>{isEditing ? 'Save Changes' : 'Record Offering'}</span>
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
        title="Delete Donation Record"
        message="Are you sure you want to delete this recorded donation?"
        itemName={`${donationToDelete?.member_name} - ${formatIndianCurrency(donationToDelete?.amount)}`}
        loading={deleteLoading}
      />
    </div>
  );
};
