'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Halihazırda oturum açılmışsa doğrudan panele yönlendir
    const token = typeof window !== 'undefined' ? localStorage.getItem('lumy_admin_token') : null;
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('lumy_admin_token', data.token);
        router.push('/admin');
      } else {
        if (data.locked || res.status === 429) {
          setIsLocked(true);
        }
        setError(data.error || 'Hatalı kullanıcı adı veya şifre!');
      }
    } catch (err: any) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4">
      {/* Back to site */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-900/5 border border-stone-200/90 space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <img
              src="/images/lumy_logo_dark.png"
              alt="Lumy Toys"
              className="h-16 sm:h-20 w-auto mx-auto object-contain transition-transform hover:scale-102"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">Yönetim Paneli Girişi</h1>
            <p className="text-xs text-stone-500 font-normal mt-1">
              Lumy Toys içerik ve ürün yönetim sistemine erişin.
            </p>
          </div>
        </div>

        {error && (
          <div
            className={`p-4 rounded-2xl border text-xs font-medium flex items-start gap-3 ${
              isLocked
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {isLocked && <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            <div className="flex-1 leading-relaxed">
              <span className="font-bold block">{isLocked ? 'Güvenlik Kilidi Aktif' : 'Hatalı Giriş'}</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                disabled={loading || isLocked}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınız"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white disabled:opacity-50 disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || isLocked}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white disabled:opacity-50 disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={loading || isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
                title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs tracking-[0.15em] uppercase cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {isLocked ? (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Erişim Engellendi (Kilitli)</span>
              </>
            ) : loading ? (
              'Giriş Yapılıyor...'
            ) : (
              'Panele Giriş Yap'
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-stone-100">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-100 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Brute-force & Rate Limit Koruması Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
