import type { User } from '@repo/api-contracts/users'

export interface AuthSession {
  user: User
  expiresAt: Date
}
