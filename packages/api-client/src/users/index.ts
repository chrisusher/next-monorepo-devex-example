import { userSchema } from '@repo/api-contracts/users'
import type { User } from '@repo/api-contracts/users'

export async function fetchMe(): Promise<User> {
  const res = await fetch('/api/me')

  if (!res.ok) {
    throw new Error('Failed to fetch current user')
  }

  const json = await res.json()
  return userSchema.parse(json)
}
