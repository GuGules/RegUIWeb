import { NextRequest, NextResponse } from "next/server";
import { checkIsAdmin, getUserById } from '@/app/lib/reguidb/user';
import { sessionIsOk } from "@/app/lib/session";

export async function POST(req: NextRequest) {

    // Chargement des paramètres de la requête
    const { userId } = await req.json();

    const connectedUserId = await sessionIsOk(); 
    if (!connectedUserId){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = await checkIsAdmin(connectedUserId);
    if (isAdmin || connectedUserId === userId) {
        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });

    } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
}