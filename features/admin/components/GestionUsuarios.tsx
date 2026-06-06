'use client';
import { useState, useEffect } from 'react';

type Rol = 'administrador' | 'vendedor';

interface Usuario {
  id: string | number;
  username: string;
  rol: Rol;
}

const ROL_BADGE: Record<Rol, { label: string; bg: string; color: string; icon: string }> = {
  administrador: { label: 'Administrador', bg: 'bg-blue-100',  color: 'text-blue-800',  icon: 'admin_panel_settings' },
  vendedor:      { label: 'Vendedor',      bg: 'bg-green-100', color: 'text-green-800', icon: 'badge' },
};

interface Props {
  usuarioActual: { username: string; rol: string } | null;
  onCrearUsuario: () => void;
  refreshKey?: number;
}

export default function GestionUsuarios({ usuarioActual, onCrearUsuario, refreshKey }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | number | null>(null);
  const [confirmarId, setConfirmarId] = useState<string | number | null>(null);

  const fetchUsuarios = async () => {
    setCargando(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/usuarios');
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? `Error ${res.status}`);
        return;
      }
      setUsuarios(data.usuarios ?? []);
    } catch {
      setErrorMsg('Error de conexión al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, [refreshKey]);

  const eliminar = async (id: string | number) => {
    setEliminandoId(id);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? 'Error al eliminar');
        return;
      }
      await fetchUsuarios();
    } catch {
      alert('Error de conexión');
    } finally {
      setEliminandoId(null);
      setConfirmarId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-xs text-gray-400">{usuarios.length} usuarios registrados</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchUsuarios}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Actualizar
          </button>
          <button
            onClick={onCrearUsuario}
            className="flex items-center gap-1.5 bg-blue-950 hover:bg-blue-800 px-3 py-1.5 rounded-lg text-xs text-white font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
            Nuevo usuario
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {cargando ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            Cargando usuarios...
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="material-symbols-outlined text-3xl text-red-400">error</span>
            <p className="text-sm text-red-600 font-semibold">{errorMsg}</p>
            <button
              onClick={fetchUsuarios}
              className="text-xs text-blue-600 hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold">Usuario</th>
                <th className="px-4 py-3 text-left font-semibold">Rol</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map(u => {
                  const cfg = ROL_BADGE[u.rol] ?? ROL_BADGE.vendedor;
                  const esMiCuenta = u.username === usuarioActual?.username;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-950 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                            {u.username[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{u.username}</p>
                            {esMiCuenta && (
                              <p className="text-xs text-blue-500">Tú</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {cfg.icon}
                          </span>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {confirmarId === u.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-gray-500">¿Confirmar?</span>
                            <button
                              onClick={() => eliminar(u.id)}
                              disabled={eliminandoId === u.id}
                              className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg font-semibold transition-colors disabled:opacity-60"
                            >
                              {eliminandoId === u.id ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                            <button
                              onClick={() => setConfirmarId(null)}
                              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmarId(u.id)}
                            disabled={esMiCuenta}
                            title={esMiCuenta ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
