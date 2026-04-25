import type { User } from '@repo/api-contracts/users'
import { requireUser } from '@repo/auth/server/require-user'

export async function getMe(
  input: { request: Request },
  deps = { requireUser },
): Promise<User> {
  return deps.requireUser(input.request)
}
