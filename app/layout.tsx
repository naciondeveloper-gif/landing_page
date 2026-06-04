import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Chavín de Huántar | Conjunto Residencial – Consorcio Neptuno',
  description: 'Lotes y casas desde S/.138,000. Proyecto exclusivo para la familia militar. KM 52 Panamericana Sur – Chilca, Perú. Título de propiedad, agua y desagüe, zona segura.',
  keywords: 'lotes, casas, familia militar, Chilca, Perú, FOVIME, Consorcio Neptuno, Chavín de Huántar',
  icons: { icon: '/stitch/neptuno-logo.png' },
  openGraph: {
    title: 'Chavín de Huántar | Tu nuevo hogar te espera',
    description: 'Lotes + Casas desde S/.138,000. Exclusivo para la familia militar.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'Consorcio Neptuno',
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
