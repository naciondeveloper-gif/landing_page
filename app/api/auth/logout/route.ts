import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (session?.value) {
    await supabase.from('sessions').delete().eq('id', session.value);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete('session');
  return response;
}
