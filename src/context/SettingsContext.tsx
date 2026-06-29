'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface PublicSettings {
  adsenseApproved: boolean;
  adsenseClientId: string;
  adsenseSlotTrial: string;
  payment: {
    mode: 'test' | 'live';
    country: string;
    operators: string[];
    configured: boolean;
  };
}

const DEFAULTS: PublicSettings = {
  adsenseApproved: false,
  adsenseClientId: '',
  adsenseSlotTrial: '',
  payment: { mode: 'test', country: 'BJ', operators: [], configured: false },
};

const SettingsContext = createContext<{ settings: PublicSettings; loading: boolean }>({
  settings: DEFAULTS,
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (active && d.settings) setSettings({ ...DEFAULTS, ...d.settings }); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
