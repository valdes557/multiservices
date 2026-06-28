'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Palette, Image, Youtube, ScrollText, Video,
  Sparkles, Download, Copy, Check, LayoutTemplate,
} from 'lucide-react';

type ContentTab = 'banner' | 'thumbnail' | 'description' | 'script';

export default function ContentPage() {
  const { t, locale } = useLocale();
  const { isPremium, isTrialActive } = useAuth();
  const [activeTab, setActiveTab] = useState<ContentTab>('banner');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    topic: '', style: '', platform: 'youtube', tone: 'professional', length: 'medium',
  });

  const canUse = isPremium() || isTrialActive();

  const tabs = [
    { key: 'banner' as ContentTab, label: t('services.content.bannerGenerator') as string, icon: <Image className="h-4 w-4" /> },
    { key: 'thumbnail' as ContentTab, label: t('services.content.thumbnailGenerator') as string, icon: <Youtube className="h-4 w-4" /> },
    { key: 'description' as ContentTab, label: t('services.content.descriptionGenerator') as string, icon: <ScrollText className="h-4 w-4" /> },
    { key: 'script' as ContentTab, label: t('services.content.scriptGenerator') as string, icon: <Video className="h-4 w-4" /> },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      if (activeTab === 'description') {
        setResult(`🎬 ${formData.topic}\n\nIn this video, we explore ${formData.topic} in depth. Whether you're a beginner or experienced, this content will help you understand the key concepts and take your skills to the next level.\n\n🔥 What you'll learn:\n• Key fundamentals\n• Best practices\n• Pro tips and tricks\n\n⏰ Timestamps:\n00:00 - Introduction\n02:30 - Main Content\n10:00 - Summary\n\n👍 Like, Subscribe & Share!\n\n#${formData.topic.replace(/\s/g, '')} #Tutorial #Learning`);
      } else if (activeTab === 'script') {
        setResult(`[INTRO]\nHey everyone! Welcome back to the channel. Today we're diving into ${formData.topic}.\n\n[HOOK]\nHave you ever wondered about ${formData.topic}? Well, by the end of this video, you'll know exactly how to master it.\n\n[MAIN CONTENT]\nLet's start with the basics...\n\nFirst, ${formData.topic} is important because...\n\nSecond, the key strategies are...\n\nThird, let me show you a practical example...\n\n[OUTRO]\nAnd that's it! If you found this helpful, don't forget to like and subscribe. Drop a comment below with your thoughts. See you in the next one!`);
      } else {
        setResult('');
      }
      setGenerating(false);
    }, 2000);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('categories.content') as string}</h1>
            <p className="text-muted-foreground">{t('categories.contentDesc') as string}</p>
          </div>
        </div>

        {/* Featured: Flyer generator */}
        <Link href="/services/content/flyer" className="block mb-6">
          <div className="flex items-center justify-between gap-4 rounded-xl border bg-gradient-to-r from-pink-500/10 to-violet-500/10 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-500/15 text-pink-600">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{locale === 'en' ? 'Professional Flyer Generator' : 'Générateur de flyers professionnels'}</p>
                <p className="text-sm text-muted-foreground">{locale === 'en' ? 'Design & export print-ready flyers (PNG / PDF)' : 'Créez et exportez des flyers prêts à imprimer (PNG / PDF)'}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">{locale === 'en' ? 'Open' : 'Ouvrir'}</Button>
          </div>
        </Link>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => { setActiveTab(tab.key); setResult(''); }}
            >
              {tab.icon}
              <span className="ml-2 whitespace-nowrap">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Banner / Thumbnail Generator */}
        {(activeTab === 'banner' || activeTab === 'thumbnail') && (
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === 'banner' ? (t('services.content.bannerGenerator') as string) : (t('services.content.thumbnailGenerator') as string)}</CardTitle>
              <CardDescription>
                {activeTab === 'banner'
                  ? 'Create stunning banners for your social media and website'
                  : 'Generate eye-catching thumbnails for your YouTube videos'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title / Topic</Label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Enter your title or topic..."
                />
              </div>
              <div className="space-y-2">
                <Label>Style</Label>
                <div className="flex gap-2 flex-wrap">
                  {['Modern', 'Minimalist', 'Bold', 'Colorful', 'Dark', 'Gradient'].map((s) => (
                    <Button
                      key={s}
                      variant={formData.style === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, style: s })}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preview area */}
              <div className={`rounded-xl border-2 border-dashed flex items-center justify-center ${
                activeTab === 'banner' ? 'h-48' : 'h-64 aspect-video max-w-md mx-auto'
              } bg-muted/30`}>
                <div className="text-center text-muted-foreground">
                  <Image className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">Preview will appear here</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleGenerate} disabled={generating || !formData.topic}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate'}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description / Script Generator */}
        {(activeTab === 'description' || activeTab === 'script') && (
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === 'description' ? (t('services.content.descriptionGenerator') as string) : (t('services.content.scriptGenerator') as string)}</CardTitle>
              <CardDescription>
                {activeTab === 'description'
                  ? 'Generate optimized YouTube descriptions with keywords and timestamps'
                  : 'Create complete video scripts with intro, content, and outro'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Topic / Video Title</Label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="What is your video about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="funny">Funny</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Length</Label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="short">Short (5 min)</option>
                    <option value="medium">Medium (10 min)</option>
                    <option value="long">Long (20+ min)</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={generating || !formData.topic}>
                <Sparkles className="h-4 w-4 mr-2" />
                {generating ? 'Generating...' : 'Generate'}
              </Button>

              {result && (
                <div className="relative">
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={copyResult}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
