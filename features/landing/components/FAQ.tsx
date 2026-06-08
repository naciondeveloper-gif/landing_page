"use client";
import { useState } from 'react';

const faqs = [
  {
    q: '¿Cuál es el precio de los lotes y casas?',
    a: 'Los lotes con casa arrancan desde S/.130,900. El precio puede variar según la ubicación del lote dentro del conjunto residencial. Selecciona un lote en el mapa interactivo para ver disponibilidad y detalles específicos.',
  },
  {
    q: '¿Quiénes pueden acceder al crédito preferencial FOVIME?',
    a: 'El crédito preferencial está disponible para miembros activos y en retiro de las Fuerzas Armadas del Perú (Ejército, Marina y Fuerza Aérea), así como para sus beneficiarios directos. Un asesor te orientará sobre los requisitos específicos.',
  },
  {
    q: '¿Dónde se ubica exactamente el proyecto?',
    a: 'En el KM 52 de la Panamericana Sur, distrito de Chilca, provincia de Cañete, Lima. A aproximadamente 52 km del centro de Lima, con acceso directo por la vía principal.',
  },
  {
    q: '¿Los lotes cuentan con todos los servicios básicos?',
    a: 'Sí. Todos los lotes cuentan con agua, desagüe y electricidad instalados, además de título de propiedad garantizado y escritura pública registrada.',
  },
  {
    q: '¿Cómo puedo reservar mi lote?',
    a: 'Selecciona un lote disponible en el mapa interactivo y completa el formulario. Un asesor te contactará en menos de 24 horas. También puedes escribirnos directamente al 924 888 889 vía WhatsApp.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-surface-container-low py-24 px-4 md:px-16">
      <div className="max-w-container-max mx-auto">
        <p className="text-label-caps text-secondary text-center mb-3">Preguntas frecuentes</p>
        <h2 className="text-headline-lg text-on-surface text-center mb-12">¿Tienes dudas? Te respondemos</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-primary-container/20 transition-colors"
              >
                <span className="text-body-md text-on-surface font-semibold pr-4">{faq.q}</span>
                <span className={`material-symbols-outlined text-secondary shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                  add
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-outline-variant/20">
                  <p className="pt-4 text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
