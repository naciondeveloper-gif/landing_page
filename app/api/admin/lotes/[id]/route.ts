import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getAdminSession } from '@/lib/auth/session';

interface PatchBody {
  mz?: string;
  numero?: string | number;
  area?: string;
  precio?: number;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID de lote requerido' }, { status: 400 });
    }

    const body = await request.json() as PatchBody;
    const { mz, numero, area, precio } = body;

    if (!mz?.trim() || !numero || !area?.trim() || precio == null) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const precioNum = Number(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }

    const { error } = await supabase
      .from('lotes')
      .update({
        mz: mz.trim().toUpperCase(),
        numero: String(numero).trim(),
        area: area.trim(),
        precio: precioNum,
      })
      .eq('id', id);

    if (error) {
      console.error('[PATCH lotes/[id]]', error);
      return NextResponse.json({ error: 'Error al actualizar el lote' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH lotes/[id]]', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
