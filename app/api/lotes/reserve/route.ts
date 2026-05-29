import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { loteId, nombre, telefono, correo, mensaje } = await request.json();

    const { error: errorReserva } = await supabase
      .from('reservaciones')
      .insert({ lote_id: loteId, nombre, telefono, correo, mensaje });

    if (errorReserva) throw errorReserva;

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 19);

    await supabase
      .from('lotes')
      .update({ disponible: false, reservado_hasta: expireDate.toISOString() })
      .eq('id', loteId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}