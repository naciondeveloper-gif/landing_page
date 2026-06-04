'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Modal from './Modal';
import { AnimatePresence } from 'framer-motion';
import { Lote } from '@/types/lote';

export default function MapaBase() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [hoveredLote, setHoveredLote] = useState<Lote | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  async function cargarMapa() {
    const ahora = new Date().toISOString();
    await supabase
      .from('lotes')
      .update({ disponible: true, estado: 'disponible', reservado_hasta: null })
      .lt('reservado_hasta', ahora);

    const { data, error } = await supabase.from('lotes').select('*');
    if (error) console.error("Error:", error);
    else setLotes(data || []);
  }

  useEffect(() => {
    cargarMapa();
  }, []);

  return (
    <div className="relative w-full">
      <Image src="/plano.jpg" alt="Plano" width={3178} height={4460} className="w-full h-auto" priority />
      
      <svg 
        viewBox="0 0 3178.88 4460.16" 
        className="absolute top-0 left-0 w-full h-full"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {lotes.map((lote: Lote) => (
          <path
            key={lote.id}
            d={lote.d}
            className="cursor-pointer transition-all"
            style={{ 
              fill: lote.type === "lote" ? (lote.disponible ? '#e8eb1400' : '#0046DE') : "#ffffff", 
              fillOpacity: lote.type === "lote" ? (hoveredLote?.id === lote.id ? 0.6 : 0.7) : 0
            }}
            onMouseEnter={() => setHoveredLote(lote)}
            onMouseLeave={() => setHoveredLote(null)}
            onClick={() => lote.disponible && setSelectedLote(lote)}
          />
        ))}
      </svg>

      {hoveredLote && (
        <div className="fixed z-50 bg-blue-950 text-white px-4 py-2 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-12" style={{ left: mousePos.x, top: mousePos.y }}>
          <p className="text-white/60 text-xs">Mz. {hoveredLote.mz}</p>
          <p className="font-bold text-sm">Lote {hoveredLote.numero}</p>
          <p className="text-amber-400 text-xs">{hoveredLote.area}</p>
        </div>
      )}

      <AnimatePresence>
        {selectedLote && (
          <Modal 
            isOpen={true} 
            lote={selectedLote} 
            onClose={() => { setSelectedLote(null); cargarMapa(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}