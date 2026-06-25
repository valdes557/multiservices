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
  Briefcase, UserCircle, ScrollText, LayoutTemplate, FileSignature,
  Download, Eye, Sparkles, ArrowRight,
} from 'lucide-react';

const templates = [
  { id: 'modern', name: 'Modern', color: 'bg-blue-500' },
  { id: 'classic', name: 'Classic', color: 'bg-slate-700' },
  { id: 'creative', name: 'Creative', color: 'bg-pink-500' },
  { id: 'minimal', name: 'Minimal', color: 'bg-gray-400' },
];

export default function ProfessionalPage() {
  const { t } = useLocale();
  const { isPremium, isTrialActive } = useAuth();
  const [activeTab, setActiveTab] = useState<'cv' | 'cover' | 'templates'>('cv');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [generating, setGenerating] = useState(false);

  const canUse = isPremium() || isTrialActive();

  const [cvData, setCvData] = useState({
    fullName: '', email: '', phone: '', title: '',
    summary: '', experience: '', education: '', skills: '',
  });

  const [coverData, setCoverData] = useState({
    company: '', position: '', body: '',
  });

  const handleGenerateCV = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const handleGenerateCover = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const tabs = [
    { key: 'cv' as const, label: t('services.professional.cvGenerator') as string, icon: <UserCircle className="h-4 w-4" /> },
    { key: 'cover' as const, label: t('services.professional.coverLetter') as string, icon: <ScrollText className="h-4 w-4" /> },
    { key: 'templates' as const, label: t('services.professional.templates') as string, icon: <LayoutTemplate className="h-4 w-4" /> },
  ];

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-500/10 text-slate-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('categories.professional') as string}</h1>
            <p className="text-muted-foreground">{t('categories.professionalDesc') as string}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b pb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* CV Generator */}
        {activeTab === 'cv' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('services.professional.cvGenerator') as string}</CardTitle>
                  <CardDescription>Fill in your details to generate a professional CV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={cvData.fullName} onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input value={cvData.title} onChange={(e) => setCvData({ ...cvData, title: e.target.value })} placeholder="Software Engineer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={cvData.email} onChange={(e) => setCvData({ ...cvData, email: e.target.value })} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={cvData.phone} onChange={(e) => setCvData({ ...cvData, phone: e.target.value })} placeholder="+1 234 567 890" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Summary</Label>
                    <Textarea value={cvData.summary} onChange={(e) => setCvData({ ...cvData, summary: e.target.value })} placeholder="Brief description of your professional background..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience</Label>
                    <Textarea value={cvData.experience} onChange={(e) => setCvData({ ...cvData, experience: e.target.value })} placeholder="Company - Role - Duration&#10;Key achievements..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Textarea value={cvData.education} onChange={(e) => setCvData({ ...cvData, education: e.target.value })} placeholder="Degree - Institution - Year" rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <Input value={cvData.skills} onChange={(e) => setCvData({ ...cvData, skills: e.target.value })} placeholder="JavaScript, React, Python, Leadership..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleGenerateCV} disabled={generating}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {generating ? 'Generating...' : 'Generate CV'}
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Template Selector */}
            <div className="space-y-4">
              <h3 className="font-semibold">Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((tmpl) => (
                  <Card
                    key={tmpl.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === tmpl.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`h-24 rounded-md ${tmpl.color} mb-2`} />
                      <p className="text-xs font-medium">{tmpl.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {activeTab === 'cover' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('services.professional.coverLetter') as string}</CardTitle>
              <CardDescription>Generate a professional cover letter for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={coverData.company} onChange={(e) => setCoverData({ ...coverData, company: e.target.value })} placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input value={coverData.position} onChange={(e) => setCoverData({ ...coverData, position: e.target.value })} placeholder="Software Developer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Details</Label>
                <Textarea value={coverData.body} onChange={(e) => setCoverData({ ...coverData, body: e.target.value })} placeholder="Add any specific details or requirements you want to include..." rows={6} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleGenerateCover} disabled={generating}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate Letter'}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Templates Gallery */}
        {activeTab === 'templates' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {['CV Modern', 'CV Classic', 'CV Creative', 'CV Minimal', 'Cover Formal', 'Cover Modern', 'Invoice', 'Receipt'].map((name, i) => (
                <Card key={i} className="group cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="h-40 rounded-md bg-gradient-to-br from-muted to-muted/50 mb-3 flex items-center justify-center">
                      <FileSignature className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{name}</p>
                      {i > 3 && <Badge variant="secondary" className="text-[10px]">PRO</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
