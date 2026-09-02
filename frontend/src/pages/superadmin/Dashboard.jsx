import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { motion } from 'framer-motion';
import {
  Church,
  Users,
  UserCheck,
  HeartHandshake,
  Calendar,
  Sparkles,
  Megaphone,
  Trophy,
  ArrowUpRight,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { useAuth } from '../../context/AuthContext';
import { WelcomeHero } from '../../components/common/WelcomeHero';
import { StatCard } from '../../components/common/StatCard';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { formatIndianCurrency } from '../../utils/currency';
import { formatDate, formatTime } from '../../utils/date';
import { Link } from 'react-router-dom';

export const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard Data States
  const [totalBranches, setTotalBranches] = useState(0);
  const [memberStats, setMemberStats] = useState({ total_members: 0, new_this_month: 0, new_this_year: 0 });
  const [totalPastors, setTotalPastors] = useState(0);
  const [donationStats, setDonationStats] = useState({ this_month: 0, this_year: 0, total: 0, top_donors: [] });
  const [highestMonthBranch, setHighestMonthBranch] = useState(null);
  const [highestYearBranch, setHighestYearBranch] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todayPrayers, setTodayPrayers] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Execute all dashboard queries in parallel
      const [
        branchesRes,
        membersRes,
        pastorsRes,
        donationsRes,
        highestMonthRes,
        highestYearRes,
        eventsRes,
        prayerRes,
        announcementsRes,
        summaryRes,
      ] = await Promise.allSettled([
        superAdminApi.getDashboardTotalBranches(),
        superAdminApi.getDashboardTotalMembers(),
        superAdminApi.getDashboardTotalPastors(),
        superAdminApi.getDashboardDonations(),
        superAdminApi.getDashboardHighestDonationMonth(),
        superAdminApi.getDashboardHighestDonationYear(),
        superAdminApi.getDashboardEvents(),
        superAdminApi.getDashboardPrayer(),
        superAdminApi.getDashboardAnnouncements(),
        superAdminApi.getDashboardBranchSummary(),
      ]);

      if (branchesRes.status === 'fulfilled' && branchesRes.value?.data) {
        setTotalBranches(branchesRes.value.data.total_branches || 0);
      }
      if (membersRes.status === 'fulfilled' && membersRes.value?.data) {
        setMemberStats(membersRes.value.data);
      }
      if (pastorsRes.status === 'fulfilled' && pastorsRes.value?.data) {
        setTotalPastors(pastorsRes.value.data.total_pastors || 0);
      }
      if (donationsRes.status === 'fulfilled' && donationsRes.value?.data) {
        setDonationStats(donationsRes.value.data);
      }
      if (highestMonthRes.status === 'fulfilled' && highestMonthRes.value?.data) {
        setHighestMonthBranch(highestMonthRes.value.data);
      }
      if (highestYearRes.status === 'fulfilled' && highestYearRes.value?.data) {
        setHighestYearBranch(highestYearRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data?.events) {
        setUpcomingEvents(eventsRes.value.data.events);
      }
      if (prayerRes.status === 'fulfilled' && prayerRes.value?.data?.prayer_schedule) {
        setTodayPrayers(prayerRes.value.data.prayer_schedule);
      }
      if (announcementsRes.status === 'fulfilled' && announcementsRes.value?.data?.announcements) {
        setRecentAnnouncements(announcementsRes.value.data.announcements);
      }
      if (summaryRes.status === 'fulfilled' && summaryRes.value?.branches) {
        setBranchSummary(summaryRes.value.branches);
      }
    } catch (err) {
      console.error('Failed to load SuperAdmin dashboard', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="page-lg">
      {/* 1. Welcome Hero Banner with scripture and church aura */}
      <WelcomeHero
        userName={user?.name || 'Super Admin'}
        role="SUPER_ADMIN"
        scripture='"He who began a good work in you will carry it on to completion until the day of Christ Jesus." — Philippians 1:6'
      />

      {/* 2. Top Stats Grid */}
      <div className="stat-grid">
        <StatCard
          title="Total Branches"
          value={totalBranches}
          icon={Church}
          color="navy"
          subtitle="Registered Diocese Branches"
        />

        <StatCard
          title="Total Members"
          value={memberStats.total_members}
          icon={Users}
          color="gold"
          badges={[
            { label: 'This Month', value: `+${memberStats.new_this_month || 0}`, color: 'emerald' },
            { label: 'This Year', value: `+${memberStats.new_this_year || 0}`, color: 'gold' },
          ]}
        />

        <StatCard
          title="Pastors / Leaders"
          value={totalPastors}
          icon={UserCheck}
          color="sky"
          subtitle="Ordained Ministers & Deacons"
        />

        <StatCard
          title="Total Donations"
          value={donationStats.total}
          isCurrency={true}
          icon={HeartHandshake}
          color="emerald"
          badges={[
            { label: 'Month', value: formatIndianCurrency(donationStats.this_month), color: 'emerald' },
            { label: 'Year', value: formatIndianCurrency(donationStats.this_year), color: 'gold' },
          ]}
        />
      </div>

      {/* 3. Highest Donation Branches (Month & Year) */}
      <div className="grid-2">
        {/* Highest Month */}
        <div className="church-card highlight-card highlight-card--gold">
          <div className="highlight-head">
            <div className="highlight-left">
              <div className="icon-tile icon-tile--gold">
                <Trophy className="icon-lg icon-gold" />
              </div>
              <div>
                <p className="kicker kicker--gold font-cinzel">
                  Top Giving Branch
                </p>
                <h4 className="card-h">Highest This Month</h4>
              </div>
            </div>
            <span className="badge-gold">This Month</span>
          </div>

          {highestMonthBranch ? (
            <div className="highlight-foot">
              <div>
                <p className="branch-name font-serif">
                  {highestMonthBranch.branch_name}
                </p>
                <p className="count-text">Branch #{highestMonthBranch.branch_id}</p>
              </div>
              <p className="amount-xl">
                {formatIndianCurrency(highestMonthBranch.total_donation)}
              </p>
            </div>
          ) : (
            <p className="muted-empty">No donation records for this month yet.</p>
          )}
        </div>

        {/* Highest Year */}
        <div className="church-card highlight-card highlight-card--navy">
          <div className="highlight-head">
            <div className="highlight-left">
              <div className="icon-tile icon-tile--navy">
                <Trophy className="icon-lg icon-navy" />
              </div>
              <div>
                <p className="kicker kicker--navy font-cinzel">
                  Top Giving Branch
                </p>
                <h4 className="card-h">Highest This Year</h4>
              </div>
            </div>
            <span className="badge-active">This Year</span>
          </div>

          {highestYearBranch ? (
            <div className="highlight-foot highlight-foot--navy">
              <div>
                <p className="branch-name font-serif">
                  {highestYearBranch.branch_name}
                </p>
                <p className="count-text">Branch #{highestYearBranch.branch_id}</p>
              </div>
              <p className="amount-xl amount-xl--navy">
                {formatIndianCurrency(highestYearBranch.total_donation)}
              </p>
            </div>
          ) : (
            <p className="muted-empty">No donation records for this year yet.</p>
          )}
        </div>
      </div>

      {/* 4. Two Column Section: Today's Prayers & Upcoming Events */}
      <div className="grid-2">
        {/* Today's Prayers across all branches */}
        <div className="church-card panel panel--tight prayer-surface">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--sm icon-tile--gold">
                <Sparkles className="icon-md" />
              </div>
              <div>
                <h3 className="panel-title font-serif">
                  Today's Prayers (All Branches)
                </h3>
                <p className="count-text">Uniting the church in continuous worship</p>
              </div>
            </div>
            <span className="chip chip--gold">
              {todayPrayers.length} Today
            </span>
          </div>

          {todayPrayers.length > 0 ? (
            <div className="feed">
              {todayPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className="feed-item feed-item--gold"
                >
                  <div className="feed-item__top">
                    <span className="feed-title font-serif">
                      {prayer.title}
                    </span>
                    <span className="chip-mini chip-mini--navy">
                      {prayer.branch_name}
                    </span>
                  </div>

                  <div className="meta-row">
                    <span>
                      <Clock className="icon-sm icon-amber" />
                      {formatTime(prayer.start_time)} - {formatTime(prayer.end_time)}
                    </span>
                    {prayer.location && (
                      <span>
                        <MapPin className="icon-sm icon-muted" />
                        {prayer.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="prayer"
              title="No prayer gatherings today"
              description="No active prayer schedules configured for today across branches."
            />
          )}
        </div>

        {/* Upcoming Events across all branches */}
        <div className="church-card panel">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--sm icon-tile--navy">
                <Calendar className="icon-md" />
              </div>
              <div>
                <h3 className="panel-title font-serif">
                  Upcoming Church Events
                </h3>
                <p className="count-text">Sunday services, conferences & crusades</p>
              </div>
            </div>
            <span className="chip chip--navy">
              {upcomingEvents.length} Events
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="feed">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="feed-item feed-item--slate"
                >
                  <div className="feed-item__top">
                    <h4 className="feed-title font-serif">
                      {event.title}
                    </h4>
                    <span className="chip-mini chip-mini--gold">
                      {event.branch_name}
                    </span>
                  </div>

                  <div className="meta-row">
                    <span>
                      <Calendar className="icon-sm icon-amber" />
                      {formatDate(event.event_date)}
                    </span>
                    {event.start_time && (
                      <span>
                        <Clock className="icon-sm icon-muted" />
                        {formatTime(event.start_time)}
                      </span>
                    )}
                    {event.location && (
                      <span>
                        <MapPin className="icon-sm icon-muted" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="events"
              title="No upcoming events"
              description="Upcoming church events from all regional branches will be displayed here."
            />
          )}
        </div>
      </div>

      {/* 5. Branch Summary Complete Overview Table */}
      <div className="church-card table-panel">
        <div className="table-bar">
          <div>
            <h3 className="panel-title font-serif">
              Branch-Wise Complete Summary
            </h3>
            <p className="count-text">
              Live statistics comparison across all registered church branches
            </p>
          </div>
          <Link
            to="/superadmin/branches"
            className="btn-navy"
          >
            <span>Manage Branches</span>
            <ArrowUpRight className="icon-sm" />
          </Link>
        </div>

        {branchSummary.length > 0 ? (
          <div className="table-scroll">
            <table className="church-table table-to-cards">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Members</th>
                  <th>Pastors</th>
                  <th>Total Donations</th>
                  <th>Upcoming Events</th>
                  <th>Active Prayers</th>
                </tr>
              </thead>
              <tbody>
                {branchSummary.map((b) => (
                  <tr key={b.branch_id}>
                    <td data-label="Branch" className="cell-name font-serif">
                      {b.branch_name}
                    </td>
                    <td data-label="Members">{new Intl.NumberFormat('en-IN').format(b.members)}</td>
                    <td data-label="Pastors">{b.pastors}</td>
                    <td data-label="Donations" className="cell-amount">
                      {formatIndianCurrency(b.donations)}
                    </td>
                    <td data-label="Events">{b.events}</td>
                    <td data-label="Prayers">{b.prayer_schedules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-empty">
            No branch summary records found.
          </div>
        )}
      </div>

      {/* 6. Recent Announcements Banner */}
      {recentAnnouncements.length > 0 && (
        <div className="church-card announce-banner">
          <div className="announce-head">
            <Megaphone className="icon-md icon-gold" />
            <h4 className="font-cinzel">
              Recent Announcements Across Branches
            </h4>
          </div>
          <div className="announce-grid">
            {recentAnnouncements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="announce-card"
              >
                <div className="announce-card__top">
                  <span className="announce-title font-serif">{a.title}</span>
                  <span className="chip-mini chip-mini--gold">
                    {a.branch_name}
                  </span>
                </div>
                <p className="muted line-clamp-2">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
