'use client';

import React from 'react';
import { SiteSettings, Product } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  heroProduct?: Product | null;
}

export default function Hero({ settings, heroProduct }: HeroProps) {
  const kicker = settings.heroKicker || 'ÖZEL TASARIM & MARKA PELUŞLARI';
  const title = settings.heroTitle || 'Fikirlerinizi sarılası peluşlara dönüştürüyoruz.';
  const ctaText = settings.heroCtaText || 'BİRLİKTE ÜRETELİM';
  const ctaLink = settings.heroCtaLink || '#contact';

  // Prioritize the full photographic studio banner matching the mockup
  const heroImage =
    settings.heroImageUrl ||
    settings.heroCustomImageUrl ||
    (settings.heroProductId && heroProduct?.image) ||
    '/images/hero_hedgehog_banner.jpg';

  return (
    <section
      style={{ backgroundColor: 'var(--site-bg)' }}
      className="relative w-full min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] flex items-center overflow-hidden transition-colors"
    >
      {/* Full-Width Background Scene Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover object-center lg:object-right-center select-none"
        />
        {/* Soft overlay gradient on mobile/tablet to guarantee text contrast */}
        <div
          style={{
            background: 'linear-gradient(to right, var(--site-bg) 0%, transparent 100%)',
            opacity: 0.9,
          }}
          className="absolute inset-0 lg:hidden pointer-events-none"
        />
      </div>

      {/* Floating Editorial Content on the Left */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-14 sm:py-20 lg:py-24">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl space-y-5 sm:space-y-7 text-left">
          
          {/* Small Uppercase Kicker */}
          <div className="inline-block">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase"
            >
              {kicker}
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{ color: 'var(--text-main)' }}
            className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-medium tracking-[-0.02em] leading-[1.14]"
          >
            {title}
          </h1>

          {/* Minimalist Line CTA */}
          <div className="pt-2 sm:pt-4">
            <a
              href={ctaLink}
              style={{ color: 'var(--text-main)' }}
              className="group inline-flex items-center gap-3 text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase opacity-90 hover:opacity-100 transition-opacity"
            >
              <span
                style={{ backgroundColor: 'var(--text-main)' }}
                className="w-8 h-[1.5px] group-hover:w-12 transition-all"
              />
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
