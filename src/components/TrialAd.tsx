'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useLocale } from '@/context/LocaleContext';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

/**
 * Ad shown AFTER a tool execution during the free trial (requirements #3, #8).
 * It renders only when ALL of these hold:
 *   - the admin marked the site as AdSense-approved (settings.adsenseApproved)
 *   - the user is currently in trial (effectiveStatus === 'trial')
 *   - ads are enabled for this user (sub.adsEnabled — set from the plan's adsDuringTrial)
 * Paid/active users (and trial users whose ads were blocked) never see it.
 *
 * When approved but no AdSense client id is configured yet, a labelled placeholder
 * is shown so the behaviour is visible end-to-end.
 */
export default function TrialAd({ className = '' }: { className?: string }) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { locale } = useLocale();
  const pushed = useRef(false);

  const sub = user?.subscription;
  // Ads run when the site is AdSense-approved AND the user's ads flag is on.
  // adsEnabled is the single source of truth: it is set for trial users and for
  // active users of a free plan, and cleared for paid/active users — so this
  // covers both the trial and the ad-supported free plan.
  const adStatus = sub?.effectiveStatus === 'trial' || sub?.effectiveStatus === 'active';
  const show = settings.adsenseApproved && adStatus && !!sub?.adsEnabled;
  const clientId = settings.adsenseClientId;

  useEffect(() => {
    if (!show || !clientId) return;
    // Load the AdSense script once (client id comes from admin settings, so it
    // can't live in the static <head>).
    const id = 'adsbygoogle-js';
    if (!document.getElementById(id)) {
      const sc = document.createElement('script');
      sc.id = id;
      sc.async = true;
      sc.crossOrigin = 'anonymous';
      sc.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      document.head.appendChild(sc);
    }
    if (!pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch { /* ignore */ }
    }
  }, [show, clientId]);

  if (!show) return null;

  const label = locale === 'en' ? 'Advertisement' : 'Publicité';
  const upsell = locale === 'en'
    ? 'Subscribe to remove ads'
    : "Abonnez-vous pour retirer les publicités";

  return (
    <div className={`my-4 rounded-lg border bg-muted/30 p-3 text-center ${className}`}>
      {clientId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={settings.adsenseSlotTrial || undefined}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
          {locale === 'en' ? 'AdSense ad space' : 'Espace publicitaire AdSense'}
        </div>
      )}
      <div className="mt-1 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
        <span>{label}</span>
        <Link href="/subscribe" className="underline hover:text-foreground">{upsell}</Link>
      </div>
    </div>
  );
}
