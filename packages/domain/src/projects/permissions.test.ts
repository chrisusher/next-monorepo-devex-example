import { describe, expect, it } from 'vitest'
import type { Project } from '@repo/api-contracts/projects'
import type { User } from '@repo/api-contracts/users'
import {
  canReadProject,
  ensureCanReadProject,
  ensureCanUpdateProject,
} from './permissions'

const user: User = {
  id: 'user-1',
  email: 'alice@example.com',
  name: 'Alice',
}

const ownedProject: Project = {
  id: 'proj-1',
  name: 'My Project',
  description: null,
  ownerId: 'user-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const otherProject: Project = {
  ...ownedProject,
  id: 'proj-2',
  ownerId: 'user-2',
}

describe('canReadProject', () => {
  it('returns true when user owns the project', () => {
    expect(canReadProject(user, ownedProject)).toBe(true)
  })

  it('returns false when user does not own the project', () => {
    expect(canReadProject(user, otherProject)).toBe(false)
  })
})

describe('ensureCanReadProject', () => {
  it('does not throw when user owns the project', () => {
    expect(() => ensureCanReadProject(user, ownedProject)).not.toThrow()
  })

  it('throws Forbidden when user does not own the project', () => {
    expect(() => ensureCanReadProject(user, otherProject)).toThrow('Forbidden')
  })
})

describe('ensureCanUpdateProject', () => {
  it('throws when user does not own the project', () => {
    expect(() => ensureCanUpdateProject(user, otherProject)).toThrow('Forbidden')
  })
})
