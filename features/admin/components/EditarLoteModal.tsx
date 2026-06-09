'use client';
import { useState } from 'react';
import type { Lote } from '@/types/lote';

interface Props {
  lote: Lote;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  mz: string;
  numero: string;
  area: string;
  precio: string;
}

interface Errores {
  mz?: string;
  numero?: string;
  area?: string;
  precio?: string;
}

export default function EditarLoteModal({ lote, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormData>({
    mz:     String(lote.mz),
    numero: String(lote.numero),
    area:   String(lote.area),
    precio: String(lote.precio),
  });
  const [errores, setErrores] = useState<Errores>({});
  const [guardando, setGuardando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');

  const set = (campo: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [campo]: e.target.value }));
    if (errores[campo]) setErrores(p => ({ ...p, [campo]: undefined }));
    setErrorGlobal('');
  };

  const validar = (): Errores => {
    const e: Errores = {};
    if (!form.mz.trim()) e.mz = 'Requerido';
    if (!form.numero.trim()) e.numero = 'Requerido';
    if (!form.area.trim()) e.area = 'Requerido';
    else if (isNaN(parseFloat(form.area)) || parseFloat(form.area) <= 0) e.area = 'Debe ser un número mayor a 0';
    if (!form.precio.trim()) e.precio = 'Requerido';
    else if (isNaN(Number(form.precio)) || Number(form.precio) <= 0) e.precio = 'Debe ser un número mayor a 0';
    return e;
  };

  const guardar = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }

    setGuardando(true);
    setErrorGlobal('');
    try {
      const res = await fetch(`/api/admin/lotes/${lote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mz:     form.mz.trim().toUpperCase(),
          numero: form.numero.trim(),
          area:   form.area.trim(),
          precio: Number(form.precio),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorGlobal(data.error ?? 'Error al guardar'); return; }
      onSuccess();
    } catch {
      setErrorGlobal('Error de conexión. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const inputClass = (campo: keyof FormData) =>
    `w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 transition ${
      errores[campo]
        ? 'border-red-400 focus:ring-red-100'
        : 'border-gray-200 focus:ring-blue-950/20 focus:border-blue-950'
    }`;

  const hayambios =
    form.mz.trim().toUpperCase() !== String(lote.mz).toUpperCase() ||
    form.numero.trim() !== String(lote.numero) ||
    form.area.trim() !== String(lote.area) ||
    Number(form.precio) !== Number(lote.precio);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-surface-tint px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Editar lote</p>
              <h3 className="text-white text-lg font-bold leading-tight mt-0.5">
                Mz. {lote.mz} — Lote {lote.numero}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 mt-0.5 shrink-0"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Manzana */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Manzana <span className="text-red-500">*</span>
              </label>
              <input
                value={form.mz}
                onChange={set('mz')}
                placeholder="Ej. A"
                className={inputClass('mz')}
              />
              {errores.mz && <p className="text-red-500 text-xs mt-1">{errores.mz}</p>}
            </div>

            {/* Número */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                N° de Lote <span className="text-red-500">*</span>
              </label>
              <input
                value={form.numero}
                onChange={set('numero')}
                placeholder="Ej. 12"
                className={inputClass('numero')}
              />
              {errores.numero && <p className="text-red-500 text-xs mt-1">{errores.numero}</p>}
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Área (m²) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                value={form.area}
                onChange={set('area')}
                placeholder="Ej. 120.00"
                className={`${inputClass('area')} pr-10`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">m²</span>
            </div>
            {errores.area && <p className="text-red-500 text-xs mt-1">{errores.area}</p>}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Precio (S/) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">S/</span>
              <input
                type="number"
                min={0}
                step={100}
                value={form.precio}
                onChange={set('precio')}
                placeholder="Ej. 130900"
                className={`${inputClass('precio')} pl-8`}
              />
            </div>
            {form.precio && !errores.precio && (
              <p className="text-xs text-gray-400 mt-1">
                {Number(form.precio).toLocaleString('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 })}
              </p>
            )}
            {errores.precio && <p className="text-red-500 text-xs mt-1">{errores.precio}</p>}
          </div>

          {errorGlobal && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-red-500 text-base shrink-0">error</span>
              <p className="text-red-600 text-xs">{errorGlobal}</p>
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
              onClick={guardar}
              disabled={guardando || !hayambios}
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
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
