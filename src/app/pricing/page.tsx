'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import BackButton from '@/components/BackButton';
import PlansPricing from '@/components/PlansPricing';
import { Smartphone } from 'lucide-react';

export default function PricingPage() {
  const { t, locale } = useLocale();
  const fr = locale === 'fr';

  return (
    <div className="py-16">
      <div className="container max-w-5xl">
        <BackButton href="/" />
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('pricing.title') as string}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('pricing.subtitle') as string}</p>
        </div>

        <div className="mb-16">
          <PlansPricing />
        </div>

        {/* Payment Methods — Mobile Money (SebPay) */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">{fr ? 'Moyens de paiement' : 'Payment Methods'}</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave'].map((m) => (
              <div key={m} className="flex items-center gap-2 px-6 py-3 rounded-xl border bg-card">
                <Smartphone className="h-5 w-5 text-primary" />
                <span className="font-medium">{m}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {fr ? 'Paiement Mobile Money sécurisé.' : 'Secure Mobile Money payment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
