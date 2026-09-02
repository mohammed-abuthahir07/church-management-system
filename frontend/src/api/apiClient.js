import axios from 'axios';
import { getToken, clearAuthStorage, getUser } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors centrally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error / server not reachable
      return Promise.reject({
        message: 'Cannot connect to server. Please ensure the backend is running.',
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
      // Unauthorized: token expired or invalid
      const user = getUser();
      const role = user?.role;
      clearAuthStorage();

      // Redirect to appropriate login page if not already there
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        if (role === 'SUB_ADMIN' || currentPath.startsWith('/subadmin')) {
          window.location.href = '/subadmin/login';
        } else {
          window.location.href = '/superadmin/login';
        }
      }
    }

    // Extract human-friendly error message
    const message =
      data?.message ||
      (status === 403
        ? 'Access denied. You do not have permission for this action.'
        : status === 404
        ? 'The requested resource was not found.'
        : status >= 500
        ? 'Internal server error. Please try again later.'
        : 'An unexpected error occurred.');

    return Promise.reject({
      status,
      message,
      data,
      originalError: error,
    });
  }
);

export default apiClient;
