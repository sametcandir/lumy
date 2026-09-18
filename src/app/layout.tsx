import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumy Toys | Sevimli & Kaliteli Peluş Oyuncak Dünyası',
  description: 'Türkiye’nin en yumuşacık ve sevimli peluş oyuncakları! Antialerjik kumaşlar, CE güvenlik sertifikalı dolgular ve zengin peluş koleksiyonu.',
  keywords: ['peluş oyuncak', 'teddy bear', 'peluş ayı', 'uyku arkadaşı', 'peluş koleksiyonu', 'Lumy Toys'],
  authors: [{ name: 'Lumy Toys' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Sniglet:wght@400;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Outfit',sans-serif] min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
