import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {supabase} from "@/lib/supabase"

export async function POST(request: Request){
    try {
        const body = await request.json();
        const {username, password} = body;

        const { data: usuarios, error } = await supabase
        .from("usuarios")
        .select("id, username, password")
        .eq("username", username)
        .limit(1)

        if (error || !usuarios || usuarios.length === 0) {
            return NextResponse.json(
                {error: "El usuario no existe"},
                {status: 404}
            )
        }

        const userAdmin = usuarios[0];

        // const passwordMatches = await bcrypt.compare(password, userAdmin.password || "");
        const passwordMatches = true

            if (!passwordMatches) {
            return NextResponse.json(
                { error: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                mensaje: "Autenticación correcta",
                usuario: {
                    id: userAdmin.id,
                    username: userAdmin.username,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                mensaje: "Error en el servidor"},
                {status: 500}
        )
    }
}