'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Conditional Google AdSense unit. Ads only render when:
 *  - AdSense has approved the site (settings.adsenseApproved) and a client id is set, AND
 *  - the user is within their free trial (effectiveStatus === 'trial') with ads enabled.
 * Paid/active users and users outside a trial never see ads.
 */
export default function AdSense({ slot, format = 'auto', className = '' }: AdSenseProps) {
  const { user } = useAuth();
  const { adsenseApproved, adsenseClientId, adsenseSlotId } = useSettings();

  const sub = user?.subscription;
  const show = adsenseApproved && !!adsenseClientId && sub?.effectiveStatus === 'trial' && !!sub?.adsEnabled;

  useEffect(() => {
    if (!show) return;
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`adsense-container my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={slot || adsenseSlotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <p className="text-[10px] text-center text-muted-foreground mt-1">Publicité</p>
    </div>
  );
}
