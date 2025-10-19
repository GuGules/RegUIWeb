import { NextRequest, NextResponse } from 'next/server';
import { checkUserPassword } from '@/app/lib/reguidb/user';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);
const TOKEN_EXPIRY = '1h';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') || 'registry';
  const scope = searchParams.get('scope');
  //const account = searchParams.get('account');

  // Vérifier l'authentification basique
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Registry Realm"'
        }
      }
    );
  }

  // Décoder les credentials
  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [username, password] = credentials.split(':');

  // Valider les credentials (à adapter selon votre système d'auth)
  const userId = await checkUserPassword(username, password);
  if (!userId) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Générer le token JWT avec jose
  const token = await new SignJWT({
    iss: 'registry-auth-service',
    sub: username,
    aud: service,
    jti: generateJTI(),
    access: parseScope(scope)
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setNotBefore(0)
    .sign(JWT_SECRET);

  return NextResponse.json({
    token,
    access_token: token,
    expires_in: 3600,
    issued_at: new Date().toISOString()
  });
}

function parseScope(scope: string | null): Array<{
  type: string;
  name: string;
  actions: string[];
}> {
  if (!scope) {
    // Accès complet par défaut si aucun scope spécifique n'est demandé
    return [{
      type: 'repository',
      name: '*',
      actions: ['pull', 'push', 'delete']
    }];
  }
  
  const scopes = scope.split(' ');
  return scopes.map(s => {
    const parts = s.split(':');
    return {
      type: parts[0] || 'repository',
      name: parts[1] || '*',
      actions: ['pull', 'push', 'delete'] // Tous les droits pour tous les repos
    };
  });
}

function generateJTI(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
