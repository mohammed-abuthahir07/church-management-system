import React, { useEffect, useState } from 'react';
import './Analytics.css';
import {
  BarChart3,
  Users,
  Church,
  HeartHandshake,
  Calendar,
  Sparkles,
  PieChart,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { ChartCard } from '../../components/charts/ChartCard';
import { MetricDonutChart } from '../../components/charts/MetricDonutChart';
import { DonationTrendChart } from '../../components/charts/DonationTrendChart';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatIndianCurrency } from '../../utils/currency';

export const SubAdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SubAdmin Analytics States
  const [memberStats, setMemberStats] = useState({ total: 0, new_month: 0, new_year: 0 });
  const [genderData, setGenderData] = useState([]);
  const [pastorStats, setPastorStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [donationStats, setDonationStats] = useState({ month: 0, year: 0, total: 0 });
  const [monthlyDonations, setMonthlyDonations] = useState([]);
  const [purposeDonations, setPurposeDonations] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [eventStats, setEventStats] = useState({ total: 0, upcoming: 0 });
  const [prayerStats, setPrayerStats] = useState({ total: 0, today: 0 });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        totMemRes,
        newMemMRes,
        newMemYRes,
        genderRes,
        pastorRes,
        pastorStatusRes,
        donMonthRes,
        donYearRes,
        donTotalRes,
        donMonthlyRes,
        donPurposeRes,
        topDonorsRes,
        eventsRes,
        upcomingEventsRes,
        prayerRes,
        prayerTodayRes,
      ] = await Promise.allSettled([
        subAdminApi.getAnalyticsTotalMembers(),
        subAdminApi.getAnalyticsNewMembersMonth(),
        subAdminApi.getAnalyticsNewMembersYear(),
        subAdminApi.getAnalyticsMemberGender(),
        subAdminApi.getAnalyticsPastors(),
        subAdminApi.getAnalyticsPastorStatus(),
        subAdminApi.getAnalyticsDonationsMonth(),
        subAdminApi.getAnalyticsDonationsYear(),
        subAdminApi.getAnalyticsDonationsTotal(),
        subAdminApi.getAnalyticsDonationsMonthly(),
        subAdminApi.getAnalyticsDonationsPurpose(),
        subAdminApi.getAnalyticsTopDonors(),
        subAdminApi.getAnalyticsEvents(),
        subAdminApi.getAnalyticsUpcomingEvents(),
        subAdminApi.getAnalyticsPrayerSchedule(),
        subAdminApi.getAnalyticsTodayPrayerSchedule(),
      ]);

      // Members
      setMemberStats({
        total: totMemRes.status === 'fulfilled' ? totMemRes.value?.data?.total_members || totMemRes.value?.total || 0 : 0,
        new_month: newMemMRes.status === 'fulfilled' ? newMemMRes.value?.data?.new_members_this_month || newMemMRes.value?.count || 0 : 0,
        new_year: newMemYRes.status === 'fulfilled' ? newMemYRes.value?.data?.new_members_this_year || newMemYRes.value?.count || 0 : 0,
      });

      // Gender
      if (genderRes.status === 'fulfilled' && genderRes.value?.data) {
        const gList = Array.isArray(genderRes.value.data) ? genderRes.value.data : [];
        setGenderData(
          gList.map((g) => ({
            name: g.gender || 'Unknown',
            value: Number(g.total_members || g.count || 0),
          }))
        );
      }

      // Pastors
      if (pastorRes.status === 'fulfilled') {
        setPastorStats((prev) => ({
          ...prev,
          total: pastorRes.value?.data?.total_pastors || pastorRes.value?.count || 0,
        }));
      }
      if (pastorStatusRes.status === 'fulfilled' && pastorStatusRes.value?.data) {
        const sList = Array.isArray(pastorStatusRes.value.data) ? pastorStatusRes.value.data : [];
        const active = sList.find((s) => s.status === 'ACTIVE')?.count || 0;
        const inactive = sList.find((s) => s.status === 'INACTIVE')?.count || 0;
        setPastorStats((prev) => ({ ...prev, active, inactive }));
      }

      // Donations
      setDonationStats({
        month: donMonthRes.status === 'fulfilled' ? donMonthRes.value?.data?.donations_this_month || donMonthRes.value?.total || 0 : 0,
        year: donYearRes.status === 'fulfilled' ? donYearRes.value?.data?.donations_this_year || donYearRes.value?.total || 0 : 0,
        total: donTotalRes.status === 'fulfilled' ? donTotalRes.value?.data?.total_donations || donTotalRes.value?.total || 0 : 0,
      });

      // Monthly Trend
      if (donMonthlyRes.status === 'fulfilled' && donMonthlyRes.value?.data) {
        setMonthlyDonations(
          Array.isArray(donMonthlyRes.value.data) ? donMonthlyRes.value.data : []
        );
      }

      // Purpose
      if (donPurposeRes.status === 'fulfilled' && donPurposeRes.value?.data) {
        const pList = Array.isArray(donPurposeRes.value.data) ? donPurposeRes.value.data : [];
        setPurposeDonations(
          pList.map((p) => ({
            name: p.purpose || 'General',
            value: Number(p.total_amount || p.amount || 0),
          }))
        );
      }

      // Top Donors
      if (topDonorsRes.status === 'fulfilled' && topDonorsRes.value?.data) {
        setTopDonors(
          Array.isArray(topDonorsRes.value.data) ? topDonorsRes.value.data : []
        );
      }

      // Events
      setEventStats({
        total: eventsRes.status === 'fulfilled' ? eventsRes.value?.data?.total_events || eventsRes.value?.count || 0 : 0,
        upcoming: upcomingEventsRes.status === 'fulfilled' ? upcomingEventsRes.value?.data?.upcoming_events || upcomingEventsRes.value?.count || 0 : 0,
      });

      // Prayer
      setPrayerStats({
        total: prayerRes.status === 'fulfilled' ? prayerRes.value?.data?.total_prayer_schedules || prayerRes.value?.count || 0 : 0,
        today: prayerTodayRes.status === 'fulfilled' ? prayerTodayRes.value?.data?.todays_prayers || prayerTodayRes.value?.count || 0 : 0,
      });
    } catch (err) {
      setError('Failed to load parish analytics.');
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

  return (
    <div className="page-lg">
      <PageHeader
        title="Parish Growth & Ministry Analytics"
        subtitle="Detailed metrics on congregation growth, tithes & offerings, and pastoral leadership"
        icon={BarChart3}
      />

      {/* Top Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Congregation Members"
          value={memberStats.total}
          icon={Users}
          color="gold"
          badges={[
            { label: 'This Month', value: `+${memberStats.new_month}` },
            { label: 'This Year', value: `+${memberStats.new_year}` },
          ]}
        />

        <StatCard
          title="Parish Donations"
          value={donationStats.total}
          isCurrency={true}
          icon={HeartHandshake}
          color="emerald"
          badges={[
            { label: 'This Month', value: formatIndianCurrency(donationStats.month) },
            { label: 'This Year', value: formatIndianCurrency(donationStats.year) },
          ]}
        />

        <StatCard
          title="Pastoral Leadership"
          value={pastorStats.total}
          icon={Church}
          color="sky"
          badges={[
            { label: 'Active', value: pastorStats.active, color: 'emerald' },
            { label: 'Inactive', value: pastorStats.inactive, color: 'navy' },
          ]}
        />

        <StatCard
          title="Parish Events"
          value={eventStats.total}
          icon={Calendar}
          color="navy"
          badges={[
            { label: 'Upcoming', value: eventStats.upcoming, color: 'emerald' },
          ]}
        />
      </div>

      {/* Primary Analytics Section: Monthly Donation Trend & Purpose Donut */}
      <div className="chart-grid">
        <div className="chart-span-2">
          <ChartCard
            title="Monthly Donation Trajectory"
            subtitle="Giving trends and tithe patterns across months"
            icon={TrendingUp}
            height="h-80"
          >
            <DonationTrendChart
              data={monthlyDonations}
              xKey="month"
              yKey="total_amount"
            />
          </ChartCard>
        </div>

        {/* Giving by Purpose */}
        <div>
          <ChartCard
            title="Giving by Category"
            subtitle="Offerings, building funds & tithes"
            icon={PieChart}
            height="h-80"
          >
            <MetricDonutChart data={purposeDonations} isCurrency={true} />
          </ChartCard>
        </div>
      </div>

      {/* Secondary Section: Gender Demographics & Top Donors List */}
      <div className="grid-2">
        {/* Gender Demographics */}
        <ChartCard
          title="Congregation Gender Distribution"
          subtitle="Demographic makeup of parish membership"
          icon={Users}
          height="h-72"
        >
          <MetricDonutChart data={genderData} />
        </ChartCard>

        {/* Top Donors Table */}
        <div className="church-card panel">
          <div>
            <div className="panel-head">
              <div className="panel-head__left">
                <div className="icon-tile icon-tile--gold">
                  <Trophy className="icon-md" />
                </div>
                <div>
                  <h3 className="panel-title font-serif">
                    Highest Contributors
                  </h3>
                  <p className="count-text">Parish generous givers</p>
                </div>
              </div>
            </div>

            {topDonors.length > 0 ? (
              <div className="feed">
                {topDonors.slice(0, 5).map((d, idx) => (
                  <div
                    key={idx}
                    className="rank-row"
                  >
                    <div className="rank-left">
                      <span className="rank-badge">
                        {idx + 1}
                      </span>
                      <span className="cell-name">
                        {d.member_name || `Member #${d.member_id}`}
                      </span>
                    </div>
                    <span className="cell-amount">
                      {formatIndianCurrency(d.total_donated || d.total_amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-empty">
                No donor records available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
