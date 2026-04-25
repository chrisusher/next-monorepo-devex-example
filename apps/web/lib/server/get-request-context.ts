import { getSession } from '@repo/auth/server/get-session'
import type { AuthSession } from '@repo/auth/types'

/**
 * App-local helper: enriches a Request with additional context
 * (e.g. locale, feature flags) beyond what `@repo/auth` provides.
 *
 * Keep app-specific wiring here rather than polluting shared packages.
 */
export async function getRequestContext(request: Request): Promise<{
  session: AuthSession | null
}> {
  const session = await getSession(request)
  return { session }
}
