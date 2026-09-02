import apiClient from './apiClient';

export const superAdminApi = {
  // Auth
  login: async (credentials) => {
    const response = await apiClient.post('/superadmin/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/superadmin/auth/profile');
    return response.data;
  },

  // Branches
  getAllBranches: async () => {
    const response = await apiClient.get('/superadmin/branches');
    return response.data;
  },

  getBranchById: async (id) => {
    const response = await apiClient.get(`/superadmin/branches/${id}`);
    return response.data;
  },

  createBranch: async (branchData) => {
    const response = await apiClient.post('/superadmin/branches', branchData);
    return response.data;
  },

  updateBranch: async (id, branchData) => {
    const response = await apiClient.put(`/superadmin/branches/${id}`, branchData);
    return response.data;
  },

  updateBranchStatus: async (id, status) => {
    const response = await apiClient.patch(`/superadmin/branches/${id}/status`, { status });
    return response.data;
  },

  deleteBranch: async (id) => {
    const response = await apiClient.delete(`/superadmin/branches/${id}`);
    return response.data;
  },

  // Sub Admins
  getAllSubAdmins: async () => {
    const response = await apiClient.get('/superadmin/subadmins');
    return response.data;
  },

  getSubAdminById: async (id) => {
    const response = await apiClient.get(`/superadmin/subadmins/${id}`);
    return response.data;
  },

  createSubAdmin: async (adminData) => {
    const response = await apiClient.post('/superadmin/subadmins', adminData);
    return response.data;
  },

  updateSubAdmin: async (id, adminData) => {
    const response = await apiClient.put(`/superadmin/subadmins/${id}`, adminData);
    return response.data;
  },

  deleteSubAdmin: async (id) => {
    const response = await apiClient.delete(`/superadmin/subadmins/${id}`);
    return response.data;
  },

  // Dashboard
  getDashboardTotalBranches: async () => {
    const response = await apiClient.get('/superadmin/dashboard/total-branches');
    return response.data;
  },

  getDashboardTotalMembers: async () => {
    const response = await apiClient.get('/superadmin/dashboard/total-members');
    return response.data;
  },

  getDashboardTotalPastors: async () => {
    const response = await apiClient.get('/superadmin/dashboard/pastors');
    return response.data;
  },

  getDashboardDonations: async () => {
    const response = await apiClient.get('/superadmin/dashboard/donations');
    return response.data;
  },

  getDashboardHighestDonationMonth: async () => {
    const response = await apiClient.get('/superadmin/dashboard/donations/highest-this-month');
    return response.data;
  },

  getDashboardHighestDonationYear: async () => {
    const response = await apiClient.get('/superadmin/dashboard/donations/highest-this-year');
    return response.data;
  },

  getDashboardEvents: async () => {
    const response = await apiClient.get('/superadmin/dashboard/events');
    return response.data;
  },

  getDashboardPrayer: async () => {
    const response = await apiClient.get('/superadmin/dashboard/prayer');
    return response.data;
  },

  getDashboardAnnouncements: async () => {
    const response = await apiClient.get('/superadmin/dashboard/announcements');
    return response.data;
  },

  getDashboardBranchSummary: async () => {
    const response = await apiClient.get('/superadmin/dashboard/branch-summary');
    return response.data;
  },

  // Funds
  getAllFunds: async () => {
    const response = await apiClient.get('/superadmin/funds');
    return response.data;
  },

  getFundById: async (id) => {
    const response = await apiClient.get(`/superadmin/funds/${id}`);
    return response.data;
  },

  createFund: async (fundData) => {
    const response = await apiClient.post('/superadmin/funds', fundData);
    return response.data;
  },

  updateFund: async (id, fundData) => {
    const response = await apiClient.put(`/superadmin/funds/${id}`, fundData);
    return response.data;
  },

  deleteFund: async (id) => {
    const response = await apiClient.delete(`/superadmin/funds/${id}`);
    return response.data;
  },

  getBranchFundSummary: async () => {
    const response = await apiClient.get('/superadmin/funds/branch-summary');
    return response.data;
  },

  // Notifications
  getAllNotifications: async () => {
    const response = await apiClient.get('/superadmin/notifications');
    return response.data;
  },

  getNotificationById: async (id) => {
    const response = await apiClient.get(`/superadmin/notifications/${id}`);
    return response.data;
  },

  createNotification: async (notifData) => {
    const response = await apiClient.post('/superadmin/notifications', notifData);
    return response.data;
  },

  updateNotification: async (id, notifData) => {
    const response = await apiClient.put(`/superadmin/notifications/${id}`, notifData);
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/superadmin/notifications/${id}`);
    return response.data;
  },

  // Analytics
  getBranchAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/branches');
    return response.data;
  },

  getMemberAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/members');
    return response.data;
  },

  getPastorAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/pastors');
    return response.data;
  },

  getDonationAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/donations');
    return response.data;
  },

  getFundAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/funds');
    return response.data;
  },

  getEventAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/events');
    return response.data;
  },

  getPrayerAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/prayer');
    return response.data;
  },

  getNotificationAnalytics: async () => {
    const response = await apiClient.get('/superadmin/analytics/notifications');
    return response.data;
  },
};
