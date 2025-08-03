import { deleteSession } from '@/app/lib/session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (sessionCookie) {
        // Supprimer la session de la base de données
        try {
            await deleteSession();
            console.log('Session deleted successfully');
            return NextResponse.json({ message: 'Logout successful' }, { status: 200 });

        } catch (error) {
            console.error('Error deleting session:', error);
            return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
        }
    }
}