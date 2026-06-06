'use client';
import { useState, useEffect } from 'react';
import { ESTADO_CONFIG } from '@/config/estados';
import type { Lote, EstadoLote } from '@/types/lote';

function estadoLote(lote: Lote): EstadoLote {
  return lote.estado ?? (lote.disponible ? 'disponible' : 'separado');
}

function useTiempoRestante(reservado_hasta: string | null) {
  const [restante, setRestante] = useState('');

  useEffect(() => {
    if (!reservado_hasta) { setRestante(''); return; }

    const calcular = () => {
      const diff = new Date(reservado_hasta).getTime() - Date.now();
      if (diff <= 0) { setRestante('Expirado'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRestante(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };

    calcular();
    const id = setInterval(calcular, 1000);
    return () => clearInterval(id);
  }, [reservado_hasta]);

  return restante;
}

function CuentaRegresiva({ reservado_hasta }: { reservado_hasta: string | null }) {
  const restante = useTiempoRestante(reservado_hasta);
  if (!restante) return <span className="text-gray-300 text-xs">Sin límite</span>;
  const expirado = restante === 'Expirado';
  return (
    <div className="flex items-center gap-1.5">
      <span className={`material-symbols-outlined text-sm ${expirado ? 'text-red-500' : 'text-amber-500'}`}>
        {expirado ? 'timer_off' : 'timer'}
      </span>
      <span className={`font-mono text-sm font-bold ${expirado ? 'text-red-500' : 'text-amber-600'}`}>
        {restante}
      </span>
    </div>
  );
}

interface Props {
  lotes: Lote[];
  onRefresh: () => void;
  onEditEstado: (lote: Lote) => void;
}

export default function ReservasTable({ lotes, onRefresh, onEditEstado }: Props) {
  const reservas = lotes.filter(l => {
    const est = estadoLote(l);
    return est === 'separado' || est === 'vendido';
  });

  const separados = reservas.filter(l => estadoLote(l) === 'separado');
  const vendidos   = reservas.filter(l => estadoLote(l) === 'vendido');

  return (
    <div className="space-y-4">
      {/* Separaciones activas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <h2 className="text-base font-bold text-gray-800">Separaciones activas</h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{separados.length}</span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold">Lote</th>
                <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold">Contacto</th>
                <th className="px-4 py-3 text-left font-semibold">Tiempo restante</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {separados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No hay separaciones activas.
                  </td>
                </tr>
              ) : (
                separados.map(lote => {
                  const res = lote.reservaciones?.[0];
                  return (
                    <tr key={lote.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-blue-950">Mz. {lote.mz} — Lote {lote.numero}</p>
                        <p className="text-xs text-gray-400">{lote.area}</p>
                      </td>
                      <td className="px-4 py-3">
                        {res ? (
                          <p className="font-semibold text-gray-700 text-xs">{res.nombre}</p>
                        ) : (
                          <span className="text-xs text-gray-300">Sin datos</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {res ? (
                          <div className="text-xs text-gray-500 space-y-0.5">
                            <p>{res.telefono}</p>
                            {res.correo && <p>{res.correo}</p>}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <CuentaRegresiva reservado_hasta={lote.reservado_hasta} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onEditEstado(lote)}
                          className="inline-flex items-center gap-1.5 bg-blue-950 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Estado
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendidos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
          <h2 className="text-base font-bold text-gray-800">Vendidos</h2>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{vendidos.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold">Lote</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendidos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No hay lotes vendidos.
                  </td>
                </tr>
              ) : (
                vendidos.map(lote => {
                  const cfg = ESTADO_CONFIG['vendido'];
                  return (
                    <tr key={lote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-blue-950">Mz. {lote.mz} — Lote {lote.numero}</p>
                        <p className="text-xs text-gray-400">{lote.area}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onEditEstado(lote)}
                          className="inline-flex items-center gap-1.5 bg-blue-950 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Estado
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
