import apiClient from './apiClient';

export const subAdminApi = {
  // Auth
  login: async (credentials) => {
    const response = await apiClient.post('/subadmin/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/subadmin/auth/profile');
    return response.data;
  },

  // Members
  getAllMembers: async () => {
    const response = await apiClient.get('/subadmin/members');
    return response.data;
  },

  getMemberById: async (id) => {
    const response = await apiClient.get(`/subadmin/members/${id}`);
    return response.data;
  },

  createMember: async (memberData) => {
    const response = await apiClient.post('/subadmin/members', memberData);
    return response.data;
  },

  updateMember: async (id, memberData) => {
    const response = await apiClient.put(`/subadmin/members/${id}`, memberData);
    return response.data;
  },

  deleteMember: async (id) => {
    const response = await apiClient.delete(`/subadmin/members/${id}`);
    return response.data;
  },

  recordMemberPayment: async (memberId, paymentData) => {
    const response = await apiClient.post(`/subadmin/members/${memberId}/payments`, paymentData);
    return response.data;
  },

  getMemberPayments: async (memberId) => {
    const response = await apiClient.get(`/subadmin/members/${memberId}/payments`);
    return response.data;
  },

  // Pastors / Leaders
  getAllPastors: async () => {
    const response = await apiClient.get('/subadmin/pastors');
    return response.data;
  },

  getPastorById: async (id) => {
    const response = await apiClient.get(`/subadmin/pastors/${id}`);
    return response.data;
  },

  createPastor: async (pastorData) => {
    const response = await apiClient.post('/subadmin/pastors', pastorData);
    return response.data;
  },

  updatePastor: async (id, pastorData) => {
    const response = await apiClient.put(`/subadmin/pastors/${id}`, pastorData);
    return response.data;
  },

  updatePastorStatus: async (id, status) => {
    const response = await apiClient.patch(`/subadmin/pastors/${id}/status`, { status });
    return response.data;
  },

  deletePastor: async (id) => {
    const response = await apiClient.delete(`/subadmin/pastors/${id}`);
    return response.data;
  },

  // Prayer Schedules
  getAllPrayerSchedules: async () => {
    const response = await apiClient.get('/subadmin/prayer-schedules');
    return response.data;
  },

  getPrayerScheduleById: async (id) => {
    const response = await apiClient.get(`/subadmin/prayer-schedules/${id}`);
    return response.data;
  },

  createPrayerSchedule: async (scheduleData) => {
    const response = await apiClient.post('/subadmin/prayer-schedules', scheduleData);
    return response.data;
  },

  updatePrayerSchedule: async (id, scheduleData) => {
    const response = await apiClient.put(`/subadmin/prayer-schedules/${id}`, scheduleData);
    return response.data;
  },

  deletePrayerSchedule: async (id) => {
    const response = await apiClient.delete(`/subadmin/prayer-schedules/${id}`);
    return response.data;
  },

  // Events
  getAllEvents: async () => {
    const response = await apiClient.get('/subadmin/events');
    return response.data;
  },

  getEventById: async (id) => {
    const response = await apiClient.get(`/subadmin/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await apiClient.post('/subadmin/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await apiClient.put(`/subadmin/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/subadmin/events/${id}`);
    return response.data;
  },

  // Donations
  getAllDonations: async () => {
    const response = await apiClient.get('/subadmin/donations');
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await apiClient.get(`/subadmin/donations/${id}`);
    return response.data;
  },

  createDonation: async (donationData) => {
    const response = await apiClient.post('/subadmin/donations', donationData);
    return response.data;
  },

  updateDonation: async (id, donationData) => {
    const response = await apiClient.put(`/subadmin/donations/${id}`, donationData);
    return response.data;
  },

  deleteDonation: async (id) => {
    const response = await apiClient.delete(`/subadmin/donations/${id}`);
    return response.data;
  },

  // Announcements
  getAllAnnouncements: async () => {
    const response = await apiClient.get('/subadmin/announcements');
    return response.data;
  },

  getAnnouncementById: async (id) => {
    const response = await apiClient.get(`/subadmin/announcements/${id}`);
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await apiClient.post('/subadmin/announcements', announcementData);
    return response.data;
  },

  updateAnnouncement: async (id, announcementData) => {
    const response = await apiClient.put(`/subadmin/announcements/${id}`, announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await apiClient.delete(`/subadmin/announcements/${id}`);
    return response.data;
  },

  // Funds (Read-only for Sub Admin)
  getFundSummary: async () => {
    const response = await apiClient.get('/subadmin/funds');
    return response.data;
  },

  getFundHistory: async () => {
    const response = await apiClient.get('/subadmin/funds/history');
    return response.data;
  },

  // Notifications
  getAllNotifications: async () => {
    const response = await apiClient.get('/subadmin/notifications');
    return response.data;
  },

  getNotificationById: async (id) => {
    const response = await apiClient.get(`/subadmin/notifications/${id}`);
    return response.data;
  },

  // Dashboard
  getMemberDashboard: async () => {
    const response = await apiClient.get('/subadmin/dashboard/member');
    return response.data;
  },

  getPastorDashboard: async () => {
    const response = await apiClient.get('/subadmin/dashboard/pastor');
    return response.data;
  },

  getDonationDashboard: async () => {
    const response = await apiClient.get('/subadmin/dashboard/donation');
    return response.data;
  },

  getEventDashboard: async () => {
    const response = await apiClient.get('/subadmin/dashboard/event');
    return response.data;
  },

  getPrayerDashboard: async () => {
    const response = await apiClient.get('/subadmin/dashboard/prayer');
    return response.data;
  },

  getAnnouncementDashboard: async () => {
    const response = await apiClient.get('/subadmin/dashboard/announcement');
    return response.data;
  },

  // Analytics
  getAnalyticsTotalMembers: async () => {
    const response = await apiClient.get('/subadmin/analytics/total-members');
    return response.data;
  },

  getAnalyticsNewMembersMonth: async () => {
    const response = await apiClient.get('/subadmin/analytics/new-members/month');
    return response.data;
  },

  getAnalyticsNewMembersYear: async () => {
    const response = await apiClient.get('/subadmin/analytics/new-members/year');
    return response.data;
  },

  getAnalyticsMemberGender: async () => {
    const response = await apiClient.get('/subadmin/analytics/member-gender');
    return response.data;
  },

  getAnalyticsPastors: async () => {
    const response = await apiClient.get('/subadmin/analytics/pastors');
    return response.data;
  },

  getAnalyticsPastorStatus: async () => {
    const response = await apiClient.get('/subadmin/analytics/pastors/status');
    return response.data;
  },

  getAnalyticsDonationsMonth: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/month');
    return response.data;
  },

  getAnalyticsDonationsYear: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/year');
    return response.data;
  },

  getAnalyticsDonationsTotal: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/total');
    return response.data;
  },

  getAnalyticsDonationsMonthly: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/monthly');
    return response.data;
  },

  getAnalyticsDonationsPurpose: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/purpose');
    return response.data;
  },

  getAnalyticsTopDonors: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/top-donors');
    return response.data;
  },

  getAnalyticsTopDonorsMonth: async () => {
    const response = await apiClient.get('/subadmin/analytics/donations/top-donors/month');
    return response.data;
  },

  getAnalyticsEvents: async () => {
    const response = await apiClient.get('/subadmin/analytics/events');
    return response.data;
  },

  getAnalyticsUpcomingEvents: async () => {
    const response = await apiClient.get('/subadmin/analytics/events/upcoming');
    return response.data;
  },

  getAnalyticsEventsMonthly: async () => {
    const response = await apiClient.get('/subadmin/analytics/events/monthly');
    return response.data;
  },

  getAnalyticsPrayerSchedule: async () => {
    const response = await apiClient.get('/subadmin/analytics/prayer-schedule');
    return response.data;
  },

  getAnalyticsTopDonorsMonth: async () => {
    const response = await apiClient.get(
      '/subadmin/analytics/donations/top-donors/month'
    );
    return response.data;
  },
  
  getAnalyticsTodayPrayerSchedule: async () => {
    const response = await apiClient.get('/subadmin/analytics/prayer-schedule/today');
    return response.data;
  },

  getAnalyticsAnnouncements: async () => {
    const response = await apiClient.get('/subadmin/analytics/announcements');
    return response.data;
  },

  getAnalyticsAnnouncementStatus: async () => {
    const response = await apiClient.get('/subadmin/analytics/announcements/status');
    return response.data;
  },
};
