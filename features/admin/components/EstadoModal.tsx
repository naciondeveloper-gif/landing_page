'use client';
import { useState } from 'react';
import { ESTADO_CONFIG } from '@/config/estados';
import type { Lote, EstadoLote } from '@/types/lote';

export interface CompradorData {
  nombre: string;
  telefono: string;
  correo: string;
  mensaje: string;
}

interface Props {
  lote: Lote;
  onClose: () => void;
  onConfirm: (nuevoEstado: EstadoLote, comprador?: CompradorData) => Promise<void>;
}

function estadoLote(lote: Lote): EstadoLote {
  return lote.estado ?? (lote.disponible ? 'disponible' : 'separado');
}

const REQUIERE_COMPRADOR: EstadoLote[] = ['separado', 'vendido'];

export default function EstadoModal({ lote, onClose, onConfirm }: Props) {
  const [seleccion, setSeleccion] = useState<EstadoLote | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [comprador, setComprador] = useState<CompradorData>({
    nombre: '', telefono: '', correo: '', mensaje: '',
  });

  const necesitaComprador = seleccion !== null && REQUIERE_COMPRADOR.includes(seleccion);

  const formValido = !necesitaComprador || (
    comprador.nombre.trim().length > 0 &&
    comprador.telefono.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(comprador.correo.trim())
  );

  const confirmar = async () => {
    if (!seleccion || !formValido) return;
    setGuardando(true);
    await onConfirm(seleccion, necesitaComprador ? comprador : undefined);
    setGuardando(false);
  };

  const actual = estadoLote(lote);
  const cfgActual = ESTADO_CONFIG[actual];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-surface-tint px-6 py-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Cambiar estado</p>
              <h3 className="text-white text-lg font-bold leading-tight">
                Mz. {lote.mz} — Lote {lote.numero}
              </h3>
              <p className="text-white/40 text-xs mt-0.5">{lote.area}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 mt-0.5"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfgActual.bg} ${cfgActual.color}`}>
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
              {cfgActual.icon}
            </span>
            Estado actual: {cfgActual.label}
          </span>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Selector de estado */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Seleccionar nuevo estado:</p>
            <div className="space-y-2">
              {(Object.entries(ESTADO_CONFIG) as [EstadoLote, typeof ESTADO_CONFIG[EstadoLote]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSeleccion(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    seleccion === key
                      ? `${cfg.bg} border-current ${cfg.color}`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${seleccion === key ? cfg.color : 'text-gray-400'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {cfg.icon}
                  </span>
                  <span className="font-semibold text-sm flex-1">{cfg.label}</span>
                  {seleccion === key && (
                    <span className={`material-symbols-outlined text-base ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      radio_button_checked
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de datos del comprador */}
          {necesitaComprador && (
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-950 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person
                </span>
                <p className="text-sm font-semibold text-gray-800">
                  Datos de quien {seleccion === 'vendido' ? 'compra' : 'separa'} el lote
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={comprador.nombre}
                    onChange={e => setComprador(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="Ej. Juan Pérez García"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/25 focus:border-blue-950 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={comprador.telefono}
                    onChange={e => setComprador(p => ({ ...p, telefono: e.target.value }))}
                    placeholder="Ej. 987 654 321"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/25 focus:border-blue-950 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={comprador.correo}
                    onChange={e => setComprador(p => ({ ...p, correo: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/25 focus:border-blue-950 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Notas <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={comprador.mensaje}
                    onChange={e => setComprador(p => ({ ...p, mensaje: e.target.value }))}
                    placeholder="Observaciones adicionales..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/25 focus:border-blue-950 transition resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmar}
              disabled={!seleccion || !formValido || guardando}
              className="flex-1 px-4 py-2.5 bg-blue-950 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {guardando ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
