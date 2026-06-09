'use client';
import { useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { ESTADO_CONFIG } from '@/config/estados';
import type { Lote, EstadoLote } from '@/types/lote';

interface Props {
  lotes: Lote[];
  conteo: Record<EstadoLote, number>;
}

function fmt(n: number) {
  return `S/ ${n.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`;
}

type RecentItem = {
  nombre: string;
  telefono: string;
  correo?: string;
  mz: string;
  numero: string | number;
  estado: EstadoLote;
  created_at?: string;
};

export default function Dashboard({ lotes, conteo }: Props) {
  const data = useMemo(() => {
    const totalRecaudado = lotes
      .filter(l => l.estado === 'vendido')
      .reduce((s, l) => s + (Number(l.precio) || 0), 0);

    const enProceso = lotes
      .filter(l => l.estado === 'separado')
      .reduce((s, l) => s + (Number(l.precio) || 0), 0);

    const totalPotencial = lotes.reduce((s, l) => s + (Number(l.precio) || 0), 0);
    const total = lotes.length;
    const pctVendido = total > 0 ? Math.round((conteo.vendido / total) * 100) : 0;
    const pctOcupado = total > 0 ? Math.round(((conteo.vendido + conteo.separado) / total) * 100) : 0;

    const manzanas = [...new Set(lotes.map(l => l.mz))].sort();
    const byManzana = manzanas.map(mz => {
      const ls = lotes.filter(l => l.mz === mz);
      return {
        mz,
        total: ls.length,
        disponible: ls.filter(l => l.estado === 'disponible').length,
        separado: ls.filter(l => l.estado === 'separado').length,
        vendido: ls.filter(l => l.estado === 'vendido').length,
      };
    });

    const recientes: RecentItem[] = lotes
      .filter(l => l.estado !== 'disponible' && l.reservaciones?.length)
      .flatMap(l =>
        (l.reservaciones || []).map(r => ({
          nombre: r.nombre,
          telefono: r.telefono,
          correo: r.correo,
          mz: l.mz,
          numero: l.numero,
          estado: l.estado,
          created_at: r.created_at,
        }))
      )
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .slice(0, 8);

    return { totalRecaudado, enProceso, totalPotencial, pctVendido, pctOcupado, total, byManzana, recientes };
  }, [lotes, conteo]);

  const descargarPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210;
    const PRIMARY: [number, number, number] = [13, 31, 78];
    const GOLD: [number, number, number] = [184, 135, 11];
    const LIGHT: [number, number, number] = [248, 249, 252];
    const DARK: [number, number, number] = [26, 28, 33];
    const MID: [number, number, number] = [100, 100, 100];

    const now = new Date().toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    // Header
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, W, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Dashboard — Consorcio Neptuno', 14, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Reporte de estado de lotes y ventas', 14, 25);
    doc.setFontSize(8);
    doc.text(`Generado: ${now}`, 14, 34);

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.line(0, 42, W, 42);

    let y = 52;

    // Resumen general
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RESUMEN GENERAL', 14, y);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(14, y + 2, 75, y + 2);

    y += 10;

    const statsData: { label: string; value: string; color: [number, number, number] }[] = [
      { label: 'Disponibles', value: String(conteo.disponible), color: [22, 163, 74] },
      { label: 'Separados',   value: String(conteo.separado),   color: [217, 119, 6] },
      { label: 'Vendidos',    value: String(conteo.vendido),     color: [220, 38, 38] },
      { label: '% Vendido',   value: `${data.pctVendido}%`,      color: [37, 99, 235] },
    ];

    const boxW = (W - 28 - 9) / 4;
    statsData.forEach((s, i) => {
      const x = 14 + i * (boxW + 3);
      doc.setFillColor(...LIGHT);
      doc.roundedRect(x, y, boxW, 20, 2, 2, 'F');
      doc.setFillColor(...s.color);
      doc.roundedRect(x, y, 3, 20, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...s.color);
      doc.text(s.value, x + 6, y + 13);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...MID);
      doc.text(s.label, x + 6, y + 18.5);
    });

    y += 28;

    // Resumen financiero
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RESUMEN FINANCIERO', 14, y);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(14, y + 2, 83, y + 2);

    y += 10;

    const finData = [
      { label: 'Total Recaudado', sub: 'Lotes vendidos',      value: data.totalRecaudado },
      { label: 'En Proceso',      sub: 'Separaciones activas', value: data.enProceso      },
      { label: 'Potencial Total', sub: 'Todos los lotes',      value: data.totalPotencial },
    ];

    const fW = (W - 28 - 6) / 3;
    finData.forEach((f, i) => {
      const x = 14 + i * (fW + 3);
      doc.setFillColor(i === 0 ? 240 : 248, i === 0 ? 253 : 249, i === 0 ? 244 : 252);
      doc.roundedRect(x, y, fW, 24, 2, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...MID);
      doc.text(f.label, x + 4, y + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...DARK);
      doc.text(fmt(f.value), x + 4, y + 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(f.sub, x + 4, y + 21);
    });

    y += 32;

    // Detalle por manzana
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DETALLE POR MANZANA', 14, y);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(14, y + 2, 88, y + 2);

    y += 10;

    const tCols = [14, 50, 90, 120, 150, 178];
    const tHeaders = ['Manzana', 'Total', 'Disponibles', 'Separados', 'Vendidos', '% Vend.'];
    doc.setFillColor(...PRIMARY);
    doc.roundedRect(14, y - 5, W - 28, 9, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    tHeaders.forEach((h, i) => doc.text(h, tCols[i], y));

    y += 6;
    data.byManzana.forEach((row, idx) => {
      const pct = row.total > 0 ? Math.round((row.vendido / row.total) * 100) : 0;
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 252 : 255);
      doc.rect(14, y - 4, W - 28, 8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...DARK);
      [row.mz, String(row.total), String(row.disponible), String(row.separado), String(row.vendido), `${pct}%`]
        .forEach((v, i) => doc.text(v, tCols[i], y + 1));
      y += 8;
    });

    y += 8;

    // Actividad reciente
    if (data.recientes.length > 0) {
      if (y > 220) { doc.addPage(); y = 20; }

      doc.setTextColor(...GOLD);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('ACTIVIDAD RECIENTE', 14, y);
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.4);
      doc.line(14, y + 2, 84, y + 2);

      y += 10;

      const aCols = [14, 48, 92, 134, 168];
      const aHeaders = ['Lote', 'Cliente', 'Teléfono', 'Correo', 'Estado'];
      doc.setFillColor(...PRIMARY);
      doc.roundedRect(14, y - 5, W - 28, 9, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      aHeaders.forEach((h, i) => doc.text(h, aCols[i], y));

      y += 6;
      data.recientes.forEach((r, idx) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 252 : 255);
        doc.rect(14, y - 4, W - 28, 8, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...DARK);
        [
          `Mz.${r.mz} L.${r.numero}`,
          r.nombre.substring(0, 18),
          r.telefono,
          (r.correo ?? '').substring(0, 20),
          r.estado === 'vendido' ? 'Vendido' : 'Separado',
        ].forEach((v, i) => doc.text(v, aCols[i], y + 1));
        y += 8;
      });
    }

    // Footer
    const footerY = 283;
    doc.setFillColor(...PRIMARY);
    doc.rect(0, footerY - 4, W, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Consorcio Neptuno', 14, footerY + 2);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte confidencial — uso interno', 14, footerY + 8);
    doc.setTextColor(150, 180, 255);
    doc.setFontSize(7);
    doc.text(`Generado automáticamente — ${now}`, 14, footerY + 13);

    doc.save(`Dashboard-Neptuno-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">Resumen en tiempo real — {data.total} lotes en total</p>
        </div>
        <button
          onClick={descargarPDF}
          className="flex items-center gap-2 bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
          <span className="hidden sm:inline">Descargar PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Disponibles', value: conteo.disponible,       color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-100', icon: 'check_circle' },
          { label: 'Separados',   value: conteo.separado,         color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-100', icon: 'schedule'     },
          { label: 'Vendidos',    value: conteo.vendido,           color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-100',   icon: 'sell'         },
          { label: '% Vendido',   value: `${data.pctVendido}%`,   color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-100',  icon: 'percent'      },
        ].map(card => (
          <div key={card.label} className={`bg-white rounded-xl p-4 shadow-sm border ${card.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card.bg} rounded-full flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-400">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Avance del proyecto</p>
          <p className="text-sm font-bold text-gray-800">{data.pctOcupado}% ocupado</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${data.total > 0 ? (conteo.vendido / data.total) * 100 : 0}%` }}
            />
            <div
              className="bg-amber-400 transition-all duration-500"
              style={{ width: `${data.total > 0 ? (conteo.separado / data.total) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block" />
            Vendido ({conteo.vendido})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block" />
            Separado ({conteo.separado})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gray-200 rounded-full inline-block" />
            Disponible ({conteo.disponible})
          </span>
        </div>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Recaudado', sub: 'Lotes vendidos',       value: data.totalRecaudado, color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-100', icon: 'payments'        },
          { label: 'En Proceso',      sub: 'Separaciones activas', value: data.enProceso,      color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-100', icon: 'hourglass_empty' },
          { label: 'Potencial Total', sub: 'Todos los lotes',      value: data.totalPotencial, color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-100',  icon: 'trending_up'     },
        ].map(card => (
          <div key={card.label} className={`bg-white rounded-xl p-4 shadow-sm border ${card.border}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                <p className={`text-lg font-bold ${card.color}`}>{fmt(card.value)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
              <div className={`w-9 h-9 ${card.bg} rounded-full flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined text-base ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manzana Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Detalle por Manzana</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="text-left px-4 py-2.5 font-semibold uppercase tracking-wide">Manzana</th>
                <th className="text-center px-3 py-2.5 font-semibold uppercase tracking-wide">Total</th>
                <th className="text-center px-3 py-2.5 font-semibold uppercase tracking-wide text-green-600">Disp.</th>
                <th className="text-center px-3 py-2.5 font-semibold uppercase tracking-wide text-amber-600">Sep.</th>
                <th className="text-center px-3 py-2.5 font-semibold uppercase tracking-wide text-red-600">Vend.</th>
                <th className="text-right px-4 py-2.5 font-semibold uppercase tracking-wide">% Vendido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.byManzana.map(row => {
                const pct = row.total > 0 ? Math.round((row.vendido / row.total) * 100) : 0;
                return (
                  <tr key={row.mz} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-gray-800">Mz. {row.mz}</td>
                    <td className="text-center px-3 py-2.5 text-gray-600">{row.total}</td>
                    <td className="text-center px-3 py-2.5 text-green-700 font-medium">{row.disponible}</td>
                    <td className="text-center px-3 py-2.5 text-amber-700 font-medium">{row.separado}</td>
                    <td className="text-center px-3 py-2.5 text-red-700 font-medium">{row.vendido}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      {data.recientes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Actividad Reciente</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.recientes.map((r, i) => {
              const cfg = ESTADO_CONFIG[r.estado];
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 ${cfg.bg} rounded-full flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-sm ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {cfg.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{r.nombre}</p>
                    <p className="text-xs text-gray-400">
                      Mz. {r.mz} — Lote {r.numero}
                      {r.correo && <> · {r.correo}</>}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} font-medium`}>
                      {cfg.label}
                    </span>
                    {r.created_at && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(r.created_at).toLocaleDateString('es-PE', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
