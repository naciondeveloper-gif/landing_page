'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lote } from '@/types/lote';

export default function AdminPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState(true);

  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .order('numero', { ascending: true });
    
    if (data) setLotes(data);
    setCargando(false);
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const toggleDisponibilidad = async (id: string | number, estadoActual: boolean) => {
    const { error } = await supabase
      .from('lotes')
      .update({ disponible: !estadoActual })
      .eq('id', id);

    if (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al cambiar el estado.");
    } else {
      fetchLotes();
    }
  };

  if (cargando) {
    return <div className="p-10 text-center font-bold text-gray-500">Cargando panel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Cabecera del Panel */}
        <div className="bg-blue-950 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-blue-200 text-sm mt-1">Gestión de disponibilidad de lotes</p>
          </div>
          <div className="bg-blue-900 px-4 py-2 rounded-lg font-semibold">
            Total Lotes: {lotes.filter(l => l.type === 'lote').length}
          </div>
        </div>

        {/* Tabla de Lotes */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600">
                <th className="p-3 font-semibold">Lote</th>
                <th className="p-3 font-semibold">Área</th>
                <th className="p-3 font-semibold">Tipo</th>
                <th className="p-3 font-semibold">Estado Actual</th>
                <th className="p-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => {
                if (lote.type !== 'lote') return null; // Ignoramos parques o áreas comunes
                
                return (
                  <tr key={lote.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-bold text-gray-800">Lote {lote.numero}</td>
                    <td className="p-3 text-gray-600">{lote.area}</td>
                    <td className="p-3 text-gray-500 capitalize">{lote.type}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        lote.disponible 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {lote.disponible ? 'Disponible' : 'Vendido / Reservado'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleDisponibilidad(lote.id, lote.disponible)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors shadow-sm ${
                          lote.disponible 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Marcar como {lote.disponible ? 'Ocupado' : 'Disponible'}
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
  );
}