'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [lotes, setLotes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const fetchDatos = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('lotes')
        .select('*, reservaciones(*)')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) setLotes(data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const sesion = localStorage.getItem("isLoggedIn");
    if (!sesion) {
      router.replace('/login');
      return;
    }
    fetchDatos();
  }, [router]);

  const toggleDisponibilidad = async (id: string | number, estadoActual: boolean) => {
    const { error } = await supabase
      .from('lotes')
      .update({ disponible: !estadoActual, reservado_hasta: null })
      .eq('id', id);

    if (error) alert("Error al cambiar estado.");
    else fetchDatos(); // Recargamos datos limpios
  };

  if (cargando) return <div className="p-10 text-center">Cargando sistema...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Encabezado */}
        <div className="bg-blue-950 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
          </div>
          <button onClick={() => { localStorage.removeItem("isLoggedIn"); router.replace("/login"); }} className="bg-red-600 px-4 py-2 rounded">Cerrar Sesión</button>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Lote</th>
                <th className="p-3">Estado / Reserva</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => (
                <tr key={lote.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">Lote {lote.numero}</td>
                  <td className="p-3">
                    {lote.disponible ? (
                      <span className="text-green-600 font-bold">Disponible</span>
                    ) : (
                      <div className="text-red-600 text-sm">
                        <p>Reservado hasta: {lote.reservado_hasta ? new Date(lote.reservado_hasta).toLocaleString() : 'N/A'}</p>
                        {lote.reservaciones?.length > 0 && (
                          <p className="font-semibold mt-1">
                            Cliente: {lote.reservaciones[0].nombre} ({lote.reservaciones[0].telefono})
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleDisponibilidad(lote.id, lote.disponible)}
                      className={`px-4 py-2 rounded text-white ${lote.disponible ? 'bg-red-600' : 'bg-green-600'}`}
                    >
                      {lote.disponible ? 'Marcar Ocupado' : 'Liberar Lote'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}