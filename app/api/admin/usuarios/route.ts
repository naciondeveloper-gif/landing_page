import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getAdminSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, username, rol')
      .order('id', { ascending: true });

    if (error) return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });

    return NextResponse.json({ usuarios: data });
  } catch (err) {
    console.error('[GET /api/admin/usuarios]', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await request.json();

    if (String(id) === admin.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
    }

    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });

    return NextResponse.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    console.error('[DELETE /api/admin/usuarios]', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
