'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Slide = { src: string; alt: string; caption: string };

const baseSlides: Slide[] = [
  { src: '/Diapositivacorta.JPG', alt: 'Fachada del modelo de vivienda de 37.60 m²', caption: 'Fachada Principal' },
  { src: '/Diapositiva2.JPG',     alt: 'Distribución del modelo de vivienda de 37.60 m²', caption: 'Distribución · 37.60 m²' },
];

const ampliacionSlides: Slide[] = [
  { src: '/Diapositivacorta2.JPG', alt: 'Fachada del modelo de vivienda con ampliación', caption: 'Fachada con Ampliación' },
  { src: '/Diapositiva5.JPG',      alt: 'Distribución ampliación - 1er nivel', caption: '1er Nivel · 51.59 m²' },
  { src: '/Diapositiva6.JPG',      alt: 'Distribución ampliación - 2do nivel', caption: '2do Nivel · 47.68 m²' },
];

const areas = [
  { label: 'Área inicial',    value: '37.60' },
  { label: 'Ampliación 1er nivel', value: '13.99' },
  { label: 'Total 1er nivel', value: '51.59' },
  { label: 'Total 2do nivel', value: '47.68' },
];

function Carousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  function go(next: number) {
    setDirection(next > index ? 1 : -1);
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20 bg-black">
      <div className="relative aspect-4/3 md:aspect-16/10">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={slides[index].src}
            src={slides[index].src}
            alt={slides[index].alt}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/0 pointer-events-none" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-4">
          <p className="text-white font-bold text-title-md drop-shadow">{slides[index].caption}</p>
          <span className="text-white/70 text-label-caps">{index + 1} / {slides.length}</span>
        </div>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              onClick={() => go(i)}
              aria-label={`Ir a ${s.caption}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-secondary' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModeloVivienda() {
  const [tab, setTab] = useState<'base' | 'ampliacion'>('base');

  return (
    <section id="modelo" className="py-24 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-4 md:px-16">
        <div className="text-center mb-10">
          <p className="text-label-caps text-secondary mb-2">Conoce tu nuevo hogar</p>
          <h2 className="text-headline-lg text-on-surface">Modelo de Vivienda</h2>
          <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto">
            Casa de 1 piso pensada para crecer contigo, con proyección a una segunda planta cuando la necesites.
          </p>
        </div>

        {/* Segmented toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex bg-surface-container p-1.5 rounded-full border border-outline-variant/20 shadow-sm">
            {(['base', 'ampliacion'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-6 py-2.5 rounded-full text-title-md z-10 transition-colors"
              >
                {tab === t && (
                  <motion.span
                    layoutId="modelo-tab-highlight"
                    className="absolute inset-0 bg-secondary rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={tab === t ? 'text-on-secondary' : 'text-on-surface-variant'}>
                  {t === 'base' ? 'Modelo Base · 37.60 m²' : 'Con Ampliación · 99.27 m²'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          <div className="lg:col-span-2">
            <Carousel slides={tab === 'base' ? baseSlides : ampliacionSlides} />
          </div>

          <div className="rounded-3xl border border-outline-variant/20 bg-surface p-6 h-full">
            {tab === 'base' ? (
              <>
                <h3 className="text-title-md text-secondary mb-4">Ficha del Modelo</h3>
                <div className="space-y-3 text-body-md">
                  <div className="flex justify-between border-b border-outline-variant/20 pb-3">
                    <span className="text-on-surface-variant">Pisos</span>
                    <span className="font-bold text-on-surface">1 piso</span>
                  </div>
                  <div className="flex justify-between border-b border-outline-variant/20 pb-3">
                    <span className="text-on-surface-variant">Área techada</span>
                    <span className="font-bold text-on-surface">37.60 m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Proyección</span>
                    <span className="font-bold text-on-surface">2do piso opcional</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-title-md text-secondary mb-4">Resumen de Áreas</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {areas.map((a) => (
                    <div key={a.label} className="rounded-xl bg-surface-container p-4 text-center">
                      <p className="text-headline-lg font-extrabold text-on-surface leading-tight">{a.value}</p>
                      <p className="text-label-caps text-on-surface-variant mt-1">{a.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-title-md text-secondary">Total techada</span>
                  <span className="text-headline-lg font-extrabold text-secondary">99.27 m²</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Facade finish details */}
        <div>
          <div className="text-center mb-6">
            <p className="text-label-caps text-secondary mb-2">Calidad en cada detalle</p>
            <h3 className="text-title-md text-on-surface">Acabados de Fachada</h3>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-outline-variant/20 bg-white">
            <img src="/Diapositiva9.JPG" alt="Detalles de acabados de fachada" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
