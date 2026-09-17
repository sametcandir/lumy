'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';
import { MessageCircle, Menu, X, Sparkles, ShieldCheck, Lock } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = formatWhatsAppPhone(settings.contact?.whatsapp);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Merhaba%20Lumy%20Toys,%20pelu%C5%9F%20oyuncaklar%20ve%20toptan%20sat%C4%B1%C5%9F%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100/70 transition-all">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-plush-500 to-amber-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
        <span>{settings.badgeText || "Türkiye'nin En Sevilen Toptan & Perakende Peluş Üreticisi"}</span>
        {settings.badgeSubtext !== '' && (
          <span className="hidden md:inline">• 🧸 {settings.badgeSubtext || '1. Sınıf EN-71 Sertifikalı Antialerjik Dolgu'}</span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {settings.logoUrl ? (
              <div className="relative flex items-center">
                <img
                  src={settings.logoUrl}
                  alt={settings.brandName || 'Lumy Toys'}
                  className="h-12 sm:h-14 w-auto max-w-[200px] object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-plush-500 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform">
                  🧸
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-plush-600 transition-colors">
                    {settings.brandName || 'Lumy Toys'}
                  </span>
                  <p className="text-[11px] font-semibold text-amber-700/80 -mt-1 tracking-wider uppercase">
                    {settings.slogan || 'Peluş & Oyuncak Dünyası'}
                  </p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <a
              href="#katalog"
              className="text-gray-700 hover:text-plush-600 font-semibold text-sm transition-colors"
            >
              {settings.navCatalog || 'Ürün Kataloğu'}
            </a>
            <a
              href="#toptan"
              className="text-gray-700 hover:text-plush-600 font-semibold text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>{settings.navWholesale || 'Toptan & Tedarik'}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                B2B
              </span>
            </a>
            <a
              href="#hakkimizda"
              className="text-gray-700 hover:text-plush-600 font-semibold text-sm transition-colors"
            >
              {settings.navAbout || 'Hakkımızda'}
            </a>
            <a
              href="#iletisim"
              className="text-gray-700 hover:text-plush-600 font-semibold text-sm transition-colors"
            >
              {settings.navContact || 'İletişim & Teklif'}
            </a>
          </nav>

          {/* Actions: WhatsApp & Admin */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="text-gray-500 hover:text-gray-900 p-2.5 rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Yönetim Paneli"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span className="hidden xl:inline">Yönetim</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-102 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>{settings.navWhatsappBtn || 'WhatsApp Danışma'}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-amber-50 rounded-xl transition-colors"
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-100 px-6 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <a
            href="#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-plush-600 border-b border-gray-100"
          >
            🧸 {settings.navCatalog || 'Ürün Kataloğu'}
          </a>
          <a
            href="#toptan"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-plush-600 border-b border-gray-100 flex items-center justify-between"
          >
            <span>📦 {settings.navWholesale || 'Toptan Satış & Tedarik'}</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">B2B</span>
          </a>
          <a
            href="#hakkimizda"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-plush-600 border-b border-gray-100"
          >
            ⭐ {settings.navAbout || 'Hakkımızda'}
          </a>
          <a
            href="#iletisim"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-gray-800 hover:text-plush-600 border-b border-gray-100"
          >
            ✉️ {settings.navContact || 'İletişim & Teklif Formu'}
          </a>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3 rounded-2xl text-center shadow-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white" />
              <span>{settings.navWhatsappBtn || 'WhatsApp Danışma'}</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-900 font-bold py-2.5 rounded-2xl text-center text-sm border border-amber-200"
            >
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Yönetici (Admin) Girişi</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
