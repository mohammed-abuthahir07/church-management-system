import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, clearAuthStorage } from '../utils/storage';
import { superAdminApi } from '../api/superAdminApi';
import { subAdminApi } from '../api/subAdminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokenState, setTokenState] = useState(getToken());
  const [userState, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(true);

  // Sync profile on mount if token is stored
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        try {
          if (storedUser.role === 'SUPER_ADMIN') {
            const profileRes = await superAdminApi.getProfile();
            if (profileRes?.user) {
              const updatedUser = { ...storedUser, ...profileRes.user };
              setUser(updatedUser);
              setUserState(updatedUser);
            }
          } else if (storedUser.role === 'SUB_ADMIN') {
            const profileRes = await subAdminApi.getProfile();
            if (profileRes?.user) {
              const updatedUser = { ...storedUser, ...profileRes.user };
              setUser(updatedUser);
              setUserState(updatedUser);
            }
          }
        } catch (error) {
          console.warn('Initial session validation failed:', error?.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    setTokenState(token);
    setUserState(user);
  };

  const logout = () => {
    const role = userState?.role;
    clearAuthStorage();
    setTokenState(null);
    setUserState(null);

    // Redirect to relevant login page
    if (role === 'SUB_ADMIN') {
      window.location.href = '/subadmin/login';
    } else {
      window.location.href = '/superadmin/login';
    }
  };

  const updateUser = (newUserData) => {
    const updated = { ...userState, ...newUserData };
    setUser(updated);
    setUserState(updated);
  };

  const isAuthenticated = Boolean(tokenState && userState);
  const isSuperAdmin = userState?.role === 'SUPER_ADMIN';
  const isSubAdmin = userState?.role === 'SUB_ADMIN';
  const branchId = userState?.branch_id || null;
  const branchName = userState?.branch_name || (branchId ? `Branch #${branchId}` : null);

  const value = {
    token: tokenState,
    user: userState,
    role: userState?.role || null,
    branchId,
    branchName,
    isAuthenticated,
    isSuperAdmin,
    isSubAdmin,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
