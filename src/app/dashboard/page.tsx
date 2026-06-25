'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Globe, BookOpen, FileText, RefreshCw, Briefcase, Palette, TrendingUp,
  Crown, Clock, AlertTriangle, ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLocale();
  const { user, isPremium, isTrialActive } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CardTitle className="mb-4">{t('auth.loginTitle') as string}</CardTitle>
          <Link href="/auth/login">
            <Button>{t('common.login') as string}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const trialDaysLeft = user.subscription.trialEndDate
    ? Math.max(0, Math.ceil((new Date(user.subscription.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const quickLinks = [
    { href: '/services/translation', icon: <Globe className="h-5 w-5" />, label: t('categories.translation') as string, color: 'text-blue-600 bg-blue-100' },
    { href: '/services/learning', icon: <BookOpen className="h-5 w-5" />, label: t('categories.learning') as string, color: 'text-green-600 bg-green-100' },
    { href: '/services/documents', icon: <FileText className="h-5 w-5" />, label: t('categories.documents') as string, color: 'text-orange-600 bg-orange-100' },
    { href: '/services/conversion', icon: <RefreshCw className="h-5 w-5" />, label: t('categories.conversion') as string, color: 'text-purple-600 bg-purple-100' },
    { href: '/services/professional', icon: <Briefcase className="h-5 w-5" />, label: t('categories.professional') as string, color: 'text-slate-600 bg-slate-100' },
    { href: '/services/content', icon: <Palette className="h-5 w-5" />, label: t('categories.content') as string, color: 'text-pink-600 bg-pink-100' },
    { href: '/services/business', icon: <TrendingUp className="h-5 w-5" />, label: t('categories.business') as string, color: 'text-indigo-600 bg-indigo-100' },
  ];

  return (
    <div className="py-8">
      <div className="container">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">{t('common.tagline') as string}</p>
        </div>

        {/* Subscription Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={`${isPremium() || isTrialActive() ? 'border-primary' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {isPremium() || isTrialActive() ? (t('common.premium') as string) : (t('common.free') as string)}
                </CardTitle>
                {(isPremium() || isTrialActive()) && <Crown className="h-5 w-5 text-primary" />}
              </div>
            </CardHeader>
            <CardContent>
              {isTrialActive() && trialDaysLeft > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      {trialDaysLeft} {trialDaysLeft === 1 ? 'jour' : 'jours'} restant(s)
                    </span>
                  </div>
                  <Progress value={(trialDaysLeft / 3) * 100} className="h-2" />
                </div>
              ) : !isPremium() ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">
                    {t('common.upgradeNow') as string}
                  </span>
                </div>
              ) : (
                <Badge>Active</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Utilisations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.subscription.plan === 'free' ? '5/10' : '∞'}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {user.subscription.plan === 'free' ? 'actions restantes aujourd\'hui' : 'Illimité'}
              </p>
            </CardContent>
          </Card>

          {!isPremium() && !isTrialActive() && (
            <Card className="border-primary bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('common.upgradeNow') as string}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  ${t('pricing.price') as string}{t('common.perMonth') as string}
                </p>
                <Link href="/pricing">
                  <Button size="sm" className="w-full">
                    {t('common.upgradeNow') as string}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-semibold mb-4">{t('common.services') as string}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.color} transition-colors`}>
                    {link.icon}
                  </div>
                  <p className="text-xs font-medium leading-tight">{link.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
