'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                MS
              </div>
              <span className="font-bold text-lg">{t('common.appName') as string}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('common.tagline') as string}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('common.services') as string}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services/translation" className="hover:text-foreground transition-colors">{t('categories.translation') as string}</Link></li>
              <li><Link href="/services/learning" className="hover:text-foreground transition-colors">{t('categories.learning') as string}</Link></li>
              <li><Link href="/services/documents" className="hover:text-foreground transition-colors">{t('categories.documents') as string}</Link></li>
              <li><Link href="/services/conversion" className="hover:text-foreground transition-colors">{t('categories.conversion') as string}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Plus</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services/professional" className="hover:text-foreground transition-colors">{t('categories.professional') as string}</Link></li>
              <li><Link href="/services/content" className="hover:text-foreground transition-colors">{t('categories.content') as string}</Link></li>
              <li><Link href="/services/business" className="hover:text-foreground transition-colors">{t('categories.business') as string}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy') as string}</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">{t('footer.terms') as string}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{t('footer.contact') as string}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {year} {t('common.appName') as string}. {t('footer.rights') as string}.
        </div>
      </div>
    </footer>
  );
}
