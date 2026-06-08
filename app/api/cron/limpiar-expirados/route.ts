import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Release lots whose reservation window has expired
  const { data: lotesExpirados, error: errorLotes } = await supabase
    .from('lotes')
    .update({ disponible: true, estado: 'disponible', reservado_hasta: null })
    .lt('reservado_hasta', new Date().toISOString())
    .eq('estado', 'separado')
    .select('id');

  if (errorLotes) {
    console.error('[cron] Error actualizando lotes:', errorLotes.message);
    return NextResponse.json({ error: 'Error al limpiar lotes' }, { status: 500 });
  }

  const ids = lotesExpirados?.map(l => l.id) ?? [];

  if (ids.length > 0) {
    await supabase.from('reservaciones').delete().in('lote_id', ids);
  }

  console.log(`[cron] Lotes liberados: ${ids.length}`);
  return NextResponse.json({ liberados: ids.length, ids });
}
