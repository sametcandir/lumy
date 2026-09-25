'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, Category, SiteSettings } from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';
import { Search, ArrowRight, X, MessageCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
}

// Default spotlight items matching the mockup if not enough categories/products exist
const SPOTLIGHT_DEFAULTS = [
  {
    title: 'MARKA MASKOTLARI',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
    categoryId: 'ayiciklar'
  },
  {
    title: 'PROMOSYON PELUŞLAR',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
    categoryId: 'bebek'
  },
  {
    title: 'HEDİYE & ETKİNLİK',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    categoryId: 'hayvanlar'
  },
  {
    title: 'ÖZEL TASARIMLAR',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    categoryId: 'dev-peluslar'
  }
];

export default function ProductCatalog({ products, categories, settings }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullCatalog, setShowFullCatalog] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Hidden scroll & arrow navigation state for categories
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const checkScroll = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      if (direction === 'left') {
        if (categoriesRef.current.scrollLeft <= 280) {
          categoriesRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          categoriesRef.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
      } else {
        categoriesRef.current.scrollBy({ left: 240, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 350);
    }
  };

  const cleanPhone = formatWhatsAppPhone(settings.contact?.whatsapp);

  const kicker = settings.productsKicker || 'ÜRÜNLERİMİZ';
  const title = settings.productsTitle || 'Bir oyuncaktan çok daha fazlası.';
  const subtitle =
    settings.productsSubtitle ||
    'Yumuşacık, sevimli ve karakter dolu — peluş oyuncaklarımız markalar, etkinlikler ve özel projeler için tasarlandı.';
  const ctaText = settings.productsCtaText || 'TÜM ÜRÜNLERİ GÖRÜNTÜLE →';

  // Filter products intended for homepage
  const visibleProducts = useMemo(() => {
    return products.filter((p) => p.showOnHomepage !== false);
  }, [products]);

  // Active categories with products
  const activeCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (cat.id === 'all') return true;
      return visibleProducts.some((p) => p.category === cat.id);
    });
  }, [categories, visibleProducts]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [activeCategories, showFullCatalog]);

  // Filtered products list (Featured / Vitrin items sorted to the top)
  const filteredProducts = useMemo(() => {
    const list = visibleProducts.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [visibleProducts, selectedCategory, searchQuery]);

  const handleOpenModal = (product: Product) => {
    setActiveModalProduct(product);
    setActiveImageIndex(0);
  };

  const handleWhatsAppOrder = (product: Product) => {
    const text = `Merhaba Lumy Toys, "${product.name}" peluş modeli hakkında bilgi ve sipariş detaylarını öğrenmek istiyorum.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Map 4 spotlight cards from categories or defaults
  const spotlightCards = useMemo(() => {
    return SPOTLIGHT_DEFAULTS.map((def, idx) => {
      const matchingCat = categories[idx + 1] || null;
      const matchingProduct = visibleProducts.find((p) => p.category === (matchingCat?.id || def.categoryId));
      return {
        title: matchingCat ? matchingCat.name.toUpperCase() : def.title,
        categoryId: matchingCat ? matchingCat.id : def.categoryId,
        image: matchingProduct?.image || def.image
      };
    });
  }, [categories, visibleProducts]);

  return (
    <section
      id="products"
      style={{ backgroundColor: 'var(--site-bg)' }}
      className="py-20 sm:py-28 border-t border-current/10 relative transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Top Header Row: Left Narrative + Right 4 Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase block"
            >
              {kicker}
            </span>

            <h2
              style={{ color: 'var(--text-main)' }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-[-0.02em] leading-[1.14]"
            >
              {title}
            </h2>

            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-xs sm:text-sm leading-relaxed max-w-md font-normal"
            >
              {subtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowFullCatalog(!showFullCatalog)}
                style={{
                  color: 'var(--text-main)',
                  borderColor: 'var(--text-main)',
                }}
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase border-b pb-1 transition-all cursor-pointer"
              >
                <span>{showFullCatalog ? 'KATALOĞU DARALT' : ctaText.replace('→', '').trim()}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showFullCatalog ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Minimalist Category / Showcase Cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-4">
              {spotlightCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(card.categoryId);
                    setShowFullCatalog(true);
                  }}
                  style={{ backgroundColor: 'var(--card-bg)' }}
                  className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-current/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  {/* Plush Studio Image */}
                  <div className="w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-current/5 mb-3 relative flex items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Category Title Link with Arrow */}
                  <div
                    style={{ color: 'var(--text-main)' }}
                    className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase group-hover:opacity-75 transition-opacity pt-1"
                  >
                    <span className="truncate">{card.title}</span>
                    <ArrowRight className="w-3 h-3 shrink-0 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Full Interactive Catalog View (Expandable / Searchable) */}
        {showFullCatalog && (
          <div className="mt-16 pt-12 border-t border-current/10 space-y-8 animate-fadeIn">
            
            {/* Elegant Minimalist Filter Bar (Hidden Scrollbar + Arrow Navigation) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-current/10 pb-4">
              
              {/* Category Slider Container */}
              <div className="relative flex items-center flex-1 min-w-0">
                {/* Left Floating Arrow with Soft Gradient Fade */}
                <div
                  style={{ background: 'linear-gradient(to right, var(--site-bg) 60%, transparent)' }}
                  className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pr-3 transition-opacity duration-200 ${
                    canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <button
                    onClick={() => scrollCategories('left')}
                    aria-label="Önceki Kategoriler"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-main)',
                    }}
                    className="p-1 rounded-full shadow-md border border-black/10 hover:scale-105 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories Track */}
                <div
                  ref={categoriesRef}
                  onScroll={checkScroll}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="flex items-center gap-6 sm:gap-8 overflow-x-auto scroll-smooth w-full [&::-webkit-scrollbar]:hidden py-1 px-3 sm:px-4"
                >
                  {activeCategories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        }}
                        className={`text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all cursor-pointer relative py-1.5 px-0.5 shrink-0 whitespace-nowrap ${
                          isActive ? 'font-bold' : 'font-medium hover:opacity-100'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isActive && (
                          <span
                            style={{ backgroundColor: 'var(--text-main)' }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Floating Arrow with Soft Gradient Fade */}
                <div
                  style={{ background: 'linear-gradient(to left, var(--site-bg) 60%, transparent)' }}
                  className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pl-3 transition-opacity duration-200 ${
                    canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <button
                    onClick={() => scrollCategories('right')}
                    aria-label="Sonraki Kategoriler"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-main)',
                    }}
                    className="p-1 rounded-full shadow-md border border-black/10 hover:scale-105 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Minimalist Search Input */}
              <div className="w-full sm:w-64 lg:w-56 shrink-0 relative">
                <Search style={{ color: 'var(--text-muted)' }} className="w-3.5 h-3.5 absolute left-0 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Koleksiyonda ara..."
                  style={{
                    color: 'var(--text-main)',
                    borderColor: 'var(--text-muted)',
                  }}
                  className="w-full pl-6 pr-2 py-1 bg-transparent border-b text-xs placeholder-stone-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div
                style={{ backgroundColor: 'var(--card-bg)' }}
                className="text-center py-16 rounded-3xl border border-current/10"
              >
                <p style={{ color: 'var(--text-muted)' }} className="text-sm font-semibold">
                  Aradığınız kriterde ürün bulunamadı.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => {
                  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleOpenModal(product)}
                      style={{ backgroundColor: 'var(--card-bg)' }}
                      className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-current/10 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-current/5 relative mb-3">
                        <img
                          src={productImages[0] || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {(product.badge || product.featured) && (
                          <span
                            style={{
                              backgroundColor: 'var(--accent-bg)',
                              color: 'var(--accent-text)',
                            }}
                            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs"
                          >
                            {product.badge || '⭐ Öne Çıkan'}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> İncele
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4
                          style={{ color: 'var(--text-main)' }}
                          className="text-xs sm:text-sm font-bold line-clamp-1 group-hover:opacity-75 transition-opacity"
                        >
                          {product.name}
                        </h4>
                        <p
                          style={{ color: 'var(--text-muted)' }}
                          className="text-[11px] line-clamp-1 font-normal"
                        >
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-current/10 flex items-center justify-between">
                        <span
                          style={{ color: 'var(--text-muted)' }}
                          className="text-[10px] uppercase tracking-wider font-semibold"
                        >
                          {product.inStock === false ? 'Tükendi' : 'Stokta Var'}
                        </span>
                        <span
                          style={{ color: 'var(--text-main)' }}
                          className="text-[11px] font-bold tracking-wider inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          Detay <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModalProduct(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-main)',
            }}
            className="rounded-3xl sm:rounded-4xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/10 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProduct(null)}
              style={{
                backgroundColor: 'var(--site-bg)',
                color: 'var(--text-main)',
              }}
              className="absolute top-5 right-5 p-2 rounded-full border border-black/10 shadow-xs hover:opacity-80 transition-opacity cursor-pointer z-10"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Left Gallery Images */}
              <div className="space-y-3">
                {(() => {
                  const gallery =
                    activeModalProduct.images && activeModalProduct.images.length > 0
                      ? activeModalProduct.images
                      : [activeModalProduct.image];
                  const currentImage = gallery[activeImageIndex] || gallery[0];

                  return (
                    <>
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-current/5 border border-black/10">
                        <img
                          src={currentImage}
                          alt={activeModalProduct.name}
                          className="w-full h-full object-cover"
                        />
                        {gallery.length > 1 && (
                          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
                              }}
                              style={{
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-main)',
                              }}
                              className="p-1.5 rounded-full shadow-md pointer-events-auto cursor-pointer border border-black/10"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
                              }}
                              style={{
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-main)',
                              }}
                              className="p-1.5 rounded-full shadow-md pointer-events-auto cursor-pointer border border-black/10"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {gallery.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {gallery.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex(i)}
                              style={{
                                borderColor: activeImageIndex === i ? 'var(--text-main)' : 'transparent',
                              }}
                              className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                                activeImageIndex === i ? '' : 'opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Right Product Info */}
              <div className="space-y-4">
                {(activeModalProduct.badge || activeModalProduct.featured) && (
                  <span
                    style={{
                      backgroundColor: 'var(--accent-bg)',
                      color: 'var(--accent-text)',
                    }}
                    className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs"
                  >
                    {activeModalProduct.badge || '⭐ Öne Çıkan'}
                  </span>
                )}

                <h3
                  style={{ color: 'var(--text-main)' }}
                  className="text-xl sm:text-2xl font-black leading-snug"
                >
                  {activeModalProduct.name}
                </h3>

                <p
                  style={{ color: 'var(--text-muted)' }}
                  className="text-xs sm:text-sm leading-relaxed font-normal"
                >
                  {activeModalProduct.description}
                </p>

                <div
                  style={{ borderColor: 'var(--text-muted)' }}
                  className="pt-4 border-t border-opacity-20 space-y-3"
                >
                  <button
                    onClick={() => handleWhatsAppOrder(activeModalProduct)}
                    style={{
                      backgroundColor: 'var(--accent-bg)',
                      color: 'var(--accent-text)',
                    }}
                    className="w-full inline-flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer opacity-95 hover:opacity-100"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp ile Bilgi Al</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
