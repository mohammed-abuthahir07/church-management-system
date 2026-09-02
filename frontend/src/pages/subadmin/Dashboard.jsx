import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import {
  Users,
  Church,
  HeartHandshake,
  Calendar,
  Sparkles,
  Megaphone,
  Clock,
  MapPin,
  Trophy,
  Award,
} from 'lucide-react';
import { subAdminApi } from '../../api/subAdminApi';
import { useAuth } from '../../context/AuthContext';
import { WelcomeHero } from '../../components/common/WelcomeHero';
import { StatCard } from '../../components/common/StatCard';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { formatIndianCurrency } from '../../utils/currency';
import { formatDate, formatTime } from '../../utils/date';

export const SubAdminDashboard = () => {
  const { user, branchName } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SubAdmin Dashboard Data
  const [memberData, setMemberData] = useState({ total_members: 0, new_this_month: 0, new_this_year: 0 });
  const [pastorData, setPastorData] = useState({ total_pastors: 0, active_pastors: 0, inactive_pastors: 0 });
  const [donationData, setDonationData] = useState({ this_month: 0, this_year: 0, total: 0, top_donor: null });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todayPrayers, setTodayPrayers] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [fundSummary, setFundSummary] = useState({ this_month: 0, this_year: 0, total: 0 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        memberRes,
        pastorRes,
        donationRes,
        eventRes,
        prayerRes,
        announcementRes,
        fundRes,
      ] = await Promise.allSettled([
        subAdminApi.getMemberDashboard(),
        subAdminApi.getPastorDashboard(),
        subAdminApi.getDonationDashboard(),
        subAdminApi.getEventDashboard(),
        subAdminApi.getPrayerDashboard(),
        subAdminApi.getAnnouncementDashboard(),
        subAdminApi.getFundSummary(),
      ]);

      if (memberRes.status === 'fulfilled' && memberRes.value?.member) {
        setMemberData(memberRes.value.member);
      }
      if (pastorRes.status === 'fulfilled' && pastorRes.value?.pastor) {
        setPastorData(pastorRes.value.pastor);
      }
      if (donationRes.status === 'fulfilled' && donationRes.value?.donation) {
        setDonationData(donationRes.value.donation);
      }
      if (eventRes.status === 'fulfilled' && eventRes.value?.events?.upcoming) {
        setUpcomingEvents(eventRes.value.events.upcoming);
      }
      if (prayerRes.status === 'fulfilled' && prayerRes.value?.prayer_schedule?.today) {
        setTodayPrayers(prayerRes.value.prayer_schedule.today);
      }
      if (announcementRes.status === 'fulfilled' && announcementRes.value?.announcements?.recent) {
        setRecentAnnouncements(announcementRes.value.announcements.recent);
      }
      if (fundRes.status === 'fulfilled' && fundRes.value?.data) {
        setFundSummary(fundRes.value.data);
      }
    } catch (err) {
      setError('Failed to load parish dashboard');
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
      {/* 1. Welcome Hero with dynamic branch name */}
      <WelcomeHero
        userName={user?.name || 'Pastor / Admin'}
        role="SUB_ADMIN"
        branchName={branchName || user?.branch_name}
        scripture='"I can do all things through Christ who strengthens me." — Philippians 4:13'
      />

      {/* 2. Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          title="Parish Members"
          value={memberData.total_members}
          icon={Users}
          color="gold"
          badges={[
            { label: 'This Month', value: `+${memberData.new_this_month || 0}`, color: 'emerald' },
            { label: 'This Year', value: `+${memberData.new_this_year || 0}`, color: 'gold' },
          ]}
        />

        <StatCard
          title="Pastors / Leaders"
          value={pastorData.total_pastors}
          icon={Church}
          color="sky"
          badges={[
            { label: 'Active', value: pastorData.active_pastors || 0, color: 'emerald' },
            { label: 'Inactive', value: pastorData.inactive_pastors || 0, color: 'navy' },
          ]}
        />

        <StatCard
          title="Parish Donations"
          value={donationData.total}
          isCurrency={true}
          icon={HeartHandshake}
          color="emerald"
          badges={[
            { label: 'Month', value: formatIndianCurrency(donationData.this_month), color: 'emerald' },
            { label: 'Year', value: formatIndianCurrency(donationData.this_year), color: 'gold' },
          ]}
        />

        <StatCard
          title="Funds Received"
          value={fundSummary.total}
          isCurrency={true}
          icon={HeartHandshake}
          color="navy"
          badges={[
            { label: 'Month', value: formatIndianCurrency(fundSummary.this_month), color: 'emerald' },
            { label: 'Year', value: formatIndianCurrency(fundSummary.this_year), color: 'gold' },
          ]}
        />
      </div>

      {/* 3. Top Donor Highlight Card */}
      {donationData.top_donor && (
        <div className="church-card top-donor donation-surface">
          <div className="top-donor__left">
            <div className="icon-tile icon-tile--lg icon-tile--gold">
              <Trophy className="icon-xl icon-gold" />
            </div>
            <div>
              <p className="kicker kicker--gold font-cinzel">
                Generous Steward Recognition
              </p>
              <h4 className="panel-title font-serif">
                {donationData.top_donor.member_name || 'Anonymous Donor'}
              </h4>
              <p className="count-text">Highest parish contributor this season</p>
            </div>
          </div>

          <div className="top-donor__amount">
            <span className="top-donor__label">Total Donated</span>
            <span className="amount-xl">
              {formatIndianCurrency(donationData.top_donor.total_donated)}
            </span>
          </div>
        </div>
      )}

      {/* 4. Two Column Section: Today's Prayer Schedules & Upcoming Events */}
      <div className="grid-2">
        {/* Today's Prayer Schedule */}
        <div className="church-card panel panel--tight prayer-surface">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--sm icon-tile--gold">
                <Sparkles className="icon-md" />
              </div>
              <div>
                <h3 className="panel-title font-serif">
                  Today's Prayer Schedule
                </h3>
                <p className="count-text">Parish prayer vigils and morning services</p>
              </div>
            </div>
            <span className="chip chip--gold">
              {todayPrayers.length} Scheduled
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
                    <h4 className="feed-title font-serif">
                      {prayer.title}
                    </h4>
                    {prayer.pastor_name && (
                      <span className="chip-mini chip-mini--gold">
                        {prayer.pastor_name}
                      </span>
                    )}
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

                  {prayer.description && (
                    <p className="muted">{prayer.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="prayer"
              title="No prayer gatherings today"
              description="Create a prayer schedule to unite the local community."
            />
          )}
        </div>

        {/* Upcoming Events */}
        <div className="church-card panel">
          <div className="panel-head">
            <div className="panel-head__left">
              <div className="icon-tile icon-tile--sm icon-tile--navy">
                <Calendar className="icon-md" />
              </div>
              <div>
                <h3 className="panel-title font-serif">
                  Upcoming Parish Events
                </h3>
                <p className="count-text">Services, youth meetings & outreach</p>
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
                  <h4 className="feed-title font-serif">
                    {event.title}
                  </h4>

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

                  {event.description && (
                    <p className="muted">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="events"
              title="No upcoming events"
              description="Schedule Sunday worship or parish fellowships."
            />
          )}
        </div>
      </div>

      {/* 5. Branch Announcements Section */}
      {recentAnnouncements.length > 0 && (
        <div className="church-card announce-banner">
          <div className="announce-head">
            <Megaphone className="icon-md icon-gold" />
            <h4 className="font-cinzel">
              Recent Parish Announcements
            </h4>
          </div>
          <div className="announce-grid">
            {recentAnnouncements.map((a) => (
              <div key={a.id} className="announce-card">
                <span className="announce-title font-serif">
                  {a.title}
                </span>
                <p className="muted">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
