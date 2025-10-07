import { NextRequest, NextResponse } from 'next/server'; 
import {checkIsAdmin, checkUserPassword} from '@/app/lib/reguidb/user';
import { createSession } from '@/app/lib/session';
  
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // Comparaison du hash

  const userId = await checkUserPassword(email, password);
  if (!userId) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  await createSession(userId);
  return NextResponse.json({ isAdmin: await checkIsAdmin(userId) }, { status: 200 });

}
   