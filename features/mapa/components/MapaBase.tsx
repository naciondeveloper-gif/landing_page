'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useLotes } from '@/features/mapa/hooks/useLotes';
import ReservaModal from './ReservaModal';
import { AnimatePresence } from 'framer-motion';
import type { Lote } from '@/types/lote';


export default function MapaBase() {
  const { lotes, recargar } = useLotes();
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [hoveredLote, setHoveredLote] = useState<Lote | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative w-full">
      <Image src="/plano.jpg" alt="Plano" width={1588} height={2245.3333} className="w-full h-auto" priority />

      <svg
        viewBox="0 0 1588 2245.3333"
        className="absolute top-0 left-0 w-full h-full"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <g>
          {lotes.map((lote: Lote) => (
            <path
              key={lote.id}
              d={lote.d}
              className="cursor-pointer transition-all"
              style={{
                fill: lote.type === 'lote' ? (lote.disponible ? '#e8eb1400' : '#0046DE') : '#ffffff',
                fillOpacity: lote.type === 'lote' ? (hoveredLote?.id === lote.id ? 0.6 : 0.7) : 1,
              }}
              transform='matrix(0,-0.16,-0.16,0,1588,2245.3333)'
              onMouseEnter={() => setHoveredLote(lote)}
              onMouseLeave={() => setHoveredLote(null)}
              onClick={() => lote.disponible && setSelectedLote(lote)}
            />
          ))}
        </g>
      </svg>

      {hoveredLote && (
        <div
          className="fixed z-50 bg-blue-950 text-white px-4 py-2 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-12"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <p className="text-white/60 text-xs">Mz. {hoveredLote.mz}</p>
          <p className="font-bold text-sm">Lote {hoveredLote.numero}</p>
          <p className="text-amber-400 text-xs">{hoveredLote.area}</p>
        </div>
      )}

      <AnimatePresence>
        {selectedLote && (
          <ReservaModal
            isOpen={true}
            lote={selectedLote}
            onClose={() => { setSelectedLote(null); recargar(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
