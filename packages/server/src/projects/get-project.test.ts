import { describe, expect, it, vi } from 'vitest'
import type { Project } from '@repo/api-contracts/projects'
import type { User } from '@repo/api-contracts/users'
import { getProject, NotFoundError } from './get-project'

const stubUser: User = {
  id: 'user-1',
  email: 'alice@example.com',
  name: 'Alice',
}

const stubProject: Project = {
  id: '550e8400-e29b-41d4-a716-446655440010',
  name: 'Test Project',
  description: null,
  ownerId: 'user-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function makeDeps(overrides: Partial<Parameters<typeof getProject>[1]> = {}) {
  return {
    requireUser: vi.fn().mockResolvedValue(stubUser),
    findProjectById: vi.fn().mockResolvedValue(stubProject),
    ensureCanReadProject: vi.fn(),
    ...overrides,
  }
}

describe('getProject', () => {
  it('returns the project when the user owns it', async () => {
    const deps = makeDeps()
    const request = new Request('http://localhost/api/projects/550e8400-e29b-41d4-a716-446655440010')
    const result = await getProject({ projectId: '550e8400-e29b-41d4-a716-446655440010', request }, deps)
    expect(result).toEqual(stubProject)
  })

  it('throws NotFoundError when project does not exist', async () => {
    const deps = makeDeps({ findProjectById: vi.fn().mockResolvedValue(null) })
    const request = new Request('http://localhost/api/projects/550e8400-e29b-41d4-a716-446655440099')
    await expect(
      getProject({ projectId: '550e8400-e29b-41d4-a716-446655440099', request }, deps),
    ).rejects.toThrow(NotFoundError)
  })

  it('calls ensureCanReadProject with the user and project', async () => {
    const deps = makeDeps()
    const request = new Request('http://localhost')
    await getProject({ projectId: '550e8400-e29b-41d4-a716-446655440010', request }, deps)
    expect(deps.ensureCanReadProject).toHaveBeenCalledWith(stubUser, stubProject)
  })
})
