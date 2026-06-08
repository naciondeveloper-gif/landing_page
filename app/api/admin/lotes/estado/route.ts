import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { sendMail } from '@/lib/mail/transport';
import { reservaAdminHtml, reservaClienteHtml, reservaText } from '@/lib/mail/templates/reserva';
import type { ReservaEmailData, TipoEvento } from '@/lib/mail/templates/reserva';
import type { EstadoLote } from '@/types/lote';
import { getAdminSession } from '@/lib/auth/session';
import { sanitizeEmail } from '@/lib/utils/sanitize';

interface CompradorBody {
  nombre: string;
  telefono: string;
  correo?: string;
  mensaje?: string;
}

export async function POST(request: Request) {
  try {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json() as {
    loteId: string | number;
    nuevoEstado: EstadoLote;
    comprador?: CompradorBody;
  };

  const { loteId, nuevoEstado, comprador } = body;

  if (!loteId || !nuevoEstado) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  if ((nuevoEstado === 'separado' || nuevoEstado === 'vendido') && !comprador?.nombre) {
    return NextResponse.json({ error: 'Se requieren los datos del comprador' }, { status: 400 });
  }

  // Validate email if provided
  let correoSeguro: string | null = null;
  if (comprador?.correo?.trim()) {
    correoSeguro = sanitizeEmail(comprador.correo);
    if (correoSeguro === null) {
      return NextResponse.json({ error: 'Correo del comprador inválido' }, { status: 400 });
    }
  }

  const { data: loteData } = await supabase
    .from('lotes')
    .select('mz, numero, area, precio')
    .eq('id', loteId)
    .limit(1);

  const lote = loteData?.[0];

  const updates: Record<string, unknown> = {
    estado: nuevoEstado,
    disponible: nuevoEstado === 'disponible',
    reservado_hasta: null,
  };

  const { error: errorLote } = await supabase
    .from('lotes')
    .update(updates)
    .eq('id', loteId);

  if (errorLote) {
    return NextResponse.json({ error: 'Error al actualizar el lote' }, { status: 500 });
  }

  if (nuevoEstado === 'disponible') {
    await supabase.from('reservaciones').delete().eq('lote_id', loteId);
  } else if (comprador && (nuevoEstado === 'separado' || nuevoEstado === 'vendido')) {
    await supabase.from('reservaciones').delete().eq('lote_id', loteId);
    await supabase.from('reservaciones').insert({
      lote_id: loteId,
      nombre: comprador.nombre.trim(),
      telefono: comprador.telefono.trim(),
      correo: correoSeguro,
      mensaje: comprador.mensaje?.trim() || null,
    });

    const emailData: ReservaEmailData = {
      loteId,
      mz: lote?.mz,
      numero: lote?.numero,
      area: lote?.area,
      precio: lote?.precio != null ? `S/. ${Number(lote.precio).toLocaleString('es-PE')}` : undefined,
      nombre: comprador.nombre.trim(),
      telefono: comprador.telefono.trim(),
      correo: correoSeguro ?? undefined,
      mensaje: comprador.mensaje?.trim() || undefined,
      adminUser: admin.username,
      fechaRegistro: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
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

    if (correoSeguro) {
      envios.push(sendMail({
        to: correoSeguro,
        subject: tipoEvento === 'vendido'
          ? `¡Tu compra fue registrada! — ${loteLabel}`
          : `Tu separación fue registrada — ${loteLabel}`,
        text: `Hola ${comprador.nombre.trim()}, tu operación fue registrada. Nos pondremos en contacto pronto.`,
        html: reservaClienteHtml(emailData),
      }));
    }

    const resultados = await Promise.allSettled(envios);
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[correo ${i === 0 ? 'admin' : 'cliente'}]`, r.reason);
    });
  }

  return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/admin/lotes/estado]', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
