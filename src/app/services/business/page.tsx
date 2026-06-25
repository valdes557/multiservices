'use client';

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, LineChart, Tag, Megaphone, ScrollText,
  Facebook, Instagram, MessageCircle,
  Sparkles, Copy, Check, ArrowRight,
} from 'lucide-react';

type BusinessTab = 'businessPlan' | 'brandName' | 'slogans' | 'marketingText' | 'social';

export default function BusinessPage() {
  const { t } = useLocale();
  const { isPremium, isTrialActive } = useAuth();
  const [activeTab, setActiveTab] = useState<BusinessTab>('businessPlan');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState<'facebook' | 'instagram' | 'whatsapp'>('facebook');

  const [formData, setFormData] = useState({
    businessName: '', industry: '', target: '', description: '', budget: '',
  });

  const canUse = isPremium() || isTrialActive();

  const tabs = [
    { key: 'businessPlan' as BusinessTab, label: t('services.business.businessPlan') as string, icon: <LineChart className="h-4 w-4" /> },
    { key: 'brandName' as BusinessTab, label: t('services.business.brandName') as string, icon: <Tag className="h-4 w-4" /> },
    { key: 'slogans' as BusinessTab, label: t('services.business.slogans') as string, icon: <Megaphone className="h-4 w-4" /> },
    { key: 'marketingText' as BusinessTab, label: t('services.business.marketingText') as string, icon: <ScrollText className="h-4 w-4" /> },
    { key: 'social' as BusinessTab, label: 'Social Media', icon: <Facebook className="h-4 w-4" /> },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      switch (activeTab) {
        case 'businessPlan':
          setResult(`📋 BUSINESS PLAN: ${formData.businessName || 'Your Business'}\n\n1. EXECUTIVE SUMMARY\n${formData.description || 'A brief overview of the business...'}\n\n2. MARKET ANALYSIS\nIndustry: ${formData.industry || 'Technology'}\nTarget Market: ${formData.target || 'Young professionals aged 25-40'}\nMarket Size: Growing at 15% annually\n\n3. PRODUCTS/SERVICES\n• Core offering description\n• Value proposition\n• Competitive advantages\n\n4. MARKETING STRATEGY\n• Digital marketing campaigns\n• Social media presence\n• Content marketing\n• Partnership opportunities\n\n5. FINANCIAL PROJECTIONS\nEstimated Budget: ${formData.budget || '$10,000'}\n• Year 1: Revenue target\n• Year 2: Growth projections\n• Break-even analysis\n\n6. OPERATIONS PLAN\n• Team structure\n• Key milestones\n• Timeline`);
          break;
        case 'brandName':
          setResult(`🏷️ BRAND NAME SUGGESTIONS for "${formData.industry || 'Technology'}" industry:\n\n1. NovaTech Solutions\n2. Apex Dynamics\n3. PrimeVerse\n4. BrightPath Co.\n5. ZenithFlow\n6. PulseWave\n7. EverGreen Digital\n8. SkySpark Innovations\n9. CoreVision Labs\n10. BluePrint Studios\n\n✨ Each name is checked for:\n• Memorability\n• Domain availability potential\n• Brand personality alignment\n• International appeal`);
          break;
        case 'slogans':
          setResult(`💬 SLOGAN IDEAS for "${formData.businessName || 'Your Brand'}":\n\n1. "Innovation at Every Step"\n2. "Where Ideas Meet Reality"\n3. "Building Tomorrow, Today"\n4. "Your Success, Our Mission"\n5. "Think Bold. Act Smart."\n6. "Beyond Ordinary"\n7. "Transforming Possibilities"\n8. "Excellence Redefined"\n9. "Smart Solutions for Smart People"\n10. "Where Quality Meets Passion"`);
          break;
        case 'marketingText':
          setResult(`📝 MARKETING COPY:\n\n🔥 HEADLINE:\n"Transform Your ${formData.industry || 'Business'} with ${formData.businessName || 'Our Solution'}"\n\n📄 BODY:\nAre you tired of [pain point]? We understand. That's why we created ${formData.businessName || 'our platform'} — the ultimate solution for ${formData.target || 'professionals'} who want results.\n\n✅ What makes us different:\n• Fast & reliable results\n• Trusted by 10,000+ users\n• 24/7 support\n• Money-back guarantee\n\n🎯 CTA:\nStart your free trial today and see the difference.\n\n📧 EMAIL VERSION:\nSubject: Ready to 10x your ${formData.industry || 'business'}?\nPreview: Join thousands who already made the switch...`);
          break;
        case 'social':
          if (socialPlatform === 'facebook') {
            setResult(`📘 FACEBOOK POST:\n\n🚀 Exciting news! ${formData.businessName || 'We'} just launched something amazing for ${formData.target || 'our community'}!\n\n${formData.description || 'Check out our latest offering that will transform the way you work.'}\n\n💡 Key Benefits:\n✅ Save time\n✅ Increase productivity\n✅ Professional results\n\n👉 Click the link in bio to learn more!\n\n#${formData.industry?.replace(/\s/g, '') || 'Business'} #Innovation #Growth #Entrepreneur`);
          } else if (socialPlatform === 'instagram') {
            setResult(`📸 INSTAGRAM CAPTION:\n\n✨ ${formData.businessName || 'Big things'} are happening! 🔥\n\nWe're thrilled to introduce our latest ${formData.industry || 'solution'} designed specifically for ${formData.target || 'go-getters like you'}.\n\n💪 What you get:\n→ Professional quality\n→ Lightning fast\n→ Easy to use\n\nDouble tap if you're ready! ❤️\n\n.\n.\n.\n#${formData.industry?.replace(/\s/g, '') || 'Business'} #Startup #Motivation #Success #Entrepreneur #Growth #Innovation #Goals`);
          } else {
            setResult(`📱 WHATSAPP BROADCAST MESSAGE:\n\n👋 Hello!\n\n🎉 ${formData.businessName || 'We have'} exciting news for you!\n\nWe just launched our new ${formData.industry || 'service'} and we think you'll love it.\n\n🔥 Special offer:\n• 50% off for early adopters\n• Free trial available\n• No commitment required\n\n👉 Reply "INFO" to learn more\n👉 Reply "TRIAL" to start your free trial\n\nThank you for being part of our community! 🙏`);
          }
          break;
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('categories.business') as string}</h1>
            <p className="text-muted-foreground">{t('categories.businessDesc') as string}</p>
          </div>
        </div>

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

        {/* Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{tabs.find(t => t.key === activeTab)?.label}</CardTitle>
            <CardDescription>Fill in details to generate professional content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Your business name"
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Fashion, Food"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="e.g., Young professionals, Students"
                />
              </div>
              {activeTab === 'businessPlan' && (
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <Input
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., $10,000"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your business, product, or service..."
                rows={3}
              />
            </div>

            {/* Social Platform Selector */}
            {activeTab === 'social' && (
              <div className="space-y-2">
                <Label>Platform</Label>
                <div className="flex gap-2">
                  {[
                    { key: 'facebook' as const, icon: <Facebook className="h-4 w-4" />, label: 'Facebook' },
                    { key: 'instagram' as const, icon: <Instagram className="h-4 w-4" />, label: 'Instagram' },
                    { key: 'whatsapp' as const, icon: <MessageCircle className="h-4 w-4" />, label: 'WhatsApp' },
                  ].map((p) => (
                    <Button
                      key={p.key}
                      variant={socialPlatform === p.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSocialPlatform(p.key)}
                    >
                      {p.icon}
                      <span className="ml-2">{p.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleGenerate} disabled={generating}>
              <Sparkles className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Result</CardTitle>
                <Button variant="ghost" size="sm" onClick={copyResult}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{result}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
