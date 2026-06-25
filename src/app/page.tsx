'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  BookOpen,
  FileText,
  RefreshCw,
  Briefcase,
  Palette,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  Check,
  ArrowRight,
  Star,
} from 'lucide-react';

const serviceIcons: Record<string, React.ReactNode> = {
  translation: <Globe className="h-8 w-8" />,
  learning: <BookOpen className="h-8 w-8" />,
  documents: <FileText className="h-8 w-8" />,
  conversion: <RefreshCw className="h-8 w-8" />,
  professional: <Briefcase className="h-8 w-8" />,
  content: <Palette className="h-8 w-8" />,
  business: <TrendingUp className="h-8 w-8" />,
};

const serviceColors: Record<string, string> = {
  translation: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
  learning: 'from-green-500/10 to-emerald-500/10 text-green-600',
  documents: 'from-orange-500/10 to-amber-500/10 text-orange-600',
  conversion: 'from-purple-500/10 to-violet-500/10 text-purple-600',
  professional: 'from-slate-500/10 to-gray-500/10 text-slate-600',
  content: 'from-pink-500/10 to-rose-500/10 text-pink-600',
  business: 'from-indigo-500/10 to-blue-500/10 text-indigo-600',
};

export default function HomePage() {
  const { t } = useLocale();

  const categories = [
    'translation', 'learning', 'documents', 'conversion', 'professional', 'content', 'business',
  ];

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

      {/* Services Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat} href={`/services/${cat}`}>
                <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${serviceColors[cat]}`}>
                      {serviceIcons[cat]}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {t(`categories.${cat}`) as string}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t(`categories.${cat}Desc`) as string}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
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

      {/* Pricing Preview */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{t('pricing.freePlan') as string}</h3>
                <p className="text-muted-foreground mt-1">{t('pricing.freePlanDesc') as string}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground">{t('common.perMonth') as string}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {(t('pricing.freeFeatures') as unknown as string[]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
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
            <Card className="relative border-2 border-primary p-8 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-4 py-1">
                  <Star className="mr-1 h-3 w-3" />
                  {t('common.premium') as string}
                </Badge>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{t('pricing.premiumPlan') as string}</h3>
                <p className="text-muted-foreground mt-1">{t('pricing.premiumPlanDesc') as string}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">${t('pricing.price') as string}</span>
                <span className="text-muted-foreground">{t('common.perMonth') as string}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {(t('pricing.premiumFeatures') as unknown as string[]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button className="w-full" size="lg">
                  {t('common.freeTrial') as string}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-3">
                {t('pricing.trial') as string}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
