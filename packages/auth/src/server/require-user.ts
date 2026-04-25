import type { AuthSession } from '../types'
import { getSession } from './get-session'

/**
 * Like getSession, but throws if there is no valid session.
 * Use this in server use-cases that require authentication.
 */
export async function requireUser(
  request: Request,
): Promise<AuthSession['user']> {
  const session = await getSession(request)

  if (!session) {
    throw new Error('Unauthorized: no valid session')
  }

  return session.user
}
