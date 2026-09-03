import React, { useEffect, useState, useMemo } from 'react';
import './Funds.css';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Church,
  Calendar,
  IndianRupee,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatIndianCurrency } from '../../utils/currency';
import { formatDate, formatDateForInput } from '../../utils/date';

export const SuperAdminFunds = () => {
  const [funds, setFunds] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    branch_id: '',
    amount: '',
    purpose: '',
    allocated_date: formatDateForInput(new Date()),
    description: '',
  });

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [fundToDelete, setFundToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fundsRes, branchesRes, summaryRes] = await Promise.all([
        superAdminApi.getAllFunds(),
        superAdminApi.getAllBranches(),
        superAdminApi.getBranchFundSummary(),
      ]);

      if (fundsRes.funds) {
        setFunds(fundsRes.funds);
      }
      if (branchesRes.branches) {
        setBranches(branchesRes.branches);
      }
      if (summaryRes.branches) {
        setBranchSummary(summaryRes.branches);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch fund allocations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAllocatedSum = useMemo(() => {
    return funds.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [funds]);

  const filteredFunds = useMemo(() => {
    if (!searchTerm.trim()) return funds;
    const term = searchTerm.toLowerCase();
    return funds.filter(
      (f) =>
        f.branch_name?.toLowerCase().includes(term) ||
        f.purpose?.toLowerCase().includes(term) ||
        f.description?.toLowerCase().includes(term) ||
        String(f.amount).includes(term)
    );
  }, [funds, searchTerm]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedFund(null);
    setFormData({
      branch_id: branches.length > 0 ? branches[0].id : '',
      amount: '',
      purpose: '',
      allocated_date: formatDateForInput(new Date()),
      description: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (fund) => {
    setIsEditing(true);
    setSelectedFund(fund);
    setFormData({
      branch_id: fund.branch_id || '',
      amount: fund.amount || '',
      purpose: fund.purpose || '',
      allocated_date: formatDateForInput(fund.allocated_date),
      description: fund.description || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.branch_id || !formData.amount || !formData.purpose.trim() || !formData.allocated_date) {
      toastError('Please fill in all required fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        branch_id: Number(formData.branch_id),
        amount: Number(formData.amount),
        purpose: formData.purpose.trim(),
        allocated_date: formData.allocated_date,
        description: formData.description || null,
      };

      if (isEditing && selectedFund) {
        await superAdminApi.updateFund(selectedFund.id, payload);
        success('Fund allocation updated', `${formatIndianCurrency(payload.amount)} allocation updated.`);
      } else {
        await superAdminApi.createFund(payload);
        success('Fund allocated successfully', `${formatIndianCurrency(payload.amount)} transferred to branch.`);
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (fund) => {
    setFundToDelete(fund);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fundToDelete) return;
    try {
      setDeleteLoading(true);
      await superAdminApi.deleteFund(fundToDelete.id);
      success('Fund allocation deleted', 'The record has been removed.');
      setIsDeleteOpen(false);
      setFundToDelete(null);
      fetchData();
    } catch (err) {
      toastError(err.message || 'Failed to delete fund allocation');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Fund Stewardship & Allocation"
        subtitle="Distribute centralized diocesan funds to regional church branches"
        icon={HeartHandshake}
        actionText="Allocate New Funds"
        onAction={handleOpenAdd}
      />

      {/* Overview Cards: Total Allocated & Branch breakdown */}
      <div className="grid-3">
        <div className="church-card metric-card metric-card--gold">
          <div className="metric-card__head">
            <span className="kicker kicker--gold font-cinzel">
              Total Funds Allocated
            </span>
            <div className="icon-tile icon-tile--gold">
              <TrendingUp className="icon-md" />
            </div>
          </div>
          <div className="metric-value metric-value--gold font-sans">
            {formatIndianCurrency(totalAllocatedSum)}
          </div>
          <p className="muted">Across all active diocesan branches</p>
        </div>

        {/* Branch Allocation Summary Card */}
        <div className="church-card panel funds-span-2">
          <div>
            <h4 className="kicker font-cinzel">
              Branch-wise Allocation Summary
            </h4>
            <div className="branch-pills">
              {branchSummary.length > 0 ? (
                branchSummary.map((b) => (
                  <div
                    key={b.branch_id}
                    className="branch-pill"
                  >
                    <Church className="icon-sm icon-amber" />
                    <span className="cell-name">{b.branch_name}:</span>
                    <span className="gold-amount">
                      {formatIndianCurrency(b.total_allocated)}
                    </span>
                  </div>
                ))
              ) : (
                <span className="row-meta">No branch summaries available.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="church-card toolbar">
        <div className="search-wrap">
          <Search className="icon-md search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by branch, purpose, amount..."
            className="church-input"
          />
        </div>
        <div className="count-text">
          Total: <strong className="cell-name">{funds.length}</strong> allocations recorded
        </div>
      </div>

      {/* Funds Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : filteredFunds.length === 0 ? (
        <EmptyState
          type="funds"
          title={searchTerm ? 'No matching fund allocations' : 'No funds allocated yet'}
          description={
            searchTerm
              ? `No records matching "${searchTerm}".`
              : 'Allocate your first branch fund transfer to support local parish ministry.'
          }
          actionText="Allocate New Funds"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Amount</th>
                  <th>Purpose / Description</th>
                  <th>Allocated Date</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFunds.map((fund) => (
                  <tr key={fund.id}>
                    <td data-label="Branch">
                      <div className="row-name font-serif">
                        {fund.branch_name}
                      </div>
                    </td>

                    <td data-label="Amount">
                      <div className="cell-amount">
                        {formatIndianCurrency(fund.amount)}
                      </div>
                    </td>

                    <td data-label="Purpose">
                      <div className="cell-name">{fund.purpose}</div>
                      {fund.description && (
                        <div className="row-meta line-clamp-1">
                          {fund.description}
                        </div>
                      )}
                    </td>

                    <td data-label="Date">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-amber" />
                        <span>{formatDate(fund.allocated_date)}</span>
                      </div>
                    </td>

                    <td data-label="Actions">
                      <div className="row-actions action-row">
                        <button
                          onClick={() => handleOpenEdit(fund)}
                          className="action-btn edit"
                          title="Edit Fund"
                        >
                          <Edit2 className="icon-md" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(fund)}
                          className="action-btn danger"
                          title="Delete Fund"
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
        title={isEditing ? 'Edit Fund Allocation' : 'Allocate Funds to Branch'}
        subtitle="Record financial transfers from Central Diocese to regional church parishes"
        icon={HeartHandshake}
      >
        <form onSubmit={handleSubmitForm} className="form-stack">
          <div>
            <label className="form-label">
              Target Church Branch *
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

          <div className="form-grid-2">
            <div>
              <label className="form-label">
                Amount (₹) *
              </label>
              <div className="input-wrap">
                <IndianRupee className="icon-md input-icon" />
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="50000"
                  className="church-input has-icon"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Allocated Date *
              </label>
              <input
                type="date"
                required
                value={formData.allocated_date}
                onChange={(e) => setFormData({ ...formData, allocated_date: e.target.value })}
                className="church-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Purpose / Fund Title *
            </label>
            <input
              type="text"
              required
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="e.g. September Branch Operating Fund, Youth Ministry Support"
              className="church-input"
            />
          </div>

          <div>
            <label className="form-label">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional notes, transfer references, or ministry budget details..."
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
                <span>{isEditing ? 'Save Changes' : 'Confirm Allocation'}</span>
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
        title="Delete Fund Allocation"
        message="Are you sure you want to delete this fund allocation record? This will adjust historical branch statistics."
        itemName={`${fundToDelete?.branch_name} - ${formatIndianCurrency(fundToDelete?.amount)}`}
        loading={deleteLoading}
      />
    </div>
  );
};
