import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { sendMail } from "@/lib/mail/transport";
import { reservaAdminHtml, reservaClienteHtml, reservaText } from "@/lib/mail/templates/reserva";
import type { ReservaEmailData } from "@/lib/mail/templates/reserva";

export async function POST(request: Request) {
  try {
    const { loteId, nombre, telefono, correo, mensaje } = await request.json();

    const { data: loteData } = await supabase
      .from('lotes')
      .select('mz, numero, area')
      .eq('id', loteId)
      .limit(1);

    const lote = loteData?.[0];

    const { error: errorReserva } = await supabase
      .from('reservaciones')
      .insert({ lote_id: loteId, nombre, telefono, correo, mensaje });

    if (errorReserva) throw errorReserva;

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 24);

    const { error: errorLote } = await supabase
      .from('lotes')
      .update({ disponible: false, estado: 'separado', reservado_hasta: expireDate.toISOString() })
      .eq('id', loteId);

    if (errorLote) throw errorLote;

    const emailData: ReservaEmailData = {
      loteId,
      mz: lote?.mz,
      numero: lote?.numero,
      area: lote?.area,
      nombre,
      telefono,
      correo,
      mensaje,
    };

    const loteLabel = `Mz. ${lote?.mz ?? ''} Lote ${lote?.numero ?? loteId}`;

    const envios = [
      sendMail({
        subject: `Nueva reserva — ${loteLabel}`,
        text: reservaText(emailData, 'reserva'),
        html: reservaAdminHtml(emailData, 'reserva'),
      }),
    ];

    if (correo?.trim()) {
      envios.push(sendMail({
        to: correo.trim(),
        subject: `Tu separación fue registrada — ${loteLabel}`,
        text: `Hola ${nombre}, hemos recibido tu solicitud. Nos pondremos en contacto pronto.`,
        html: reservaClienteHtml(emailData),
      }));
    }

    const resultados = await Promise.allSettled(envios);
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[correo ${i === 0 ? 'admin' : 'cliente'}]`, r.reason);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al registrar la reserva" }, { status: 500 });
  }
}
