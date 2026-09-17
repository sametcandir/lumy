'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Product,
  Category,
  SiteSettings,
  UserMessage,
  WholesaleFeature,
  StatItem
} from '@/lib/db';
import { formatWhatsAppPhone } from '@/lib/whatsapp';
import {
  Package,
  FileText,
  Phone,
  Inbox,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  Upload,
  LogOut,
  ExternalLink,
  RefreshCw,
  Search,
  MessageCircle,
  Eye,
  AlertCircle,
  Mail,
  Image as ImageIcon,
  FolderPlus,
  Send,
  Crown,
  Tag,
  EyeOff
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication check
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'products' | 'content' | 'contact' | 'email' | 'messages'>('products');

  // Data states
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  // UI status feedback
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Product Edit / Create Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Inline New Category state in product modal
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Category management modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Filter state for products tab
  const [productSearch, setProductSearch] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  useEffect(() => {
    // Check local admin token
    const token = typeof window !== 'undefined' ? localStorage.getItem('lumy_admin_token') : null;
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setAuthenticated(true);
    fetchData();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, productsRes, categoriesRes, messagesRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/messages')
      ]);

      const [settingsData, productsData, categoriesData, messagesData] = await Promise.all([
        settingsRes.json(),
        productsRes.json(),
        categoriesRes.json(),
        messagesRes.json()
      ]);

      if (settingsData.success) {
        const s = settingsData.data;
        if (!s.aboutFeatures || s.aboutFeatures.length === 0) {
          s.aboutFeatures = [
            { id: 'q1', icon: '🛡️', title: 'EN-71 Çocuk Güvenliği', description: 'Toksik olmayan boyalar ve kimyasallar.' },
            { id: 'q2', icon: '✨', title: 'Kopmaz Nakış & Kilit', description: 'Bebekler için tam korumalı emniyet kilitleri.' },
            { id: 'q3', icon: '🧸', title: 'Yıkanabilir & Tüy Dökmez', description: '30° hassas yıkamada formunu koruyan doku.' },
            { id: 'q4', icon: '🏭', title: 'Yerli Üretim & Hızlı Tedarik', description: 'Stoktan aynı gün kargo veya sevkiyat.' }
          ];
        }
        setSettings(s);
      }
      if (productsData.success) setProducts(productsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (messagesData.success) setMessages(messagesData.data);
    } catch (err: any) {
      showStatus('error', 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lumy_admin_token');
    router.push('/admin/login');
  };

  // -------------------------------------------------------------
  // PRODUCT ACTIONS
  // -------------------------------------------------------------
  const openNewProductModal = () => {
    setEditingProduct({
      name: '',
      category: categories[1]?.id || 'ayiciklar',
      price: null,
      wholesaleMin: null,
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
      description: '',
      inStock: true,
      showStock: true,
      featured: false,
      badge: 'Yeni Ürün'
    });
    setIsAddingNewCategory(false);
    setNewCategoryInput('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsAddingNewCategory(false);
    setNewCategoryInput('');
    setIsProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(prev => prev ? { ...prev, image: data.url } : null);
        showStatus('success', 'Ürün görseli başarıyla yüklendi!');
      } else {
        showStatus('error', data.error || 'Görsel yüklenemedi');
      }
    } catch (err) {
      showStatus('error', 'Görsel yüklenirken hata oluştu');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, logoUrl: data.url });
        showStatus('success', 'Logo yüklendi! Lütfen "Değişiklikleri Kaydet" butonuna basınız.');
      } else {
        showStatus('error', data.error || 'Logo yüklenemedi');
      }
    } catch (err) {
      showStatus('error', 'Logo yüklenirken hata oluştu');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryInput.trim()) return;
    setIsSavingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        const createdCat = data.data;
        setCategories(prev => {
          if (prev.some(c => c.id === createdCat.id)) return prev;
          return [...prev, createdCat];
        });
        setEditingProduct(prev => prev ? { ...prev, category: createdCat.id } : null);
        setIsAddingNewCategory(false);
        setNewCategoryInput('');
        showStatus('success', `"${createdCat.name}" kategorisi başarıyla eklendi!`);
      } else {
        showStatus('error', data.error || 'Kategori eklenemedi');
      }
    } catch (err) {
      showStatus('error', 'Kategori eklenirken hata oluştu');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (catId === 'all') {
      showStatus('error', 'Tüm Peluşlar ana sekmesi silinemez.');
      return;
    }
    const assignedCount = products.filter(p => p.category === catId).length;
    if (assignedCount > 0) {
      alert(`Bu kategoride ${assignedCount} adet peluş ürün bulunmaktadır. Silmek için önce bu ürünlerin kategorisini değiştirin veya ürünleri silin.`);
      return;
    }
    if (!confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(catId)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(c => c.id !== catId));
        showStatus('success', `"${catName}" kategorisi başarıyla silindi!`);
      } else {
        showStatus('error', data.error || 'Kategori silinemedi.');
      }
    } catch (err) {
      showStatus('error', 'Kategori silinirken hata oluştu.');
    }
  };

  const toggleProductHomepage = async (product: Product) => {
    const nextVal = product.showOnHomepage === false ? true : false;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnHomepage: nextVal })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, showOnHomepage: nextVal } : p));
        showStatus('success', nextVal ? `"${product.name}" ana sayfada gösteriliyor.` : `"${product.name}" ana sayfadan gizlendi.`);
      } else {
        showStatus('error', data.error || 'Görünürlük güncellenemedi');
      }
    } catch (err) {
      showStatus('error', 'Görünürlük güncellenirken hata oluştu');
    }
  };

  const toggleHeroProduct = async (productId: string) => {
    if (!settings) return;
    const isCurrentlyHero = settings.heroProductId === productId;
    const newHeroId = isCurrentlyHero ? '' : productId;
    const prod = products.find(p => p.id === productId);

    const updatedSettings = {
      ...settings,
      heroProductId: newHeroId,
      ...(newHeroId && prod ? {
        heroImgBadge1: prod.badge || prod.name,
        heroImgBadge2: prod.price ? `₺${prod.price}` : 'Toptan & Perakende'
      } : {})
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(updatedSettings);
        showStatus('success', isCurrentlyHero ? 'Ana sayfa en üst vitrin ürünü kaldırıldı (varsayılana döndü).' : `"${prod?.name || 'Ürün'}" ana sayfanın en tepesine (Hero) yerleştirildi! 👑`);
      } else {
        showStatus('error', data.error || 'Hero vitrin ürünü güncellenemedi');
      }
    } catch (err) {
      showStatus('error', 'Hero ürünü güncellenirken hata oluştu');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    setIsSaving(true);
    try {
      if (editingProduct.id) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        const data = await res.json();
        if (data.success) {
          setProducts(prev => prev.map(p => p.id === data.data.id ? data.data : p));
          setIsProductModalOpen(false);
          showStatus('success', 'Ürün başarıyla güncellendi!');
        } else {
          showStatus('error', data.error || 'Ürün güncellenemedi');
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        const data = await res.json();
        if (data.success) {
          setProducts(prev => [data.data, ...prev]);
          setIsProductModalOpen(false);
          showStatus('success', 'Yeni peluş ürün eklendi!');
        } else {
          showStatus('error', data.error || 'Ürün eklenemedi');
        }
      }
    } catch (err) {
      showStatus('error', 'Kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showStatus('success', 'Ürün silindi!');
      } else {
        showStatus('error', data.error || 'Silinemedi');
      }
    } catch (err) {
      showStatus('error', 'Silinirken hata oluştu');
    }
  };

  const toggleProductStock = async (prod: Product) => {
    try {
      const newStockStatus = prod.inStock === false ? true : false;
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStockStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === prod.id ? data.data : p));
        showStatus('success', `${prod.name} stok durumu güncellendi.`);
      }
    } catch (err) {
      showStatus('error', 'Stok güncellenemedi');
    }
  };

  // -------------------------------------------------------------
  // SETTINGS & CONTENT ACTIONS
  // -------------------------------------------------------------
  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showStatus('success', 'Site ayarları ve metinleri başarıyla kaydedildi!');
      } else {
        showStatus('error', data.error || 'Ayarlar kaydedilemedi');
      }
    } catch (err) {
      showStatus('error', 'Kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!settings?.emailNotification?.recipientEmail) {
      showStatus('error', 'Lütfen önce e-posta adresi girip kaydedin!');
      return;
    }
    setSendingTestEmail(true);
    try {
      const res = await fetch('/api/test-email', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showStatus('success', data.message || 'Test e-postası başarıyla gönderildi!');
      } else {
        showStatus('error', data.error || 'Test e-postası gönderilemedi.');
      }
    } catch (err: any) {
      showStatus('error', 'E-posta testi sırasında bağlantı hatası oluştu');
    } finally {
      setSendingTestEmail(false);
    }
  };

  // -------------------------------------------------------------
  // MESSAGES ACTIONS
  // -------------------------------------------------------------
  const toggleMessageStatus = async (id: string, currentStatus: 'read' | 'unread') => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
        showStatus('success', 'Mesaj durumu güncellendi');
      }
    } catch (err) {
      showStatus('error', 'Durum güncellenemedi');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m.id !== id));
        showStatus('success', 'Mesaj silindi');
      }
    } catch (err) {
      showStatus('error', 'Mesaj silinemedi');
    }
  };

  if (!authenticated) {
    return null;
  }

  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-stone-50/80 text-gray-800 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="h-8 sm:h-10 w-auto max-w-[100px] sm:max-w-[140px] object-contain rounded-lg shrink-0"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500 text-white flex items-center justify-center text-base sm:text-xl font-black shadow-md shrink-0">
                🧸
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-xl font-black text-gray-900 tracking-tight truncate">
                  {settings?.brandName || 'Lumy Toys'}
                </h1>
                <span className="bg-amber-100 text-amber-800 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md uppercase shrink-0">
                  Panel
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Ürün, İçerik & Bildirim Merkezi</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {(activeTab === 'content' || activeTab === 'contact' || activeTab === 'email') && (
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                title="Değişiklikleri Kaydet"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? '...' : 'Kaydet'}</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-plush-600 bg-stone-100 hover:bg-stone-200/70 p-2 sm:px-3.5 sm:py-2 rounded-xl transition-colors"
              title="Siteyi Gör"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Siteyi Gör</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 sm:px-3.5 sm:py-2 rounded-xl transition-colors cursor-pointer"
              title="Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Çıkış</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 border-t border-gray-100 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-4 border-b-2 text-xs sm:text-sm font-extrabold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              activeTab === 'products'
                ? 'border-plush-500 text-plush-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Ürünler ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-4 border-b-2 text-xs sm:text-sm font-extrabold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              activeTab === 'content'
                ? 'border-plush-500 text-plush-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Site Yazıları & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-4 border-b-2 text-xs sm:text-sm font-extrabold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              activeTab === 'contact'
                ? 'border-plush-500 text-plush-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>İletişim & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-4 border-b-2 text-xs sm:text-sm font-extrabold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              activeTab === 'email'
                ? 'border-plush-500 text-plush-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>E-Posta</span>
            {settings?.emailNotification?.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-4 border-b-2 text-xs sm:text-sm font-extrabold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              activeTab === 'messages'
                ? 'border-plush-500 text-plush-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Talepler</span>
            {unreadMessagesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Floating Status Toast Alert */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold animate-in slide-in-from-bottom-5 text-white ${
            statusMessage.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-plush-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">Yönetim verileri yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------------------- */}
            {/* TAB 1: PRODUCT MANAGEMENT */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Peluş Oyuncak Kataloğu</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fiyat ve stok alanları opsiyoneldir; ister girin ister boş bırakın.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Ürün adı ara..."
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-plush-400"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-300 transition-all cursor-pointer"
                        title="Kategorileri Düzenle / Sil"
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        <span>Kategorileri Yönet ({categories.filter(c => c.id !== 'all').length})</span>
                      </button>

                      <button
                        onClick={openNewProductModal}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-plush-500 hover:bg-plush-600 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Yeni Peluş Ekle</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Table & Mobile Cards */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                  {/* Mobile Card List (< md screens) */}
                  <div className="md:hidden divide-y divide-gray-100">
                    {products
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((p) => (
                        <div key={p.id} className="p-4 flex items-start gap-3 hover:bg-amber-50/30 transition-colors">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-black text-gray-900 text-sm truncate">{p.name}</h3>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                  title="Düzenle"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <p className="text-[11px] text-plush-600 font-semibold mt-0.5">
                              {categories.find(c => c.id === p.category)?.name || p.category}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {/* Hero Showcase Button */}
                              {settings?.heroProductId === p.id ? (
                                <button
                                  type="button"
                                  onClick={() => toggleHeroProduct(p.id)}
                                  className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-black px-2 py-0.5 rounded-md text-[10px] cursor-pointer"
                                  title="En üstteki Hero vitrininden kaldır"
                                >
                                  <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                                  <span>👑 En Üstte (Hero)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleHeroProduct(p.id)}
                                  className="inline-flex items-center gap-1 text-gray-600 hover:text-amber-700 bg-stone-100 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer border border-gray-200"
                                  title="Ana sayfanın en üstüne koy"
                                >
                                  <Crown className="w-3 h-3" />
                                  <span>En Üste Al</span>
                                </button>
                              )}

                              {/* Show on Homepage Toggle */}
                              <button
                                type="button"
                                onClick={() => toggleProductHomepage(p)}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                                  p.showOnHomepage !== false
                                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                    : 'text-gray-500 bg-gray-100 border border-gray-300'
                                }`}
                              >
                                {p.showOnHomepage !== false ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                                <span>{p.showOnHomepage !== false ? 'Yayında' : 'Gizli'}</span>
                              </button>

                              {p.price ? (
                                <span className="font-black text-gray-900 text-xs">₺{p.price}</span>
                              ) : (
                                <span className="text-amber-600 bg-amber-50 font-bold px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                                  Fiyat Sorunuz
                                </span>
                              )}

                              {p.wholesaleMin && (
                                <span className="text-gray-500 text-[10px] font-semibold">
                                  Min. {p.wholesaleMin} ad.
                                </span>
                              )}

                              {p.showStock === false ? (
                                <span className="text-gray-400 text-[10px] italic">Stok Gizli</span>
                              ) : (
                                <button
                                  onClick={() => toggleProductStock(p)}
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                                    p.inStock !== false
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {p.inStock !== false ? '● Stokta' : '○ Tükendi'}
                                </button>
                              )}

                              {p.badge && (
                                <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                      <div className="p-8 text-center text-xs text-gray-400">
                        Aramanıza uygun ürün bulunamadı.
                      </div>
                    )}
                  </div>

                  {/* Desktop Table (>= md screens) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-extrabold">
                        <tr>
                          <th className="py-3.5 px-4">Görsel</th>
                          <th className="py-3.5 px-4">Ürün Adı & Kategori</th>
                          <th className="py-3.5 px-4">Perakende Fiyat</th>
                          <th className="py-3.5 px-4">Min. Toptan</th>
                          <th className="py-3.5 px-4">Stok Durumu</th>
                          <th className="py-3.5 px-4">Ana Sayfa & Vitrin</th>
                          <th className="py-3.5 px-4">Rozet</th>
                          <th className="py-3.5 px-4 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products
                          .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((p) => (
                            <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                              <td className="py-3 px-4">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="font-extrabold text-gray-900 text-sm">{p.name}</div>
                                <div className="text-[11px] text-plush-600 font-semibold">
                                  {categories.find(c => c.id === p.category)?.name || p.category}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                {p.price ? (
                                  <span className="font-black text-gray-900 text-sm">₺{p.price}</span>
                                ) : (
                                  <span className="text-amber-600 bg-amber-50 font-bold px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                                    Fiyat Sorunuz
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-bold text-gray-700">
                                {p.wholesaleMin ? `${p.wholesaleMin} Adet` : <span className="text-gray-400 font-normal">-</span>}
                              </td>

                              <td className="py-3 px-4">
                                {p.showStock === false ? (
                                  <span className="text-gray-400 text-[10px] italic">Gizli</span>
                                ) : (
                                  <button
                                    onClick={() => toggleProductStock(p)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                                      p.inStock !== false
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {p.inStock !== false ? '● Stokta Var' : '○ Tükendi'}
                                  </button>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1.5 items-start">
                                  {/* Hero Showcase Button */}
                                  {settings?.heroProductId === p.id ? (
                                    <button
                                      type="button"
                                      onClick={() => toggleHeroProduct(p.id)}
                                      className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-black px-2 py-0.5 rounded-lg text-[10px] cursor-pointer hover:bg-amber-200 transition-colors shadow-xs"
                                      title="Hero vitrininden kaldırmak için tıklayın"
                                    >
                                      <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                                      <span>👑 En Üstte (Hero)</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => toggleHeroProduct(p.id)}
                                      className="inline-flex items-center gap-1 text-gray-500 hover:text-amber-700 hover:bg-amber-50 font-bold px-2 py-0.5 rounded-lg text-[10px] cursor-pointer border border-gray-200 hover:border-amber-300 transition-colors"
                                      title="Bu ürünü ana sayfanın en tepesindeki büyük vitrine koy"
                                    >
                                      <Crown className="w-3 h-3" />
                                      <span>En Üste Al</span>
                                    </button>
                                  )}

                                  {/* Show on Homepage Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleProductHomepage(p)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                                      p.showOnHomepage !== false
                                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                                        : 'text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                    }`}
                                    title={p.showOnHomepage !== false ? 'Katalogda yayında (Gizlemek için tıklayın)' : 'Katalogdan gizlendi (Yayınlamak için tıklayın)'}
                                  >
                                    {p.showOnHomepage !== false ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                                    <span>{p.showOnHomepage !== false ? 'Yayında' : 'Gizli'}</span>
                                  </button>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                {p.badge ? (
                                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                                    {p.badge}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                  title="Düzenle"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 2: SITE TEXTS, ICONS & LOGO */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'content' && settings && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Site Metinleri, İkonlar & Başlıklar</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sitedeki her bir başlığı, rozet ikonunu, buton yazısını ve metni buradan anında değiştirebilirsiniz.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                  </button>
                </div>

                {/* Section: Custom Logo Upload */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-plush-600" /> Marka Logosu
                    </h3>
                    {settings.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, logoUrl: '' })}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Logoyu Kaldır (Varsayılan İkonu Kullan)
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
                    <div className="w-32 h-20 bg-white border border-gray-300 rounded-xl flex items-center justify-center p-2 shadow-inner shrink-0">
                      {settings.logoUrl ? (
                        <img
                          src={settings.logoUrl}
                          alt="Yüklü Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-gray-400 text-xs">
                          <span className="text-2xl block">🧸</span>
                          Varsayılan
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <p className="text-xs text-gray-600 font-medium">
                        Logonuz şeffaf arka planlı (PNG veya SVG) olduğunda sitenin hem üst menüsünde hem de alt kısmında kusursuz görünür.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-plush-500 hover:bg-plush-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingLogo ? 'Yükleniyor...' : 'Bilgisayardan Logo Seç'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={uploadingLogo}
                          />
                        </label>

                        <input
                          type="text"
                          value={settings.logoUrl || ''}
                          onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                          placeholder="Veya Doğrudan Logo URL Yapıştırın (https://...)"
                          className="flex-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Brand & Header Notice */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">🏷️</span> Marka Kimliği & En Üst Duyuru Çubuğu
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Marka Adı</label>
                      <input
                        type="text"
                        value={settings.brandName || ''}
                        onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Marka Sloganı</label>
                      <input
                        type="text"
                        value={settings.slogan || ''}
                        onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">En Üst Duyuru Rozet Yazısı</label>
                      <input
                        type="text"
                        value={settings.badgeText || ''}
                        onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
                        placeholder="🧸 Türkiye'nin Sevilen Peluş Üreticisi & Toptancısı"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">En Üst Duyuru Yan Vurgu Metni</label>
                      <input
                        type="text"
                        value={settings.badgeSubtext || ''}
                        onChange={(e) => setSettings({ ...settings, badgeSubtext: e.target.value })}
                        placeholder="1. Sınıf EN-71 Sertifikalı Antialerjik Dolgu"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Navbar Links */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">🧭</span> Üst Gezinti Menüsü (Navbar) Yazıları
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">1. Menü Adı</label>
                      <input
                        type="text"
                        value={settings.navCatalog || ''}
                        onChange={(e) => setSettings({ ...settings, navCatalog: e.target.value })}
                        placeholder="Ürün Kataloğu"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">2. Menü Adı</label>
                      <input
                        type="text"
                        value={settings.navWholesale || ''}
                        onChange={(e) => setSettings({ ...settings, navWholesale: e.target.value })}
                        placeholder="Toptan & Tedarik"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">3. Menü Adı</label>
                      <input
                        type="text"
                        value={settings.navAbout || ''}
                        onChange={(e) => setSettings({ ...settings, navAbout: e.target.value })}
                        placeholder="Hakkımızda"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">4. Menü Adı</label>
                      <input
                        type="text"
                        value={settings.navContact || ''}
                        onChange={(e) => setSettings({ ...settings, navContact: e.target.value })}
                        placeholder="İletişim & Teklif"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Menü Sağındaki Yeşil WhatsApp Butonu Yazısı</label>
                    <input
                      type="text"
                      value={settings.navWhatsappBtn || ''}
                      onChange={(e) => setSettings({ ...settings, navWhatsappBtn: e.target.value })}
                      placeholder="WhatsApp Danışma"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Section 1: Hero Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">✨</span> 1. Ana Karşılama (Hero) Alanı
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Üst Rozet İkonu</label>
                      <input
                        type="text"
                        value={settings.heroBadgeIcon || '🧸'}
                        onChange={(e) => setSettings({ ...settings, heroBadgeIcon: e.target.value })}
                        placeholder="🧸"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs text-center text-lg"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Hero Ana Başlığı</label>
                      <input
                        type="text"
                        value={settings.heroTitle || ''}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Hero Açıklama Metni</label>
                    <textarea
                      rows={2}
                      value={settings.heroSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                  </div>

                  {/* Hero Wholesale Box Customization */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                    <span className="text-xs font-bold text-amber-950 block">📦 Karşılama Alanındaki Toptan Satış Kartı</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kart İkonu / Emoji</label>
                        <input
                          type="text"
                          value={settings.heroWholesaleIcon || '📦'}
                          onChange={(e) => setSettings({ ...settings, heroWholesaleIcon: e.target.value })}
                          placeholder="📦"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-center text-lg"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kart Başlığı</label>
                        <input
                          type="text"
                          value={settings.heroWholesaleTitle || ''}
                          onChange={(e) => setSettings({ ...settings, heroWholesaleTitle: e.target.value })}
                          placeholder="Mağazalar & E-Ticaret İçin Toptan Satış"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kart Alt Açıklaması</label>
                      <input
                        type="text"
                        value={settings.heroWholesaleText || ''}
                        onChange={(e) => setSettings({ ...settings, heroWholesaleText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Hero Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">1. Buton Yazısı (Turuncu Buton)</label>
                      <input
                        type="text"
                        value={settings.heroCatalogBtnText || ''}
                        onChange={(e) => setSettings({ ...settings, heroCatalogBtnText: e.target.value })}
                        placeholder="Peluşları Keşfet"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">2. Buton Yazısı (Beyaz Buton)</label>
                      <input
                        type="text"
                        value={settings.heroWholesaleBtnText || ''}
                        onChange={(e) => setSettings({ ...settings, heroWholesaleBtnText: e.target.value })}
                        placeholder="Toptan Fiyat Teklifi Al"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white font-bold"
                      />
                    </div>
                  </div>

                  {/* 3 Trust Items */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-700 block mb-2">Butonların Altındaki 3 Güven Maddesi</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-stone-50 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={settings.heroTrust1Icon || '🛡️'}
                            onChange={(e) => setSettings({ ...settings, heroTrust1Icon: e.target.value })}
                            className="w-10 px-1 py-1 bg-white border border-gray-200 rounded text-center text-sm"
                            placeholder="🛡️"
                          />
                          <span className="text-[10px] font-bold text-gray-500">1. Madde</span>
                        </div>
                        <input
                          type="text"
                          value={settings.heroTrust1Text || ''}
                          onChange={(e) => setSettings({ ...settings, heroTrust1Text: e.target.value })}
                          placeholder="CE & EN-71 Sertifikalı"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={settings.heroTrust2Icon || '✨'}
                            onChange={(e) => setSettings({ ...settings, heroTrust2Icon: e.target.value })}
                            className="w-10 px-1 py-1 bg-white border border-gray-200 rounded text-center text-sm"
                            placeholder="✨"
                          />
                          <span className="text-[10px] font-bold text-gray-500">2. Madde</span>
                        </div>
                        <input
                          type="text"
                          value={settings.heroTrust2Text || ''}
                          onChange={(e) => setSettings({ ...settings, heroTrust2Text: e.target.value })}
                          placeholder="%100 Antialerjik Dolgu"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={settings.heroTrust3Icon || '📦'}
                            onChange={(e) => setSettings({ ...settings, heroTrust3Icon: e.target.value })}
                            className="w-10 px-1 py-1 bg-white border border-gray-200 rounded text-center text-sm"
                            placeholder="📦"
                          />
                          <span className="text-[10px] font-bold text-gray-500">3. Madde</span>
                        </div>
                        <input
                          type="text"
                          value={settings.heroTrust3Text || ''}
                          onChange={(e) => setSettings({ ...settings, heroTrust3Text: e.target.value })}
                          placeholder="Hızlı & Güvenli Teslimat"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Showcase Product Selector */}
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                        <span>Ana Sayfanın En Üstündeki Vitrin Ürünü (Hero)</span>
                      </span>
                      {settings.heroProductId && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, heroProductId: '' })}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Seçimi Kaldır (Varsayılana Dön)
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Katalogdan Peluş Seç
                        </label>
                        <select
                          value={settings.heroProductId || ''}
                          onChange={(e) => {
                            const selId = e.target.value;
                            const prod = products.find(p => p.id === selId);
                            setSettings({
                              ...settings,
                              heroProductId: selId,
                              ...(prod ? {
                                heroImgBadge1: prod.badge || prod.name,
                                heroImgBadge2: prod.price ? `₺${prod.price}` : 'Toptan & Perakende'
                              } : {})
                            });
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          <option value="">-- Katalogdan Ürün Seçilmedi (Özel veya Varsayılan Görsel) --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              👑 {p.name} {p.price ? `(₺${p.price})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Veya Özel Görsel URL Girin (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={settings.heroCustomImageUrl || ''}
                          onChange={(e) => setSettings({ ...settings, heroCustomImageUrl: e.target.value })}
                          placeholder="https://... (boşsa ürün görseli veya varsayılan kullanılır)"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* Live Preview of Hero Image */}
                    {(() => {
                      const selectedProd = products.find(p => p.id === settings.heroProductId);
                      const previewImg = selectedProd?.image || settings.heroCustomImageUrl || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80";
                      return (
                        <div className="flex items-center gap-3 pt-2 bg-white p-2.5 rounded-xl border border-amber-200">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-stone-100 shrink-0">
                            <img src={previewImg} alt="Hero Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-xs">
                            <div className="font-bold text-gray-900">
                              {selectedProd ? `Seçili Ürün: ${selectedProd.name}` : 'Varsayılan / Özel Görsel Aktif'}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Ana sayfanın en üstünde sağdaki büyük kartta bu peluş görünecektir.
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Hero Visual Overlay Badges */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-gray-200 space-y-3">
                    <span className="text-xs font-bold text-gray-900 block">🖼️ Sağdaki Görsel Üzerindeki Rozet ve Baloncuklar</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Görsel Üst Sol Etiket</label>
                        <input
                          type="text"
                          value={settings.heroImgBadge1 || ''}
                          onChange={(e) => setSettings({ ...settings, heroImgBadge1: e.target.value })}
                          placeholder="👑 120 cm Dev Sarılma Ayısı"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Görsel Alt Sağ Etiket</label>
                        <input
                          type="text"
                          value={settings.heroImgBadge2 || ''}
                          onChange={(e) => setSettings({ ...settings, heroImgBadge2: e.target.value })}
                          placeholder="Toptan & Perakende"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                        <span className="text-[10px] font-extrabold text-gray-500 uppercase">Sol Alt Uçan Rozet</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={settings.heroMiniBadge1Icon || '✨'}
                            onChange={(e) => setSettings({ ...settings, heroMiniBadge1Icon: e.target.value })}
                            className="w-10 px-1 py-1 bg-stone-50 border border-gray-200 rounded text-center text-sm"
                            placeholder="✨"
                          />
                          <input
                            type="text"
                            value={settings.heroMiniBadge1Title || ''}
                            onChange={(e) => setSettings({ ...settings, heroMiniBadge1Title: e.target.value })}
                            placeholder="Güven Standartı"
                            className="flex-1 px-2 py-1 bg-stone-50 border border-gray-200 rounded text-xs font-bold"
                          />
                        </div>
                        <input
                          type="text"
                          value={settings.heroMiniBadge1Text || ''}
                          onChange={(e) => setSettings({ ...settings, heroMiniBadge1Text: e.target.value })}
                          placeholder="%100 Boncuk Elyaf"
                          className="w-full px-2 py-1 bg-stone-50 border border-gray-200 rounded text-xs"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                        <span className="text-[10px] font-extrabold text-gray-500 uppercase">Sağ Üst Yeşil Rozet</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={settings.heroMiniBadge2Icon || '🏆'}
                            onChange={(e) => setSettings({ ...settings, heroMiniBadge2Icon: e.target.value })}
                            className="w-10 px-1 py-1 bg-stone-50 border border-gray-200 rounded text-center text-sm"
                            placeholder="🏆"
                          />
                          <input
                            type="text"
                            value={settings.heroMiniBadge2Title || ''}
                            onChange={(e) => setSettings({ ...settings, heroMiniBadge2Title: e.target.value })}
                            placeholder="Toptan Avantajı"
                            className="flex-1 px-2 py-1 bg-stone-50 border border-gray-200 rounded text-xs font-bold"
                          />
                        </div>
                        <input
                          type="text"
                          value={settings.heroMiniBadge2Text || ''}
                          onChange={(e) => setSettings({ ...settings, heroMiniBadge2Text: e.target.value })}
                          placeholder="Özel Üretici İskontosu"
                          className="w-full px-2 py-1 bg-stone-50 border border-gray-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Stats */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-700 block mb-2">Görselin Altındaki 4 İstatistik Kutusu</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {(settings.stats || []).map((st, idx) => (
                        <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-gray-200 space-y-1.5">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Kutu {idx + 1} Rakam</label>
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => {
                              const newStats = [...settings.stats];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              setSettings({ ...settings, stats: newStats });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-black text-plush-600"
                            placeholder="50.000+"
                          />
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Açıklama</label>
                          <input
                            type="text"
                            value={st.label}
                            onChange={(e) => {
                              const newStats = [...settings.stats];
                              newStats[idx] = { ...newStats[idx], label: e.target.value };
                              setSettings({ ...settings, stats: newStats });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px]"
                            placeholder="Mutlu Müşteri"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2: Catalog Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">🧸</span> 2. Ürün Kataloğu Bölümü
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet İkonu</label>
                      <input
                        type="text"
                        value={settings.catalogBadgeIcon || '✨'}
                        onChange={(e) => setSettings({ ...settings, catalogBadgeIcon: e.target.value })}
                        placeholder="✨"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs text-center text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet Yazısı</label>
                      <input
                        type="text"
                        value={settings.catalogBadge || ''}
                        onChange={(e) => setSettings({ ...settings, catalogBadge: e.target.value })}
                        placeholder="Peluş Koleksiyonumuz"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Katalog Ana Başlığı</label>
                      <input
                        type="text"
                        value={settings.catalogTitle || ''}
                        onChange={(e) => setSettings({ ...settings, catalogTitle: e.target.value })}
                        placeholder="Özenle Üretilmiş Sevimli Peluşlar"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Katalog Alt Açıklaması</label>
                    <textarea
                      rows={2}
                      value={settings.catalogSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, catalogSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Arama Kutusu İpucu Metni</label>
                    <input
                      type="text"
                      value={settings.catalogSearchPlaceholder || ''}
                      onChange={(e) => setSettings({ ...settings, catalogSearchPlaceholder: e.target.value })}
                      placeholder="Peluş adı veya özellik ara (örn: Panda, Ayı, Tavşan)..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  {/* Product Card Buttons and Status Texts */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-gray-200 space-y-3">
                    <span className="text-xs font-bold text-gray-900 block">Katalog Kartı Butonları & Durum Metinleri</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Resim İçi İncele Butonu</label>
                        <input
                          type="text"
                          value={settings.catalogCardViewBtn || ''}
                          onChange={(e) => setSettings({ ...settings, catalogCardViewBtn: e.target.value })}
                          placeholder="Detayları Gör"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Sipariş Ver Butonu</label>
                        <input
                          type="text"
                          value={settings.catalogCardOrderBtn || ''}
                          onChange={(e) => setSettings({ ...settings, catalogCardOrderBtn: e.target.value })}
                          placeholder="Sipariş Ver"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Toptan Fiyat Butonu</label>
                        <input
                          type="text"
                          value={settings.catalogCardWholesaleBtn || ''}
                          onChange={(e) => setSettings({ ...settings, catalogCardWholesaleBtn: e.target.value })}
                          placeholder="Toptan Fiyat"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-plush-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Fiyatsız Ürün Metni</label>
                        <input
                          type="text"
                          value={settings.catalogNoPriceText || ''}
                          onChange={(e) => setSettings({ ...settings, catalogNoPriceText: e.target.value })}
                          placeholder="Fiyat Sorunuz"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Stokta Var Metni</label>
                        <input
                          type="text"
                          value={settings.catalogInStockText || ''}
                          onChange={(e) => setSettings({ ...settings, catalogInStockText: e.target.value })}
                          placeholder="Stokta Var"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Tükendi Metni</label>
                        <input
                          type="text"
                          value={settings.catalogOutOfStockText || ''}
                          onChange={(e) => setSettings({ ...settings, catalogOutOfStockText: e.target.value })}
                          placeholder="Tükendi"
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Wholesale B2B Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">📦</span> 3. Toptan Satış & Tedarikçi Bölümü
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet İkonu</label>
                      <input
                        type="text"
                        value={settings.wholesaleBadgeIcon || '📦'}
                        onChange={(e) => setSettings({ ...settings, wholesaleBadgeIcon: e.target.value })}
                        placeholder="📦"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs text-center text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Bölüm Rozet Yazısı</label>
                      <input
                        type="text"
                        value={settings.wholesaleBadge || ''}
                        onChange={(e) => setSettings({ ...settings, wholesaleBadge: e.target.value })}
                        placeholder="B2B & Tedarikçi Ortaklığı"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Toptan Bölüm Başlığı</label>
                      <input
                        type="text"
                        value={settings.wholesaleTitle || ''}
                        onChange={(e) => setSettings({ ...settings, wholesaleTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Toptan Bölüm Alt Açıklaması</label>
                    <textarea
                      rows={2}
                      value={settings.wholesaleSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, wholesaleSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  {/* 4 Feature Cards with Icon & Title & Description */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-gray-700 mb-3">Tedarikçi Avantaj Kartları (4 Madde)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(settings.wholesaleFeatures || []).map((feat, index) => (
                        <div key={feat.id || index} className="p-3.5 bg-stone-50 rounded-2xl border border-gray-200 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat.icon || '📦'}
                              onChange={(e) => {
                                const newFeatures = [...settings.wholesaleFeatures];
                                newFeatures[index] = { ...newFeatures[index], icon: e.target.value };
                                setSettings({ ...settings, wholesaleFeatures: newFeatures });
                              }}
                              className="w-10 px-1 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-base"
                              placeholder="📦"
                            />
                            <input
                              type="text"
                              value={feat.title}
                              onChange={(e) => {
                                const newFeatures = [...settings.wholesaleFeatures];
                                newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                                setSettings({ ...settings, wholesaleFeatures: newFeatures });
                              }}
                              placeholder="Avantaj Başlığı"
                              className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={feat.description}
                            onChange={(e) => {
                              const newFeatures = [...settings.wholesaleFeatures];
                              newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                              setSettings({ ...settings, wholesaleFeatures: newFeatures });
                            }}
                            placeholder="Avantaj Açıklaması"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wholesale CTA Banner */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-gray-200 space-y-3 mt-4">
                    <span className="text-xs font-bold text-gray-900 block">Koyu Renkli Toptan Teklif Bannerı</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Banner Üst Rozet Metni</label>
                        <input
                          type="text"
                          value={settings.wholesaleCtaBadge || ''}
                          onChange={(e) => setSettings({ ...settings, wholesaleCtaBadge: e.target.value })}
                          placeholder="Hemen Tedarikçi Olun"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Banner Başlığı</label>
                        <input
                          type="text"
                          value={settings.wholesaleCtaTitle || ''}
                          onChange={(e) => setSettings({ ...settings, wholesaleCtaTitle: e.target.value })}
                          placeholder="Toplu Alımlar İçin Güncel Fiyat Listesi..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Banner Açıklaması</label>
                      <textarea
                        rows={2}
                        value={settings.wholesaleCtaText || ''}
                        onChange={(e) => setSettings({ ...settings, wholesaleCtaText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">1. Buton Yazısı (Turuncu)</label>
                        <input
                          type="text"
                          value={settings.wholesaleBtn1Text || ''}
                          onChange={(e) => setSettings({ ...settings, wholesaleBtn1Text: e.target.value })}
                          placeholder="Teklif Formunu Doldur"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">2. Buton Yazısı (Yeşil)</label>
                        <input
                          type="text"
                          value={settings.wholesaleBtn2Text || ''}
                          onChange={(e) => setSettings({ ...settings, wholesaleBtn2Text: e.target.value })}
                          placeholder="Toptan Satış Temsilcisi"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: About Us */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">💖</span> 4. Hakkımızda Bölümü
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet İkonu</label>
                      <input
                        type="text"
                        value={settings.aboutBadgeIcon || '💖'}
                        onChange={(e) => setSettings({ ...settings, aboutBadgeIcon: e.target.value })}
                        placeholder="💖"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs text-center text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet Metni</label>
                      <input
                        type="text"
                        value={settings.aboutBadge || ''}
                        onChange={(e) => setSettings({ ...settings, aboutBadge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Bölüm Başlığı</label>
                      <input
                        type="text"
                        value={settings.aboutTitle || ''}
                        onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">1. Paragraf</label>
                    <textarea
                      rows={2}
                      value={settings.aboutText1 || ''}
                      onChange={(e) => setSettings({ ...settings, aboutText1: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">2. Paragraf</label>
                    <textarea
                      rows={2}
                      value={settings.aboutText2 || ''}
                      onChange={(e) => setSettings({ ...settings, aboutText2: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  {/* About Floating Card */}
                  <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 space-y-3">
                    <span className="text-xs font-bold text-pink-950 block">Görsel Üzerindeki Rozet Kart</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">İkon / Emoji</label>
                        <input
                          type="text"
                          value={settings.aboutCardIcon || '💖'}
                          onChange={(e) => setSettings({ ...settings, aboutCardIcon: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-center text-lg"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kart Başlığı</label>
                        <input
                          type="text"
                          value={settings.aboutCardTitle || ''}
                          onChange={(e) => setSettings({ ...settings, aboutCardTitle: e.target.value })}
                          placeholder="Sevgiyle Dikildi"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kart Alt Açıklaması</label>
                      <input
                        type="text"
                        value={settings.aboutCardText || ''}
                        onChange={(e) => setSettings({ ...settings, aboutCardText: e.target.value })}
                        placeholder="Her dikişinde mutluluk ve yüksek güvenlik."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* 4 Quality Guarantee Badges */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-gray-700 mb-3">4 Kalite Güvence Maddesi (Hakkımızda Altı)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(settings.aboutFeatures || []).map((feat, index) => (
                        <div key={feat.id || index} className="p-3.5 bg-stone-50 rounded-2xl border border-gray-200 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat.icon || '🛡️'}
                              onChange={(e) => {
                                const newFeats = [...(settings.aboutFeatures || [])];
                                newFeats[index] = { ...newFeats[index], icon: e.target.value };
                                setSettings({ ...settings, aboutFeatures: newFeats });
                              }}
                              className="w-10 px-1 py-1.5 bg-white border border-gray-200 rounded-lg text-center text-base"
                              placeholder="🛡️"
                            />
                            <input
                              type="text"
                              value={feat.title}
                              onChange={(e) => {
                                const newFeats = [...(settings.aboutFeatures || [])];
                                newFeats[index] = { ...newFeats[index], title: e.target.value };
                                setSettings({ ...settings, aboutFeatures: newFeats });
                              }}
                              placeholder="Kalite Başlığı"
                              className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={feat.description}
                            onChange={(e) => {
                              const newFeats = [...(settings.aboutFeatures || [])];
                              newFeats[index] = { ...newFeats[index], description: e.target.value };
                              setSettings({ ...settings, aboutFeatures: newFeats });
                            }}
                            placeholder="Kalite Açıklaması"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 5: Contact Section Texts */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">✉️</span> 5. İletişim & Teklif Formu Başlıkları
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet İkonu</label>
                      <input
                        type="text"
                        value={settings.contactBadgeIcon || '✉️'}
                        onChange={(e) => setSettings({ ...settings, contactBadgeIcon: e.target.value })}
                        placeholder="✉️"
                        className="w-full px-3 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs text-center text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rozet Metni</label>
                      <input
                        type="text"
                        value={settings.contactBadge || ''}
                        onChange={(e) => setSettings({ ...settings, contactBadge: e.target.value })}
                        placeholder="Bize Ulaşın"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">İletişim Ana Başlığı</label>
                      <input
                        type="text"
                        value={settings.contactTitle || ''}
                        onChange={(e) => setSettings({ ...settings, contactTitle: e.target.value })}
                        placeholder="Toptan Fiyat Teklifi Alın veya Bize Danışın"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">İletişim Alt Açıklaması</label>
                    <textarea
                      rows={2}
                      value={settings.contactSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, contactSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">1. Form Sekmesi Adı</label>
                      <input
                        type="text"
                        value={settings.contactWholesaleTab || ''}
                        onChange={(e) => setSettings({ ...settings, contactWholesaleTab: e.target.value })}
                        placeholder="📦 Toptan / Tedarikçi Teklifi"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">2. Form Sekmesi Adı</label>
                      <input
                        type="text"
                        value={settings.contactCustomerTab || ''}
                        onChange={(e) => setSettings({ ...settings, contactCustomerTab: e.target.value })}
                        placeholder="🧸 Müşteri / Genel Soru"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Form Gönder Buton Metni</label>
                      <input
                        type="text"
                        value={settings.contactSubmitBtnText || ''}
                        onChange={(e) => setSettings({ ...settings, contactSubmitBtnText: e.target.value })}
                        placeholder="Teklif Talebini Gönder"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold text-plush-600"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Contact Box */}
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3 mt-3">
                    <span className="text-xs font-bold text-emerald-950 block">💬 İletişim Yanındaki Yeşil WhatsApp Kartı</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kart Başlığı</label>
                        <input
                          type="text"
                          value={settings.contactCardTitle || ''}
                          onChange={(e) => setSettings({ ...settings, contactCardTitle: e.target.value })}
                          placeholder="Hızlı WhatsApp İletişim Hattı"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kart Buton Yazısı</label>
                        <input
                          type="text"
                          value={settings.contactCardBtnText || ''}
                          onChange={(e) => setSettings({ ...settings, contactCardBtnText: e.target.value })}
                          placeholder="WhatsApp Sohbeti Başlat"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kart Açıklaması</label>
                      <textarea
                        rows={2}
                        value={settings.contactCardText || ''}
                        onChange={(e) => setSettings({ ...settings, contactCardText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Contact Info Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Sabit Telefon Başlığı</label>
                      <input
                        type="text"
                        value={settings.contactPhoneTitle || ''}
                        onChange={(e) => setSettings({ ...settings, contactPhoneTitle: e.target.value })}
                        placeholder="Sabit Telefon"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">E-Posta Başlığı</label>
                      <input
                        type="text"
                        value={settings.contactEmailTitle || ''}
                        onChange={(e) => setSettings({ ...settings, contactEmailTitle: e.target.value })}
                        placeholder="E-Posta Adresleri"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Fabrika Adres Başlığı</label>
                      <input
                        type="text"
                        value={settings.contactAddressTitle || ''}
                        onChange={(e) => setSettings({ ...settings, contactAddressTitle: e.target.value })}
                        placeholder="Fabrika & Showroom Adresi"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 6: Footer & Floating WhatsApp */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-500">⚓</span> 6. Alt Bilgi (Footer) & Yüzen WhatsApp
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Footer Şirket Tanıtım Metni</label>
                    <textarea
                      rows={2}
                      value={settings.footerDescription || ''}
                      onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                      placeholder="Lumy Toys olarak 1. sınıf antialerjik kumaşlar ve CE güvenlik standartlarında..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Güvenlik Rozet İkonu</label>
                      <input
                        type="text"
                        value={settings.footerSecurityBadgeIcon || '🛡️'}
                        onChange={(e) => setSettings({ ...settings, footerSecurityBadgeIcon: e.target.value })}
                        placeholder="🛡️"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs text-center text-lg"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Güvenlik Rozet Yazısı</label>
                      <input
                        type="text"
                        value={settings.footerSecurityBadge || ''}
                        onChange={(e) => setSettings({ ...settings, footerSecurityBadge: e.target.value })}
                        placeholder="EN-71 Avrupa Güvenlik Onaylı Üretim"
                        className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">2. Sütun Başlığı</label>
                      <input
                        type="text"
                        value={settings.footerCol2Title || ''}
                        onChange={(e) => setSettings({ ...settings, footerCol2Title: e.target.value })}
                        placeholder="Hızlı Gezinti"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">3. Sütun Başlığı</label>
                      <input
                        type="text"
                        value={settings.footerCol3Title || ''}
                        onChange={(e) => setSettings({ ...settings, footerCol3Title: e.target.value })}
                        placeholder="İletişim Bilgileri"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">4. Sütun Başlığı</label>
                      <input
                        type="text"
                        value={settings.footerCol4Title || ''}
                        onChange={(e) => setSettings({ ...settings, footerCol4Title: e.target.value })}
                        placeholder="Yönetim & Güvenlik"
                        className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Telif / Hakları Saklıdır Metni</label>
                      <input
                        type="text"
                        value={settings.footerCopyright || ''}
                        onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                        placeholder="Tüm Hakları Saklıdır."
                        className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">En Alt Kalp Yanı Sevgi Metni</label>
                      <input
                        type="text"
                        value={settings.footerTagline || ''}
                        onChange={(e) => setSettings({ ...settings, footerTagline: e.target.value })}
                        placeholder="Peluş ve çocuk sevgisiyle üretilmiştir"
                        className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 mt-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      📱 Ekranın Sağ Altındaki Yüzen WhatsApp Butonu Balon Yazısı
                    </label>
                    <input
                      type="text"
                      value={settings.floatingWhatsappText || ''}
                      onChange={(e) => setSettings({ ...settings, floatingWhatsappText: e.target.value })}
                      placeholder="🧸 Bize WhatsApp'tan Yazın!"
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                  </button>
                </div>

              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 3: CONTACT & WHATSAPP */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'contact' && settings && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">İletişim & WhatsApp Ayarları</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sitedeki tüm WhatsApp butonlarının ve formların yönlendirildiği bilgiler.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                  </button>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-900">
                      <strong>WhatsApp Sipariş & Danışma Numarası:</strong>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Sitedeki butonlar tıklandığında bu numaraya ücretsiz WhatsApp mesajı açılır. Başına ülke kodunu (+90) ekleyerek giriniz.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        WhatsApp Sipariş Numarası
                      </label>
                      <input
                        type="text"
                        value={settings.contact?.whatsapp || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contact: { ...settings.contact, whatsapp: e.target.value }
                          })
                        }
                        placeholder="+90 530 123 45 67"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Sabit Telefon Numarası
                      </label>
                      <input
                        type="text"
                        value={settings.contact?.phone || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contact: { ...settings.contact, phone: e.target.value }
                          })
                        }
                        placeholder="+90 (212) 555 89 42"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Genel İletişim E-Posta
                      </label>
                      <input
                        type="email"
                        value={settings.contact?.email || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contact: { ...settings.contact, email: e.target.value }
                          })
                        }
                        placeholder="info@lumytoys.com"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Toptan Satış E-Posta
                      </label>
                      <input
                        type="email"
                        value={settings.contact?.wholesaleEmail || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            contact: { ...settings.contact, wholesaleEmail: e.target.value }
                          })
                        }
                        placeholder="toptan@lumytoys.com"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Fabrika & Showroom Açık Adresi
                    </label>
                    <textarea
                      rows={2}
                      value={settings.contact?.address || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, address: e.target.value }
                        })
                      }
                      placeholder="İkitelli OSB..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Çalışma Gün & Saatleri
                    </label>
                    <input
                      type="text"
                      value={settings.contact?.workingHours || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contact: { ...settings.contact, workingHours: e.target.value }
                        })
                      }
                      placeholder="Pazartesi - Cumartesi: 09:00 - 18:30"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Kaydediliyor...' : 'İletişim Bilgilerini Kaydet'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 4: EMAIL NOTIFICATION SETTINGS */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'email' && settings && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">E-Posta Bildirim Ayarları</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Siteye yeni bir mesaj veya toptan teklif talebi geldiğinde istediğiniz e-postaya anında bildirim düşsün.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                  </button>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                    <div className="space-y-0.5">
                      <strong className="text-sm text-gray-900 block">E-Posta Bildirimlerini Aktifleştir</strong>
                      <p className="text-xs text-gray-500">
                        Ziyaretçi veya toptancı formu doldurduğu an belirlenen e-postaya bildirim gider.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotification?.enabled !== false}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            emailNotification: {
                              ...(settings.emailNotification || { recipientEmail: '' }),
                              enabled: e.target.checked
                            }
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Bildirimlerin Gönderileceği E-Posta Adresi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.emailNotification?.recipientEmail || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotification: {
                            ...(settings.emailNotification || { enabled: true }),
                            recipientEmail: e.target.value
                          }
                        })
                      }
                      placeholder="Örn: samet@gmail.com veya bildirim@lumytoys.com"
                      className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-plush-400 focus:bg-white"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Web sitesinde formu kim doldurursa, mesajı ve telefon numarası bu adrese iletilir.
                    </p>
                  </div>

                  {/* Optional SMTP Details */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Gelişmiş SMTP Sunucu Ayarları (Opsiyonel)
                      </h4>
                      <span className="text-[10px] text-gray-400">Kurumsal mail veya Gmail için</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">SMTP Sunucusu (Host)</label>
                        <input
                          type="text"
                          value={settings.emailNotification?.smtpHost || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailNotification: {
                                ...(settings.emailNotification || { enabled: true, recipientEmail: '' }),
                                smtpHost: e.target.value
                              }
                            })
                          }
                          placeholder="smtp.gmail.com veya mail.alanadiniz.com"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">SMTP Port</label>
                        <input
                          type="number"
                          value={settings.emailNotification?.smtpPort || 587}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailNotification: {
                                ...(settings.emailNotification || { enabled: true, recipientEmail: '' }),
                                smtpPort: Number(e.target.value)
                              }
                            })
                          }
                          placeholder="587 veya 465"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">SMTP Kullanıcı Adı / E-Posta</label>
                        <input
                          type="text"
                          value={settings.emailNotification?.smtpUser || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailNotification: {
                                ...(settings.emailNotification || { enabled: true, recipientEmail: '' }),
                                smtpUser: e.target.value
                              }
                            })
                          }
                          placeholder="gonderen@alanadiniz.com"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">SMTP Şifresi / Uygulama Şifresi</label>
                        <input
                          type="password"
                          value={settings.emailNotification?.smtpPass || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailNotification: {
                                ...(settings.emailNotification || { enabled: true, recipientEmail: '' }),
                                smtpPass: e.target.value
                              }
                            })
                          }
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* Helpful Guide Box for Gmail / Hosting */}
                    <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-gray-700 space-y-2 mt-4">
                      <div className="font-black text-amber-900 flex items-center gap-1.5">
                        <span>💡</span>
                        <span>Gmail veya Hosting E-Postası ile Gönderme Rehberi:</span>
                      </div>
                      <p className="leading-relaxed text-[11px] text-gray-600">
                        • <strong>Gmail için:</strong> SMTP Host: <code className="bg-white px-1 py-0.5 rounded">smtp.gmail.com</code>, Port: <code className="bg-white px-1 py-0.5 rounded">465</code> (veya 587). Şifre kısmına normal Gmail şifreniz değil, Google Hesabınızdaki <strong>Uygulama Şifresi (App Password)</strong> yazılmalıdır (Google normal şifreyle girişe izin vermez).
                      </p>
                      <p className="leading-relaxed text-[11px] text-gray-600">
                        • <strong>Kendi Web Sitenizin Maili için:</strong> Hosting firmanızın verdiği SMTP Host (örn: <code className="bg-white px-1 py-0.5 rounded">mail.lumytoys.com</code>), Port ve E-posta şifrenizi girmeniz yeterlidir.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={sendingTestEmail}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-black px-5 py-3 rounded-xl transition-all cursor-pointer border border-stone-300"
                    >
                      <Send className="w-3.5 h-3.5 text-plush-600" />
                      <span>{sendingTestEmail ? 'Test Ediliyor...' : '📧 Test E-Postası Gönder'}</span>
                    </button>

                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 5: MESSAGES & INQUIRIES */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Gelen Mesajlar & Talepler</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Web sitesindeki teklif formunu dolduran toptancıların ve müşterilerin mesajları.
                    </p>
                  </div>

                  <div className="text-xs font-bold bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
                    Toplam {messages.length} Talep
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 p-8">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-700">Henüz Mesaj Yok</h3>
                    <p className="text-xs text-gray-400">Web sitesinden form doldurulduğunda burada görünecektir.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {messages.map((msg) => {
                      const cleanCustomerPhone = formatWhatsAppPhone(msg.phone);
                      const waReplyUrl = `https://wa.me/${cleanCustomerPhone}?text=Merhaba%20${encodeURIComponent(msg.name)},%20Lumy%20Toys%20toptan%20ve%20pelu%C5%9F%20teklif%20talebiniz%20i%C3%A7in%20yaz%C4%B1yorum.`;

                      return (
                        <div
                          key={msg.id}
                          className={`p-6 rounded-3xl border transition-all ${
                            msg.status === 'unread'
                              ? 'bg-white border-plush-300 shadow-md ring-2 ring-plush-100'
                              : 'bg-stone-50/70 border-gray-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                  msg.type === 'wholesale'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-sky-100 text-sky-800'
                                }`}
                              >
                                {msg.type === 'wholesale' ? '📦 Toptan Teklif Talebi' : '🧸 Müşteri Sorusu'}
                              </span>

                              {msg.status === 'unread' && (
                                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                                  Yeni
                                </span>
                              )}

                              <span className="text-xs text-gray-400">{msg.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleMessageStatus(msg.id, msg.status)}
                                className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                                  msg.status === 'unread'
                                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                                    : 'bg-white hover:bg-stone-100 text-stone-500 border-gray-200'
                                }`}
                              >
                                {msg.status === 'unread' ? 'Okundu Yap' : 'Okunmadı Olarak İşaretle'}
                              </button>

                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
                            <div>
                              <span className="text-gray-400 uppercase font-bold text-[10px]">İsim / Firma:</span>
                              <p className="font-black text-gray-900 text-sm mt-0.5">{msg.name}</p>
                              {msg.company && (
                                <p className="text-stone-500 font-semibold">{msg.company}</p>
                              )}
                            </div>

                            <div>
                              <span className="text-gray-400 uppercase font-bold text-[10px]">İletişim:</span>
                              <p className="font-bold text-gray-800 mt-0.5">{msg.phone}</p>
                              {msg.email && <p className="text-gray-500">{msg.email}</p>}
                            </div>

                            <div>
                              <span className="text-gray-400 uppercase font-bold text-[10px]">İlgi & Adet:</span>
                              <p className="font-bold text-gray-800 mt-0.5">{msg.productInterest || '-'}</p>
                              {msg.estimatedQty && (
                                <p className="text-plush-600 font-bold">Miktar: {msg.estimatedQty}</p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200/80 text-xs text-gray-700 leading-relaxed">
                            <span className="font-bold text-gray-500 block mb-1">Talep Mesajı:</span>
                            {msg.message}
                          </div>

                          {/* Quick reply button via WhatsApp */}
                          <div className="mt-4 flex justify-end">
                            <a
                              href={waReplyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>WhatsApp'tan Cevap Yaz</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isProductModalOpen && editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl sm:rounded-4xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-xl font-black text-gray-900">
                {editingProduct.id ? 'Peluş Ürünü Düzenle' : 'Yeni Peluş Ürün Ekle'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
              >
                ✕ Kapat
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ürün Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Örn: 80 cm Pofuduk Sevimli Ayı"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                      className="text-[11px] font-bold text-plush-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FolderPlus className="w-3 h-3" />
                      <span>{isAddingNewCategory ? 'Mevcut Kategorileri Seç' : '+ Yeni Kategori Ekle'}</span>
                    </button>
                  </div>

                  {isAddingNewCategory ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="Örn: Bebek Çıngırakları"
                        className="flex-1 px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-plush-400"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isSavingCategory || !newCategoryInput.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        {isSavingCategory ? '...' : 'Ekle'}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={editingProduct.category || 'ayiciklar'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white cursor-pointer"
                    >
                      {categories
                        .filter(c => c.id !== 'all')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Fiyat (TL)
                    </label>
                    <span className="text-[10px] text-gray-400">Opsiyonel</span>
                  </div>
                  <input
                    type="number"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="Boş bırakılabilir"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Boşsa "Fiyat Sorunuz" görünür.</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Min. Toptan (Adet)
                    </label>
                    <span className="text-[10px] text-gray-400">Opsiyonel</span>
                  </div>
                  <input
                    type="number"
                    value={editingProduct.wholesaleMin ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, wholesaleMin: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="Boş bırakılabilir"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Toptan asgari sipariş miktarı.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Özel Rozet (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="Örn: En Çok Satan"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Image Input: File Upload OR Direct URL */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-700">
                  Ürün Görseli
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {editingProduct.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-300 bg-white shrink-0">
                      <img
                        src={editingProduct.image}
                        alt="Önizleme"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <input
                        type="text"
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="Görsel URL yapıştırın (https://...)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Veya bilgisayardan yükleyin:</span>
                      <label className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-100 text-gray-700 font-bold px-3 py-1.5 rounded-lg border border-gray-300 cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Yükleniyor...' : 'Dosya Seç'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ürün Açıklaması & Özellikleri
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Kumaş cinsi, boyutu, temizlik talimatı, antialerjik dolgu özellikleri vb."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400 focus:bg-white"
                />
              </div>

              {/* Flexible Stock and Feature Options */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-3">
                <span className="text-xs font-bold text-gray-700 block">Stok & Vitrin Seçenekleri</span>
                
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={editingProduct.showStock !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, showStock: e.target.checked })}
                      className="w-4 h-4 rounded text-plush-500 focus:ring-plush-400"
                    />
                    <span>Sitede Stok Durumu Gösterilsin</span>
                  </label>

                  {editingProduct.showStock !== false && (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-400"
                      />
                      <span>Şu an Stokta Var</span>
                    </label>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.featured)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-plush-500 focus:ring-plush-400"
                    />
                    <span>Öne Çıkarılan Ürün (Vitrin)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <input
                      type="checkbox"
                      checked={editingProduct.showOnHomepage !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-400"
                    />
                    <span>Ana Sayfa Kataloğunda Göster</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.id && settings?.heroProductId === editingProduct.id)}
                      onChange={() => {
                        if (editingProduct.id) {
                          toggleHeroProduct(editingProduct.id);
                        }
                      }}
                      disabled={!editingProduct.id}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400"
                    />
                    <span className="flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Ana Sayfanın En Üstündeki Vitrin Ürünü (Hero)</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-stone-50 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-plush-500 hover:bg-plush-600 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY MANAGEMENT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl sm:rounded-4xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-5 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">Kategorileri Yönet</h3>
                  <p className="text-[11px] text-gray-500">Mevcut kategorileri düzenleyin veya silin.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer bg-stone-100 hover:bg-stone-200 p-1.5 rounded-lg transition-colors"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Category List */}
            <div className="space-y-1.5 mb-5 divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                const isAll = cat.id === 'all';

                return (
                  <div key={cat.id} className="pt-2.5 pb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-plush-400 shrink-0"></span>
                      <div className="min-w-0">
                        <div className="font-black text-xs sm:text-sm text-gray-900 truncate">{cat.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">id: {cat.id}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        count > 0 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {isAll ? `${products.length} Ürün (Tümü)` : `${count} Ürün`}
                      </span>

                      {isAll ? (
                        <span className="text-[10px] font-semibold text-gray-400 italic px-2">Sabit</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Kategoriyi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Category Box */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700">Yeni Kategori Ekle</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  placeholder="Örn: Bebek Çıngırakları..."
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-plush-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isSavingCategory || !newCategoryInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  {isSavingCategory ? '...' : '+ Ekle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
