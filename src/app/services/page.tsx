'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import ToolsBrowser from '@/components/ToolsBrowser';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function ServicesPage() {
  const { t, locale } = useLocale();
  const { user } = useAuth();
  const fr = locale === 'fr';
  const hasPlan = !!user?.subscription?.planKey;

  return (
    <div className="py-12">
      <div className="container">
        <BackButton href="/" />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('common.services') as string}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('common.tagline') as string}</p>
        </div>

        {/* Users must have selected a plan to use the tools. */}
        {!hasPlan && (
          <Card className="mb-10 border-primary/30 bg-primary/5 max-w-3xl mx-auto">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm">
                  {fr
                    ? 'Choisissez un plan pour débloquer et utiliser les outils.'
                    : 'Choose a plan to unlock and use the tools.'}
                </p>
              </div>
              <Link href={user ? '/subscribe' : '/auth/signup'}>
                <Button size="sm">{fr ? 'Choisir un plan' : 'Choose a plan'}</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <ToolsBrowser />
      </div>
    </div>
  );
}
