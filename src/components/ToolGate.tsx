'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToolAccess } from '@/hooks/useToolAccess';
import { useAuth } from '@/context/AuthContext';

/**
 * Wraps a premium tool's UI. Renders children only when the current user is
 * entitled to the tool; otherwise shows a lock + upgrade/login CTA.
 */
export default function ToolGate({ toolKey, children }: { toolKey: string; children: React.ReactNode }) {
  const { user } = useAuth();
  const { loading, found, allowed, planKeys, isPremium } = useToolAccess(toolKey);

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground text-sm">Chargement…</div>;
  }

  // Unknown tool or free tool -> render freely.
  if (!found || !isPremium || allowed) return <>{children}</>;

  return (
    <Card className="mx-auto max-w-lg text-center p-8 border-2 border-primary/20">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Lock className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Outil réservé aux abonnés</h3>
      <p className="text-muted-foreground mb-1">
        Cet outil est disponible avec le(s) plan(s) :{' '}
        <span className="font-medium text-foreground">{planKeys.length ? planKeys.join(', ') : 'premium'}</span>.
      </p>
      <p className="text-muted-foreground mb-6 text-sm">
        {user ? 'Activez un essai ou payez votre abonnement pour y accéder.' : 'Connectez-vous puis choisissez un plan.'}
      </p>
      <div className="flex justify-center gap-3">
        {user ? (
          <Link href="/subscribe"><Button>Voir les plans</Button></Link>
        ) : (
          <>
            <Link href="/auth/login"><Button variant="outline">Se connecter</Button></Link>
            <Link href="/pricing"><Button>Voir les tarifs</Button></Link>
          </>
        )}
      </div>
    </Card>
  );
}
