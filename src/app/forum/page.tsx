'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessagesSquare, Lock, ArrowRight } from 'lucide-react';

interface ForumItem {
  planKey: string;
  name: { fr: string; en: string };
  forumOpen: boolean;
  canAccess: boolean;
  isMine: boolean;
}

export default function ForumIndexPage() {
  const { user, token } = useAuth();
  const { locale } = useLocale();
  const fr = locale !== 'en';
  const [forums, setForums] = useState<ForumItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/forums', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setForums(d.forums || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="py-16">
        <div className="container max-w-md text-center">
          <MessagesSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">{fr ? 'Forums des plans' : 'Plan forums'}</h1>
          <p className="text-muted-foreground mb-6">{fr ? 'Connectez-vous pour rejoindre le forum de votre plan.' : 'Sign in to join your plan forum.'}</p>
          <Link href="/auth/login"><Button>{fr ? 'Se connecter' : 'Sign in'}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <MessagesSquare className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">{fr ? 'Forums' : 'Forums'}</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          {fr ? 'Échangez avec les autres membres de votre plan. Accès inclus pendant l’essai et l’abonnement.' : 'Chat with other members of your plan. Access included during trial and subscription.'}
        </p>

        {loading ? (
          <p className="text-sm text-muted-foreground">{fr ? 'Chargement…' : 'Loading…'}</p>
        ) : (
          <div className="space-y-3">
            {forums.map((f) => (
              <Card key={f.planKey}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {fr ? f.name.fr : f.name.en}
                      {f.isMine && <Badge variant="secondary">{fr ? 'mon plan' : 'my plan'}</Badge>}
                      {!f.forumOpen && <Badge variant="destructive">{fr ? 'fermé' : 'closed'}</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.planKey}</div>
                  </div>
                  {f.canAccess ? (
                    <Link href={`/forum/${f.planKey}`}>
                      <Button size="sm">{fr ? 'Ouvrir' : 'Open'} <ArrowRight className="h-4 w-4 ml-1" /></Button>
                    </Link>
                  ) : (
                    <Link href="/subscribe">
                      <Button size="sm" variant="outline"><Lock className="h-4 w-4 mr-1" /> {fr ? 'Rejoindre' : 'Join'}</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
            {forums.length === 0 && <p className="text-sm text-muted-foreground">{fr ? 'Aucun forum disponible.' : 'No forum available.'}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
