'use client';

import React from 'react';
import { SiteSettings, WhyFeature } from '@/lib/db';
import { Heart, Star, Leaf, Smile, Sparkles, ShieldCheck } from 'lucide-react';

interface WhyLumySectionProps {
  settings: SiteSettings;
}

const DEFAULT_WHY_FEATURES: WhyFeature[] = [
  {
    id: 'wf-1',
    icon: 'heart',
    title: 'Yaratıcı Tasarım Desteği',
    description: 'Fikirlerinizi gerçeğe dönüştürmenize yardımcı oluyoruz.'
  },
  {
    id: 'wf-2',
    icon: 'star',
    title: 'Birinci Sınıf Kalite',
    description: 'Güvenli, dayanıklı ve uzun ömürlü üretim.'
  },
  {
    id: 'wf-3',
    icon: 'leaf',
    title: 'Sürdürülebilir Seçimler',
    description: 'Gelecek için çevre dostu, sağlıklı malzemeler.'
  },
  {
    id: 'wf-4',
    icon: 'smile',
    title: 'Güvenilir İş Ortağı',
    description: 'Dünya standartlarında üretim ve güven.'
  }
];

export default function WhyLumySection({ settings }: WhyLumySectionProps) {
  const kicker = settings.whyKicker || 'NEDEN LUMY TOYS?';
  const note = settings.whyNote || 'Gerçek ortaklıklar. Kalıcı anılar. ♡';
  const labelImage =
    (settings.whyImageUrl && !settings.whyImageUrl.includes('photo-1584917865442'))
      ? settings.whyImageUrl
      : '/images/why_hedgehog.jpg';
  const features =
    settings.whyFeatures && settings.whyFeatures.length > 0
      ? settings.whyFeatures
      : DEFAULT_WHY_FEATURES;

  const renderIcon = (iconName: string) => {
    const iconStyle = { color: 'var(--text-main)' };
    const iconClass = "w-5 h-5 transition-colors";
    switch (iconName?.toLowerCase()) {
      case 'heart':
        return <Heart style={iconStyle} className={iconClass} strokeWidth={1.8} />;
      case 'star':
        return <Star style={iconStyle} className={iconClass} strokeWidth={1.8} />;
      case 'leaf':
        return <Leaf style={iconStyle} className={iconClass} strokeWidth={1.8} />;
      case 'smile':
        return <Smile style={iconStyle} className={iconClass} strokeWidth={1.8} />;
      case 'shield':
        return <ShieldCheck style={iconStyle} className={iconClass} strokeWidth={1.8} />;
      default:
        return <Sparkles style={iconStyle} className={iconClass} strokeWidth={1.8} />;
    }
  };

  return (
    <section
      id="why-lumy"
      style={{ backgroundColor: 'var(--site-bg)' }}
      className="py-20 sm:py-28 border-t border-current/10 relative transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Close-up fabric shot with handwriting note */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Handwritten note in top left corner of the photo */}
              <div
                style={{ color: 'var(--text-main)' }}
                className="absolute -top-7 -left-2 z-20 font-serif italic text-sm sm:text-base tracking-wide select-none drop-shadow-xs opacity-90"
              >
                <span>{note}</span>
              </div>

              {/* Fabric image with woven label */}
              <div className="rounded-3xl sm:rounded-4xl overflow-hidden shadow-xl border border-current/10 bg-current/5 aspect-[4/3] relative group">
                <img
                  src={labelImage}
                  alt="Lumy Toys Kalite & Kumaş Dokusu"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />

                {/* Simulated Woven Brand Tag on corner */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl shadow-lg border border-stone-200/80 flex items-center gap-2 select-none transform -rotate-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
                  <span className="text-xs font-black tracking-wider text-stone-900 uppercase">
                    lumy <span className="font-light text-[10px]">TOYS</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: 4 Value Propositions */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span
                style={{ color: 'var(--text-muted)' }}
                className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase block mb-2"
              >
                {kicker}
              </span>
              <h2
                style={{ color: 'var(--text-main)' }}
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight"
              >
                Her dikişte sevgi, her detayda kusursuz güven.
              </h2>
            </div>

            {/* 4 Feature Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2">
              {features.map((feat) => (
                <div key={feat.id} className="space-y-2 group">
                  <div
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--text-muted)',
                    }}
                    className="w-11 h-11 rounded-2xl border border-opacity-25 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                  >
                    {renderIcon(feat.icon)}
                  </div>
                  <h3
                    style={{ color: 'var(--text-main)' }}
                    className="text-sm font-extrabold tracking-tight"
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{ color: 'var(--text-muted)' }}
                    className="text-xs leading-relaxed font-normal"
                  >
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
