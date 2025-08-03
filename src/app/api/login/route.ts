import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {checkUserPassword} from '@/app/lib/reguidb/user'
import { createSession } from '@/app/lib/session';

// Exemple d'utilisateur stocké en "base de données"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // Comparaison du hash

  const userId = await checkUserPassword(email, password);
  if (!userId) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  await createSession(userId);
  return NextResponse.json({ message: 'Connexion réussie' }, { status: 200 });
  
}
   