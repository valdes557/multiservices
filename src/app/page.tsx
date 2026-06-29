'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ToolsBrowser from '@/components/ToolsBrowser';
import PlansPricing from '@/components/PlansPricing';
import {
  Zap,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              {t('hero.trialBadge') as string}
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {t('hero.title') as string}
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              {t('hero.subtitle') as string}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  {t('hero.cta') as string}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl">
                  {t('common.learnMore') as string}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        </div>
      </section>

      {/* Tools listing (dynamic, DB-driven; access gated by plan) */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {t('common.services') as string}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('common.tagline') as string}
            </p>
          </div>
          <ToolsBrowser />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {(t('common.appName') as string)}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('common.appName') === 'MultiServices' ? 'Fast & Powerful' : 'Rapide & Puissant'}
              </h3>
              <p className="text-muted-foreground">
                {t('common.appName') === 'MultiServices' ? 'Lightning-fast processing for all your documents and translations.' : 'Traitement ultra-rapide pour tous vos documents et traductions.'}
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('common.appName') === 'MultiServices' ? 'Secure' : 'Sécurisé'}
              </h3>
              <p className="text-muted-foreground">
                {t('common.appName') === 'MultiServices' ? 'Your data is encrypted and protected at all times.' : 'Vos données sont chiffrées et protégées en permanence.'}
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('common.appName') === 'MultiServices' ? '24/7 Available' : 'Disponible 24/7'}
              </h3>
              <p className="text-muted-foreground">
                {t('common.appName') === 'MultiServices' ? 'Access all services anytime, anywhere in the world.' : 'Accédez à tous les services à tout moment, partout dans le monde.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview (dynamic plans) */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {t('pricing.title') as string}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('pricing.subtitle') as string}
            </p>
          </div>
          <PlansPricing />
        </div>
      </section>
    </div>
  );
}
