import fs from 'fs';
import path from 'path';

export interface WholesaleFeature {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export interface QualityFeature {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  wholesaleEmail: string;
  address: string;
  workingHours: string;
  instagram: string;
  facebook: string;
}

export interface EmailNotificationConfig {
  enabled: boolean;
  recipientEmail: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
}

export interface SiteSettings {
  brandName: string;
  logoUrl?: string;
  slogan: string;
  badgeText: string;
  badgeSubtext?: string;

  // Navbar
  navCatalog?: string;
  navWholesale?: string;
  navAbout?: string;
  navContact?: string;
  navWhatsappBtn?: string;

  // Hero Section
  heroBadgeIcon?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroWholesaleTitle?: string;
  heroWholesaleText: string;
  heroWholesaleIcon?: string;
  heroCatalogBtnText?: string;
  heroWholesaleBtnText?: string;
  heroTrust1Icon?: string;
  heroTrust1Text?: string;
  heroTrust2Icon?: string;
  heroTrust2Text?: string;
  heroTrust3Icon?: string;
  heroTrust3Text?: string;
  heroImgBadge1?: string;
  heroImgBadge2?: string;
  heroMiniBadge1Icon?: string;
  heroMiniBadge1Title?: string;
  heroMiniBadge1Text?: string;
  heroMiniBadge2Icon?: string;
  heroMiniBadge2Title?: string;
  heroMiniBadge2Text?: string;
  heroProductId?: string; // Showcase product on top of homepage
  heroCustomImageUrl?: string; // Override image for hero

  // Catalog Section
  catalogBadgeIcon?: string;
  catalogBadge?: string;
  catalogTitle?: string;
  catalogSubtitle?: string;
  catalogSearchPlaceholder?: string;
  catalogCardViewBtn?: string;
  catalogCardOrderBtn?: string;
  catalogCardWholesaleBtn?: string;
  catalogNoPriceText?: string;
  catalogInStockText?: string;
  catalogOutOfStockText?: string;

  // About Section
  aboutBadgeIcon?: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutCardIcon?: string;
  aboutCardTitle?: string;
  aboutCardText?: string;
  aboutFeatures?: QualityFeature[];

  // Wholesale Section
  wholesaleBadgeIcon?: string;
  wholesaleBadge?: string;
  wholesaleTitle: string;
  wholesaleSubtitle: string;
  wholesaleCtaBadge?: string;
  wholesaleCtaTitle?: string;
  wholesaleCtaText?: string;
  wholesaleBtn1Text?: string;
  wholesaleBtn2Text?: string;
  wholesaleFeatures: WholesaleFeature[];

  // Stats
  stats: StatItem[];

  // Contact Section
  contactBadgeIcon?: string;
  contactBadge?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactWholesaleTab?: string;
  contactCustomerTab?: string;
  contactSubmitBtnText?: string;
  contactCardTitle?: string;
  contactCardText?: string;
  contactCardBtnText?: string;
  contactPhoneTitle?: string;
  contactEmailTitle?: string;
  contactAddressTitle?: string;
  contact: ContactInfo;

  // Footer Section
  footerDescription?: string;
  footerSecurityBadgeIcon?: string;
  footerSecurityBadge?: string;
  footerCol2Title?: string;
  footerCol3Title?: string;
  footerCol4Title?: string;
  footerCopyright?: string;
  footerTagline?: string;

  // Floating WhatsApp
  floatingWhatsappText?: string;

  // Email Notification
  emailNotification?: EmailNotificationConfig;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number | null; // Opsiyonel
  wholesaleMin?: number | null; // Opsiyonel
  image: string;
  description: string;
  inStock?: boolean; // Opsiyonel
  showStock?: boolean; // Stok durumu sitede belirtilsin mi?
  featured: boolean;
  showOnHomepage?: boolean; // Ana sayfada/katalogda gosterilsin mi?
  badge?: string;
}

export interface UserMessage {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  type: 'wholesale' | 'customer';
  productInterest?: string;
  estimatedQty?: string;
  message: string;
  date: string;
  status: 'read' | 'unread';
}

export interface DatabaseSchema {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  messages: UserMessage[];
}

let memoryDb: DatabaseSchema | null = null;

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'lumy_db';

function getDbFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpPath = path.join('/tmp', 'db.json');
    if (!fs.existsSync(tmpPath)) {
      try {
        const bundledPath = path.join(process.cwd(), 'data', 'db.json');
        if (fs.existsSync(bundledPath)) {
          const content = fs.readFileSync(bundledPath, 'utf-8');
          fs.writeFileSync(tmpPath, content, 'utf-8');
        }
      } catch (e) {
        console.warn('Could not copy initial db.json to /tmp:', e);
      }
    }
    return tmpPath;
  }
  return path.join(process.cwd(), 'data', 'db.json');
}

