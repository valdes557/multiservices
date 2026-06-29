'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable "back" button shown at the top of pages and after actions.
 * Uses the browser history; falls back to a provided href when there is no
 * history entry to go back to (e.g. a freshly opened tab).
 */
export default function BackButton({
  href,
  label,
  className = '',
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const text = label || (locale === 'en' ? 'Back' : 'Retour');

  const onClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(href || '/');
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`mb-4 -ml-2 text-muted-foreground hover:text-foreground ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      {text}
    </Button>
  );
}
