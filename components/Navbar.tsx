"use client"; 
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="https://www.consorcioneptuno.com/" className="text-md font-bold text-blue-900 text-center md:text-2xl cursor-pointer">
          Consorcio Neptuno
        </Link>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="#inicio" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <Link href="#nosotros" className="hover:text-blue-600 transition-colors">Nuestros lotes</Link>
          <Link href="#mapa" className="hover:text-blue-600 transition-colors">Mapa</Link>
          <Link href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</Link>
        </div>

        <div className="flex gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/#mapa" className="bg-blue-900 text-white px-4 py-2.5 rounded-full hover:bg-blue-800 transition-colors text-xs font-semibold">
              Reserva ya
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/login" className="bg-sky-400 text-white px-4 py-2.5 rounded-full hover:bg-sky-500 transition-colors text-xs font-semibold">
              Iniciar Sesión
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}