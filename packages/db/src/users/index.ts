import type { User } from '@repo/api-contracts/users'
import { seedUsers } from '../client'

let users: User[] = [...seedUsers]

export const userRepo = {
  async findById(id: string): Promise<User | null> {
    return users.find((u) => u.id === id) ?? null
  },

  async findByEmail(email: string): Promise<User | null> {
    return users.find((u) => u.email === email) ?? null
  },

  /** Reset store – used in tests */
  _reset() {
    users = [...seedUsers]
  },
}
