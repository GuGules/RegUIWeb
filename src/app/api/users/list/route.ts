import { listUsers, checkIsAdmin } from '@/app/lib/reguidb/user';
import { sessionIsOk } from '@/app/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest){
    const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    try {
        const users = await listUsers();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}