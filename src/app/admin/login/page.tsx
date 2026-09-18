'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
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
        setError(data.error || 'Hatalı kullanıcı adı veya şifre!');
      }
    } catch (err: any) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-xl border border-amber-200/80 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-plush-500 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl shadow-md">
            🧸
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Lumy Toys Yönetim</h1>
          <p className="text-xs text-gray-500 font-medium">
            Yönetim paneline erişmek için lütfen giriş yapın.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-200 text-center">
            {error}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adınız"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plush-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plush-500 hover:bg-plush-600 disabled:opacity-60 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm cursor-pointer mt-2"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}
          </button>
        </form>

        <div className="text-center pt-2">
          <span className="text-[11px] text-gray-400 font-medium">
            Lumy Toys Yönetim Sistemi
          </span>
        </div>
      </div>
    </div>
  );
}
