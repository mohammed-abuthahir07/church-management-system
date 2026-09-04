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
  Clock,
  MapPin,
  Megaphone,
  Activity,
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
import { formatTime } from '../../utils/date';

// =====================================================
// HELPERS
// =====================================================

const getNumber = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') {
      const number = Number(value);

      if (!Number.isNaN(number)) {
        return number;
      }
    }
  }

  return 0;
};

const getArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

/*
 * Axios normally returns:
 *
 * response.data
 *
 * But depending on your controller it may be:
 *
 * response.data
 * response.data.data
 * response.data.prayer_schedules
 * response.data.today
 *
 * These helpers make the page tolerant of those structures.
 */

const getBody = (response) => {
  return response?.data ?? response ?? null;
};

const findArray = (response, keys = []) => {
  const body = getBody(response);

  if (Array.isArray(body)) {
    return body;
  }

  for (const key of keys) {
    if (Array.isArray(body?.[key])) {
      return body[key];
    }

    if (Array.isArray(body?.data?.[key])) {
      return body.data[key];
    }
  }

  if (Array.isArray(body?.data)) {
    return body.data;
  }

  return [];
};

const getCount = (response, keys = []) => {
  const body = getBody(response);

  for (const key of keys) {
    const value = body?.[key];

    if (value !== undefined && value !== null && value !== '') {
      return getNumber(value);
    }

    const nestedValue = body?.data?.[key];

    if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
      return getNumber(nestedValue);
    }
  }

  return 0;
};

const normalizeStatus = (value) => {
  return String(value || '')
    .trim()
    .toUpperCase();
};

// =====================================================
// COMPONENT
// =====================================================

