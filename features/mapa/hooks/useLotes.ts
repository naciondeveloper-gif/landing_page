'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Lote } from '@/types/lote';

export function useLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);

  async function recargar() {
    const ahora = new Date().toISOString();
    await supabase
      .from('lotes')
      .update({ disponible: true, estado: 'disponible', reservado_hasta: null })
      .lt('reservado_hasta', ahora);

    const { data, error } = await supabase.from('lotes').select('*');
    if (error) console.error('Error cargando lotes:', error);
    else setLotes(data || []);
  }

  useEffect(() => { recargar(); }, []);

  return { lotes, recargar };
}
