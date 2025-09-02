import { createRegistry } from '@/app/lib/reguidb/registry'
import { sessionIsOk } from '@/app/lib/session';
import { checkIsAdmin } from '@/app/lib/reguidb/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
    /*const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }*/

    const { name, url, description } = await req.json();
    console.log(await req)
    console.log(name, url, description);

    try {
        //await createRegistry(name, url, description);
        return NextResponse.json({ message: 'Registry created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}