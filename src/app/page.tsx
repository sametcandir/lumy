import React from 'react';
import { getSettings, getProducts, getCategories } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProcessSection from '@/components/ProcessSection';
import ProductCatalog from '@/components/ProductCatalog';
import WhyLumySection from '@/components/WhyLumySection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSettings();
  const products = await getProducts();
  const categories = await getCategories();

  // Find featured hero product if configured
  const heroProduct = settings.heroProductId
    ? products.find((p) => p.id === settings.heroProductId) || null
    : null;

  const theme = settings.theme || {};
  const siteBg = theme.siteBg || '#FAF8F5';
  const textColor = theme.textColor || '#18181B';
  const mutedTextColor = theme.mutedTextColor || '#71717A';
  const cardBg = theme.cardBg || '#FFFFFF';
  const processBg = theme.processBg || '#F4F0E8';
  const accentColor = theme.accentColor || '#18181B';
  const accentTextColor = theme.accentTextColor || '#FFFFFF';
  const footerBg = theme.footerBg || '#141414';
  const footerTextColor = theme.footerTextColor || '#D6D3D1';

  return (
    <>
      <style>{`
        :root {
          --site-bg: ${siteBg};
          --text-main: ${textColor};
          --text-muted: ${mutedTextColor};
          --card-bg: ${cardBg};
          --process-bg: ${processBg};
          --accent-bg: ${accentColor};
          --accent-text: ${accentTextColor};
          --footer-bg: ${footerBg};
          --footer-text: ${footerTextColor};
        }
        body {
          background-color: var(--site-bg);
          color: var(--text-main);
        }
      `}</style>

      <main
        style={{
          backgroundColor: 'var(--site-bg)',
          color: 'var(--text-main)',
        }}
        className="min-h-screen flex flex-col font-sans selection:bg-[#84CC16]/30 transition-colors duration-200"
      >
        {/* 1. Header Navigation */}
        <Navbar settings={settings} />

        {/* 2. Hero Section ("Fikirlerinizi sarılası peluşlara dönüştürüyoruz.") */}
        <Hero settings={settings} heroProduct={heroProduct} />

        {/* 3. Our Process ("Çizimden gülümsemeye." - 4 Steps) */}
        <ProcessSection settings={settings} />

        {/* 4. Products Spotlight & Catalog ("Bir oyuncaktan çok daha fazlası.") */}
        <ProductCatalog products={products} categories={categories} settings={settings} />

        {/* 5. Why Lumy Toys? ("Gerçek ortaklıklar. Kalıcı anılar. ♡") */}
        <WhyLumySection settings={settings} />

        {/* 6. Contact & Luxury Dark Footer with Peeking Fox */}
        <Footer settings={settings} />

        {/* 7. Discreet Floating WhatsApp Button */}
        <FloatingWhatsApp settings={settings} />
      </main>
    </>
  );
}
