'use client';

import React from 'react';
import { LocaleProvider } from '@/context/LocaleContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <SettingsProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </SettingsProvider>
    </LocaleProvider>
  );
}
