'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface PublicSettings {
  adsenseApproved: boolean;
  adsenseClientId: string;
  adsenseSlotId: string;
}

const defaultSettings: PublicSettings = {
  adsenseApproved: false,
  adsenseClientId: '',
  adsenseSlotId: '',
};

const SettingsContext = createContext<PublicSettings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings/public')
      .then((r) => (r.ok ? r.json() : defaultSettings))
      .then((d) => { if (!cancelled) setSettings({ ...defaultSettings, ...d }); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Inject the Google AdSense loader once, only when the site is approved and a
  // client id is configured. Without this script the <ins> units never fill.
  useEffect(() => {
    if (!settings.adsenseApproved || !settings.adsenseClientId) return;
    if (typeof document === 'undefined') return;
    if (document.getElementById('adsbygoogle-js')) return;
    const s = document.createElement('script');
    s.id = 'adsbygoogle-js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsenseClientId}`;
    document.head.appendChild(s);
  }, [settings.adsenseApproved, settings.adsenseClientId]);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
