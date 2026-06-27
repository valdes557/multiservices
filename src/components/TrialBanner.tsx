'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

/**
 * Global banner for subscribers on trial or just-expired. During the trial it
 * shows the countdown and a "pay to remove ads" CTA (ads only mentioned when the
 * site is actually serving them). When expired, it prompts payment to continue.
 */
export default function TrialBanner() {
  const { user } = useAuth();
  const { adsenseApproved } = useSettings();
  const [dismissed, setDismissed] = React.useState(false);

  const sub = user?.subscription;
  if (!sub || dismissed) return null;

  const status = sub.effectiveStatus;
  if (status !== 'trial' && status !== 'expired') return null;

  const adsRunning = adsenseApproved && sub.adsEnabled && status === 'trial';

  if (status === 'trial') {
    return (
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container flex items-center justify-between gap-3 py-2 text-sm">
          <div className="flex items-center gap-2 text-amber-800">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              Essai gratuit : <strong>{sub.trialDaysLeft} jour(s)</strong> restant(s).
              {adsRunning ? ' Vos outils se terminent par une publicité — ' : ' '}
              <Link href="/subscribe" className="underline font-medium">
                {adsRunning ? 'payez pour retirer les pubs' : 'passez à l’abonnement mensuel'}
              </Link>.
            </span>
          </div>
          <button onClick={() => setDismissed(true)} aria-label="Fermer" className="text-amber-700 hover:text-amber-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-b border-red-200">
      <div className="container flex items-center justify-between gap-3 py-2 text-sm">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Votre essai est terminé. <Link href="/subscribe" className="underline font-medium">Payez votre abonnement</Link> pour continuer à utiliser les outils premium.
          </span>
        </div>
        <button onClick={() => setDismissed(true)} aria-label="Fermer" className="text-red-700 hover:text-red-900">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
