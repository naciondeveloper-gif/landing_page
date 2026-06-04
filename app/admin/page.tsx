'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lote, EstadoLote } from '@/types/lote';
import Link from 'next/link';

type EstadoConfig = { label: string; color: string; bg: string; icon: string };

const ESTADO: Record<EstadoLote, EstadoConfig> = {
  disponible: { label: 'Disponible', color: 'text-green-700',  bg: 'bg-green-100',  icon: 'check_circle' },
  separado:   { label: 'Separación', color: 'text-amber-700',  bg: 'bg-amber-100',  icon: 'schedule'     },
  vendido:    { label: 'Vendido',    color: 'text-red-700',    bg: 'bg-red-100',    icon: 'sell'         },
};

function estadoLote(lote: Lote): EstadoLote {
  return lote.estado ?? (lote.disponible ? 'disponible' : 'separado');
}

export default function AdminPage() {
  const [usuario, setUsuario] = useState<{ username: string } | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalLote, setModalLote] = useState<Lote | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoLote | null>(null);
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  const fetchDatos = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('lotes')
        .select('*, reservaciones(*)')
        .eq('type', 'lote')
        .order('mz', { ascending: true })
        .order('numero', { ascending: true });

      if (error) throw error;
      if (data) setLotes(data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userStorage = localStorage.getItem('user');
    if (!isLoggedIn) { router.replace('/login'); return; }
    if (userStorage) {
      try { setUsuario(JSON.parse(userStorage)); } catch {}
    }
    fetchDatos();
  }, [router]);

  const abrirModal = (lote: Lote) => {
    setModalLote(lote);
    setNuevoEstado(null);
  };

  const cerrarModal = () => {
    setModalLote(null);
    setNuevoEstado(null);
  };

  const confirmarCambio = async () => {
    if (!modalLote || !nuevoEstado) return;
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('lotes')
        .update({
          estado: nuevoEstado,
          disponible: nuevoEstado === 'disponible',
          reservado_hasta: nuevoEstado === 'disponible' ? null : modalLote.reservado_hasta,
        })
        .eq('id', modalLote.id);

      if (error) throw error;
      cerrarModal();
      fetchDatos();
    } catch {
      alert('Error al actualizar el estado.');
    } finally {
      setGuardando(false);
    }
  };

  const conteo = {
    disponible: lotes.filter(l => estadoLote(l) === 'disponible').length,
    separado:   lotes.filter(l => estadoLote(l) === 'separado').length,
    vendido:    lotes.filter(l => estadoLote(l) === 'vendido').length,
  };

  if (cargando) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Cargando sistema...
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="w-full bg-white fixed top-0 h-14 flex px-4 justify-between items-center shadow-sm border-b border-gray-200 z-40">
        <div className="flex gap-3 items-center">
          <Link
            href="/"
            className="text-white font-bold bg-blue-950 w-9 h-9 flex items-center justify-center text-sm rounded-full hover:bg-blue-800 transition-colors"
          >
            N
          </Link>
          <div>
            <p className="text-sm font-bold text-blue-950 leading-tight">Consorcio Neptuno</p>
            <p className="text-xs text-gray-400">Panel Administrativo</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 pr-3 border-r border-gray-200">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_circle
            </span>
            {usuario?.username}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('isLoggedIn');
              router.replace('/login');
            }}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="px-6 pt-20 pb-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(Object.entries(conteo) as [EstadoLote, number][]).map(([key, n]) => {
            const cfg = ESTADO[key];
            return (
              <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${cfg.bg} rounded-full flex items-center justify-center`}>
                    <span
                      className={`material-symbols-outlined ${cfg.color}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {cfg.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{n}</p>
                    <p className="text-xs text-gray-400">{cfg.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Lista de Lotes</h1>
              <p className="text-xs text-gray-400">{lotes.length} lotes registrados</p>
            </div>
            <button
              onClick={fetchDatos}
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
                  <th className="px-4 py-3 text-left font-semibold">Manzana</th>
                  <th className="px-4 py-3 text-left font-semibold">Lote</th>
                  <th className="px-4 py-3 text-left font-semibold">Área</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lotes.map((lote) => {
                  const est = estadoLote(lote);
                  const cfg = ESTADO[est];
                  const reservacion = lote.reservaciones?.[0];
                  return (
                    <tr key={lote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 text-xs">Mz. {lote.mz}</td>
                      <td className="px-4 py-3 font-bold text-blue-950">Lote {lote.numero}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{lote.area}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                        >
                          <span
                            className="material-symbols-outlined text-xs"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {cfg.icon}
                          </span>
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
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => abrirModal(lote)}
                          className="inline-flex items-center gap-1.5 bg-blue-950 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Estado
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de cambio de estado */}
      {modalLote && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

            {/* Header */}
            <div className="bg-blue-950 px-6 py-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Cambiar estado</p>
                  <h3 className="text-white text-lg font-bold leading-tight">
                    Mz. {modalLote.mz} — Lote {modalLote.numero}
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">{modalLote.area}</p>
                </div>
                <button
                  onClick={cerrarModal}
                  className="text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 mt-0.5"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              {(() => {
                const est = estadoLote(modalLote);
                const cfg = ESTADO[est];
                return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {cfg.icon}
                    </span>
                    Estado actual: {cfg.label}
                  </span>
                );
              })()}
            </div>

            {/* Opciones */}
            <div className="p-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Seleccionar nuevo estado:</p>
              <div className="space-y-2">
                {(Object.entries(ESTADO) as [EstadoLote, EstadoConfig][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setNuevoEstado(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      nuevoEstado === key
                        ? `${cfg.bg} border-current ${cfg.color}`
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${nuevoEstado === key ? cfg.color : 'text-gray-400'}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {cfg.icon}
                    </span>
                    <span className="font-semibold text-sm flex-1">{cfg.label}</span>
                    {nuevoEstado === key && (
                      <span
                        className={`material-symbols-outlined text-base ${cfg.color}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        radio_button_checked
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCambio}
                  disabled={!nuevoEstado || guardando}
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
      )}
    </section>
  );
}
