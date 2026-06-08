'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Lote, EstadoLote } from '@/types/lote';
import type { CompradorData } from '../components/EstadoModal';

function estadoLote(lote: Lote): EstadoLote {
  return lote.estado ?? (lote.disponible ? 'disponible' : 'separado');
}

export function useAdminLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState(true);

  const fetchDatos = async (showLoading = true) => {
    if (showLoading) setCargando(true);
    try {
      const { data, error } = await supabase
        .from('lotes')
        .select('*, reservaciones(*)')
        .eq('type', 'lote')
        .order('mz', { ascending: true })
        .order('numero', { ascending: true });

      if (error) throw error;
      if (data) setLotes(data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      if (showLoading) setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
    const interval = setInterval(() => fetchDatos(false), 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiarEstado = async (lote: Lote, nuevoEstado: EstadoLote, comprador?: CompradorData) => {
    if (nuevoEstado === 'disponible') {
      // Disponible: sin datos de comprador, actualizar directo
      const { error } = await supabase
        .from('lotes')
        .update({ estado: 'disponible', disponible: true, reservado_hasta: null })
        .eq('id', lote.id);

      if (error) throw error;

      await supabase.from('reservaciones').delete().eq('lote_id', lote.id);
    } else {
      // Separado / Vendido: llamar API de admin (valida sesión, crea reservación, envía correo)
      const res = await fetch('/api/admin/lotes/estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loteId: lote.id,
          nuevoEstado,
          comprador: comprador
            ? {
                nombre:   comprador.nombre,
                telefono: comprador.telefono,
                correo:   comprador.correo   || undefined,
                mensaje:  comprador.mensaje  || undefined,
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al cambiar estado');
      }
    }

    await fetchDatos();
  };

  const conteo: Record<EstadoLote, number> = {
    disponible: lotes.filter(l => estadoLote(l) === 'disponible').length,
    separado:   lotes.filter(l => estadoLote(l) === 'separado').length,
    vendido:    lotes.filter(l => estadoLote(l) === 'vendido').length,
  };

  return { lotes, cargando, conteo, fetchDatos, cambiarEstado };
}
