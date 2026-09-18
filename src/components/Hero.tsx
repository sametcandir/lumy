'use client';

import React from 'react';
import { SiteSettings, Product } from '@/lib/db';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, PackageCheck, Award } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  heroProduct?: Product | null;
}

export default function Hero({ settings, heroProduct }: HeroProps) {
  const displayImage = heroProduct?.image || settings.heroCustomImageUrl || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80";
  const displayAlt = heroProduct?.name || "Lumy Toys Dev Peluş Ayıcık";
  const displayBadge1 = heroProduct?.badge || settings.heroImgBadge1 || (heroProduct ? heroProduct.name : '👑 120 cm Dev Sarılma Ayısı');
  const displayBadge2 = settings.heroImgBadge2 || 'Özel Tasarım';
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Decorative Pastel Background Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300/60 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-amber-900 shadow-sm">
              <span className="text-base">{settings.heroBadgeIcon || '🧸'}</span>
              <span>{settings.slogan || 'En Yumuşak Sarılmalar, En Tatlı Gülümsemeler'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              {settings.heroTitle || 'Her Yaşa Neşe Katan Yumuşacık Peluş Dünyası'}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {settings.heroSubtitle ||
                'Lumy Toys olarak 1. sınıf antialerjik kumaşlar ve CE güvenlik sertifikalı dolgularla tüm peluş severlere en sevimli peluş oyuncakları sunuyoruz.'}
            </p>

            {/* Quality & Softness Highlight Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-amber-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 max-w-xl mx-auto lg:mx-0 shadow-sm flex flex-row items-center gap-3.5 text-left">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-xl sm:text-2xl shadow-xs">
                {settings.heroWholesaleIcon || '🧸'}
              </div>
              <div className="text-xs sm:text-sm">
                <strong className="block text-gray-900 font-bold text-xs sm:text-sm">
                  {settings.heroWholesaleTitle || 'Özenle Tasarlanmış Peluş Koleksiyonu'}
                </strong>
                <span className="text-gray-600 text-[11px] sm:text-xs block mt-0.5 leading-snug">
                  {settings.heroWholesaleText || '1. Sınıf antialerjik kumaş, %100 güvenli boncuk elyaf ve sevgi dolu detaylar.'}
                </span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <a
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-plush-500 hover:bg-plush-600 text-white font-extrabold px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all text-sm sm:text-base group"
              >
                <span>{settings.heroCatalogBtnText || 'Peluşları Keşfet'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#iletisim"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-gray-900 font-bold px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl border-2 border-amber-300 hover:border-amber-400 transition-all text-sm sm:text-base shadow-sm"
              >
                <span>{settings.heroWholesaleBtnText || 'Bize Ulaşın'}</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 max-w-xl mx-auto lg:mx-0 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">{settings.heroTrust1Icon || '🛡️'}</span>
                <span>{settings.heroTrust1Text || 'CE & EN-71 Sertifikalı'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base shrink-0">{settings.heroTrust2Icon || '✨'}</span>
                <span>{settings.heroTrust2Text || '%100 Antialerjik Dolgu'}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1 justify-center sm:justify-start">
                <span className="text-base shrink-0">{settings.heroTrust3Icon || '📦'}</span>
                <span>{settings.heroTrust3Text || 'Hızlı & Güvenli Teslimat'}</span>
              </div>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Featured Image Card */}
              <div className="relative z-10 bg-white p-3 sm:p-4 rounded-4xl shadow-2xl border border-amber-100 overflow-hidden transform hover:-rotate-1 transition-transform duration-500">
                <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-amber-50">
                  <img
                    src={displayImage}
                    alt={displayAlt}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-black text-amber-900 shadow-sm flex items-center gap-1.5">
                    <span>{displayBadge1}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                    {displayBadge2}
                  </div>
                </div>
              </div>

              {/* Floating Mini Badge 1: Quality Guarantee */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-amber-200 shadow-xl hidden sm:flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
                  {settings.heroMiniBadge1Icon || '✨'}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{settings.heroMiniBadge1Title || 'Güven Standartı'}</div>
                  <div className="text-sm font-extrabold text-gray-900">{settings.heroMiniBadge1Text || '%100 Boncuk Elyaf'}</div>
                </div>
              </div>

              {/* Floating Mini Badge 2: Quality Design */}
              <div className="absolute -top-6 -right-6 z-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-3xl shadow-xl hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{settings.heroMiniBadge2Icon || '🏆'}</span>
                  <span className="text-xs font-extrabold tracking-wider uppercase">{settings.heroMiniBadge2Title || 'Sevgiyle Üretildi'}</span>
                </div>
                <div className="text-sm font-black mt-0.5">{settings.heroMiniBadge2Text || 'Özel Tasarım Peluşlar'}</div>
              </div>
            </div>

            {/* Quick Stats Grid under Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {settings.stats?.map((st, idx) => (
                <div key={idx} className="bg-white/90 border border-amber-100 rounded-2xl p-3 text-center shadow-sm">
                  <div className="text-xl sm:text-2xl font-black text-plush-600">{st.value}</div>
                  <div className="text-[11px] font-semibold text-gray-600 mt-0.5">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
