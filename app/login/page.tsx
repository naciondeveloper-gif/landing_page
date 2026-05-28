"use client"
import { use, useState } from "react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault();
        setMensaje("Conectando");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {"Content-Type": "apliccation/json"},
                body: JSON.stringify({username, password})
            });

            const request = await res.json();

            if(res.ok) {
                setMensaje("Con acceso")
            } else {
                setMensaje("No se pudo ingresar")
            }
        } catch (error) {
            setMensaje("Error con el servidor")
        }
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Acceso Administrativo
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div>
                <input
                type="text"
                value={username}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Usuario"
                onChange={(e) => setUsername(e.target.value)}
                required
                />
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
                value={password}
              type="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mensaje && (
            <p>
                {mensaje}
            </p>
          )}
          
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}