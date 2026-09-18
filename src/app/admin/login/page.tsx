'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Otomatik olarak doğrudan yönetim paneline aktar
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/50 flex flex-col justify-center items-center p-4">
      {/* Back to site */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-plush-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-xl border border-amber-200/80 space-y-6 text-center">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-plush-500 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl shadow-md">
            🧸
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lumy Toys Yönetim</h1>
          <p className="text-xs text-gray-500 font-medium">
            Şifresiz doğrudan erişim aktiftir. Yönetim paneline yönlendiriliyorsunuz...
          </p>
        </div>

        <Link
          href="/admin"
          className="w-full inline-flex items-center justify-center gap-2 bg-plush-500 hover:bg-plush-600 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
        >
          <span>Panele Git</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="text-center pt-2">
          <span className="text-[11px] text-gray-400 font-medium">
            Lumy Toys Yönetim Sistemi
          </span>
        </div>
      </div>
    </div>
  );
}
