'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { locales, localeNames, Locale } from '@/lib/i18n';
import {
  Globe,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const { user, logout, isPremium, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('common.home') as string },
    { href: '/services', label: t('common.services') as string },
    { href: '/tools', label: 'Outils' },
    { href: '/pricing', label: t('common.pricing') as string },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              MS
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              {t('common.appName') as string}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs uppercase">{locale}</span>
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-md border bg-popover p-1 shadow-md z-50">
                {locales.map((loc: Locale) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocale(loc);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors ${
                      locale === loc ? 'bg-accent font-medium' : ''
                    }`}
                  >
                    {localeNames[loc]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User section */}
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline text-sm">{user.name.split(' ')[0]}</span>
                {isPremium() && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">
                    PRO
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-md z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t('common.dashboard') as string}
                  </Link>
                  {isAdmin() && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      {t('common.admin') as string}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('common.logout') as string}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  {t('common.login') as string}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  {t('common.signup') as string}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium py-2 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('common.login') as string}
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">
                  {t('common.signup') as string}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}