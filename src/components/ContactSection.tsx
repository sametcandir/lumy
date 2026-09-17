'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle, MessageCircle, Building } from 'lucide-react';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [formType, setFormType] = useState<'wholesale' | 'customer'>('wholesale');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productInterest: '',
    estimatedQty: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cleanPhone = formatWhatsAppPhone(settings.contact?.whatsapp);
  const whatsappDirect = `https://wa.me/${cleanPhone}?text=Merhaba%20Lumy%20Toys,%20ileti%C5%9Fime%20ge%C3%A7mek%20istiyorum.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: formType
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          productInterest: '',
          estimatedQty: '',
          message: ''
        });
      } else {
        setErrorMsg(data.error || 'Bir hata oluştu, lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setErrorMsg('Bağlantı hatası oluştu. Lütfen WhatsApp üzerinden bize ulaşın.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="iletisim" className="py-16 sm:py-24 bg-gradient-to-b from-white via-amber-50/30 to-orange-50/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-plush-100 text-plush-700 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            <span className="text-sm">{settings.contactBadgeIcon || '✉️'}</span>
            <span>{settings.contactBadge || 'Bize Ulaşın'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            {settings.contactTitle || 'Toptan Fiyat Teklifi Alın veya Bize Danışın'}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            {settings.contactSubtitle ||
              'İster mağazanız için toptan sipariş planlayın, ister aklınıza takılan soruları sorun. Ekibimiz en kısa sürede size dönüş yapacaktır.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-4xl p-6 sm:p-10 border border-amber-100 shadow-xl">
            
            {/* Form Type Tabs */}
            <div className="flex rounded-2xl bg-amber-50/80 p-1.5 mb-8 border border-amber-200">
              <button
                type="button"
                onClick={() => setFormType('wholesale')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  formType === 'wholesale'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {settings.contactWholesaleTab || '📦 Toptan / Tedarikçi Teklifi'}
              </button>
              <button
                type="button"
                onClick={() => setFormType('customer')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  formType === 'customer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {settings.contactCustomerTab || '🧸 Müşteri / Genel Soru'}
              </button>
            </div>

            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-gray-900">Talebiniz Alındı!</h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Mesajınız ve bilgileriniz başarıyla yetkililerimize iletildi. Toptan satış temsilcimiz veya müşteri ekibimiz sizinle en kısa sürede irtibata geçecektir.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-plush-600 bg-plush-50 px-5 py-2.5 rounded-xl border border-plush-200 hover:bg-plush-100"
                >
                  Yeni Bir Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Telefon / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ornek@alanadi.com"
                      className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                  </div>

                  {formType === 'wholesale' ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Firma / Mağaza Adı
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Örn: Renkli Düşler Oyuncak"
                        className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        İlgilendiğiniz Ürün
                      </label>
                      <input
                        type="text"
                        value={formData.productInterest}
                        onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                        placeholder="Örn: 120 cm Dev Ayıcık"
                        className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  )}
                </div>

                {formType === 'wholesale' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        İlgilendiğiniz Modeller
                      </label>
                      <input
                        type="text"
                        value={formData.productInterest}
                        onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                        placeholder="Örn: Ayıcıklar & Dinozor Serisi"
                        className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Tahmini Adet / Bütçe
                      </label>
                      <input
                        type="text"
                        value={formData.estimatedQty}
                        onChange={(e) => setFormData({ ...formData, estimatedQty: e.target.value })}
                        placeholder="Örn: 100 - 250 adet"
                        className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Mesajınız & Talebiniz <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      formType === 'wholesale'
                        ? 'Toptan katalog ve fiyat listesi talebinizi, teslimat şehri veya varsa özel taleplerinizi belirtebilirsiniz...'
                        : 'Sormak istediğiniz soruları buraya yazabilirsiniz...'
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-plush-500 hover:bg-plush-600 disabled:opacity-60 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-base"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? 'Gönderiliyor...' : (settings.contactSubmitBtnText || 'Teklif Talebini Gönder')}</span>
                </button>
              </form>
            )}

          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Card */}
            <div className="bg-emerald-600 text-white p-7 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white fill-white" />
                </div>
                <h3 className="text-xl font-black">{settings.contactCardTitle || 'Hızlı WhatsApp İletişim Hattı'}</h3>
                <p className="text-sm text-emerald-100 font-light">
                  {settings.contactCardText || 'Form doldurmakla vakit kaybetmek istemiyorsanız doğrudan toptan ve perakende satış sorumlumuzla WhatsApp üzerinden yazışabilirsiniz.'}
                </p>
                <div className="text-2xl font-black pt-1">
                  {settings.contact?.whatsapp || '+90 530 123 45 67'}
                </div>
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  <span>{settings.contactCardBtnText || 'WhatsApp Sohbeti Başlat'}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* General Contact Info Box */}
            <div className="bg-white p-7 rounded-3xl border border-amber-100 shadow-sm space-y-5">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">{settings.contactPhoneTitle || 'Sabit Telefon'}</h4>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">
                    {settings.contact?.phone || '+90 (212) 555 89 42'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">{settings.contactEmailTitle || 'E-Posta Adresleri'}</h4>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">
                    {settings.contact?.email || 'info@lumytoys.com'}
                  </p>
                  {settings.contact?.wholesaleEmail && (
                    <p className="text-xs text-plush-600 font-semibold">
                      Toptan: {settings.contact.wholesaleEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">{settings.contactAddressTitle || 'Fabrika & Showroom Adresi'}</h4>
                  <p className="text-sm font-medium text-gray-700 mt-0.5 leading-snug">
                    {settings.contact?.address || 'İkitelli OSB Mah. Oyuncakçılar Sanayi Sitesi A Blok No: 24, Başakşehir / İstanbul'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Çalışma Saatleri</h4>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {settings.contact?.workingHours || 'Pazartesi - Cumartesi: 09:00 - 18:30'}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
