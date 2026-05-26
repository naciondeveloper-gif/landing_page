'use client';
import { useState } from 'react';
import { LOTES } from '@/data/lotes';
import Modal from './Modal';

export default function MapaBase() {
  const [selectedLote, setSelectedLote] = useState<any>(null);
  
  const [hoveredLote, setHoveredLote] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative w-full">
      <img src="plano.jpg" className="w-full" alt="Plano" />
      
      <svg 
        viewBox="0 0 3178.88 4460.16" 
        className="absolute top-0 left-0 w-full h-full"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {LOTES.map((lote) => (
          <path
            key={lote.id}
            d={lote.d}
            className="cursor-pointer transition-all"
            style={{ 
              fill: lote.disponible ? '#e8eb14' : '#ff0000', 
              fillOpacity: hoveredLote?.id === lote.id ? 0.9 : 0.3 
            }}
            onMouseEnter={() => setHoveredLote(lote)}
            onMouseLeave={() => setHoveredLote(null)}
            onClick={() => setSelectedLote(lote)}
          />
        ))}
      </svg> 

      {hoveredLote && (
        <div 
          className="fixed z-50 bg-blue-950 text-white px-4 py-2 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-12"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <p className="font-bold text-sm">Lote {hoveredLote.numero}</p>
          <p className="text-amber-400 text-xs">{hoveredLote.area}</p>
        </div>
      )}

      <Modal 
        isOpen={!!selectedLote} 
        lote={selectedLote || {}} 
        onClose={() => setSelectedLote(null)} 
      />
    </div>
  );
}