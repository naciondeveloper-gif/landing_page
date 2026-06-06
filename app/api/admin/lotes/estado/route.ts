import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';
import { sendMail } from '@/lib/mail/transport';
import { reservaAdminHtml, reservaClienteHtml, reservaText } from '@/lib/mail/templates/reserva';
import type { ReservaEmailData, TipoEvento } from '@/lib/mail/templates/reserva';
import type { EstadoLote } from '@/types/lote';

interface CompradaorBody {
  nombre: string;
  telefono: string;
  correo?: string;
  mensaje?: string;
}

async function getAdminSession(): Promise<{ id: string; username: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session?.value) return null;

  const { data } = await supabase
    .from('usuarios')
    .select('id, username, rol')
    .eq('id', session.value)
    .limit(1);

  const user = data?.[0];
  if (!user || user.rol !== 'administrador') return null;
  return { id: String(user.id), username: user.username };
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json() as {
    loteId: string | number;
    nuevoEstado: EstadoLote;
    comprador?: CompradaorBody;
  };

  const { loteId, nuevoEstado, comprador } = body;

  if (!loteId || !nuevoEstado) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  if ((nuevoEstado === 'separado' || nuevoEstado === 'vendido') && !comprador?.nombre) {
    return NextResponse.json({ error: 'Se requieren los datos del comprador' }, { status: 400 });
  }

  // Obtener info del lote para el correo
  const { data: loteData } = await supabase
    .from('lotes')
    .select('mz, numero, area')
    .eq('id', loteId)
    .limit(1);

  const lote = loteData?.[0];

  // Calcular updates del lote
  const updates: Record<string, unknown> = {
    estado: nuevoEstado,
    disponible: nuevoEstado === 'disponible',
    reservado_hasta: null,
  };

  if (nuevoEstado === 'separado') {
    const exp = new Date();
    exp.setHours(exp.getHours() + 24);
    updates.reservado_hasta = exp.toISOString();
  }

  const { error: errorLote } = await supabase
    .from('lotes')
    .update(updates)
    .eq('id', loteId);

  if (errorLote) {
    return NextResponse.json({ error: 'Error al actualizar el lote' }, { status: 500 });
  }

  // Manejar reservaciones
  if (nuevoEstado === 'disponible') {
    await supabase.from('reservaciones').delete().eq('lote_id', loteId);
  } else if (comprador && (nuevoEstado === 'separado' || nuevoEstado === 'vendido')) {
    // Limpiar reservaciones anteriores e insertar la del comprador actual
    await supabase.from('reservaciones').delete().eq('lote_id', loteId);
    await supabase.from('reservaciones').insert({
      lote_id: loteId,
      nombre: comprador.nombre,
      telefono: comprador.telefono,
      correo: comprador.correo ?? null,
      mensaje: comprador.mensaje ?? null,
    });

    // Enviar correos
    const emailData: ReservaEmailData = {
      loteId,
      mz: lote?.mz,
      numero: lote?.numero,
      area: lote?.area,
      nombre: comprador.nombre,
      telefono: comprador.telefono,
      correo: comprador.correo,
      mensaje: comprador.mensaje,
      adminUser: admin.username,
    };

    const tipoEvento: TipoEvento = nuevoEstado === 'vendido' ? 'vendido' : 'separado';
    const loteLabel = lote ? `Mz. ${lote.mz} Lote ${lote.numero}` : `ID ${loteId}`;

    const envios = [
      sendMail({
        subject: `${tipoEvento === 'vendido' ? 'Venta' : 'Separación'} registrada — ${loteLabel}`,
        text: reservaText(emailData, tipoEvento),
        html: reservaAdminHtml(emailData, tipoEvento),
      }),
    ];

    if (comprador.correo?.trim()) {
      envios.push(sendMail({
        to: comprador.correo.trim(),
        subject: tipoEvento === 'vendido'
          ? `¡Tu compra fue registrada! — ${loteLabel}`
          : `Tu separación fue registrada — ${loteLabel}`,
        text: `Hola ${comprador.nombre}, tu operación fue registrada. Nos pondremos en contacto pronto.`,
        html: reservaClienteHtml(emailData),
      }));
    }

    const resultados = await Promise.allSettled(envios);
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[correo ${i === 0 ? 'admin' : 'cliente'}]`, r.reason);
    });
  }

  return NextResponse.json({ success: true });
}
