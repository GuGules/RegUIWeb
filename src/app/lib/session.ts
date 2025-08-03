import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { saveSession, checkSession,deleteSavedSession } from '@/app/lib/reguidb/session'
 
const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

 
export async function encrypt(userId: string, expiresAt: Date) {
  return new SignJWT({ userId, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error("Error verifying session:", error)
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt(userId, expiresAt)
  const cookieStore = await cookies()

  // Sauvegarde de la session dans la base de données
  await saveSession(userId, session); 

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function sessionIsOk(){
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  if (!sessionCookie) {
    return false;
  }
  else {
    const sessionData = await decrypt(sessionCookie.value);
    const userId=await checkSession(sessionData.userId,sessionCookie.value);
    if (!userId) {
      return null;
    } else {
      return userId;  
    }
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (sessionCookie) {
    await deleteSavedSession(sessionCookie.value);
    cookieStore.delete('session');
  } else {
    console.error('Eror deleting session: No session cookie found');
  }
}