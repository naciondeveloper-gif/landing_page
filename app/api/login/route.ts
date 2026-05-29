import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {supabase} from "@/lib/supabase"

export async function POST(request: Request){
    try {
        const body = await request.json();
        const {username, password} = body;

        const { data: usuarios, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("username", username)

        if(error || !usuarios || usuarios.length === 0){
            return NextResponse.json(
                {error: "El usuario no existe"},
                {status: 404}
            )
        }

        const userAdmin = usuarios[0];

        const passwordTrue = password === userAdmin.password;

        if(!passwordTrue){
            return NextResponse.json(
                {error: "Contraseña incorrecta"},
                {status: 401}
            )
        }
        return NextResponse.json(
            {
                mensaje: "Autenticación correcta"},
                {status: 200
            }
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