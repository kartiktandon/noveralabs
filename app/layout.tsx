import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://novera-labs.kartik-tandon491441.chatgpt.site'),
  title: 'Novera Labs — Websites & CRM systems built for momentum',
  description: 'Novera Labs creates high-converting websites and intelligent CRM systems for ambitious teams.',
  icons: {
    icon: [{ url: '/novera-tab-icon.svg', type: 'image/svg+xml' }],
    shortcut: '/novera-tab-icon.svg',
    apple: '/novera-tab-icon.svg',
  },
  openGraph: {
    title: 'Novera Labs — We engineer momentum.',
    description: 'High-converting websites and intelligent CRM systems, designed as one connected growth engine.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Novera Labs — We engineer momentum.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novera Labs — We engineer momentum.',
    description: 'High-converting websites and intelligent CRM systems, designed as one connected growth engine.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
