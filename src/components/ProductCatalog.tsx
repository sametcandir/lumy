'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category, SiteSettings } from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';
import { Search, MessageCircle, Eye, Sparkles, Check, X, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
}

export default function ProductCatalog({ products, categories, settings }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const cleanPhone = formatWhatsAppPhone(settings.contact?.whatsapp);

  // Open modal and reset gallery image index
  const handleOpenModal = (product: Product) => {
    setActiveModalProduct(product);
    setActiveImageIndex(0);
  };

  // Filter products: only products intended to be shown on the homepage
  const visibleProducts = useMemo(() => {
    return products.filter((p) => p.showOnHomepage !== false);
  }, [products]);

  // Filter categories: only show categories that contain at least 1 visible product (plus 'all')
  const activeCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (cat.id === 'all') return true;
      return visibleProducts.some((p) => p.category === cat.id);
    });
  }, [categories, visibleProducts]);

  // Reset category to 'all' if the selected category has no visible products
  useEffect(() => {
    if (selectedCategory !== 'all' && !activeCategories.some((c) => c.id === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [activeCategories, selectedCategory]);

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [visibleProducts, selectedCategory, searchQuery]);

  const handleWhatsAppOrder = (product: Product) => {
    const text = `Merhaba Lumy Toys, "${product.name}" peluş ürünü hakkında bilgi ve sipariş detaylarını almak istiyorum.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="katalog" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-900 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            <span className="text-sm">{settings.catalogBadgeIcon || '✨'}</span>
            <span>{settings.catalogBadge || 'Peluş Koleksiyonumuz'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {settings.catalogTitle || 'Özenle Üretilmiş Sevimli Peluşlar'}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal">
            {settings.catalogSubtitle ||
              'Her dikişinde sevgi, her dokunuşunda güven taşıyan en sevimli peluş modellerimizi keşfedin.'}
          </p>
        </div>

        {/* Filter Controls: Search & Category Buttons */}
        <div className="space-y-6 mb-12">
          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={settings.catalogSearchPlaceholder || 'Peluş adı veya özellik ara (örn: Panda, Ayı, Tavşan)...'}
              className="w-full pl-11 pr-4 py-3.5 bg-amber-50/50 border border-amber-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activeCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-plush-500 text-white shadow-md shadow-plush-500/20 scale-105'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-gray-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-amber-50/50 rounded-3xl border border-dashed border-amber-200 max-w-lg mx-auto p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Eşleşen Peluş Bulunamadı</h3>
            <p className="text-sm text-gray-500 mb-4">
              Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-plush-600 underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const productImages = (product.images && product.images.length > 0)
                ? product.images
                : (product.image ? [product.image] : []);
              const mainImg = productImages[0] || product.image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl border border-amber-100/90 shadow-soft hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image Area */}
                    <div className="relative h-64 w-full bg-amber-50/70 overflow-hidden cursor-pointer" onClick={() => handleOpenModal(product)}>
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                      />

                      {/* Product Badge */}
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-amber-900 font-black text-[11px] px-3 py-1 rounded-full shadow-sm">
                          {product.badge}
                        </div>
                      )}

                      {/* Multiple Images Indicator Badge */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
                          <span>📷</span>
                          <span>{productImages.length} Fotoğraf</span>
                        </div>
                      )}

                      {/* Quick Preview Button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(product);
                          }}
                          className="bg-white/95 text-gray-900 font-bold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-plush-600" />
                          <span>{settings.catalogCardViewBtn || 'Detayları İncele'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-amber-800/80 font-semibold uppercase tracking-wider">
                        <span>
                          {categories.find((c) => c.id === product.category)?.name || 'Peluş'}
                        </span>
                        {product.showStock !== false && (
                          product.inStock !== false ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                              {settings.catalogInStockText || 'Stokta Var'}
                            </span>
                          ) : (
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-bold">
                              {settings.catalogOutOfStockText || 'Tükendi'}
                            </span>
                          )
                        )}
                      </div>

                      <h3
                        onClick={() => handleOpenModal(product)}
                        className="font-bold text-gray-900 text-base group-hover:text-plush-600 transition-colors line-clamp-1 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Footer without prices */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200/90 text-gray-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-plush-600" />
                        <span>İncele</span>
                      </button>

                      <button
                        onClick={() => handleWhatsAppOrder(product)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Product Detail with 5 Images Gallery */}
        {activeModalProduct && (() => {
          const modalImages = (activeModalProduct.images && activeModalProduct.images.length > 0)
            ? activeModalProduct.images
            : (activeModalProduct.image ? [activeModalProduct.image] : []);
          const currentImg = modalImages[activeImageIndex] || activeModalProduct.image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80';

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setActiveModalProduct(null)}
            >
              <div
                className="bg-white rounded-4xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100 relative p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 text-gray-700 rounded-full transition-colors cursor-pointer"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
                  {/* Modal Image Gallery */}
                  <div className="space-y-3">
                    <div className="rounded-3xl overflow-hidden bg-amber-50 h-72 sm:h-80 relative border border-amber-100 shadow-inner group">
                      <img
                        src={currentImg}
                        alt={activeModalProduct.name}
                        className="w-full h-full object-cover object-center transition-all duration-300"
                      />
                      {activeModalProduct.badge && (
                        <div className="absolute top-3 left-3 bg-white/95 font-extrabold text-xs px-3 py-1 rounded-full text-amber-900 shadow-sm">
                          {activeModalProduct.badge}
                        </div>
                      )}

                      {/* Prev/Next arrows if multiple images */}
                      {modalImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1));
                            }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer text-lg font-bold"
                            aria-label="Önceki Görsel"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0));
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer text-lg font-bold"
                            aria-label="Sonraki Görsel"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Row (Up to 5 images) */}
                    {modalImages.length > 1 && (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
                        {modalImages.map((img, idx) => {
                          const isActive = activeImageIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveImageIndex(idx)}
                              className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 cursor-pointer transition-all duration-200 ${
                                isActive
                                  ? 'shadow-md ring-2 ring-plush-400/30'
                                  : 'opacity-65 hover:opacity-100'
                              }`}
                              title={`Görsel ${idx + 1}`}
                            >
                              <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover object-center block"
                              />
                              {/* Tam oturan kusursuz çerçeve katmanı */}
                              <div
                                className={`absolute inset-0 rounded-2xl pointer-events-none transition-colors ${
                                  isActive
                                    ? 'border-2 border-plush-500'
                                    : 'border border-black/10 group-hover:border-black/25'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Modal Info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-plush-600 uppercase tracking-wider">
                        {categories.find((c) => c.id === activeModalProduct.category)?.name}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {activeModalProduct.name}
                      </h3>
                    </div>

                    {activeModalProduct.showStock !== false && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-gray-800">
                          {activeModalProduct.inStock !== false ? (settings.catalogInStockText || 'Stokta Mevcut') : (settings.catalogOutOfStockText || 'Tükendi')}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ürün Açıklaması</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {activeModalProduct.description}
                      </p>
                    </div>

                    {/* Quality Checklist */}
                    <div className="space-y-1.5 text-xs text-gray-600 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>1. Kalite EN-71 Avrupa Güvenlik Onaylı</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Antialerjik yıkanabilir peluş kumaş</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kopmaz kilitli göz sistemi (Bebek güvenli)</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleWhatsAppOrder(activeModalProduct)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-md transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>WhatsApp ile Bilgi Al / Sipariş Ver</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
