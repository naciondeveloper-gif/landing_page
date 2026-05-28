import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Consorcio Neptuno | Chavín de Huántar',
  description: 'Conjunto Residencial Chavín de Huántar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <link rel="icon" type="image/png" href="/icon-neptuno.jpeg"></link>
      <body className={`${inter.className} bg-gray-50`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}