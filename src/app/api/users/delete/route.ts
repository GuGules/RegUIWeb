import { NextRequest, NextResponse } from "next/server";
import { sessionIsOk } from "@/app/lib/session";
import { checkIsAdmin, deleteUserById } from "@/app/lib/reguidb/user";
import { deleteUserSessions } from "@/app/lib/reguidb/session";

export async function DELETE(req: NextRequest){
    const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { deletedUserId } = await req.json();
    if (!deletedUserId) {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    try {
        await deleteUserSessions(deletedUserId);
        await deleteUserById(deletedUserId);
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    }catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

}