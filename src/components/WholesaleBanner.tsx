'use client';

import React from 'react';
import { SiteSettings } from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';
import { Package, TrendingUp, ShieldAlert, BadgeCheck, FileSpreadsheet, Truck, Layers, PhoneCall } from 'lucide-react';

interface WholesaleBannerProps {
  settings: SiteSettings;
  onOpenWholesaleModal?: () => void;
}

export default function WholesaleBanner({ settings, onOpenWholesaleModal }: WholesaleBannerProps) {
  const cleanPhone = formatWhatsAppPhone(settings.contact?.whatsapp);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Merhaba%20Lumy%20Toys,%20toptan%20fiyat%20listenizi%20ve%20katalogunuzu%20almak%20istiyorum.`;

  return (
    <section id="toptan" className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-white relative overflow-hidden">
      {/* Soft Background circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            <span>{settings.wholesaleBadgeIcon || '📦'}</span>
            <span>{settings.wholesaleBadge || 'B2B & Tedarikçi Ortaklığı'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {settings.wholesaleTitle || 'Tedarikçilere & Bayilere Özel Avantajlar'}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            {settings.wholesaleSubtitle ||
              'Mağazanız veya işletmeniz için yüksek kâr marjı, hızlı teslimat ve zengin model çeşitliliği sunuyoruz.'}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {settings.wholesaleFeatures?.map((f, i) => {
            const defaultIcons = ['📈', '🛡️', '🚚', '🏷️'];
            const bgStyles = [
              'bg-amber-50 border-amber-200',
              'bg-emerald-50 border-emerald-200',
              'bg-sky-50 border-sky-200',
              'bg-purple-50 border-purple-200'
            ];

            return (
              <div
                key={f.id || i}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${bgStyles[i % 4]} flex items-center justify-center mb-5 text-2xl shadow-xs`}>
                    {f.icon || defaultIcons[i % 4]}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    {f.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Öncelikli Hizmet</span>
                  <span className="text-plush-600">{settings.brandName || 'Lumy'} Güvencesi</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wholesale Call to Action Banner Box */}
        <div className="bg-gradient-to-r from-gray-900 via-stone-900 to-amber-950 text-white rounded-4xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-plush-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="bg-plush-500 text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                {settings.wholesaleCtaBadge || 'Hemen Tedarikçi Olun'}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {settings.wholesaleCtaTitle || 'Toplu Alımlar İçin Güncel Fiyat Listesi & Toptan Katalog İsteyin'}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl font-light">
                {settings.wholesaleCtaText ||
                  'Oyuncak mağazaları, AVM stantları, hediye butikleri, çiçekçiler ve e-ticaret satıcıları için özel iskontolar ve esnek ödeme kolaylıkları sunuyoruz.'}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href="#iletisim"
                className="inline-flex items-center justify-center gap-2 bg-plush-500 hover:bg-plush-600 text-white font-extrabold px-6 py-3.5 rounded-2xl text-center shadow-lg transition-transform hover:scale-102"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>{settings.wholesaleBtn1Text || 'Teklif Formunu Doldur'}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-center transition-colors"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{settings.wholesaleBtn2Text || 'Toptan Satış Temsilcisi'}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
