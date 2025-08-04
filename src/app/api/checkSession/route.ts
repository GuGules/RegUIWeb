import 'server-only';
import { NextResponse } from 'next/server';
import { sessionIsOk } from '@/app/lib/session';
import { checkIsAdmin } from '@/app/lib/reguidb/user';


export async function GET() {
    const userId = await sessionIsOk();
    if(!userId){
        return NextResponse.json({ isConnected: false, isAdmin: false }, { status: 200 });
    }
    return NextResponse.json({ isConnected: true, isAdmin: await checkIsAdmin(userId) }, { status: 200 });
}