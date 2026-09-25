'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/db';
import LumyLogo, { isDarkColor } from './LumyLogo';
import { Mail, Phone, MapPin, Instagram, Linkedin, Send, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isDarkFooter = isDarkColor(settings.theme?.footerBg || '#141414');

  const contactInfo = settings.contact || {
    email: 'info@lumytoys.com',
    phone: '+90 530 123 45 67',
    address: 'İstanbul, Türkiye',
    instagram: 'https://instagram.com/lumytoys'
  };

  const tagline = settings.footerTagline || 'Özel bir şeyler üretelim. Ekibimizle hemen iletişime geçin.';
  const contactTitle = settings.footerContactTitle || 'BİZE ULAŞIN';

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.contact.includes('@') ? formData.contact : '',
          phone: !formData.contact.includes('@') ? formData.contact : '',
          message: formData.message,
          type: 'customer'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', contact: '', message: '' });
      } else {
        setErrorMsg(data.error || 'Mesaj iletilemedi, lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setErrorMsg('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      id="contact"
      style={{
        backgroundColor: 'var(--footer-bg)',
        color: 'var(--footer-text)',
      }}
      className="pt-20 pb-12 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-current/15">
          
          {/* Left Column: Brand & Interactive Contact Form */}
          <div className="lg:col-span-6 space-y-6">
            <Link href="/" className="inline-block group">
              <LumyLogo
                variant={isDarkFooter ? 'dark' : 'light'}
                logoUrl={settings.logoUrl}
                brandName={settings.brandName || 'lumy TOYS'}
              />
            </Link>

            <p
              style={{ color: 'var(--footer-text)', opacity: 0.8 }}
              className="text-xs sm:text-sm font-normal leading-relaxed max-w-md"
            >
              {tagline}
            </p>

            {/* Quick Contact Form */}
            <div className="bg-[#1C1C1C] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-800/80 shadow-xl max-w-lg">
              {submitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#84CC16]/20 text-[#84CC16] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Mesajınız Alındı!</h4>
                  <p className="text-xs text-stone-400">
                    Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#84CC16] underline hover:text-[#A3E635] pt-2"
                  >
                    Yeni bir mesaj gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  {errorMsg && (
                    <div className="p-2.5 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Adınız Soyadınız *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#262626] border border-stone-700/60 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#84CC16]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Telefon veya E-posta *"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#262626] border border-stone-700/60 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#84CC16]"
                    />
                  </div>

                  <textarea
                    rows={3}
                    required
                    placeholder="Mesajınız veya hayalinizdeki peluş proje *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#262626] border border-stone-700/60 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#84CC16] resize-none"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#84CC16] hover:bg-[#A3E635] disabled:opacity-50 text-stone-950 font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>{loading ? 'Gönderiliyor...' : 'Mesajı İlet'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Center Column: Direct Contact Info & Socials */}
          <div className="lg:col-span-3 space-y-6">
            <span
              style={{ color: 'var(--footer-text)', opacity: 0.65 }}
              className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase block"
            >
              {contactTitle}
            </span>

            <div className="space-y-4 text-xs font-medium" style={{ color: 'var(--footer-text)' }}>
              {contactInfo.email && (
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href={`mailto:${contactInfo.email}`} className="hover:underline transition-all">
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {contactInfo.phone && (
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Phone className="w-4 h-4" />
                  </div>
                  <a href={`tel:${contactInfo.phone}`} className="hover:underline transition-all">
                    {contactInfo.phone}
                  </a>
                </div>
              )}

              {contactInfo.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 opacity-80 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="leading-relaxed opacity-85">
                    {contactInfo.address}
                  </span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              {contactInfo.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  style={{ color: 'var(--footer-text)' }}
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contactInfo.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  style={{ color: 'var(--footer-text)' }}
                  title="Facebook"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Peeking Fox Mascot Graphic */}
          <div className="lg:col-span-3 relative flex items-end justify-center lg:justify-end">
            <div className="w-48 sm:w-56 lg:w-64 select-none relative">
              {/* Cute SVG Plush Fox Face peeking up */}
              <svg
                viewBox="0 0 240 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-2xl"
              >
                {/* Left Ear */}
                <path
                  d="M40 140L15 45C13 38 22 34 27 40L75 95C60 110 48 125 40 140Z"
                  fill="#D95D1E"
                />
                <path
                  d="M38 120L24 58C22 53 28 50 32 54L65 92C55 102 45 111 38 120Z"
                  fill="#FFF7ED"
                />

                {/* Right Ear */}
                <path
                  d="M200 140L225 45C227 38 218 34 213 40L165 95C180 110 192 125 200 140Z"
                  fill="#D95D1E"
                />
                <path
                  d="M202 120L216 58C218 53 212 50 208 54L175 92C185 102 195 111 202 120Z"
                  fill="#FFF7ED"
                />

                {/* Main Fox Head Shape */}
                <path
                  d="M35 150C35 100 70 85 120 85C170 85 205 100 205 150C205 200 170 220 120 220C70 220 35 200 35 150Z"
                  fill="#E66A23"
                />

                {/* White Cheek Tufts / Fur */}
                <path
                  d="M35 155C35 190 70 215 120 215C170 215 205 190 205 155C195 155 180 140 160 145C140 150 130 165 120 165C110 165 100 150 80 145C60 140 45 155 35 155Z"
                  fill="#FFFBF5"
                />

                {/* Left Eye */}
                <ellipse cx="85" cy="140" rx="6" ry="8" fill="#1C1917" />
                <circle cx="83" cy="137" r="2.5" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse cx="155" cy="140" rx="6" ry="8" fill="#1C1917" />
                <circle cx="153" cy="137" r="2.5" fill="#FFFFFF" />

                {/* Cute Black Snout / Nose */}
                <path
                  d="M110 170C110 165 130 165 130 170C130 176 120 182 120 182C120 182 110 176 110 170Z"
                  fill="#1C1917"
                />

                {/* Gentle Smile */}
                <path
                  d="M114 184C117 187 120 188 120 188C120 188 123 187 126 184"
                  stroke="#1C1917"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin Link */}
        <div
          style={{ color: 'var(--footer-text)', opacity: 0.6 }}
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        >
          <div>
            <span>© 2026 Lumy Toys. Tüm hakları saklıdır.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:opacity-100 flex items-center gap-1.5 transition-opacity">
              <Lock className="w-3.5 h-3.5 opacity-70" />
              <span>Yönetim Girişi</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
