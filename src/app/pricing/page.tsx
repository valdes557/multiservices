'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight, Coins, Wallet } from 'lucide-react';

export default function PricingPage() {
  const { t } = useLocale();

  return (
    <div className="py-16">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('pricing.title') as string}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('pricing.subtitle') as string}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <Card className="relative border-2 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{t('pricing.freePlan') as string}</h3>
              <p className="text-muted-foreground mt-1">{t('pricing.freePlanDesc') as string}</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-muted-foreground text-lg">{t('common.perMonth') as string}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {(t('pricing.freeFeatures') as unknown as string[]).map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <Button variant="outline" className="w-full" size="lg">
                {t('common.getStarted') as string}
              </Button>
            </Link>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-primary p-8 shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="px-4 py-1 text-sm">
                <Star className="mr-1.5 h-3.5 w-3.5" />
                {t('common.premium') as string}
              </Badge>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{t('pricing.premiumPlan') as string}</h3>
              <p className="text-muted-foreground mt-1">{t('pricing.premiumPlanDesc') as string}</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">${t('pricing.price') as string}</span>
              <span className="text-muted-foreground text-lg">{t('common.perMonth') as string}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {(t('pricing.premiumFeatures') as unknown as string[]).map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <Button className="w-full" size="lg">
                {t('common.freeTrial') as string}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-3">{t('pricing.trial') as string}</p>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">
            {t('common.appName') === 'MultiServices' ? 'Payment Methods' : 'Moyens de paiement'}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl border bg-card">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">USDT (TRC20)</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl border bg-card">
              <Wallet className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Binance Pay</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {t('common.appName') === 'MultiServices'
              ? 'More payment methods coming soon.'
              : 'Plus de moyens de paiement bientôt disponibles.'}
          </p>
        </div>
      </div>
    </div>
  );
}
