'use client';

import React, { useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  RefreshCw, Upload, FileText, FileSpreadsheet, Presentation,
  Image, FileOutput, Download, ArrowRight, CheckCircle2,
} from 'lucide-react';

interface ConversionType {
  key: string;
  from: string;
  to: string;
  icon: React.ReactNode;
}

export default function ConversionPage() {
  const { t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedConversion, setSelectedConversion] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const conversions: ConversionType[] = [
    { key: 'pdfToWord', from: 'PDF', to: 'Word', icon: <FileText className="h-5 w-5" /> },
    { key: 'pdfToExcel', from: 'PDF', to: 'Excel', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { key: 'pdfToPpt', from: 'PDF', to: 'PowerPoint', icon: <Presentation className="h-5 w-5" /> },
    { key: 'wordToPdf', from: 'Word', to: 'PDF', icon: <FileText className="h-5 w-5" /> },
    { key: 'txtToPdf', from: 'TXT', to: 'PDF', icon: <FileOutput className="h-5 w-5" /> },
    { key: 'imgToPdf', from: 'Image', to: 'PDF', icon: <Image className="h-5 w-5" /> },
    { key: 'pdfToImg', from: 'PDF', to: 'Image', icon: <Image className="h-5 w-5" /> },
  ];

  const handleConvert = () => {
    setConverting(true);
    setTimeout(() => {
      setConverting(false);
      setConverted(true);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setConverted(false);
    }
  };

  const reset = () => {
    setUploadedFile(null);
    setConverted(false);
    setConverting(false);
  };

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('categories.conversion') as string}</h1>
            <p className="text-muted-foreground">{t('categories.conversionDesc') as string}</p>
          </div>
        </div>

        {/* Conversion Types */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {conversions.map((conv) => (
            <Card
              key={conv.key}
              className={`group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                selectedConversion === conv.key ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => { setSelectedConversion(conv.key); reset(); }}
            >
              <CardContent className="flex flex-col items-center p-5 text-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {conv.icon}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <span>{conv.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span>{conv.to}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload & Convert */}
        {selectedConversion && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t(`services.conversion.${selectedConversion}`) as string}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-1">Upload your file</p>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={reset}>Change</Button>
                  </div>

                  {converted ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <p className="font-medium text-green-800">Conversion complete!</p>
                      <Button size="sm" className="ml-auto">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleConvert} disabled={converting} className="w-full" size="lg">
                      {converting ? (
                        <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Converting...</>
                      ) : (
                        <><RefreshCw className="h-4 w-4 mr-2" /> Convert Now</>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
