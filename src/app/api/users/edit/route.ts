import { NextRequest, NextResponse } from "next/server";
import { sessionIsOk } from "@/app/lib/session";
import { checkIsAdmin, updateUser } from "@/app/lib/reguidb/user";

export async function POST(req: NextRequest){

    const formData = await req.json();
    console.log(formData);
    // Vérification de la session utilisateur
    const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }
    // Vérification des droits
    const isAdmin = await checkIsAdmin(userId);
    if (isAdmin || userId === formData.userId) {
        // Mise à jour de l'utilisateur
        if (!isAdmin){
            formData.isAdmin = false; // Si l'utilisateur n'est pas admin, on ne peut pas le rendre admin
        }
        const result = await updateUser(formData.userId, formData.firstName, formData.lastName, formData.isAdmin);
        if (result) {
            return NextResponse.json({ message: "Utilisateur mis à jour avec succès" }, { status: 200 });
        }
        return NextResponse.json({ error: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 });
    } else {
        return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }
}