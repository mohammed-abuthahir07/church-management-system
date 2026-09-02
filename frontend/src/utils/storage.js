const TOKEN_KEY = 'church_auth_token';
const USER_KEY = 'church_auth_user';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to save token to localStorage', error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token from localStorage', error);
  }
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error('Failed to save user to localStorage', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove user from localStorage', error);
  }
};

export const clearAuthStorage = () => {
  removeToken();
  removeUser();
};
