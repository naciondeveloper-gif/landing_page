'use client';
import { useState, useEffect, useMemo } from 'react';
import { ESTADO_CONFIG } from '@/config/estados';
import type { Lote, EstadoLote } from '@/types/lote';

const PAGE_SIZE = 20;

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
  if (!restante) return <span className="text-gray-300">—</span>;
  const expirado = restante === 'Expirado';
  return (
    <span className={`font-mono text-xs font-bold ${expirado ? 'text-red-500' : 'text-amber-600'}`}>
      {restante}
    </span>
  );
}

type SortKey = 'mz' | 'numero' | 'area' | 'estado';
type SortDir = 'asc' | 'desc';

interface Props {
  lotes: Lote[];
  onRefresh: () => void;
  onEditEstado: (lote: Lote) => void;
}

export default function LotesTable({ lotes, onRefresh, onEditEstado }: Props) {
  const [filtroEstado, setFiltroEstado] = useState<EstadoLote | 'todos'>('todos');
  const [filtroMz, setFiltroMz] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('mz');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [pagina, setPagina] = useState(1);

  const manzanas = useMemo(() => {
    const set = new Set(lotes.map(l => l.mz));
    return Array.from(set).sort();
  }, [lotes]);

  const lotesFiltrados = useMemo(() => {
    return lotes
      .filter(l => {
        if (filtroEstado !== 'todos' && estadoLote(l) !== filtroEstado) return false;
        if (filtroMz && l.mz !== filtroMz) return false;
        if (filtroCliente) {
          const res = l.reservaciones?.[0];
          const nombre = res?.nombre?.toLowerCase() ?? '';
          const tel = res?.telefono?.toLowerCase() ?? '';
          const busq = filtroCliente.toLowerCase();
          if (!nombre.includes(busq) && !tel.includes(busq)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let va: string | number = '';
        let vb: string | number = '';
        if (sortKey === 'mz') { va = a.mz; vb = b.mz; }
        else if (sortKey === 'numero') { va = Number(a.numero); vb = Number(b.numero); }
        else if (sortKey === 'area') { va = parseFloat(String(a.area)); vb = parseFloat(String(b.area)); }
        else if (sortKey === 'estado') { va = estadoLote(a); vb = estadoLote(b); }

        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [lotes, filtroEstado, filtroMz, filtroCliente, sortKey, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(lotesFiltrados.length / PAGE_SIZE));

  useEffect(() => { setPagina(1); }, [filtroEstado, filtroMz, filtroCliente, sortKey, sortDir]);

  const lotesVisibles = lotesFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="material-symbols-outlined text-xs ml-0.5 opacity-60">
      {sortKey === k ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
    </span>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Lista de Lotes</h1>
            <p className="text-xs text-gray-400">{lotesFiltrados.length} de {lotes.length} lotes</p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value as EstadoLote | 'todos')}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-950/20 bg-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="separado">Separación</option>
            <option value="vendido">Vendido</option>
          </select>

          <select
            value={filtroMz}
            onChange={e => setFiltroMz(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-950/20 bg-white"
          >
            <option value="">Todas las manzanas</option>
            {manzanas.map(mz => (
              <option key={mz} value={mz}>Mz. {mz}</option>
            ))}
          </select>

          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm pointer-events-none">search</span>
            <input
              type="text"
              value={filtroCliente}
              onChange={e => setFiltroCliente(e.target.value)}
              placeholder="Buscar cliente..."
              className="text-xs border border-gray-200 rounded-lg pl-7 pr-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-950/20 w-44"
            />
          </div>

          {(filtroEstado !== 'todos' || filtroMz || filtroCliente) && (
            <button
              onClick={() => { setFiltroEstado('todos'); setFiltroMz(''); setFiltroCliente(''); }}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort('mz')} className="flex items-center font-semibold hover:text-gray-600">
                  Manzana <SortIcon k="mz" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort('numero')} className="flex items-center font-semibold hover:text-gray-600">
                  Lote <SortIcon k="numero" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort('area')} className="flex items-center font-semibold hover:text-gray-600">
                  Área <SortIcon k="area" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort('estado')} className="flex items-center font-semibold hover:text-gray-600">
                  Estado <SortIcon k="estado" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold">Tiempo</th>
              <th className="px-4 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lotesVisibles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-3xl block mb-2 opacity-30">search_off</span>
                  No hay lotes que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              lotesVisibles.map((lote) => {
                const est = estadoLote(lote);
                const cfg = ESTADO_CONFIG[est];
                const reservacion = lote.reservaciones?.[0];
                return (
                  <tr key={lote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs">Mz. {lote.mz}</td>
                    <td className="px-4 py-3 font-bold text-blue-950">Lote {lote.numero}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{lote.area}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {reservacion ? (
                        <div className="text-xs">
                          <p className="font-semibold text-gray-700">{reservacion.nombre}</p>
                          <p className="text-gray-400">{reservacion.telefono}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {est === 'separado' ? (
                        <CuentaRegresiva reservado_hasta={lote.reservado_hasta} />
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
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

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Página {pagina} de {totalPaginas} · {lotesFiltrados.length} resultados
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPagina(p as number)}
                    className={`min-w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      pagina === p ? 'bg-blue-950 text-white' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
