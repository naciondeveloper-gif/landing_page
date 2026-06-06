'use client';
import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

type Rol = 'administrador' | 'vendedor';

export default function CrearUsuarioModal({ onClose, onSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [rol, setRol] = useState<Rol>('vendedor');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rol }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Error al crear el usuario.');
        return;
      }

      setExito(true);
      onSuccess?.();
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const ROL_CONFIG: Record<Rol, { label: string; icon: string; desc: string }> = {
    administrador: { label: 'Administrador', icon: 'admin_panel_settings', desc: 'Acceso total: lotes, usuarios y configuración' },
    vendedor:      { label: 'Vendedor',       icon: 'badge',               desc: 'Solo puede gestionar reservas y estados' },
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-950" style={{ fontVariationSettings: "'FILL' 1" }}>
              manage_accounts
            </span>
            <h2 className="font-bold text-blue-950 text-base">Crear Nuevo Usuario</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-5">
          {exito ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">¡Usuario creado!</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{username}</span>{' '}
                  ({ROL_CONFIG[rol].label}) puede iniciar sesión ahora.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-blue-950 hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre de usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="ej. vendedor1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/30 focus:border-blue-950 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rol</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(ROL_CONFIG) as [Rol, typeof ROL_CONFIG[Rol]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRol(key)}
                      className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                        rol === key
                          ? 'border-blue-950 bg-blue-950/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`material-symbols-outlined text-base ${rol === key ? 'text-blue-950' : 'text-gray-400'}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {cfg.icon}
                        </span>
                        <span className={`text-xs font-bold ${rol === key ? 'text-blue-950' : 'text-gray-600'}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-tight">{cfg.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/30 focus:border-blue-950 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-950/30 focus:border-blue-950 transition"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-blue-950 hover:bg-blue-800 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {cargando ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Creando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                      Crear usuario
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
