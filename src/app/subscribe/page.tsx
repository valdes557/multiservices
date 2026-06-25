'use client';

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown, Coins, Wallet, Copy, Check, ArrowRight,
  Shield, Clock, Zap, Globe, CheckCircle2,
} from 'lucide-react';

export default function SubscribePage() {
  const { t } = useLocale();
  const { user, isPremium, isTrialActive } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'usdt' | 'binance'>('usdt');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = 'TXrk4w7bAT8kLQSQmg9Y6YYXC4VdGE4pXz';

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('Please enter your transaction ID');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod === 'usdt' ? 'USDT (TRC20)' : 'Binance Pay',
          transactionId: transactionId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (isPremium() && !isTrialActive()) {
    return (
      <div className="py-16">
        <div className="container max-w-lg text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">You&apos;re already Premium!</h1>
          <p className="text-muted-foreground mb-6">
            Enjoy unlimited access to all services without ads.
          </p>
          <Badge className="text-sm px-4 py-1.5">
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Active Premium
          </Badge>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-16">
        <div className="container max-w-lg text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your premium subscription is now active. Enjoy unlimited access to all services.
          </p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{t('common.upgradeNow') as string}</h1>
          <p className="text-muted-foreground">
            Unlock all premium features for just ${t('pricing.price') as string}/month
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Premium Benefits</h2>
            <div className="space-y-3">
              {[
                { icon: <Zap className="h-5 w-5 text-amber-500" />, text: 'Unlimited access to all services' },
                { icon: <Shield className="h-5 w-5 text-green-500" />, text: 'No ads experience' },
                { icon: <Globe className="h-5 w-5 text-blue-500" />, text: 'Premium translation features' },
                { icon: <Crown className="h-5 w-5 text-purple-500" />, text: 'Advanced document tools' },
                { icon: <Clock className="h-5 w-5 text-orange-500" />, text: 'Priority support' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                  {item.icon}
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose Payment Method</CardTitle>
              <CardDescription>Select your preferred crypto payment method</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    className={`cursor-pointer transition-all ${paymentMethod === 'usdt' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setPaymentMethod('usdt')}
                  >
                    <CardContent className="flex flex-col items-center p-4 gap-2">
                      <Coins className="h-6 w-6 text-yellow-500" />
                      <span className="text-sm font-medium">USDT (TRC20)</span>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${paymentMethod === 'binance' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setPaymentMethod('binance')}
                  >
                    <CardContent className="flex flex-col items-center p-4 gap-2">
                      <Wallet className="h-6 w-6 text-amber-500" />
                      <span className="text-sm font-medium">Binance Pay</span>
                    </CardContent>
                  </Card>
                </div>

                {/* Wallet Address */}
                {paymentMethod === 'usdt' && (
                  <div className="space-y-2">
                    <Label>Send $9.99 USDT (TRC20) to:</Label>
                    <div className="flex gap-2">
                      <Input value={walletAddress} readOnly className="font-mono text-xs" />
                      <Button type="button" variant="outline" size="icon" onClick={copyAddress}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'binance' && (
                  <div className="p-4 rounded-lg border bg-muted/30 text-center">
                    <Wallet className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <p className="text-sm font-medium mb-1">Binance Pay ID: 123456789</p>
                    <p className="text-xs text-muted-foreground">Send $9.99 via Binance Pay</p>
                  </div>
                )}

                {/* Transaction ID */}
                <div className="space-y-2">
                  <Label>Transaction ID / Hash</Label>
                  <Input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Paste your transaction ID here..."
                    className="font-mono text-xs"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    After sending the payment, paste the transaction ID above for verification.
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" size="lg" disabled={loading || !user}>
                  {loading ? 'Processing...' : `Pay $${t('pricing.price') as string} & Activate Premium`}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
