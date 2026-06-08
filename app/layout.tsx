import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.consorcioneptuno.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Chavín de Huántar | Lotes y Casas – Consorcio Neptuno & FOVIME',
    template: '%s – Chavín de Huántar',
  },
  description:
    'Lotes y casas desde S/.130,900 en Chilca, Lima. Proyecto exclusivo para la familia militar peruana. Título de propiedad, agua, desagüe y financiamiento preferencial FOVIME. KM 52 Panamericana Sur.',
  keywords: [
    'lotes Chilca',
    'casas familia militar',
    'FOVIME',
    'Consorcio Neptuno',
    'Chavín de Huántar',
    'conjunto residencial Chilca',
    'lotes Lima sur',
    'vivienda militar Perú',
    'Panamericana Sur KM 52',
  ],
  authors: [{ name: 'Consorcio Neptuno' }],
  creator: 'Consorcio Neptuno',
  icons: {
    icon: '/neptuno-logo.png',
    shortcut: '/neptuno-logo.png',
    apple: '/neptuno-logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Chavín de Huántar | Tu nuevo hogar en Chilca',
    description:
      'Lotes + Casas desde S/.130,900. Exclusivo para la familia militar peruana. Financiamiento FOVIME. KM 52 Panamericana Sur – Chilca, Lima.',
    url: BASE_URL,
    type: 'website',
    locale: 'es_PE',
    siteName: 'Chavín de Huántar – Consorcio Neptuno',
    images: [
      {
        url: '/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Conjunto Residencial Chavín de Huántar – Chilca, Lima',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chavín de Huántar | Lotes y Casas desde S/.130,900',
    description:
      'Proyecto exclusivo para la familia militar. Financiamiento preferencial FOVIME. Chilca, Lima.',
    images: ['/hero-bg.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${manrope.className} bg-background text-on-surface overflow-x-hidden`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
