import { NextRequest, NextResponse } from "next/server";
import { sessionIsOk } from "@/app/lib/session";
import { getUserById } from "@/app/lib/reguidb/user";

export async function GET(){

    const userId = await sessionIsOk();

    if (!userId) {
        return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
    } else {
        try {
            const userData = await getUserById(userId);
            return NextResponse.json(userData);
        } catch (error) {
            return NextResponse.json({ error: "Echec lors de la récupération des données utilisateur" }, { status: 500 });
        }
    }
}