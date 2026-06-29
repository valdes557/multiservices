'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, CheckCircle2, ArrowRight, Loader2, Crown } from 'lucide-react';

interface PublicPlan {
  key: string;
  name: { fr: string; en: string };
  price: number;
  currency: string;
  trialDays: number;
}

const OPERATOR_LABEL: Record<string, string> = {
  mtn: 'MTN MoMo', moov: 'Moov Money', orange: 'Orange Money', wave: 'Wave',
};

type Step = 'form' | 'pending' | 'success' | 'failed';

export default function SubscribePage() {
  const { locale } = useLocale();
  const { user, token, refresh } = useAuth();
  const { settings } = useSettings();
  const fr = locale !== 'en';

  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [planKey, setPlanKey] = useState('');
  const [operator, setOperator] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [providerLink, setProviderLink] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/plans').then((r) => r.json()).then((d) => {
      const list: PublicPlan[] = d.plans || [];
      setPlans(list);
      const current = user?.subscription.planKey;
      setPlanKey(current && list.find((p) => p.key === current) ? current : list[0]?.key || '');
    }).catch(() => {});
  }, [user?.subscription.planKey]);

  useEffect(() => {
    const ops = settings.payment.operators;
    if (ops.length && !operator) setOperator(ops[0]);
  }, [settings.payment.operators, operator]);

  const selectedPlan = plans.find((p) => p.key === planKey);

  const pollStatus = async (reference: string) => {
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      try {
        const res = await fetch(`/api/payment/status/${encodeURIComponent(reference)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (d.status === 'completed') { setStep('success'); await refresh(); return; }
        if (d.status === 'failed') { setStep('failed'); setError(fr ? 'Paiement échoué ou annulé.' : 'Payment failed or cancelled.'); return; }
      } catch { /* keep polling */ }
    }
    setInfo(fr ? "Le paiement est toujours en attente. Rafraîchissez votre tableau de bord plus tard." : 'Payment still pending. Check your dashboard later.');
  };

  const pay = async () => {
    setError(''); setInfo(''); setProviderLink(null);
    if (!selectedPlan) { setError(fr ? 'Choisissez un plan.' : 'Choose a plan.'); return; }
    if (!phone.trim()) { setError(fr ? 'Entrez votre numéro.' : 'Enter your phone number.'); return; }
    setStep('pending');
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planKey, phone, operator, otp_code: otp || undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Payment failed');
      if (d.providerLink) setProviderLink(d.providerLink);
      setInfo(d.message || (fr ? 'Validez le paiement sur votre téléphone.' : 'Confirm the payment on your phone.'));
      await pollStatus(d.reference);
    } catch (e) {
      setStep('failed');
      setError((e as Error).message);
    }
  };

  if (!user) {
    return (
      <div className="py-16">
        <div className="container max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">{fr ? 'Connexion requise' : 'Sign in required'}</h1>
          <p className="text-muted-foreground mb-6">{fr ? 'Connectez-vous pour souscrire à un abonnement.' : 'Sign in to subscribe.'}</p>
          <Link href="/auth/login"><Button>{fr ? 'Se connecter' : 'Sign in'}</Button></Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="py-16">
        <div className="container max-w-lg text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{fr ? 'Paiement réussi !' : 'Payment successful!'}</h1>
          <p className="text-muted-foreground mb-6">
            {fr ? 'Votre abonnement est actif et les publicités sont désormais bloquées.' : 'Your subscription is active and ads are now blocked.'}
          </p>
          <Link href="/dashboard"><Button>{fr ? 'Aller au tableau de bord' : 'Go to dashboard'} <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <BackButton href="/dashboard" />
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
            <Crown className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold mb-1">{fr ? 'Souscrire un abonnement' : 'Subscribe to a plan'}</h1>
          <p className="text-muted-foreground">{fr ? 'Payez par Mobile Money pour activer votre plan et retirer les publicités.' : 'Pay with Mobile Money to activate your plan and remove ads.'}</p>
        </div>

        {!settings.payment.configured && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {fr ? 'Le paiement Mobile Money n’est pas encore configuré par l’administrateur.' : 'Mobile Money payment is not configured yet by the administrator.'}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Smartphone className="h-5 w-5" /> {fr ? 'Paiement Mobile Money' : 'Mobile Money payment'}</CardTitle>
            <CardDescription>{fr ? 'Orange Money, MTN, Moov, Wave…' : 'Orange Money, MTN, Moov, Wave…'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Plan */}
            <div className="space-y-2">
              <Label>{fr ? 'Plan' : 'Plan'}</Label>
              <div className="grid sm:grid-cols-3 gap-2">
                {plans.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPlanKey(p.key)}
                    className={`rounded-lg border p-3 text-left transition-all ${planKey === p.key ? 'ring-2 ring-primary border-primary' : 'hover:bg-muted/40'}`}
                  >
                    <div className="font-medium text-sm">{fr ? p.name.fr : p.name.en}</div>
                    <div className="text-lg font-bold">{p.price} <span className="text-xs font-normal text-muted-foreground">{p.currency}</span></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Operator */}
            <div className="space-y-2">
              <Label>{fr ? 'Opérateur' : 'Operator'}</Label>
              <div className="flex flex-wrap gap-2">
                {settings.payment.operators.map((op) => (
                  <Button key={op} type="button" size="sm" variant={operator === op ? 'default' : 'outline'} onClick={() => setOperator(op)}>
                    {OPERATOR_LABEL[op] || op}
                  </Button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>{fr ? 'Numéro de téléphone' : 'Phone number'}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="22997000000" inputMode="tel" />
              <p className="text-xs text-muted-foreground">{fr ? 'Format international sans +' : 'International format without +'}</p>
            </div>

            {/* OTP (some operators) */}
            <div className="space-y-2">
              <Label>{fr ? 'Code OTP (si demandé par l’opérateur)' : 'OTP code (if required)'}</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" className="w-40" />
            </div>

            {providerLink && (
              <a href={providerLink} target="_blank" rel="noreferrer" className="block text-sm text-primary underline">
                {fr ? 'Ouvrir la page de validation du paiement →' : 'Open the payment validation page →'}
              </a>
            )}
            {info && <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">{info}</div>}
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            <Button onClick={pay} size="lg" className="w-full" disabled={step === 'pending' || !settings.payment.configured}>
              {step === 'pending'
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {fr ? 'En attente de validation…' : 'Awaiting confirmation…'}</>
                : <>{fr ? 'Payer' : 'Pay'} {selectedPlan ? `${selectedPlan.price} ${selectedPlan.currency}` : ''}</>}
            </Button>
            {user.subscription.effectiveStatus === 'trial' && (
              <p className="text-center text-xs text-muted-foreground">
                {fr ? 'Vous êtes en essai gratuit — payez maintenant pour arrêter les publicités.' : "You're on a free trial — pay now to stop ads."}
              </p>
            )}
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Badge variant="outline" className="mr-1">{settings.payment.mode === 'live' ? 'LIVE' : 'TEST'}</Badge>
          {fr ? 'Paiement sécurisé via SebPay.' : 'Secure payment via SebPay.'}
        </p>
      </div>
    </div>
  );
}
