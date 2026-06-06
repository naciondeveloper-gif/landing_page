import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase/client';

interface Usuario {
  id: string | number;
  username: string;
  password: string;
  rol: string; // ✅ Sin ? - requerido
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id, username, password, rol')
      .eq('username', username)
      .limit(1);

    if (error) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('usuarios')
        .select('id, username, password')
        .eq('username', username)
        .limit(1);

      if (fallbackError || !fallbackData || fallbackData.length === 0) {
        return NextResponse.json({ error: 'El usuario no existe' }, { status: 404 });
      }

      usuarios = fallbackData.map((user) => ({
        ...user,
        rol: 'administrador',
      }));
    }

    if (!usuarios || usuarios.length === 0) {
      return NextResponse.json({ error: 'El usuario no existe' }, { status: 404 });
    }

    const userAdmin = usuarios[0];
    const passwordMatches = await bcrypt.compare(password, userAdmin.password || '');

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const response = NextResponse.json(
      {
        mensaje: 'Autenticación correcta',
        usuario: { 
          id: userAdmin.id, 
          username: userAdmin.username, 
          rol: userAdmin.rol 
        },
      },
      { status: 200 }
    );

    response.cookies.set('session', String(userAdmin.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ mensaje: 'Error en el servidor' }, { status: 500 });
  }
}