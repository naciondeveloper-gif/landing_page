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

  function handleImprimir() {
    window.print();
  }

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
    <section id="calculadora" className="py-24 bg-surface-container-low print:py-0 print:bg-white">
      <div className="max-w-container-max mx-auto px-4 md:px-16 print:px-0 print:max-w-none">
        <div className="text-center mb-16 print:hidden">
          <p className="text-label-caps text-secondary mb-3">Planifica tu compra</p>
          <h2 className="text-headline-lg text-on-surface">Calculadora de Cuotas</h2>
          <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto">
            Simula tu crédito hipotecario referencial para el Conjunto Residencial Chavín de Huántar.
          </p>
          <button
            onClick={handleImprimir}
            className="mt-6 inline-flex items-center gap-1.5 bg-on-surface text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            title="Imprimir esta simulación"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Imprimir simulación
          </button>
        </div>

        <div className="hidden print:block text-center border-b border-slate-300 pb-4 mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">CHAVÍN DE HUÁNTAR</h2>
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-0.5">
            Cotización de Crédito Hipotecario Referencial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-4xl mx-auto print:block print:max-w-none">
          {/* Inputs */}
          <div className="print:hidden bg-surface p-6 md:p-8 rounded-2xl border border-outline-variant/20 shadow-sm space-y-5">
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
          <div className="flex flex-col gap-4 print:block">
            <div className="bg-primary text-white p-8 rounded-2xl shadow-xl text-center print:hidden">
              <p className="text-label-caps text-white/70 mb-2">Cuota mensual estimada</p>
              <p className="text-[42px] leading-none font-extrabold mb-1">{cuota}</p>
              <p className="text-body-sm text-white/60">/ mes</p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-outline-variant/20 space-y-3 print:hidden">
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Monto a financiar</span>
                <span className="font-semibold text-on-surface">{montoFinanciar}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">N.° de cuotas</span>
                <span className="font-semibold text-on-surface">{plazo * 12} meses</span>
              </div>
            </div>

            {/* Printable summary table */}
            <div className="hidden print:block my-4">
              <table className="w-full text-left text-sm border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="p-3 font-bold bg-slate-50 w-1/2">Precio del Inmueble evaluado:</td>
                    <td className="p-3 text-slate-800">S/ {precio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-3 font-bold bg-slate-50">Cuota Inicial Aportada:</td>
                    <td className="p-3 text-slate-800">S/ {inicial.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-3 font-bold bg-slate-50">Monto Neto Financiado por el banco:</td>
                    <td className="p-3 font-semibold text-slate-800">{montoFinanciar}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-3 font-bold bg-slate-50">Tasa de Interés Nominal Efectiva:</td>
                    <td className="p-3 text-slate-800">{tasa}% TEA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold bg-slate-50">Plazo de amortización acordado:</td>
                    <td className="p-3 text-slate-800">{plazo} años ({plazo * 12} cuotas mensuales)</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-white border border-slate-400 p-6 rounded text-center mt-6">
                <span className="text-sm text-slate-700 block mb-1">
                  Para una hipoteca de <span className="font-bold text-slate-900">{montoFinanciar}</span> amortizado en {plazo} años, su pago mensual estimado es de:
                </span>
                <span className="text-4xl font-black text-slate-900 mt-2 block">
                  {cuota} <span className="text-sm font-normal text-slate-500">/ mes</span>
                </span>
              </div>
            </div>

            <a
              href={waLink('Hola, quiero cotizar el crédito para un lote en Chavín de Huántar')}
              target="_blank"
              rel="noopener noreferrer"
              className="print:hidden flex items-center justify-center gap-2 w-full whatsapp-gradient text-white font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 text-body-md"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              Consultar esta simulación
            </a>

            <p className="text-body-sm text-on-surface-variant/70 text-center px-2 print:hidden">
              *Valores referenciales e informativos. Sujetos a evaluación crediticia de la entidad financiera.
            </p>

            <div className="hidden print:block mt-16 border-t border-slate-300 pt-4 text-center">
              <p className="text-[10px] text-slate-400">Simulación generada digitalmente en el portal web del Conjunto Residencial Chavín de Huántar.</p>
              <p className="text-[9px] text-slate-400 italic mt-1 max-w-xl mx-auto">
                *Nota: Los valores expuestos en este documento son estrictamente referenciales e informativos. Las tasas, primas de seguros desgravamen, gastos notariales y condiciones finales están sujetos a la evaluación crediticia formal de la entidad bancaria regulada por la SBS de su preferencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
