import { Baloo_2, Andika } from 'next/font/google';

const baloo = Baloo_2({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700', '800'], variable: '--fonte-baloo', display: 'swap' });
const andika = Andika({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], variable: '--fonte-andika', display: 'swap' });

export const metadata = {
  title: 'Amigos do Arco-Íris',
  description: 'As histórias, os jogos e as músicas da Francisca e dos Amigos do Arco-Íris.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Amigos', statusBarStyle: 'default' },
  icons: { icon: '/icon-192.png', apple: '/apple-touch-icon.png' },
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#DCEEFB' };

export default function LayoutRaiz({ children }) {
  return (
    <html lang="pt-PT" className={`${baloo.variable} ${andika.variable}`}>
      <body>{children}</body>
    </html>
  );
}