export const SubAdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================
  // MEMBERS
  // =====================================================

  const [memberStats, setMemberStats] = useState({
    total: 0,
    new_month: 0,
    new_year: 0,
  });

  const [genderData, setGenderData] = useState([]);

  // =====================================================
  // PASTORS
  // =====================================================

  const [pastorStats, setPastorStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  // =====================================================
  // DONATIONS
  // =====================================================

  const [donationStats, setDonationStats] = useState({
    month: 0,
    year: 0,
    total: 0,
  });

  const [monthlyDonations, setMonthlyDonations] = useState([]);

  const [purposeDonations, setPurposeDonations] = useState([]);

  const [topDonors, setTopDonors] = useState([]);

  const [currentMonthTopDonors, setCurrentMonthTopDonors] = useState([]);

  // =====================================================
  // EVENTS
  // =====================================================

  const [eventStats, setEventStats] = useState({
    total: 0,
    upcoming: 0,
  });

  const [monthlyEvents, setMonthlyEvents] = useState([]);

  // =====================================================
  // PRAYER
  // =====================================================

  const [prayerStats, setPrayerStats] = useState({
    total: 0,
    today: 0,
  });

  const [todayPrayers, setTodayPrayers] = useState([]);

  // =====================================================
  // ANNOUNCEMENTS
  // =====================================================

  const [announcementStats, setAnnouncementStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [announcements, setAnnouncements] = useState([]);

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        // =================================================
        // MEMBERS
        // =================================================

        subAdminApi.getAnalyticsTotalMembers(),

        subAdminApi.getAnalyticsNewMembersMonth(),

        subAdminApi.getAnalyticsNewMembersYear(),

        subAdminApi.getAnalyticsMemberGender(),

        // =================================================
        // PASTORS
        // =================================================

        subAdminApi.getAnalyticsPastors(),

        subAdminApi.getAnalyticsPastorStatus(),

        // =================================================
        // DONATIONS
        // =================================================

        subAdminApi.getAnalyticsDonationsMonth(),

        subAdminApi.getAnalyticsDonationsYear(),

        subAdminApi.getAnalyticsDonationsTotal(),

        subAdminApi.getAnalyticsDonationsMonthly(),

        subAdminApi.getAnalyticsDonationsPurpose(),

        subAdminApi.getAnalyticsTopDonors(),

        subAdminApi.getAnalyticsTopDonorsMonth(),

        // =================================================
        // EVENTS
        // =================================================

        subAdminApi.getAnalyticsEvents(),

        subAdminApi.getAnalyticsUpcomingEvents(),

        subAdminApi.getAnalyticsEventsMonthly(),

        // =================================================
        // PRAYER
        // =================================================

        subAdminApi.getAnalyticsPrayerSchedule(),

        subAdminApi.getAnalyticsTodayPrayerSchedule(),

        // =================================================
        // ANNOUNCEMENTS
        // =================================================

        subAdminApi.getAnalyticsAnnouncements(),

        subAdminApi.getAnalyticsAnnouncementStatus(),
      ]);

      // =====================================================
      // RESULT INDEXES
      // =====================================================

      const [
        totalMembersRes,
        newMembersMonthRes,
        newMembersYearRes,
        genderRes,

        pastorsRes,
        pastorStatusRes,

        donationMonthRes,
        donationYearRes,
        donationTotalRes,
        donationMonthlyRes,
        donationPurposeRes,
        topDonorsRes,
        currentMonthTopDonorsRes,

        eventsRes,
        upcomingEventsRes,
        eventsMonthlyRes,

        prayerRes,
        todayPrayerRes,

        announcementsRes,
        announcementStatusRes,
      ] = results;

      // =====================================================
      // MEMBERS
      // =====================================================

      setMemberStats({
        total:
          totalMembersRes.status === 'fulfilled'
            ? getCount(totalMembersRes.value, [
                'total_members',
                'total',
                'count',
                'members_count',
              ])
            : 0,

        new_month:
          newMembersMonthRes.status === 'fulfilled'
            ? getCount(newMembersMonthRes.value, [
                'new_members_this_month',
                'new_month',
                'count',
                'total',
              ])
            : 0,

        new_year:
          newMembersYearRes.status === 'fulfilled'
            ? getCount(newMembersYearRes.value, [
                'new_members_this_year',
                'new_year',
                'count',
                'total',
              ])
            : 0,
      });

      // =====================================================
      // MEMBER GENDER
      // =====================================================

      if (genderRes.status === 'fulfilled') {
        const list = findArray(genderRes.value, [
          'gender',
          'genders',
          'members',
          'data',
        ]);

        setGenderData(
          list.map((item) => ({
            name: item.gender || item.name || 'Unknown',

            value: getNumber(
              item.total_members,
              item.count,
              item.total,
              item.value,
              item.members
            ),
          }))
        );
      }

      // =====================================================
      // PASTORS
      // =====================================================

      if (pastorsRes.status === 'fulfilled') {
        setPastorStats((previous) => ({
          ...previous,

          total: getCount(pastorsRes.value, [
            'total_pastors',
            'total',
            'count',
            'pastors_count',
          ]),
        }));
      }

      // =====================================================
      // PASTOR STATUS
      // =====================================================

      if (pastorStatusRes.status === 'fulfilled') {
        const list = findArray(pastorStatusRes.value, [
          'statuses',
          'pastor_status',
          'data',
        ]);

        let active = 0;
        let inactive = 0;

        list.forEach((item) => {
          const status = normalizeStatus(item.status);

          const count = getNumber(
            item.count,
            item.total,
            item.total_pastors,
            item.value
          );

          if (status === 'ACTIVE') {
            active = count;
          }

          if (status === 'INACTIVE') {
            inactive = count;
          }
        });

        setPastorStats((previous) => ({
          ...previous,

          active,

          inactive,
        }));
      }

      // =====================================================
      // DONATION TOTALS
      // =====================================================

      setDonationStats({
        month:
          donationMonthRes.status === 'fulfilled'
            ? getCount(donationMonthRes.value, [
                'donations_this_month',
                'this_month',
                'total_amount',
                'total',
                'amount',
              ])
            : 0,

        year:
          donationYearRes.status === 'fulfilled'
            ? getCount(donationYearRes.value, [
                'donations_this_year',
                'this_year',
                'total_amount',
                'total',
                'amount',
              ])
            : 0,

        total:
          donationTotalRes.status === 'fulfilled'
            ? getCount(donationTotalRes.value, [
                'total_donations',
                'total_amount',
                'total',
                'amount',
              ])
            : 0,
      });

      // =====================================================
      // MONTHLY DONATIONS
      // =====================================================

      if (donationMonthlyRes.status === 'fulfilled') {
        const list = findArray(donationMonthlyRes.value, [
          'monthly',
          'monthly_donations',
          'donations',
          'data',
        ]);

        setMonthlyDonations(list);
      }

      // =====================================================
      // DONATION PURPOSE
      // =====================================================

      if (donationPurposeRes.status === 'fulfilled') {
        const list = findArray(donationPurposeRes.value, [
          'purposes',
          'purpose',
          'donations',
          'data',
        ]);

        setPurposeDonations(
          list.map((item) => ({
            name: item.purpose || item.category || item.name || 'General',

            value: getNumber(
              item.total_amount,
              item.amount,
              item.total,
              item.value
            ),
          }))
        );
      }

      // =====================================================
      // TOP DONORS
      // =====================================================

      if (topDonorsRes.status === 'fulfilled') {
        const list = findArray(topDonorsRes.value, [
          'top_donors',
          'donors',
          'data',
        ]);

        setTopDonors(list);
      }

      // =====================================================
      // CURRENT MONTH TOP DONORS
      // =====================================================

      if (currentMonthTopDonorsRes.status === 'fulfilled') {
        const list = findArray(currentMonthTopDonorsRes.value, [
          'top_donors',
          'donors',
          'data',
        ]);

        setCurrentMonthTopDonors(list);
      }

      // =====================================================
      // EVENTS
      // =====================================================

      setEventStats({
        total:
          eventsRes.status === 'fulfilled'
            ? getCount(eventsRes.value, ['total_events', 'total', 'count'])
            : 0,

        upcoming:
          upcomingEventsRes.status === 'fulfilled'
            ? getCount(upcomingEventsRes.value, [
                'upcoming_events',
                'upcoming',
                'count',
                'total',
              ])
            : 0,
      });

      // =====================================================
      // MONTHLY EVENTS
      // =====================================================

      if (eventsMonthlyRes.status === 'fulfilled') {
        const list = findArray(eventsMonthlyRes.value, [
          'monthly',
          'monthly_events',
          'events',
          'data',
        ]);

        setMonthlyEvents(list);
      }

      // =====================================================
      // PRAYER — ALL WEEKLY SCHEDULES
      // =====================================================

      if (prayerRes.status === 'fulfilled') {
        const allPrayers = findArray(prayerRes.value, [
          'prayer_schedules',
          'prayerSchedules',
          'schedules',
          'prayers',
          'data',
        ]);

        setPrayerStats((previous) => ({
          ...previous,

          total: allPrayers.length,
        }));
      }

      // =====================================================
      // PRAYER — TODAY
      // =====================================================

      if (todayPrayerRes.status === 'fulfilled') {
        const todayList = findArray(todayPrayerRes.value, [
          'today',
          'prayer_schedules',
          'prayerSchedules',
          'schedules',
          'prayers',
          'prayer_schedule',
          'data',
        ]);

        setTodayPrayers(todayList);

        setPrayerStats((previous) => ({
          ...previous,

          today: todayList.length,
        }));
      }

      // =====================================================
      // ANNOUNCEMENTS
      // =====================================================

      if (announcementsRes.status === 'fulfilled') {
        const list = findArray(announcementsRes.value, ['announcements', 'data']);

        setAnnouncements(list);

        setAnnouncementStats((previous) => ({
          ...previous,

          total: list.length,
        }));
      }

      // =====================================================
      // ANNOUNCEMENT STATUS
      // =====================================================

      if (announcementStatusRes.status === 'fulfilled') {
        const list = findArray(announcementStatusRes.value, [
          'statuses',
          'announcement_status',
          'data',
        ]);

        let active = 0;
        let inactive = 0;

        list.forEach((item) => {
          const status = normalizeStatus(item.status);

          const count = getNumber(item.count, item.total, item.value);

          if (status === 'ACTIVE') {
            active = count;
          }

          if (status === 'INACTIVE') {
            inactive = count;
          }
        });

        setAnnouncementStats((previous) => ({
          ...previous,

          active,

          inactive,
        }));
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      console.error("Analytics error response:", err?.response?.data);
      console.error("Analytics error status:", err?.response?.status);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load parish analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <DashboardSkeleton />;
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return <ErrorState message={error} onRetry={fetchAnalytics} />;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page-lg">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title="Parish Growth & Ministry Analytics"
        subtitle="Complete branch analytics for members, pastors, donations, events, Mass schedules and announcements"
        icon={BarChart3}
      />

      {/* =================================================
          TOP STAT CARDS
      ================================================= */}

      <div className="stat-grid">
        {/* MEMBERS */}

        <StatCard
          title="Members"
          value={memberStats.total}
          icon={Users}
          color="gold"
          badges={[
            {
              label: 'This Month',
              value: `+${memberStats.new_month}`,
            },
            {
              label: 'This Year',
              value: `+${memberStats.new_year}`,
            },
          ]}
        />

        {/* DONATIONS */}

        <StatCard
          title="Donations"
          value={donationStats.total}
          isCurrency={true}
          icon={HeartHandshake}
          color="emerald"
          badges={[
            {
              label: 'This Month',
              value: formatIndianCurrency(donationStats.month),
            },
            {
              label: 'This Year',
              value: formatIndianCurrency(donationStats.year),
            },
          ]}
        />

        {/* PASTORS */}

        <StatCard
          title="Leadership"
          value={pastorStats.total}
          icon={Church}
          color="sky"
          badges={[
            {
              label: 'Active',
              value: pastorStats.active,
              color: 'emerald',
            },
            {
              label: 'Inactive',
              value: pastorStats.inactive,
              color: 'navy',
            },
          ]}
        />

        {/* EVENTS */}

        <StatCard
          title="Events"
          value={eventStats.total}
          icon={Calendar}
          color="navy"
          badges={[
            {
              label: 'Upcoming',
              value: eventStats.upcoming,
              color: 'emerald',
            },
          ]}
        />
      </div>

      {/* =================================================
          TODAY'S PRAYER SCHEDULE
      ================================================= */}

      <div className="church-card panel">
        <div className="panel-head">
          <div className="panel-head__left">
            <div className="icon-tile icon-tile--gold">
              <Sparkles className="icon-md" />
            </div>

            <div>
              <h3 className="panel-title font-serif">
                Today's Mass Schedule
              </h3>

              <p className="count-text">
                Active weekly Mass gatherings for today
              </p>
            </div>
          </div>
        </div>

        {todayPrayers.length > 0 ? (
          <div className="feed">
            {todayPrayers.map((prayer, index) => (
              <div
                key={prayer.id || `${prayer.title}-${index}`}
                className="rank-row"
              >
                <div className="rank-left">
                  <span className="rank-badge">
                    <Sparkles className="icon-sm" />
                  </span>

                  <div>
                    <div className="cell-name">
                      {prayer.title || 'Prayer Gathering'}
                    </div>

                    {prayer.description && (
                      <div className="count-text">
                        {prayer.description}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span className="cell-name">
                    <Clock
                      className="icon-sm"
                      style={{
                        display: 'inline',
                        marginRight: '6px',
                      }}
                    />

                    {prayer.start_time
                      ? formatTime(prayer.start_time)
                      : '--:--'}

                    {' - '}

                    {prayer.end_time
                      ? formatTime(prayer.end_time)
                      : '--:--'}
                  </span>

                  {prayer.location && (
                    <span className="count-text">
                      <MapPin
                        className="icon-sm"
                        style={{
                          display: 'inline',
                          marginRight: '5px',
                        }}
                      />

                      {prayer.location}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-empty">
            No prayer gathering is scheduled for today.
          </div>
        )}
      </div>

      {/* =================================================
          DONATION ANALYTICS
      ================================================= */}

      <div className="chart-grid">
        {/* DONATION ANALYTICS */}
      <div className="chart-grid">

        {/* Trajectory Chart */}
        <div className="chart-span-2">
          <ChartCard
            title="Monthly Donation Trajectory"
            subtitle="Giving trends and tithe patterns across months"
            icon={TrendingUp}
            height="h-80"
          >
            {monthlyDonations.length > 0 ? (
              <DonationTrendChart
                data={monthlyDonations}
                xKey="month"
                yKey="total_amount"
              />
            ) : (
              <div className="table-empty">
                No monthly donation data available.
              </div>
            )}
          </ChartCard>
        </div>
      </div>

        {/* GIVING PURPOSE */}

        <div>
          <ChartCard
            title="Giving by Category"
            subtitle="Offerings, building funds, tithes and other purposes"
            icon={PieChart}
            height="h-80"
          >
            {purposeDonations.length > 0 ? (
              <MetricDonutChart data={purposeDonations} isCurrency={true} />
            ) : (
              <div className="table-empty">
                No donation purpose data available.
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* =================================================
          MEMBER + PASTOR ANALYTICS
      ================================================= */}

      <div className="grid-2">
        {/* GENDER */}

        <ChartCard
          title="Congregation Gender Distribution"
          subtitle="Demographic makeup of parish membership"
          icon={Users}
          height="h-72"
        >
          {genderData.length > 0 ? (
            <MetricDonutChart data={genderData} />
          ) : (
            <div className="table-empty">
              No gender records available.
            </div>
          )}
        </ChartCard>

        

        {/* PASTOR STATUS */}

        <div className="church-card panel">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--gold">
                <Church className="icon-md" />
              </div>

              <div>
                <h3 className="panel-title font-serif">
                  Pastoral Leadership
                </h3>

                <p className="count-text">Current pastor status</p>
              </div>
            </div>
          </div>

          <div className="feed">
            <div className="rank-row">
              <div className="rank-left">
                <span className="rank-badge">
                  <Activity className="icon-sm" />
                </span>

                <span className="cell-name">Active Pastors</span>
              </div>

              <span className="cell-amount">{pastorStats.active}</span>
            </div>

            <div className="rank-row">
              <div className="rank-left">
                <span className="rank-badge">
                  <Activity className="icon-sm" />
                </span>

                <span className="cell-name">Inactive Pastors</span>
              </div>

              <span className="cell-amount">{pastorStats.inactive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          TOP DONORS
      ================================================= */}

      <div className="grid-2">
        {/* ALL-TIME TOP DONORS */}

        <div className="church-card panel">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--gold">
                <Trophy className="icon-md" />
              </div>

              <div>
                <h3 className="panel-title font-serif">
                  Highest Contributors
                </h3>

                <p className="count-text">Top parish contributors</p>
              </div>
            </div>
          </div>

          {topDonors.length > 0 ? (
            <div className="feed">
              {topDonors.slice(0, 5).map((donor, index) => (
                <div
                  key={donor.member_id || donor.id || index}
                  className="rank-row"
                >
                  <div className="rank-left">
                    <span className="rank-badge">{index + 1}</span>

                    <span className="cell-name">
                      {donor.member_name ||
                        donor.name ||
                        `Member #${donor.member_id || ''}`}
                    </span>
                  </div>

                  <span className="cell-amount">
                    {formatIndianCurrency(
                      getNumber(
                        donor.total_donated,
                        donor.total_amount,
                        donor.amount
                      )
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-empty">No donor records available.</div>
          )}
        </div>

        {/* CURRENT MONTH TOP DONORS */}

        <div className="church-card panel">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--gold">
                <HeartHandshake className="icon-md" />
              </div>

              <div>
                <h3 className="panel-title font-serif">
                  This Month's Top Donors
                </h3>

                <p className="count-text">
                  Highest contributors this month
                </p>
              </div>
            </div>
          </div>

          {currentMonthTopDonors.length > 0 ? (
            <div className="feed">
              {currentMonthTopDonors.slice(0, 5).map((donor, index) => (
                <div
                  key={donor.member_id || donor.id || index}
                  className="rank-row"
                >
                  <div className="rank-left">
                    <span className="rank-badge">{index + 1}</span>

                    <span className="cell-name">
                      {donor.member_name ||
                        donor.name ||
                        `Member #${donor.member_id || ''}`}
                    </span>
                  </div>

                  <span className="cell-amount">
                    {formatIndianCurrency(
                      getNumber(
                        donor.total_donated,
                        donor.total_amount,
                        donor.amount
                      )
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-empty">
              No donations recorded this month.
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          EVENTS MONTHLY ANALYTICS
      ================================================= */}

      <div className="church-card panel">
        <div className="panel-head">
          <div className="panel-head__left">
            <div className="icon-tile icon-tile--gold">
              <Calendar className="icon-md" />
            </div>

            <div>
              <h3 className="panel-title font-serif">Monthly Events</h3>

              <p className="count-text">Event activity across the year</p>
            </div>
          </div>
        </div>

        {monthlyEvents.length > 0 ? (
          <div className="feed">
            {monthlyEvents.map((event, index) => (
              <div
                key={event.id || event.month || index}
                className="rank-row"
              >
                <div className="rank-left">
                  <span className="rank-badge">
                    <Calendar className="icon-sm" />
                  </span>

                  <span className="cell-name">
                    {event.month_name || event.month || `Month ${index + 1}`}
                  </span>
                </div>

                <span className="cell-amount">
                  {getNumber(
                    event.total_events,
                    event.event_count,
                    event.count,
                    event.total,
                    event.value
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-empty">
            No monthly event data available.
          </div>
        )}
      </div>
    </div>
  );
};