# 🧸 Lumy Toys - Peluş Oyuncak Tanıtım & Yönetim Platformu

**Lumy Toys**, hem perakende müşterilere hem de toptan oyuncak bayilerine ve tedarikçilere hitap eden, modern, sevimli, mobil uyumlu ve dinamik yönetim paneline (Admin Paneli) sahip bir tanıtım web sitesidir.

---

## 🌟 Öne Çıkan Özellikler

### 1. Ziyaretçi & Müşteri Arayüzü
- **Sektöre Özgü Sevimli Tasarım:** Peluş oyuncak ruhuna uygun pastel tonlar, yumuşak mikro animasyonlar, sevimli rozetler.
- **Toptan & Tedarikçi (B2B) Vurgusu:**
  - Fabrikadan doğrudan toptan alım avantajları,
  - CE & EN-71 Avrupa Çocuk Güvenlik Sertifikaları,
  - Minimum Sipariş Adetleri (MOQ),
  - Toptan fiyat listesi ve numune başvuru formu.
- **Ürün Kataloğu & Filtreleme:**
  - Kategoriler (Ayıcıklar, Sevimli Hayvanlar, Dev Peluşlar, Bebek & Uyku Arkadaşı, Anahtarlıklar),
  - Anlık arama çubuğu,
  - Ürün detay modalı,
  - **Tek tıkla WhatsApp Sipariş / Danışma** entegrasyonu.
- **İletişim & Teklif Formu:**
  - Ziyaretçilerin ve bayilerin doğrudan teklif isteyebileceği dinamik form.
  - Açık adres, telefon, e-posta, çalışma saatleri ve harita bilgileri.
- **Yüzen WhatsApp Butonu:** Sayfanın sağ alt köşesinde sürekli erişilebilir hızlı WhatsApp iletişim desteği.

---

### 2. Admin (Yönetim) Paneli
- **Şifreli Güvenli Giriş:** `/admin` veya `/admin/login`
  - **Kullanıcı Adı:** `admin`
  - **Şifre:** `lumy123`
- **Ürün Yönetimi:**
  - Yeni peluş oyuncak ekleme, düzenleme ve silme.
  - Bilgisayardan fotoğraf yükleme (`/api/upload`) veya görsel linki yapıştırma.
  - Fiyat, toptan min. alım adedi (MOQ), stok durumu (Stokta Var / Tükendi) ve öne çıkarma butonları.
- **Site Metinleri & Bölüm Yönetimi:**
  - Hero ana başlığı, alt başlığı, sloganı, üst duyuru rozet metnini anında değiştirme.
  - Hakkımızda metinlerini ve başlıklarını güncelleme.
  - Toptan satış avantajlarını (4 kart) tek tıkla özelleştirme.
- **İletişim & WhatsApp Ayarları:**
  - Sitedeki tüm butonların yönlendirildiği WhatsApp numarasını, sabit telefonu, e-postaları ve fabrika adresini değiştirme.
- **Gelen Talepler & Mesajlar:**
  - Formu dolduran toptancı ve müşterilerin mesajlarını listeleme,
  - Tek tıkla "Okundu" işaretleme veya silme,
  - **"WhatsApp'tan Cevap Yaz"** butonu ile müşteriye anında dönüş yapabilme.

---

## 🚀 Kurulum ve Çalıştırma

### Geliştirme Modunda Başlatma:
```bash
npm run dev
```
Tarayıcınızda açın:
- **Ana Sayfa:** [http://localhost:3000](http://localhost:3000)
- **Admin Paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)

### Canlıya Hazırlama (Production Build):
```bash
npm run build
npm run start
```

---

## 📂 Dosya Yapısı
- `src/app/page.tsx` : Ana Tanıtım Sayfası (Dinamik SSR)
- `src/app/admin/page.tsx` : Admin Yönetim Paneli
- `src/app/admin/login/page.tsx` : Admin Giriş Ekranı
- `src/components/` : Modüler Arayüz Bileşenleri (Navbar, Hero, ProductCatalog, WholesaleBanner, vb.)
- `src/app/api/` : Veritabanı ve dosya yükleme API rotaları
- `data/db.json` : Kalıcı veri tabanı dosyası (Ürünler, ayarlar, mesajlar)
- `public/uploads/` : Yüklenen ürün fotoğrafları
