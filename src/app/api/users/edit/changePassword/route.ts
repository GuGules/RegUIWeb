import { NextRequest, NextResponse } from "next/server";
import { checkIsAdmin, changeUserPassword, checkUserPasswordWithId } from "@/app/lib/reguidb/user";
import { sessionIsOk } from "@/app/lib/session";

export async function POST(req: NextRequest){
    const user = await req.json();

    const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: "Session invalide ou expirée" }, { status: 401 });
    }
    const isAdmin = await checkIsAdmin(userId);
    if (isAdmin){
        try {
            if (user.password !== user.confirmPassword){
                return NextResponse.json({ error: "Les mots de passe ne correspondent pas" }, { status: 400 });
            }
            await changeUserPassword(user.userId, user.password);
            return NextResponse.json({ success: true });
        } catch (error) {
            console.error("Erreur lors du changement de mot de passe:", error);
            return NextResponse.json({ error: "Erreur lors du changement de mot de passe" }, { status: 500 });
        }
    } else if (userId === user.userId){
        try {
            if (! await checkUserPasswordWithId(userId, user.password)){
                return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
            }
            if (user.password !== user.confirmPassword){
                return NextResponse.json({ error: "Les mots de passe ne correspondent pas" }, { status: 400 });
            }
            await changeUserPassword(userId, user.password);
            return NextResponse.json({ success: true });
        } catch (error) {
            console.error("Erreur lors du changement de mot de passe:", error);
            return NextResponse.json({ error: "Erreur lors du changement de mot de passe" }, { status: 500 });
        }        
    } else {
        return NextResponse.json({ error: "Vous n'êtes pas autorisé à changer le mot de passe de cet utilisateur" }, { status: 403 });
    }
}