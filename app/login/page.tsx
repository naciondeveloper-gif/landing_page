"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validar = (): string | null => {
    if (!username.trim()) return "El usuario es requerido.";
    if (!password) return "La contraseña es requerida.";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) { setError(errorValidacion); return; }

    setCargando(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.usuario));
        localStorage.setItem("isLoggedIn", "true");
        router.push("/admin");
      } else {
        setError(data.error || "Credenciales inválidas. Verifica tu usuario y contraseña.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <span
              className="material-symbols-outlined text-amber-400 text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>
          </div>
          <h1 className="text-white text-xl font-bold">Consorcio Neptuno</h1>
          <p className="text-white/50 text-sm mt-1">Panel Administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-800 text-xl font-bold mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {/* Usuario */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl pointer-events-none">
                  person
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl pointer-events-none">
                  lock
                </span>
                <input
                  type={verPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-xl">
                    {verPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                <span
                  className="material-symbols-outlined text-base shrink-0 mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  error
                </span>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-950 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              {cargando ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  Verificando...
                </>
              ) : (
                <>
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    login
                  </span>
                  Ingresar al sistema
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-white/30 text-xs text-center mt-6">
          Acceso exclusivo para administradores autorizados
        </p>
      </div>
    </div>
  );
}
