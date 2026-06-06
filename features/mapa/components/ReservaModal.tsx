'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Lote } from '@/types/lote';

interface ModalProps {
  lote: Lote;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservaModal({ lote, onClose }: ModalProps) {
  const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const validar = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.nombre.trim()) e.nombre = 'El nombre es requerido';
    else if (formData.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres';

    if (!formData.telefono.trim()) e.telefono = 'El teléfono es requerido';
    else if (!/^\d{7,15}$/.test(formData.telefono.replace(/\s/g, '')))
      e.telefono = 'Solo dígitos, entre 7 y 15';

    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      e.correo = 'Correo inválido';

    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    setCargando(true);
    try {
      const res = await fetch('/api/lotes/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loteId: lote.id, ...formData }),
      });
      if (!res.ok) throw new Error();
      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
        setFormData({ nombre: '', telefono: '', correo: '', mensaje: '' });
        onClose();
        window.location.reload();
      }, 2500);
    } catch {
      alert('Hubo un error al registrar. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const inputClass = (campo: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all ${
      errores[campo]
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-950 px-6 pt-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-amber-400 text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {lote.disponible ? 'home' : 'lock'}
              </span>
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">
                Manzana {lote.mz}
              </p>
              <h2 className="text-white text-xl font-bold leading-tight">Lote {lote.numero}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
              <span className="material-symbols-outlined text-amber-400 text-base">square_foot</span>
              <span className="text-white text-sm font-medium">{lote.area}</span>
            </div>
            <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${lote.disponible ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <span
                className={`material-symbols-outlined text-base ${lote.disponible ? 'text-green-400' : 'text-red-400'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {lote.disponible ? 'check_circle' : 'cancel'}
              </span>
              <span className={`text-sm font-medium ${lote.disponible ? 'text-green-300' : 'text-red-300'}`}>
                {lote.disponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {lote.disponible ? (
            enviado ? (
              <div className="py-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">¡Solicitud enviada!</h3>
                <p className="text-gray-500 text-sm">
                  Un asesor te contactará pronto. Recuerda que la reserva es válida por 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Déjanos tus datos y un asesor te contactará.{' '}
                  <strong className="text-blue-950">La reserva es válida por 24 horas.</strong>
                </p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez García"
                    className={inputClass('nombre')}
                  />
                  {errores.nombre && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {errores.nombre}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="924 888 889"
                      className={inputClass('telefono')}
                    />
                    {errores.telefono && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errores.telefono}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Correo <span className="text-gray-400 font-normal text-xs">(opcional)</span>
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      className={inputClass('correo')}
                    />
                    {errores.correo && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {errores.correo}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mensaje <span className="text-gray-400 font-normal text-xs">(opcional)</span>
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={2}
                    placeholder="¿Tienes alguna consulta sobre este lote?"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-blue-950 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
                >
                  {cargando ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                      Solicitar información
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lote no disponible</h3>
              <p className="text-gray-500 text-sm">
                El Lote {lote.numero} de Mz. {lote.mz} ya fue vendido o está en proceso de separación.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Ver otros lotes
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
