import { listRegistries } from '@/app/lib/reguidb/registry'
import { sessionIsOk } from '@/app/lib/session';
import { checkIsAdmin } from '@/app/lib/reguidb/user';
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
        const registries = await listRegistries();
        return NextResponse.json(registries);
    } catch (error) {
        console.error('Error listing registries:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}