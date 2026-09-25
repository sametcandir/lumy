'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/db';
import LumyLogo, { isDarkColor } from './LumyLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDarkNavbar = isDarkColor(settings.theme?.siteBg);

  return (
    <header
      style={{ backgroundColor: 'var(--site-bg)' }}
      className="sticky top-0 z-40 bg-opacity-95 backdrop-blur-md border-b border-current/10 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center">
            <LumyLogo
              variant={isDarkNavbar ? 'dark' : 'light'}
              logoUrl={settings.logoUrl}
              brandName={settings.brandName || 'lumy TOYS'}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
            <a
              href="#about"
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase hover:opacity-100 transition-opacity"
            >
              {settings.navAbout || 'HAKKIMIZDA'}
            </a>
            <a
              href="#process"
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase hover:opacity-100 transition-opacity"
            >
              {settings.processKicker || 'SÜRECİMİZ'}
            </a>
            <a
              href="#products"
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase hover:opacity-100 transition-opacity"
            >
              {settings.navCatalog || 'ÜRÜNLER'}
            </a>
            <a
              href="#why-lumy"
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase hover:opacity-100 transition-opacity"
            >
              {settings.whyKicker || 'NEDEN LUMY?'}
            </a>
            <a
              href="#contact"
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] lg:text-xs font-bold tracking-[0.2em] uppercase hover:opacity-100 transition-opacity"
            >
              {settings.navContact || 'İLETİŞİM'}
            </a>
          </nav>

          {/* Right Action: Contact / Let's Create */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#contact"
              style={{
                color: 'var(--text-main)',
                borderColor: 'var(--text-main)',
              }}
              className="group inline-flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase border border-opacity-30 hover:border-opacity-100 px-4 py-2.5 rounded-full transition-all"
            >
              <span>{settings.heroCtaText || 'BİZE ULAŞIN'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--text-main)' }}
              className="p-2.5 rounded-xl hover:bg-current/5"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: 'var(--site-bg)' }}
          className="md:hidden border-b border-current/10 px-6 py-6 space-y-4 shadow-xl"
        >
          <nav className="flex flex-col space-y-3">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-main)' }}
              className="text-xs font-bold tracking-[0.2em] uppercase py-2"
            >
              {settings.navAbout || 'HAKKIMIZDA'}
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-main)' }}
              className="text-xs font-bold tracking-[0.2em] uppercase py-2"
            >
              {settings.processKicker || 'SÜRECİMİZ'}
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-main)' }}
              className="text-xs font-bold tracking-[0.2em] uppercase py-2"
            >
              {settings.navCatalog || 'ÜRÜNLER'}
            </a>
            <a
              href="#why-lumy"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-main)' }}
              className="text-xs font-bold tracking-[0.2em] uppercase py-2"
            >
              {settings.whyKicker || 'NEDEN LUMY?'}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-main)' }}
              className="text-xs font-bold tracking-[0.2em] uppercase py-2"
            >
              {settings.navContact || 'İLETİŞİM'}
            </a>
          </nav>

          <div className="pt-2 border-t border-current/10">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent-text)',
              }}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-extrabold tracking-wider uppercase py-3 rounded-full shadow-md"
            >
              <span>{settings.heroCtaText || 'BİZE ULAŞIN'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
