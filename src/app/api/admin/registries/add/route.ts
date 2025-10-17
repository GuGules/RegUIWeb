import { createRegistry, listRegistries } from '@/app/lib/reguidb/registry'
import { sessionIsOk } from '@/app/lib/session';
import { checkIsAdmin } from '@/app/lib/reguidb/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
    const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, url, description, isPublic } = await req.json();

    try {
        await createRegistry(name, url, isPublic, description == "" ? description : "");
        const registries = await listRegistries();
        return NextResponse.json({ message: 'Registry created successfully', registries: registries }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}