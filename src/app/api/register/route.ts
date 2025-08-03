import { createUser } from '@/app/lib/reguidb/user'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, firstName, email, password } = await req.json();
    if (!name || !firstName || !email || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

  const user = await createUser(email, password, name, firstName);
  return NextResponse.json(user);
}
