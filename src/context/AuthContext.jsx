import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
  });

  const [loading, setLoading] = useState(true);

  // Initial profilni yuklash / token holatini tekshirish
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
          }
        } catch (err) {
          console.log('Token or profile invalid on start', err?.message);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Axios interceptor dan kelgan unauthorized hodisasini tutish
    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // 1. REGISTER
  const register = async ({ name, email, password, confirmPassword }) => {
    const res = await authService.register({ name, email, password, confirmPassword });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
    }
    if (res?.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    }
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
    }
    return res;
  };

  // 2. LOGIN
  const login = async ({ email, password }) => {
    const res = await authService.login({ email, password });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
    }
    if (res?.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refreshToken);
    }
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
    }
    return res;
  };

  // 3. LOGOUT
  const logout = async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      await authService.logout(refreshToken);
    } catch (e) {
      console.warn('Logout error ignored:', e);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  // 4. UPDATE PROFILE
  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
    }
    return res;
  };

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

