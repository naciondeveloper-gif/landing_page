"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { waLink } from '@/config/contacto';

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen pt-20 flex flex-col justify-center overflow-hidden bg-background">

      {/* Background image + gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/terrenos.png"
          alt="Conjunto Residencial Chavín de Huántar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-16 py-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

        {/* ── Left: messaging ── */}
        <motion.div
          className="md:col-span-7 flex flex-col gap-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col gap-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-4 py-1.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              <span className="text-label-caps text-secondary">EXCLUSIVO PARA LA FAMILIA MILITAR PERUANA</span>
            </div>

            <h1 className="text-[40px] md:text-display-lg text-on-surface leading-tight font-extrabold">
              Tu hogar propio, <br />
              <span className="text-secondary italic">a la altura de tu servicio</span>
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-xl">
              Un conjunto residencial con servicios completos y el respaldo financiero de FOVIME. A solo 52 km de Lima, con acceso directo por la Panamericana Sur — Chilca.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: 'description', label: 'Título de propiedad registrado' },
              { icon: 'water_drop',  label: 'Agua, desagüe y electricidad' },
              { icon: 'shield',      label: 'Zona residencial vigilada' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-secondary/20 flex items-center justify-center group-hover:border-secondary/50 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-secondary">{b.icon}</span>
                </div>
                <span className="text-body-md text-title-md text-on-surface">{b.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div className="flex flex-wrap gap-4 pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Link
              href="#mapa"
              className="bg-gradient-to-r from-secondary to-secondary-fixed-dim text-on-secondary px-8 py-4 rounded-lg text-title-md gold-glow hover:brightness-110 transition-all flex items-center gap-2 active:scale-95"
            >
              Ver disponibilidad
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <a
              href={waLink('Hola, me interesa el proyecto Chavín de Huántar')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-lg text-title-md hover:brightness-110 transition-all flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* ── Right: price card ── */}
        <motion.div
          className="md:col-span-5 flex justify-center md:justify-end"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="bg-surface-container/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-sm gold-glow">
            <div className="flex justify-between items-start mb-6">
              <span className="text-label-caps text-on-surface-variant">PRECIO DESDE</span>
              <div className="bg-secondary/20 p-2 rounded-full">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-headline-lg font-extrabold text-secondary flex items-baseline gap-2">
                <span className="text-title-md">S/.</span> 138,000
              </div>
              <p className="text-body-md text-on-surface-variant mt-1">Lote + Casa de 1 piso</p>
            </div>
            <div className="space-y-4 border-t border-outline-variant/30 pt-6">
              {[
                { label: 'Área Terreno',  value: '90 m²' },
                { label: 'Área Techada',  value: '35 m²' },
                { label: 'Ubicación',     value: 'KM 52 Pan. Sur – Chilca' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">{r.label}</span>
                  <span className="text-on-surface font-bold text-right">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <span className="material-symbols-outlined text-secondary/50 text-[32px]">expand_more</span>
      </div>
    </section>
  );
}
