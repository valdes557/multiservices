'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe, BookOpen, FileText, RefreshCw, Briefcase, Palette, TrendingUp,
  Languages, Mic, MessageSquare, GraduationCap, Award,
  FileEdit, Merge, Scissors, Minimize2, Type, Image, PenTool, Highlighter,
  Receipt, Zap as ZapIcon,
  ArrowRightLeft,
  FileOutput, FileInput,
  UserCircle, FileSignature,
  Youtube, LayoutTemplate, ScrollText, Video,
  LineChart, Tag, Megaphone, Facebook, Instagram, MessageCircle,
} from 'lucide-react';

interface ServiceItem {
  key: string;
  icon: React.ReactNode;
  premium?: boolean;
}

interface ServiceCategory {
  id: string;
  icon: React.ReactNode;
  color: string;
  items: ServiceItem[];
}

export default function ServicesPage() {
  const { t } = useLocale();

  const categories: ServiceCategory[] = [
    {
      id: 'translation',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { key: 'textTranslation', icon: <Languages className="h-5 w-5" /> },
        { key: 'pdfTranslation', icon: <FileText className="h-5 w-5" />, premium: true },
        { key: 'wordTranslation', icon: <FileEdit className="h-5 w-5" />, premium: true },
        { key: 'audioTranslation', icon: <Mic className="h-5 w-5" />, premium: true },
        { key: 'grammarCorrection', icon: <Type className="h-5 w-5" /> },
        { key: 'pronunciation', icon: <Mic className="h-5 w-5" /> },
        { key: 'chatPractice', icon: <MessageSquare className="h-5 w-5" /> },
      ],
    },
    {
      id: 'learning',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      items: [
        { key: 'allLanguages', icon: <GraduationCap className="h-5 w-5" /> },
        { key: 'exercises', icon: <BookOpen className="h-5 w-5" /> },
        { key: 'progress', icon: <LineChart className="h-5 w-5" /> },
        { key: 'certificate', icon: <Award className="h-5 w-5" />, premium: true },
      ],
    },
    {
      id: 'documents',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-orange-500 to-amber-500',
      items: [
        { key: 'readEdit', icon: <FileEdit className="h-5 w-5" /> },
        { key: 'merge', icon: <Merge className="h-5 w-5" /> },
        { key: 'split', icon: <Scissors className="h-5 w-5" /> },
        { key: 'compress', icon: <Minimize2 className="h-5 w-5" /> },
        { key: 'addText', icon: <Type className="h-5 w-5" />, premium: true },
        { key: 'addImage', icon: <Image className="h-5 w-5" />, premium: true },
        { key: 'addSignature', icon: <PenTool className="h-5 w-5" />, premium: true },
        { key: 'annotate', icon: <Highlighter className="h-5 w-5" />, premium: true },
        { key: 'officialDocs', icon: <Receipt className="h-5 w-5" />, premium: true },
      ],
    },
    {
      id: 'conversion',
      icon: <RefreshCw className="h-6 w-6" />,
      color: 'from-purple-500 to-violet-500',
      items: [
        { key: 'pdfToWord', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { key: 'pdfToExcel', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { key: 'pdfToPpt', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { key: 'wordToPdf', icon: <FileOutput className="h-5 w-5" /> },
        { key: 'txtToPdf', icon: <FileOutput className="h-5 w-5" /> },
        { key: 'imgToPdf', icon: <FileInput className="h-5 w-5" /> },
        { key: 'pdfToImg', icon: <FileOutput className="h-5 w-5" /> },
      ],
    },
    {
      id: 'professional',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'from-slate-500 to-gray-500',
      items: [
        { key: 'cvGenerator', icon: <UserCircle className="h-5 w-5" /> },
        { key: 'coverLetter', icon: <ScrollText className="h-5 w-5" /> },
        { key: 'templates', icon: <LayoutTemplate className="h-5 w-5" /> },
        { key: 'signature', icon: <FileSignature className="h-5 w-5" />, premium: true },
      ],
    },
    {
      id: 'content',
      icon: <Palette className="h-6 w-6" />,
      color: 'from-pink-500 to-rose-500',
      items: [
        { key: 'bannerGenerator', icon: <Image className="h-5 w-5" /> },
        { key: 'thumbnailGenerator', icon: <Youtube className="h-5 w-5" /> },
        { key: 'descriptionGenerator', icon: <ScrollText className="h-5 w-5" /> },
        { key: 'scriptGenerator', icon: <Video className="h-5 w-5" /> },
      ],
    },
    {
      id: 'business',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-indigo-500 to-blue-500',
      items: [
        { key: 'businessPlan', icon: <LineChart className="h-5 w-5" /> },
        { key: 'brandName', icon: <Tag className="h-5 w-5" /> },
        { key: 'slogans', icon: <Megaphone className="h-5 w-5" /> },
        { key: 'marketingText', icon: <ScrollText className="h-5 w-5" /> },
        { key: 'facebook', icon: <Facebook className="h-5 w-5" /> },
        { key: 'instagram', icon: <Instagram className="h-5 w-5" /> },
        { key: 'whatsapp', icon: <MessageCircle className="h-5 w-5" /> },
      ],
    },
  ];

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('common.services') as string}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('common.tagline') as string}</p>
        </div>

        <div className="space-y-12">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${cat.color} text-white`}>
                  {cat.icon}
                </div>
                <h2 className="text-2xl font-bold">{t(`categories.${cat.id}`) as string}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.items.map((item) => (
                  <Link key={item.key} href={`/services/${cat.id}/${item.key}`}>
                    <Card className="group h-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {t(`services.${cat.id}.${item.key}`) as string}
                          </p>
                        </div>
                        {item.premium && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">PRO</Badge>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
