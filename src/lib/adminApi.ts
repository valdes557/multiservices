'use client';

/** Tiny fetch helper for admin client calls: attaches the bearer token + JSON. */
export async function adminFetch(path: string, token: string | null, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export interface AdminPlan {
  _id: string;
  key: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  price: number;
  currency: string;
  trialDays: number;
  features: { fr: string; en: string }[];
  limits: Record<string, number>;
  adsDuringTrial: boolean;
  showAds: boolean;
  forumEnabled: boolean;
  active: boolean;
  order: number;
  isSystem: boolean;
}

export interface AdminTool {
  _id: string;
  key: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  category: string;
  href: string;
  icon: string;
  planKeys: string[];
  isPremium: boolean;
  active: boolean;
  order: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  effectiveStatus: 'none' | 'trial' | 'active' | 'expired' | 'disabled';
  subscription: {
    planKey: string | null;
    status: string;
    trialEndDate: string | null;
    endDate: string | null;
    adsEnabled: boolean;
    activatedByAdmin: boolean;
    disabledByAdmin: boolean;
  };
}
