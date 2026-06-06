import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';

async function verificarAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session?.value) return false;

  const { data, error } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', session.value)
    .limit(1);

  if (error) console.error('[verificarAdmin] Supabase error:', error.message);

  return data?.[0]?.rol === 'administrador';
}

export async function GET() {
  if (!(await verificarAdmin())) {
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
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!(await verificarAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await request.json();

  if (String(id) === String(session?.value)) {
    return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
  }

  const { error } = await supabase.from('usuarios').delete().eq('id', id);
  if (error) return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });

  return NextResponse.json({ mensaje: 'Usuario eliminado' });
}
