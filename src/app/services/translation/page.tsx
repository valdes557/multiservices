'use client';

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import TrialAd from '@/components/TrialAd';
import { Globe, ArrowRightLeft, Volume2, Copy, Check } from 'lucide-react';

const languages = [
  { code: 'fr', name: 'Français' }, { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }, { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' }, { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' }, { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }, { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' }, { code: 'sw', name: 'Kiswahili' },
  { code: 'hi', name: 'हिन्दी' }, { code: 'tr', name: 'Türkçe' },
];

export default function TranslationPage() {
  const { t } = useLocale();
  const { isPremium, isTrialActive } = useAuth();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    // Simulated translation - in production, connect to a translation API
    setTimeout(() => {
      setTranslatedText(`[Translated from ${sourceLang} to ${targetLang}]: ${sourceText}`);
      setLoading(false);
    }, 1000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canUse = isPremium() || isTrialActive();

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('services.translation.title') as string}</h1>
            <p className="text-muted-foreground">{t('categories.translationDesc') as string}</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          <Button variant="outline" size="icon" onClick={swapLanguages} className="shrink-0">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {languages.find(l => l.code === sourceLang)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t('services.translation.textTranslation') as string}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[200px] border-0 resize-none focus-visible:ring-0 p-0"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">{sourceText.length} chars</span>
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {languages.find(l => l.code === targetLang)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] text-sm">
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    {t('common.processing') as string}
                  </div>
                ) : translatedText ? (
                  <p>{translatedText}</p>
                ) : (
                  <p className="text-muted-foreground">{t('services.translation.textTranslation') as string}...</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">{translatedText.length} chars</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!translatedText}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleTranslate} disabled={loading || !sourceText.trim()} className="px-12">
            {loading ? (t('common.processing') as string) : (t('services.translation.textTranslation') as string)}
          </Button>
        </div>

        {translatedText && <TrialAd />}

        {!canUse && (
          <div className="mt-6 text-center">
            <Badge variant="secondary" className="px-4 py-2">
              {t('common.upgradeNow') as string}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
