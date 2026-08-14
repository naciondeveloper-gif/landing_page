'use client';

import { useEffect, useState } from 'react';
import { waLink } from '@/config/contacto';

export default function Calculadora() {
  const [precio, setPrecio] = useState(139000);
  const [inicial, setInicial] = useState(20000);
  const [tasa, setTasa] = useState(9.5);
  const [plazo, setPlazo] = useState(15);

  const [cuota, setCuota] = useState('S/ 0.00');
  const [montoFinanciar, setMontoFinanciar] = useState('S/ 0.00');

  useEffect(() => {
    calcularCuota();
  }, [precio, inicial, tasa, plazo]);

  function calcularCuota() {
    const monto = precio - inicial;
    const tasaMensual = tasa / 100 / 12;
    const nMeses = plazo * 12;

    if (monto <= 0 || nMeses <= 0) {
      setCuota('S/ 0.00');
      setMontoFinanciar('S/ 0.00');
      return;
    }

    const pago =
      tasaMensual > 0
        ? (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -nMeses))
        : monto / nMeses;

    setMontoFinanciar(
      `S/ ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
    );
    setCuota(
      `S/ ${pago.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    );
  }

  return (
    <section id="calculadora" className="py-24 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-4 md:px-16">
        <div className="text-center mb-16">
          <p className="text-label-caps text-secondary mb-3">Planifica tu compra</p>
          <h2 className="text-headline-lg text-on-surface">Calculadora de Cuotas</h2>
          <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto">
            Simula tu crédito hipotecario referencial para el Conjunto Residencial Chavín de Huántar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
          {/* Inputs */}
          <div className="bg-surface p-6 md:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-5">
            <div>
              <label className="text-label-caps text-on-surface-variant block mb-1.5">
                Precio Total (S/)
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
                className="w-full border border-outline-variant/40 rounded-lg p-3 text-body-md text-on-surface bg-surface-container outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div>
              <label className="text-label-caps text-on-surface-variant block mb-1.5">
                Cuota Inicial (S/)
              </label>
              <input
                type="number"
                value={inicial}
                onChange={(e) => setInicial(parseFloat(e.target.value) || 0)}
                className="w-full border border-outline-variant/40 rounded-lg p-3 text-body-md text-on-surface bg-surface-container outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-label-caps text-on-surface-variant block mb-1.5">
                  Tasa Interés (% TEA)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tasa}
                  onChange={(e) => setTasa(parseFloat(e.target.value) || 0)}
                  className="w-full border border-outline-variant/40 rounded-lg p-3 text-body-md text-on-surface bg-surface-container outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant block mb-1.5">
                  Plazo (años)
                </label>
                <input
                  type="number"
                  value={plazo}
                  onChange={(e) => setPlazo(parseInt(e.target.value) || 0)}
                  className="w-full border border-outline-variant/40 rounded-lg p-3 text-body-md text-on-surface bg-surface-container outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="flex flex-col gap-4">
            <div className="bg-primary text-white p-8 rounded-2xl shadow-xl text-center">
              <p className="text-label-caps text-white/70 mb-2">Cuota mensual estimada</p>
              <p className="text-[42px] leading-none font-extrabold mb-1">{cuota}</p>
              <p className="text-body-sm text-white/60">/ mes</p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 space-y-3">
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Monto a financiar</span>
                <span className="font-semibold text-on-surface">{montoFinanciar}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">N.° de cuotas</span>
                <span className="font-semibold text-on-surface">{plazo * 12} meses</span>
              </div>
            </div>

            <a
              href={waLink('Hola, quiero cotizar el crédito para un lote en Chavín de Huántar')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full whatsapp-gradient text-white font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 text-body-md"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              Consultar esta simulación
            </a>

            <p className="text-body-sm text-on-surface-variant/70 text-center px-2">
              *Valores referenciales e informativos. Sujetos a evaluación crediticia de la entidad financiera.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
