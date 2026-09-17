'use client';

import React from 'react';
import { SiteSettings } from '@/lib/db';
import { Heart, Sparkles, Award, Smile, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="hakkimizda" className="py-16 sm:py-24 bg-gradient-to-b from-white via-amber-50/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase Side */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              <div className="rounded-4xl overflow-hidden shadow-2xl border-4 border-white bg-amber-100">
                <img
                  src="https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800&auto=format&fit=crop&q=80"
                  alt="Lumy Toys Atölye ve Peluşlar"
                  className="w-full h-96 sm:h-[450px] object-cover"
                />
              </div>

              {/* Little Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-xl border border-amber-200 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    {settings.aboutCardIcon || '💖'}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">{settings.aboutCardTitle || 'Sevgiyle Dikildi'}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{settings.aboutCardText || 'Her dikişinde mutluluk ve yüksek güvenlik.'}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Text Content Side */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              <span>{settings.aboutBadgeIcon || '💖'}</span>
              <span>{settings.aboutBadge || 'Hakkımızda'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {settings.aboutTitle || 'Lumy Toys Hikayesi & Kalite Anlayışımız'}
            </h2>

            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
              {settings.aboutText1 ||
                'Lumy Toys, çocukların hayal gücünü beslemek ve yetişkinlerin içindeki çocuğu sevindirmek amacıyla en kaliteli peluş oyuncakları üretmek ve tedarik etmek için kuruldu.'}
            </p>

            <p className="text-base text-gray-600 font-normal leading-relaxed">
              {settings.aboutText2 ||
                'Her bir dikişinde sevgi, her dokunuşunda güven taşıyan ürünlerimiz; Avrupa standartlarında (EN-71) antialerjik kumaş ve %100 boncuk elyaf dolgu ile üretilir. Toptan tedarik ortaklarımız ve binlerce mutlu müşterimizle Türkiye’nin dört bir yanına mutluluk ulaştırıyoruz.'}
            </p>

            {/* Quality Badges List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {(settings.aboutFeatures && settings.aboutFeatures.length > 0 ? settings.aboutFeatures : [
                { id: 'q1', icon: '🛡️', title: 'EN-71 Çocuk Güvenliği', description: 'Toksik olmayan boyalar ve kimyasallar.' },
                { id: 'q2', icon: '✨', title: 'Kopmaz Nakış & Kilit', description: 'Bebekler için tam korumalı emniyet kilitleri.' },
                { id: 'q3', icon: '🧸', title: 'Yıkanabilir & Tüy Dökmez', description: '30° hassas yıkamada formunu koruyan doku.' },
                { id: 'q4', icon: '🏭', title: 'Yerli Üretim & Hızlı Tedarik', description: 'Stoktan aynı gün kargo veya sevkiyat.' }
              ]).map((feat, idx) => (
                <div key={feat.id || idx} className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-amber-100 shadow-sm">
                  <span className="text-xl shrink-0 mt-0.5">{feat.icon || '🛡️'}</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{feat.title}</h4>
                    <p className="text-xs text-gray-500">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
