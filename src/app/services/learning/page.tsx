'use client';

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, GraduationCap, Award, Play, CheckCircle2,
  Globe, Star, ArrowRight, Timer,
} from 'lucide-react';

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧', level: 'A1-C2' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', level: 'A1-C2' },
  { code: 'es', name: 'Español', flag: '🇪🇸', level: 'A1-B2' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', level: 'A1-B2' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', level: 'A1-B1' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', level: 'A1-B1' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', level: 'A1-B1' },
  { code: 'zh', name: '中文', flag: '🇨🇳', level: 'A1-B1' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', level: 'A1-A2' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', level: 'A1-A2' },
];

const lessons = [
  { id: 1, title: 'Greetings & Introductions', duration: '15 min', completed: true, level: 'A1' },
  { id: 2, title: 'Numbers & Counting', duration: '20 min', completed: true, level: 'A1' },
  { id: 3, title: 'Family & Relationships', duration: '25 min', completed: false, level: 'A1' },
  { id: 4, title: 'Daily Routines', duration: '20 min', completed: false, level: 'A1' },
  { id: 5, title: 'Food & Dining', duration: '25 min', completed: false, level: 'A2' },
  { id: 6, title: 'Travel & Directions', duration: '30 min', completed: false, level: 'A2' },
];

export default function LearningPage() {
  const { t } = useLocale();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  if (!selectedLang) {
    return (
      <div className="py-8">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('categories.learning') as string}</h1>
              <p className="text-muted-foreground">{t('categories.learningDesc') as string}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Choose a language to learn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {availableLanguages.map((lang) => (
              <Card
                key={lang.code}
                className="group cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                onClick={() => setSelectedLang(lang.code)}
              >
                <CardContent className="flex flex-col items-center p-6 text-center gap-2">
                  <span className="text-4xl">{lang.flag}</span>
                  <p className="font-medium">{lang.name}</p>
                  <Badge variant="secondary" className="text-[10px]">{lang.level}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const lang = availableLanguages.find((l) => l.code === selectedLang)!;
  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <BackButton href="/services" />
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{lang.flag}</span>
            <div>
              <h1 className="text-2xl font-bold">{lang.name}</h1>
              <p className="text-muted-foreground">{t('categories.learning') as string}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedLang(null)}>
            <Globe className="h-4 w-4 mr-2" /> Change Language
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-xl font-bold">{progressPercent}%</p>
                <Progress value={progressPercent} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-xl font-bold">A1</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificate</p>
                <Badge variant="secondary">Not yet</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons */}
        <h2 className="text-lg font-semibold mb-4">Lessons</h2>
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className={`${lesson.completed ? 'bg-muted/30' : ''}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  lesson.completed
                    ? 'bg-green-100 text-green-600'
                    : index === completedCount
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {lesson.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{lesson.id}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="h-3 w-3" /> {lesson.duration}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{lesson.level}</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={lesson.completed ? 'outline' : index === completedCount ? 'default' : 'ghost'}
                  disabled={index > completedCount}
                >
                  {lesson.completed ? 'Review' : index === completedCount ? (
                    <>Start <ArrowRight className="h-3 w-3 ml-1" /></>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
