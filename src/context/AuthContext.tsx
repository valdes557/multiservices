'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SubscriptionStatus = 'none' | 'trial' | 'active' | 'expired' | 'disabled';

export interface UserSubscription {
  planKey: string | null;
  status: SubscriptionStatus;
  effectiveStatus: SubscriptionStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  startDate: string | null;
  endDate: string | null;
  adsEnabled: boolean;
  activatedByAdmin: boolean;
  disabledByAdmin: boolean;
  trialDaysLeft: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  locale: 'fr' | 'en';
  subscription: UserSubscription;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  isPremium: () => boolean;
  isTrialActive: () => boolean;
  hasPremiumAccess: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  refresh: async () => {},
  isPremium: () => false,
  isTrialActive: () => false,
  hasPremiumAccess: () => false,
  isAdmin: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Re-fetch the current user (e.g. after selecting a plan or a payment).
  const refresh = useCallback(async () => {
    const savedToken = token || localStorage.getItem('token');
    if (!savedToken) return;
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${savedToken}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, [token]);

  const isPremium = useCallback(() => {
    return user?.subscription.effectiveStatus === 'active';
  }, [user]);

  const isTrialActive = useCallback(() => {
    return user?.subscription.effectiveStatus === 'trial';
  }, [user]);

  const hasPremiumAccess = useCallback(() => {
    const s = user?.subscription.effectiveStatus;
    return s === 'trial' || s === 'active';
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refresh, isPremium, isTrialActive, hasPremiumAccess, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
