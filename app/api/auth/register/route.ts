import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { username, password, rol } = await request.json();

  if (!username || !password || password.length < 6) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const rolValido = rol === 'administrador' || rol === 'vendedor' ? rol : 'vendedor';

  const { data: existe } = await supabase
    .from("usuarios")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (existe && existe.length > 0) {
    return NextResponse.json({ error: "El nombre de usuario ya existe" }, { status: 409 });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { error } = await supabase
    .from("usuarios")
    .insert([{ username, password: hashedPassword, rol: rolValido }]);

  if (error) return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 400 });

  return NextResponse.json({ mensaje: "Usuario creado exitosamente" }, { status: 201 });
}
