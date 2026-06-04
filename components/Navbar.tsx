"use client";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-50 bg-surface-container/90 backdrop-blur-md border-b border-outline-variant/20 shadow-sm"
      >
        <div className="max-w-container-max mx-auto px-4 md:px-16 h-20 flex items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <span className="text-headline-lg-mobile md:text-headline-lg font-extrabold text-secondary tracking-tight">
              Chavín de Huántar
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-8 items-center">
            <Link href="#inicio"    className="text-secondary border-b-2 border-secondary pb-1 text-body-md">Proyecto</Link>
            <Link href="#nosotros"  className="text-on-surface-variant hover:text-secondary transition-colors text-body-md">Sobre Nosotros</Link>
            <Link href="#mapa"      className="text-on-surface-variant hover:text-secondary transition-colors text-body-md">Planos</Link>
            <Link href="#contacto"  className="text-on-surface-variant hover:text-secondary transition-colors text-body-md">Contacto</Link>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Link
                href="#mapa"
                className="bg-primary-container text-primary border border-primary/30 px-6 py-2 rounded-lg text-title-md text-nowrap hover:bg-primary hover:text-on-primary transition-all"
              >
                Reservar Ahora
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Link
                href="/login"
                className="border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg text-body-md text-nowrap hover:border-secondary hover:text-secondary transition-all"
              >
                Iniciar Sesión
              </Link>
            </motion.div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-surface-container-high transition-colors"
              aria-label="Abrir menú"
            >
              <span className={`block w-5 h-0.5 bg-on-surface transition-transform duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-on-surface transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-on-surface transition-transform duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-surface-container border-t border-outline-variant/20 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                <Link href="#inicio"   onClick={() => setMenuOpen(false)} className="text-on-surface text-body-md py-1 hover:text-secondary">Proyecto</Link>
                <Link href="#nosotros" onClick={() => setMenuOpen(false)} className="text-on-surface text-body-md py-1 hover:text-secondary">Sobre Nosotros</Link>
                <Link href="#mapa"     onClick={() => setMenuOpen(false)} className="text-on-surface text-body-md py-1 hover:text-secondary">Planos</Link>
                <Link href="#contacto" onClick={() => setMenuOpen(false)} className="text-on-surface text-body-md py-1 hover:text-secondary">Contacto</Link>
                <div className="flex gap-3 pt-2 border-t border-outline-variant/20">
                  <Link href="#mapa"  onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-primary-container text-primary py-2.5 rounded-lg text-body-md font-semibold">Reservar</Link>
                  <Link href="/login" className="flex-1 text-center border border-outline-variant text-on-surface-variant py-2.5 rounded-lg text-body-md">Sesión</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
