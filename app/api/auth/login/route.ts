import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase/client';
import { checkRateLimit } from '@/lib/utils/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed, retryAfter } = checkRateLimit(`login:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Credenciales requeridas' }, { status: 400 });
    }

    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id, username, password, rol')
      .eq('username', username)
      .limit(1);

    if (error) throw error;

    const userAdmin = usuarios?.[0];
    // Always run bcrypt to prevent timing attacks revealing valid usernames
    const passwordMatches = userAdmin
      ? await bcrypt.compare(password, userAdmin.password || '')
      : await bcrypt.compare(password, '$2b$12$invalidhashpaddinginvalidhash00');

    if (!userAdmin || !passwordMatches || userAdmin.rol !== 'administrador') {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({ id: sessionId, user_id: Number(userAdmin.id), expires_at: expiresAt.toISOString() });

    if (sessionError) throw sessionError;

    const response = NextResponse.json(
      { mensaje: 'Autenticación correcta', usuario: { username: userAdmin.username, rol: userAdmin.rol } },
      { status: 200 }
    );

    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[login]', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
