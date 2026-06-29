'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight } from 'lucide-react';
import type { LocalizedText } from '@/models/Plan';

interface PublicPlan {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  currency: string;
  trialDays: number;
  features: LocalizedText[];
}

/**
 * Dynamic pricing grid driven by the admin-configured plans (/api/plans).
 * Replaces the old hardcoded "Free / Premium" cards. The free plan (price 0)
 * is highlighted; trial plans show their trial length.
 */
export default function PlansPricing() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const fr = locale === 'fr';

  useEffect(() => {
    let active = true;
    fetch('/api/plans')
      .then((r) => r.json())
      .then((d) => { if (active && Array.isArray(d.plans)) setPlans(d.plans); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return <p className="text-center text-sm text-muted-foreground py-8">{fr ? 'Chargement des plans…' : 'Loading plans…'}</p>;
  }
  if (plans.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-8">{fr ? 'Aucun plan disponible pour le moment.' : 'No plans available yet.'}</p>;
  }

  const ctaHref = user ? '/subscribe' : '/auth/signup';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((p) => {
        const isFree = p.price === 0;
        const highlight = isFree;
        return (
          <Card key={p.key} className={`relative border-2 p-8 flex flex-col ${highlight ? 'border-primary shadow-lg' : ''}`}>
            {highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-4 py-1"><Star className="mr-1 h-3 w-3" />{fr ? 'Gratuit' : 'Free'}</Badge>
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold">{fr ? p.name.fr : p.name.en}</h3>
              {(p.description?.fr || p.description?.en) && (
                <p className="text-muted-foreground mt-1 text-sm">{fr ? p.description.fr : p.description.en}</p>
              )}
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">{isFree ? (fr ? 'Gratuit' : 'Free') : p.price}</span>
              {!isFree && <span className="text-muted-foreground"> {p.currency}{fr ? '/mois' : '/mo'}</span>}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {(p.features || []).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {fr ? f.fr : f.en}
                </li>
              ))}
            </ul>
            <Link href={ctaHref}>
              <Button className="w-full" size="lg" variant={highlight ? 'default' : 'outline'}>
                {isFree ? (fr ? 'Commencer gratuitement' : 'Start for free') : (fr ? 'Choisir ce plan' : 'Choose this plan')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {p.trialDays > 0 && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                {fr ? `${p.trialDays} jours d'essai gratuit` : `${p.trialDays}-day free trial`}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
