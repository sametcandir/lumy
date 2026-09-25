'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const cleanPhone = formatWhatsAppPhone(settings.contact?.whatsapp);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Merhaba%20Lumy%20Toys,%20pelu%C5%9F%20oyuncaklar%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`;

  return (
    <aside aria-label="WhatsApp İletişim" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Speech bubble */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-main)',
        }}
        className="hidden sm:block mr-3 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-lg border border-current/10 transform group-hover:scale-105 transition-transform duration-200"
      >
        {settings.floatingWhatsappText || "WhatsApp'tan Danışın"}
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Canlı Destek ve Sipariş"
        className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white text-white" />
      </a>
    </aside>
  );
}
