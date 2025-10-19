import { listUsers, checkIsAdmin } from '@/app/lib/reguidb/user';
import { sessionIsOk } from '@/app/lib/session';
import { NextResponse } from 'next/server';

export async function GET(){
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
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}