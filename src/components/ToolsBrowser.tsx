'use client';

import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { Lock } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { useTools, type PublicTool } from '@/hooks/useTools';
import { planAllowsTool } from '@/lib/entitlements';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CATEGORY_LABEL: Record<string, { fr: string; en: string }> = {
  translation: { fr: 'Traduction', en: 'Translation' },
  learning: { fr: 'Apprentissage', en: 'Learning' },
  documents: { fr: 'Documents', en: 'Documents' },
  conversion: { fr: 'Conversion', en: 'Conversion' },
  professional: { fr: 'Professionnel', en: 'Professional' },
  content: { fr: 'Contenu', en: 'Content' },
  business: { fr: 'Business', en: 'Business' },
};

function ToolIcon({ name }: { name: string }) {
  const Cmp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
    || LucideIcons.Wrench;
  return <Cmp className="h-5 w-5" />;
}

/**
 * Dynamic, DB-driven tool catalogue. Each tool is rendered from the admin's
 * configuration; access is decided by the user's selected plan (planAllowsTool).
 * Tools the user's plan doesn't grant are shown locked and route to /pricing.
 */
export default function ToolsBrowser({ limit, showHeading = true }: { limit?: number; showHeading?: boolean }) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const { tools, loading } = useTools();
  const fr = locale === 'fr';

  if (loading) {
    return <p className="text-center text-sm text-muted-foreground py-8">{fr ? 'Chargement des outils…' : 'Loading tools…'}</p>;
  }
  if (tools.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-8">{fr ? 'Aucun outil disponible.' : 'No tools available.'}</p>;
  }

  const shown = typeof limit === 'number' ? tools.slice(0, limit) : tools;

  // Group by category, preserving order.
  const groups: Record<string, PublicTool[]> = {};
  for (const tool of shown) {
    (groups[tool.category] ||= []).push(tool);
  }

  return (
    <div className="space-y-10">
      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat}>
          {showHeading && (
            <h2 className="text-2xl font-bold mb-4">
              {CATEGORY_LABEL[cat] ? (fr ? CATEGORY_LABEL[cat].fr : CATEGORY_LABEL[cat].en) : cat}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((tool) => {
              const allowed = planAllowsTool(user?.subscription, tool);
              const href = allowed ? (tool.href || '/services') : '/pricing';
              return (
                <Link key={tool.key} href={href}>
                  <Card className={`group h-full transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${allowed ? 'hover:shadow-md' : 'opacity-70'}`}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ToolIcon name={tool.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {fr ? tool.name.fr : tool.name.en}
                        </p>
                      </div>
                      {!allowed && (
                        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      {tool.isPremium && allowed && (
                        <Badge variant="secondary" className="text-[10px] shrink-0">PRO</Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
