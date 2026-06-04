import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { loteId, nombre, telefono, correo, mensaje } = await request.json();

    const { error: errorReserva } = await supabase
      .from('reservaciones')
      .insert({ lote_id: loteId, nombre, telefono, correo, mensaje });

    if (errorReserva) throw errorReserva;

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 19);

    const { error: errorLote } = await supabase
      .from('lotes')
      .update({ disponible: false, estado: 'separado', reservado_hasta: expireDate.toISOString() })
      .eq('id', loteId);

    if (errorLote) throw errorLote;

    try {
      await sendMail({
        subject: 'Nueva reserva de lote',
        text: `Se ha registrado una nueva reserva de lote.

          Lote ID: ${loteId}
          Nombre: ${nombre}
          Teléfono: ${telefono}
          Correo: ${correo || 'No proporcionado'}
          Mensaje: ${mensaje || 'Ninguno'}`,
      });
    } catch (emailError) {
      console.error('Error enviando email de notificación:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}