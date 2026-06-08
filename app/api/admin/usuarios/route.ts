import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getAdminSession } from '@/lib/auth/session';

export async function GET() {
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
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await request.json();

  // Prevent self-deletion by comparing user IDs (not session tokens)
  if (String(id) === admin.id) {
    return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
  }

  const { error } = await supabase.from('usuarios').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });

  return NextResponse.json({ mensaje: 'Usuario eliminado' });
}
