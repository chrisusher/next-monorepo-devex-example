/**
 * In a real app this would be your Prisma client or database connection.
 *
 * We use an in-memory store here so the example runs without any external deps.
 * Replace this with your actual Prisma/Drizzle/Kysely setup.
 */

import type { Project } from '@repo/api-contracts/projects'
import type { User } from '@repo/api-contracts/users'

// ---------------------------------------------------------------------------
// In-memory seed data – swap out for real DB in production
// ---------------------------------------------------------------------------

export const seedUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'alice@example.com',
    name: 'Alice',
  },
]

export const seedProjects: Project[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Example Project',
    description: 'A demonstration project',
    ownerId: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
]
