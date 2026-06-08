import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { sendMail } from "@/lib/mail/transport";
import { reservaAdminHtml, reservaClienteHtml, reservaText } from "@/lib/mail/templates/reserva";
import type { ReservaEmailData } from "@/lib/mail/templates/reserva";
import { sanitizeEmail } from "@/lib/utils/sanitize";

export async function POST(request: Request) {
  try {
    const { loteId, nombre, telefono, correo, mensaje } = await request.json();

    if (!loteId || !nombre?.trim() || !telefono?.trim()) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Validate email if provided — reject CRLF injection attempts
    const correoSeguro = correo?.trim() ? sanitizeEmail(correo) : null;
    if (correo?.trim() && correoSeguro === null) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const { data: loteData } = await supabase
      .from('lotes')
      .select('mz, numero, area, precio')
      .eq('id', loteId)
      .limit(1);

    const lote = loteData?.[0];

    // Atomic lock: only update if the lot is still available.
    // If another request reserved it between now and this update, count will be 0.
    const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { data: updated, error: errorLote } = await supabase
      .from('lotes')
      .update({ disponible: false, estado: 'separado', reservado_hasta: expireDate.toISOString() })
      .eq('id', loteId)
      .eq('disponible', true)
      .select('id');

    if (errorLote) throw errorLote;

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Este lote ya no está disponible" }, { status: 409 });
    }

    const { error: errorReserva } = await supabase
      .from('reservaciones')
      .insert({ lote_id: loteId, nombre: nombre.trim(), telefono: telefono.trim(), correo: correoSeguro, mensaje: mensaje?.trim() || null });

    if (errorReserva) throw errorReserva;

    const emailData: ReservaEmailData = {
      loteId,
      mz: lote?.mz,
      numero: lote?.numero,
      area: lote?.area,
      precio: lote?.precio != null ? `S/. ${Number(lote.precio).toLocaleString('es-PE')}` : undefined,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      correo: correoSeguro ?? undefined,
      mensaje: mensaje?.trim() || undefined,
      fechaRegistro: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const loteLabel = `Mz. ${lote?.mz ?? ''} Lote ${lote?.numero ?? loteId}`;

    const envios = [
      sendMail({
        subject: `Nueva reserva — ${loteLabel}`,
        text: reservaText(emailData, 'reserva'),
        html: reservaAdminHtml(emailData, 'reserva'),
      }),
    ];

    if (correoSeguro) {
      envios.push(sendMail({
        to: correoSeguro,
        subject: `Tu separación fue registrada — ${loteLabel}`,
        text: `Hola ${nombre.trim()}, hemos recibido tu solicitud. Nos pondremos en contacto pronto.`,
        html: reservaClienteHtml(emailData),
      }));
    }

    const resultados = await Promise.allSettled(envios);
    const adminEmailFailed = resultados[0].status === 'rejected';
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[correo ${i === 0 ? 'admin' : 'cliente'}]`, r.reason);
    });

    return NextResponse.json({
      success: true,
      ...(adminEmailFailed && { warning: 'Reserva registrada pero el correo de notificación no se pudo enviar.' }),
    });
  } catch (error) {
    console.error('[reserve]', error);
    return NextResponse.json({ error: "Error al registrar la reserva" }, { status: 500 });
  }
}
