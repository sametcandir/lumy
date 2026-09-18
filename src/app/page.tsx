import React from 'react';
import { getSettings, getProducts, getCategories } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

export default async function HomePage() {
  const settings = await getSettings();
  const products = await getProducts();
  const categories = await getCategories();

  // Find featured hero product if configured
  const heroProduct = settings.heroProductId
    ? products.find((p) => p.id === settings.heroProductId) || null
    : null;

  return (
    <main className="min-h-screen flex flex-col bg-[#FFFDF9]">
      {/* Navigation */}
      <Navbar settings={settings} />

      {/* Hero Welcome */}
      <Hero settings={settings} heroProduct={heroProduct} />

      {/* Interactive Products Catalog */}
      <ProductCatalog products={products} categories={categories} settings={settings} />

      {/* About Lumy Toys */}
      <AboutSection settings={settings} />

      {/* Contact & Wholesale Quote Form */}
      <ContactSection settings={settings} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Footer */}
      <Footer settings={settings} />
    </main>
  );
}
