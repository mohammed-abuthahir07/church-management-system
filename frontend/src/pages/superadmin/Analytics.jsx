import React, { useEffect, useState } from 'react';
import './Analytics.css';
import {
  BarChart3,
  Church,
  Users,
  UserCheck,
  HeartHandshake,
  Calendar,
  Sparkles,
  Bell,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { superAdminApi } from '../../api/superAdminApi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { ChartCard } from '../../components/charts/ChartCard';
import { BranchBarChart } from '../../components/charts/BranchBarChart';
import { MetricDonutChart } from '../../components/charts/MetricDonutChart';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatIndianCurrency } from '../../utils/currency';

export const SuperAdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Analytics states
  const [branchData, setBranchData] = useState([]);
  const [memberData, setMemberData] = useState({ total_members: 0, by_branch: [] });
  const [pastorData, setPastorData] = useState({ total_pastors: 0, by_branch: [] });
  const [donationData, setDonationData] = useState({
    donations_this_month: 0,
    donations_this_year: 0,
    total_donations: 0,
    by_branch: [],
    this_month_by_branch: [],
  });
  const [fundData, setFundData] = useState({ total_allocated: 0, by_branch: [] });
  const [eventData, setEventData] = useState({ total_events: 0, upcoming_events: 0, by_branch: [] });
  const [prayerData, setPrayerData] = useState({ total_prayer_schedules: 0, todays_prayers: 0, by_branch: [] });
  const [notifData, setNotifData] = useState({
    total_notifications: 0,
    all_branch_notifications: 0,
    branch_specific_notifications: 0,
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        branchesRes,
        membersRes,
        pastorsRes,
        donationsRes,
        fundsRes,
        eventsRes,
        prayerRes,
        notifRes,
      ] = await Promise.allSettled([
        superAdminApi.getBranchAnalytics(),
        superAdminApi.getMemberAnalytics(),
        superAdminApi.getPastorAnalytics(),
        superAdminApi.getDonationAnalytics(),
        superAdminApi.getFundAnalytics(),
        superAdminApi.getEventAnalytics(),
        superAdminApi.getPrayerAnalytics(),
        superAdminApi.getNotificationAnalytics(),
      ]);

      if (branchesRes.status === 'fulfilled' && branchesRes.value?.data) {
        setBranchData(branchesRes.value.data);
      }
      if (membersRes.status === 'fulfilled' && membersRes.value?.data) {
        setMemberData(membersRes.value.data);
      }
      if (pastorsRes.status === 'fulfilled' && pastorsRes.value?.data) {
        setPastorData(pastorsRes.value.data);
      }
      if (donationsRes.status === 'fulfilled' && donationsRes.value?.data) {
        setDonationData(donationsRes.value.data);
      }
      if (fundsRes.status === 'fulfilled' && fundsRes.value?.data) {
        setFundData(fundsRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
        setEventData(eventsRes.value.data);
      }
      if (prayerRes.status === 'fulfilled' && prayerRes.value?.data) {
        setPrayerData(prayerRes.value.data);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value?.data) {
        setNotifData(notifRes.value.data);
      }
    } catch (err) {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  // Prep donut chart data for Member Distribution
  const memberDonutData = (memberData.by_branch || []).map((b) => ({
    name: b.branch_name,
    value: b.total_members,
  }));

  // Prep donut chart data for Fund Allocations
  const fundDonutData = (fundData.by_branch || []).map((b) => ({
    name: b.branch_name,
    value: b.total_allocated,
  }));

  // Prep donut chart data for Notifications
  const notifDonutData = [
    { name: 'All Branches', value: notifData.all_branch_notifications || 0 },
    { name: 'Branch Specific', value: notifData.branch_specific_notifications || 0 },
  ];

  return (
    <div className="page-lg">
      <PageHeader
        title="Diocesan Analytics  Growth"
        subtitle="Visual insights into membership expansion, financial stewardship, and ministry across all branches"
        icon={BarChart3}
      />

      {/* Top Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Total Membership"
          value={memberData.total_members}
          icon={Users}
          color="gold"
          badges={[
            { label: 'New This Month', value: `+${memberData.new_members_this_month || 0}` },
            { label: 'New This Year', value: `+${memberData.new_members_this_year || 0}` },
          ]}
        />

        <StatCard
          title="Total Donations"
          value={donationData.total_donations}
          isCurrency={true}
          icon={HeartHandshake}
          color="emerald"
          badges={[
            { label: 'This Month', value: formatIndianCurrency(donationData.donations_this_month) },
            { label: 'This Year', value: formatIndianCurrency(donationData.donations_this_year) },
          ]}
        />

        <StatCard
          title="Allocated Funds"
          value={fundData.total_allocated}
          isCurrency={true}
          icon={TrendingUp}
          color="navy"
          subtitle="Transferred to regional parishes"
        />

        <StatCard
          title="Total Pastors"
          value={pastorData.total_pastors}
          icon={UserCheck}
          color="sky"
          subtitle="Active Church Leadership"
        />
      </div>

      {/* Primary Chart: Branch Comparison (Members & Pastors) */}
      <div className="chart-grid">
        <div className="chart-span-2">
          <ChartCard
            title="Branch Overview: Members & Pastors"
            subtitle="Congregation size and ordained leadership by branch"
            icon={Church}
            height="h-80"
          >
            <BranchBarChart
              data={branchData}
              xKey="branch_name"
              bars={[
                { key: 'total_members', name: 'Members', color: '#1B3573' },
                { key: 'total_pastors', name: 'Pastors', color: '#D4AF37' },
              ]}
            />
          </ChartCard>
        </div>

        {/* Member Distribution Donut */}
        <div>
          <ChartCard
            title="Member Distribution"
            subtitle="Diocesan membership breakdown by branch"
            icon={PieChart}
            height="h-80"
          >
            <MetricDonutChart data={memberDonutData} />
          </ChartCard>
        </div>
      </div>

      {/* Secondary Chart: Donation Comparison Across Branches */}
      <div className="chart-grid">
        <div className="chart-span-2">
          <ChartCard
            title="Donations by Branch"
            subtitle="Total offerings and tithes received across regions"
            icon={HeartHandshake}
            height="h-80"
          >
            <BranchBarChart
              data={donationData.by_branch || []}
              xKey="branch_name"
              bars={[
                { key: 'total_donations', name: 'Total Donations', color: '#059669' },
              ]}
              isCurrency={true}
            />
          </ChartCard>
        </div>

        {/* Fund Allocation Donut */}
        <div>
          <ChartCard
            title="Fund Allocations"
            subtitle="Diocese funds shared with branches"
            icon={TrendingUp}
            height="h-80"
          >
            <MetricDonutChart data={fundDonutData} isCurrency={true} />
          </ChartCard>
        </div>
      </div>

      {/* Tertiary Row: Events, Prayer Schedules, and Notifications */}
      <div className="grid-3">
        {/* Events Breakdown */}
        <ChartCard
          title="Church Events by Branch"
          subtitle={`Total: ${eventData.total_events} | Upcoming: ${eventData.upcoming_events}`}
          icon={Calendar}
          height="h-64"
        >
          <BranchBarChart
            data={eventData.by_branch || []}
            xKey="branch_name"
            bars={[{ key: 'total_events', name: 'Events', color: '#0284C7' }]}
          />
        </ChartCard>

        {/* Prayer Schedules Breakdown */}
        

        {/* Notification Distribution */}
        <ChartCard
          title="Broadcast Channels"
          subtitle={`Total Broadcasts: ${notifData.total_notifications}`}
          icon={Bell}
          height="h-64"
        >
          <MetricDonutChart data={notifDonutData} />
        </ChartCard>
      </div>
    </div>
  );
};
