import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const { username, password } = await request.json();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { data, error } = await supabase
        .from("usuarios")
        .insert([{ username, password: hashedPassword }]);

    if (error) return NextResponse.json({ error: "No se pudo crear" }, { status: 400 });

    return NextResponse.json({ mensaje: "Usuario creado exitosamente" }, { status: 201 });
}