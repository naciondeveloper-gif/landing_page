'use client';
import { useState } from 'react';

export default function LoteMap() {
  const [modalType, setModalType] = useState<null | 'contact' | 'unavailable'>(null);
  const lote = {
    id: "path1",
    disponible: true
  };

  const handleLoteClick = () => {
    if (lote.disponible) {
      setModalType('contact');
    } else {
      setModalType('unavailable');
    }
  };

  return (
    <>
      <svg viewBox="0 0 3178.88 4460.16" className="w-full h-auto">
        <path
          style={{ 
            fill: lote.disponible ? '#e8eb14' : '#ff0000',
            fillOpacity: 0.2, 
            cursor: 'pointer' 
          }}
          d="m 387.74068,815.78415 163.52743,-53.73705 17.14027,71.80382 -166.30693,32.89079 z"
          id={lote.id}
          onClick={handleLoteClick}
          onMouseEnter={(e) => e.currentTarget.style.fillOpacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.fillOpacity = '0.2'}
        />
      </svg>
      {modalType === 'contact' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">¡Lote Disponible!</h2>
            <p className="mb-6">Completa tus datos para más información.</p>
            {/* Aquí iría tu formulario */}
            <button onClick={() => setModalType(null)} className="text-sm text-gray-500">Cerrar</button>
          </div>
        </div>
      )}
      {modalType === 'unavailable' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">¡Ups!</h2>
            <p>Este lote ya se encuentra reservado.</p>
            <button onClick={() => setModalType(null)} className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg">Aceptar</button>
          </div>
        </div>
      )}
    </>
  );
}