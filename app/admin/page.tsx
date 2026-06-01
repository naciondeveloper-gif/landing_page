'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lote } from '@/types/lote';
import Link from 'next/link';

export default function AdminPage() {
  const [usuario, setUsuario] = useState<{username: string} | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('lotes')
        .select('*, reservaciones(*)')
        .eq('type', 'lote')
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
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userStorage = localStorage.getItem("user");

      if (!isLoggedIn) {
        router.replace('/login');
        return;
      }
      if (userStorage) {
        try {
          setUsuario(JSON.parse(userStorage));
        } catch (e) {
          console.error("Error al parsear el usuario:", e);
        }
      }
      fetchDatos();
    };
    checkAuth();
  }, [router]);

  const toggleDisponibilidad = async (id: string | number, estadoActual: boolean) => {
    const { error } = await supabase
      .from('lotes')
      .update({ disponible: !estadoActual, reservado_hasta: null })
      .eq('id', id);

    if (error) alert("Error al cambiar estado.");
    else fetchDatos();
  };

  if (cargando) return <div className="p-10 text-center">Cargando sistema...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error al cargar datos: {error}</div>;

  return (
    <section className="min-h-screen bg-gray-50">
      <div className='w-full bg-mist-100 text-gray-800 font-medium fixed top-0 h-12 flex p-2 justify-between items-center drop-shadow-2xl'>
        <div className='flex gap-2 items-center'>
          <Link href={"/"} className=' text-white font-bold bg-blue-900 p-2 text-sm w-9 text-center rounded-full'>N</Link>
          <h1 className="text-md font-bold">Consorcio Neptuno</h1>
        </div>
        <div className='flex gap-2 items-center'>
          <span className='text-md pr-1 border-r border-gray-300'>Bienvenido {usuario?.username}</span>
          <button onClick={() => {localStorage.removeItem("user"); localStorage.removeItem("isLoggedIn"); router.replace("/login"); }} className="bg-red-500 px-2 py-2 rounded-md text-xs text-white cursor-pointer ml-1">Cerrar Sesión
          </button>
        </div>
      </div>
      <div className='m-8 mt-20'>
        <div className='mb-5 font-bold text-2xl'>Lista de Lotes</div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden ">
          <div className="overflow-x-auto p-6">
            <table className="w-full text-center border-collapse  text-xs">
              <thead>
                <tr className="border-b border-gray-300  text-gray-600">
                  <th className="p-3">Manzana</th>
                  <th className="p-3">Lote</th>
                  <th className="p-3">Área</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((lote) => (
                  <tr key={lote.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-1 text-nowrap">Mz. {lote.mz}</td>   
                    <td className="p-1 text-nowrap">Lote {lote.numero}</td>   
                    <td className="p-1 text-nowrap">{lote.area}</td>    
                    <td className="p-1 text-nowrap">{lote.type.toUpperCase()}</td>   
                    <td className="p-1">
                      {lote.disponible ? (
                        <span className="text-green-600 font-bold">Disponible</span>
                      ) : (
                        <div className="text-red-600 text-sm">
                          <p>Reservado hasta: {lote.reservado_hasta ? new Date(lote.reservado_hasta).toLocaleString() : 'N/A'}</p>
                          {lote.reservaciones && lote.reservaciones.length > 0 && (
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
                        {lote.disponible ? 'Separar' : 'Liberar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}