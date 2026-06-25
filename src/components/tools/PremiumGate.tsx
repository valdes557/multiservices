'use client';
import React from 'react';
import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

interface PremiumGateProps {
  children: React.ReactNode;
  toolName?: string;
}

export function PremiumGate({ children, toolName }: PremiumGateProps) {
  const { isPremium, isTrialActive, user } = useAuth();
  const { locale } = useLocale();
  const unlocked = isPremium() || isTrialActive();

  if (unlocked) return <>{children}</>;

  const S = locale === 'en'
    ? {
        title: 'Premium feature',
        desc: toolName
          ? `"${toolName}" is reserved for Premium members. Upgrade to unlock it.`
          : 'This tool is reserved for Premium members. Upgrade to unlock it.',
        cta: user ? 'Upgrade to Premium' : 'Sign in to continue',
        href: user ? '/pricing' : '/auth/login',
        perks: ['Unlimited access to all premium tools', 'PDF / PNG exports', 'Priority support'],
      }
    : {
        title: 'Fonctionnalité Premium',
        desc: toolName
          ? `« ${toolName} » est réservé aux membres Premium. Passez Premium pour le débloquer.`
          : 'Cet outil est réservé aux membres Premium. Passez Premium pour le débloquer.',
        cta: user ? 'Passer Premium' : 'Se connecter pour continuer',
        href: user ? '/pricing' : '/auth/login',
        perks: ['Accès illimité à tous les outils premium', 'Exports PDF / PNG', 'Support prioritaire'],
      };

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-40" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-amber-300 shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <Lock className="h-7 w-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold">{S.title}</h3>
            <p className="text-muted-foreground">{S.desc}</p>
            <ul className="space-y-1 text-sm text-left">
              {S.perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" /> {p}
                </li>
              ))}
            </ul>
            <Link href={S.href} className="w-full">
              <Button className="w-full bg-amber-500 hover:bg-amber-600">{S.cta}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}