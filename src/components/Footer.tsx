'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/db';
import { Heart, Lock, ShieldCheck, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.brandName || 'Lumy Toys'}
                  className="h-10 w-auto max-w-[180px] object-contain bg-white/10 p-1.5 rounded-xl backdrop-blur-xs"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-plush-500 flex items-center justify-center text-xl text-white shadow-md">
                    🧸
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {settings.brandName || 'Lumy Toys'}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              {settings.footerDescription ||
                (settings.slogan
                  ? `${settings.slogan} En sevimli ve kaliteli peluş oyuncak koleksiyonları.`
                  : 'Lumy Toys olarak 1. sınıf antialerjik kumaşlar ve CE güvenlik standartlarında sevimli peluş oyuncaklar tasarlıyoruz.')}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="text-sm">{settings.footerSecurityBadgeIcon || '🛡️'}</span>
              <span>{settings.footerSecurityBadge || 'EN-71 Avrupa Güvenlik Onaylı Üretim'}</span>
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">{settings.footerCol2Title || 'Hızlı Gezinti'}</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#katalog" className="hover:text-plush-400 transition-colors">
                  {settings.navCatalog || 'Ürün Kataloğu & Modeller'}
                </a>
              </li>
              <li>
                <a href="#hakkimizda" className="hover:text-plush-400 transition-colors">
                  {settings.navAbout || 'Hakkımızda & Kalite Standartları'}
                </a>
              </li>
              <li>
                <a href="#iletisim" className="hover:text-plush-400 transition-colors">
                  {settings.navContact || 'İletişim & Danışma'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">{settings.footerCol3Title || 'İletişim Bilgileri'}</h4>
            <p className="text-xs text-stone-400">
              <strong>Tel:</strong> {settings.contact?.phone}
            </p>
            <p className="text-xs text-stone-400">
              <strong>WhatsApp:</strong> {settings.contact?.whatsapp}
            </p>
            <p className="text-xs text-stone-400">
              <strong>E-posta:</strong> {settings.contact?.email}
            </p>
          </div>

          {/* Col 4: Admin & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">{settings.footerCol4Title || 'Yönetim & Güvenlik'}</h4>
            <p className="text-xs text-stone-400">
              Web sitesi içeriklerini, vitrin peluşlarını ve mesajları yönetmek için:
            </p>
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors border border-stone-700"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Girişi</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.brandName || 'Lumy Toys'}. {settings.footerCopyright || 'Tüm Hakları Saklıdır.'}</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>{settings.footerTagline || 'Peluş ve çocuk sevgisiyle üretilmiştir'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
