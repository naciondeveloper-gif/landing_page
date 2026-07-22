import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/client';

export interface AdminSession {
  id: string;
  username: string;
  rol: 'administrador' | 'vendedor';
}

/**
 * Validates the session cookie against the sessions table.
 * Returns the logged-in user (administrador or vendedor) or null if invalid/expired.
 * Requires the sessions table — run the migration in Supabase before deploying.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session?.value) return null;

  const { data: sessionRow } = await supabase
    .from('sessions')
    .select('user_id')
    .eq('id', session.value)
    .limit(1);

  const row = sessionRow?.[0];
  if (!row) return null;

  const { data: userData } = await supabase
    .from('usuarios')
    .select('id, username, rol')
    .eq('id', row.user_id)
    .limit(1);

  const user = userData?.[0];
  if (!user || (user.rol !== 'administrador' && user.rol !== 'vendedor')) return null;

  return { id: String(user.id), username: user.username, rol: user.rol };
}
