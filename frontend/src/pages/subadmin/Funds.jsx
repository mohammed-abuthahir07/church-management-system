import React, { useEffect, useState } from 'react';
import './Funds.css';
import {
  HeartHandshake,
  Calendar,
  IndianRupee,
  TrendingUp,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatIndianCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export const SubAdminFunds = () => {
  const { branchName } = useAuth();
  const [summary, setSummary] = useState({ this_month: 0, this_year: 0, total: 0 });
  const [fundHistory, setFundHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, historyRes] = await Promise.all([
        subAdminApi.getFundSummary(),
        subAdminApi.getFundHistory(),
      ]);

      if (summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (historyRes.funds) {
        setFundHistory(historyRes.funds);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch branch fund history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  return (
    <div className="page">
      <PageHeader
        title="Parish Funds Received"
        subtitle={`Diocesan funds allocated specifically to ${branchName || 'your branch'}`}
        icon={HeartHandshake}
      />

      {/* Notice Banner */}
      <div className="fund-note">
        <Info className="icon-md icon-gold" />
        <div>
          <span className="cell-name">Read-Only Financial Overview: </span>
          Funds displayed here are granted and allocated directly by the Central Diocese Super Admin to support local parish operations, community outreach, and ministry.
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid-3">
        <div className="church-card metric-card metric-card--emerald">
          <div className="metric-card__head">
            <span className="kicker kicker--emerald font-cinzel">
              Received This Month
            </span>
            <div className="icon-tile icon-tile--emerald">
              <TrendingUp className="icon-md" />
            </div>
          </div>
          <div className="metric-value metric-value--emerald font-sans">
            {formatIndianCurrency(summary.this_month)}
          </div>
          <p className="muted">Granted in current calendar month</p>
        </div>

        <div className="church-card metric-card metric-card--gold">
          <div className="metric-card__head">
            <span className="kicker kicker--gold font-cinzel">
              Received This Year
            </span>
            <div className="icon-tile icon-tile--gold">
              <TrendingUp className="icon-md" />
            </div>
          </div>
          <div className="metric-value metric-value--gold font-sans">
            {formatIndianCurrency(summary.this_year)}
          </div>
          <p className="muted">Cumulative parish grants this year</p>
        </div>

        <div className="church-card metric-card metric-card--navy">
          <div className="metric-card__head">
            <span className="kicker kicker--navy font-cinzel">
              All-Time Total Received
            </span>
            <div className="icon-tile icon-tile--navy">
              <HeartHandshake className="icon-md" />
            </div>
          </div>
          <div className="metric-value metric-value--navy font-sans">
            {formatIndianCurrency(summary.total)}
          </div>
          <p className="muted">Total diocesan funding received</p>
        </div>
      </div>

      {/* Fund History Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchFunds} />
      ) : fundHistory.length === 0 ? (
        <EmptyState
          type="funds"
          title="No fund allocations received yet"
          description="Transfers granted by the Central Diocese Super Admin will appear here."
          actionText={null}
        />
      ) : (
        <div className="church-card table-panel">
          <div className="table-bar">
            <h3 className="panel-title font-serif">
              Diocesan Allocation Transfer History
            </h3>
          </div>
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Allocated Amount (₹)</th>
                  <th>Purpose / Ministry Focus</th>
                  <th>Allocation Date</th>
                  <th>Notes & Description</th>
                </tr>
              </thead>
              <tbody>
                {fundHistory.map((fund) => (
                  <tr key={fund.id}>
                    <td data-label="Amount">
                      <span className="cell-amount">
                        {formatIndianCurrency(fund.amount)}
                      </span>
                    </td>

                    <td data-label="Purpose">
                      <span className="cell-name">
                        {fund.purpose}
                      </span>
                    </td>

                    <td data-label="Date">
                      <div className="date-cell">
                        <Calendar className="icon-sm icon-amber" />
                        <span>{formatDate(fund.allocated_date)}</span>
                      </div>
                    </td>

                    <td data-label="Notes">
                      <p className="muted line-clamp-1">
                        {fund.description || '—'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
