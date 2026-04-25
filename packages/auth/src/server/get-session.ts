import type { AuthSession } from '../types'

/**
 * Extracts the session from an incoming request.
 *
 * In a real app: decode/verify a JWT or look up a session cookie.
 * Here we return a hardcoded session so the example runs without infra.
 *
 * Replace with: next-auth, lucia, better-auth, clerk, etc.
 */
export async function getSession(
  request: Request,
): Promise<AuthSession | null> {
  const authHeader = request.headers.get('authorization')

  // In production: verify a signed JWT / session token
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  // Stub: treat any Bearer token as the seed user
  return {
    user: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'alice@example.com',
      name: 'Alice',
    },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  }
}
