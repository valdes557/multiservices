'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/context/LocaleContext';

export function ToolLayout({ title, description, icon, premium, children }: {
  title: string; description: string; icon?: React.ReactNode; premium?: boolean; children: React.ReactNode;
}) {
  const { locale } = useLocale();
  const backLabel = locale === 'en' ? 'All tools' : 'Tous les outils';
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" /> {backLabel}
      </Link>
      <div className="mb-8 flex items-start gap-4">
        {icon && <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div>}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {premium && <Badge className="bg-amber-500 hover:bg-amber-500">Premium</Badge>}
          </div>
          <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}