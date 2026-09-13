import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const sora = Sora({ variable: '--font-sora', subsets: ['latin'] });
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Nexora Tech — Technology that moves business forward',
  description:
    'Nexora Tech turns complex technology into clear business momentum through digital products, custom platforms, and connected systems.',
  icons: {
    icon: [{ url: '/nexora-tech-mark.png', type: 'image/png' }],
    shortcut: '/nexora-tech-mark.png',
    apple: '/nexora-tech-mark.png',
  },
  openGraph: {
    title: 'Nexora Tech — Technology that moves business forward',
    description: 'Next-generation technology, made practical.',
    images: [
      {
        url: '/nexora-tech-og.png',
        width: 1200,
        height: 630,
        alt: 'Nexora Tech — Technology that moves business forward.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexora Tech — Technology that moves business forward',
    description: 'Next-generation technology, made practical.',
    images: ['/nexora-tech-og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