export async function getDatabase(): Promise<DatabaseSchema> {
  // 1. If Vercel KV / Upstash credentials exist, fetch from cloud database
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store'
      });
      const json = await res.json();
      if (json && json.result) {
        const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
        if (parsed && parsed.settings && parsed.products) {
          memoryDb = parsed as DatabaseSchema;
          return memoryDb;
        }
      }
    } catch (kvErr) {
      console.warn('Failed reading from KV cloud, falling back to local file:', kvErr);
    }
  }

  // 2. Fallback to local file / memory
  try {
    const filePath = getDbFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      memoryDb = JSON.parse(data) as DatabaseSchema;
      return memoryDb;
    }
    const fallbackPath = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(fallbackPath)) {
      const data = fs.readFileSync(fallbackPath, 'utf-8');
      memoryDb = JSON.parse(data) as DatabaseSchema;
      return memoryDb;
    }
    if (memoryDb) return memoryDb;
    throw new Error('Database file not found');
  } catch (error) {
    console.error('Error reading database:', error);
    if (memoryDb) return memoryDb;
    throw error;
  }
}

export async function saveDatabase(db: DatabaseSchema): Promise<void> {
  memoryDb = db;

  // 1. If Vercel KV / Upstash credentials exist, persist to cloud database
  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/set/${KV_KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(db)
      });
    } catch (kvErr) {
      console.error('Failed saving to KV cloud:', kvErr);
    }
  }

  // 2. Also persist to local file / /tmp as secondary backup
  try {
    const filePath = getDbFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Direct write failed, attempting /tmp fallback:', error);
    try {
      const tmpPath = path.join('/tmp', 'db.json');
      fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf-8');
    } catch (e) {
      // Ignored in read-only environment
    }
  }
}

// Site Settings
export async function getSettings(): Promise<SiteSettings> {
  const db = await getDatabase();
  return db.settings;
}

export async function updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await getDatabase();
  db.settings = { ...db.settings, ...newSettings };
  await saveDatabase(db);
  return db.settings;
}

// Products
export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase();
  return db.products;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const db = await getDatabase();
  return db.products.find(p => p.id === id);
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const db = await getDatabase();
  const newProduct: Product = {
    ...data,
    id: `prod-${Date.now()}`
  };
  db.products.unshift(newProduct);
  await saveDatabase(db);
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  const db = await getDatabase();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...data };
  await saveDatabase(db);
  return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== id);
  if (db.products.length !== initialLength) {
    await saveDatabase(db);
    return true;
  }
  return false;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();
  return db.categories;
}

export async function createCategory(name: string): Promise<Category> {
  const db = await getDatabase();
  const trimmed = name.trim();
  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]+/g, '-')
    .replace(/^-|-$/g, '') || `kat-${Date.now()}`;

  // Check if exists
  const existing = db.categories.find(c => c.name.toLowerCase() === trimmed.toLowerCase() || c.id === slug);
  if (existing) {
    return existing;
  }

  const newCat: Category = {
    id: slug,
    name: trimmed
  };
  db.categories.push(newCat);
  await saveDatabase(db);
  return newCat;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (id === 'all') {
    return { success: false, error: 'Tüm Peluşlar ana sekmesi silinemez.' };
  }

  // Check if any product is using this category
  const assignedProducts = db.products.filter(p => p.category === id);
  if (assignedProducts.length > 0) {
    return {
      success: false,
      error: `Bu kategoride ${assignedProducts.length} adet ürün bulunmaktadır. Silmek için önce bu ürünlerin kategorisini değiştirin veya ürünleri silin.`
    };
  }

  const initialLength = db.categories.length;
  db.categories = db.categories.filter(c => c.id !== id);
  if (db.categories.length !== initialLength) {
    await saveDatabase(db);
    return { success: true };
  }

  return { success: false, error: 'Kategori bulunamadı.' };
}

// Messages
export async function getMessages(): Promise<UserMessage[]> {
  const db = await getDatabase();
  return db.messages;
}

export async function createMessage(data: Omit<UserMessage, 'id' | 'date' | 'status'>): Promise<UserMessage> {
  const db = await getDatabase();
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newMessage: UserMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    date: dateStr,
    status: 'unread'
  };
  db.messages.unshift(newMessage);
  await saveDatabase(db);
  return newMessage;
}

export async function markMessageStatus(id: string, status: 'read' | 'unread'): Promise<boolean> {
  const db = await getDatabase();
  const msg = db.messages.find(m => m.id === id);
  if (!msg) return false;
  msg.status = status;
  await saveDatabase(db);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = await getDatabase();
  const initialLength = db.messages.length;
  db.messages = db.messages.filter(m => m.id !== id);
  if (db.messages.length !== initialLength) {
    await saveDatabase(db);
    return true;
  }
  return false;
}
