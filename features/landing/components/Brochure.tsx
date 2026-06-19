'use client';

import { useState } from 'react';
import { waLink } from '@/config/contacto';
import { generateFichaTecnicaPDF } from '@/lib/utils/generateFichaTecnicaPDF';

const specs = [
  { icon: 'home',         label: 'Tipo de Vivienda',  value: 'Casa + Lote — 1 piso' },
  { icon: 'king_bed',     label: 'Habitaciones',      value: '2 dormitorios' },
  { icon: 'bathtub',      label: 'Baños',             value: '1 baño completo' },
  { icon: 'square_foot',  label: 'Área de Terreno',   value: '90 m²' },
  { icon: 'architecture', label: 'Área Techada',      value: '35 m²' },
  { icon: 'apartment',    label: 'Total de Lotes',    value: '309 unidades' },
];

export default function Brochure() {
  const [downloading, setDownloading] = useState(false);
  const precio = '139,000';

  async function handleDownload() {
    setDownloading(true);
    try {
      await generateFichaTecnicaPDF();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-16">
        <div className="text-center mb-16">
          <p className="text-label-caps text-secondary mb-3">Material informativo</p>
          <h2 className="text-headline-lg text-on-surface">Ficha Técnica del Proyecto</h2>
          <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto">
            Todas las especificaciones del Conjunto Residencial Chavín de Huántar en un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Flayer */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20 bg-surface-container-low">
            <img
              src="/flayer.png"
              alt="Flayer Chavín de Huántar"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-title-md text-secondary mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                description
              </span>
              Especificaciones Técnicas
            </h3>

            <div className="space-y-3 mb-8">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-container border border-outline-variant/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-caps text-on-surface-variant">{s.label}</p>
                    <p className="text-title-md text-on-surface">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 mb-6">
              <p className="text-label-caps text-secondary mb-1">Precio</p>
              <p className="text-[42px] leading-none font-extrabold text-secondary mb-2">S/ {precio}</p>
              <p className="text-body-md text-on-surface-variant">
                Precio base: Lote + Casa de 1 piso. Crédito preferencial FOVIME disponible.
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 w-full bg-primary text-white font-bold py-4 rounded-xl transition-opacity hover:opacity-90 text-title-md mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {downloading ? 'hourglass_top' : 'download'}
              </span>
              {downloading ? 'Generando PDF…' : 'Descargar Ficha Técnica (PDF)'}
            </button>

            <a
              href={waLink('Hola, quiero más información sobre el proyecto Chavín de Huántar')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full whatsapp-gradient text-white font-bold py-4 rounded-xl transition-opacity hover:opacity-90 text-title-md"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              Solicitar información por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
