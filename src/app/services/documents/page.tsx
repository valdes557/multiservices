'use client';

import React, { useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Upload, FileEdit, Merge, Scissors, Minimize2,
  Type, Image, PenTool, Highlighter, Receipt, Download, Eye, Lock,
} from 'lucide-react';

interface DocTool {
  key: string;
  icon: React.ReactNode;
  description: string;
  premium: boolean;
}

export default function DocumentsPage() {
  const { t } = useLocale();
  const { isPremium, isTrialActive } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const canUse = isPremium() || isTrialActive();

  const tools: DocTool[] = [
    { key: 'readEdit', icon: <FileEdit className="h-5 w-5" />, description: 'Read and edit PDF documents', premium: false },
    { key: 'merge', icon: <Merge className="h-5 w-5" />, description: 'Merge multiple PDFs into one', premium: false },
    { key: 'split', icon: <Scissors className="h-5 w-5" />, description: 'Split PDF into separate pages', premium: false },
    { key: 'compress', icon: <Minimize2 className="h-5 w-5" />, description: 'Reduce PDF file size', premium: false },
    { key: 'addText', icon: <Type className="h-5 w-5" />, description: 'Add text to PDF pages', premium: true },
    { key: 'addImage', icon: <Image className="h-5 w-5" />, description: 'Insert images into PDF', premium: true },
    { key: 'addSignature', icon: <PenTool className="h-5 w-5" />, description: 'Add digital signature', premium: true },
    { key: 'annotate', icon: <Highlighter className="h-5 w-5" />, description: 'Highlight and annotate PDF', premium: true },
    { key: 'officialDocs', icon: <Receipt className="h-5 w-5" />, description: 'Generate official documents (invoices, receipts)', premium: true },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <BackButton href="/services" />
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('categories.documents') as string}</h1>
            <p className="text-muted-foreground">{t('categories.documentsDesc') as string}</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tools.map((tool) => {
            const locked = tool.premium && !canUse;
            return (
              <Card
                key={tool.key}
                className={`group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  selectedTool === tool.key ? 'ring-2 ring-primary' : ''
                } ${locked ? 'opacity-60' : ''}`}
                onClick={() => !locked && setSelectedTool(tool.key)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    {locked ? <Lock className="h-5 w-5" /> : tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{t(`services.documents.${tool.key}`) as string}</p>
                      {tool.premium && <Badge variant="secondary" className="text-[10px]">PRO</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload Area */}
        {selectedTool && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">
                {t(`services.documents.${selectedTool}`) as string}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, DOCX up to 50MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                    <FileText className="h-8 w-8 text-orange-600" />
                    <div className="flex-1">
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)}>
                      Change
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button>
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Process & Download
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
