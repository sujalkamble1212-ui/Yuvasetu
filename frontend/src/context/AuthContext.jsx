import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('yuvasetu_token') || '');
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setProfile(null);
        setEducation(null);
        setLoading(false);
        return;
      }
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile);
        setEducation(data.education);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.success) {
      localStorage.setItem('yuvasetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.success) {
      localStorage.setItem('yuvasetu_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('yuvasetu_token');
    setToken('');
    setUser(null);
    setProfile(null);
    setEducation(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile);
        setEducation(data.education);
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        education,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
