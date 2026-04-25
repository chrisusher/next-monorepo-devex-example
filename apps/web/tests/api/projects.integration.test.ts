import { describe, expect, it, vi, beforeEach } from 'vitest'

/**
 * Integration tests for the /api/projects route handlers.
 *
 * We test the route handlers directly (not via HTTP) for speed.
 * The handlers are thin wrappers, so this primarily validates:
 *  - correct HTTP status codes
 *  - request→use-case wiring
 *  - response shape
 *
 * For deeper business-logic coverage, see packages/server tests.
 */

// Mock the auth package so we can control session state in tests
vi.mock('@repo/auth/server/require-user', () => ({
  requireUser: vi.fn(),
}))

vi.mock('@repo/auth/server/get-session', () => ({
  getSession: vi.fn(),
}))

vi.mock('@repo/db/projects', () => ({
  projectRepo: {
    findById: vi.fn(),
    listForUser: vi.fn(),
    create: vi.fn(),
    _reset: vi.fn(),
  },
}))

import { GET as getProjects, POST as postProject } from '../../app/api/projects/route'
import { GET as getProject } from '../../app/api/projects/[id]/route'
import { requireUser } from '@repo/auth/server/require-user'
import { projectRepo } from '@repo/db/projects'
import type { User } from '@repo/api-contracts/users'
import type { Project } from '@repo/api-contracts/projects'

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

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, {
    headers: { authorization: 'Bearer test-token' },
    ...init,
  })
}

beforeEach(() => {
  vi.mocked(requireUser).mockResolvedValue(stubUser)
  vi.mocked(projectRepo.listForUser).mockResolvedValue([stubProject])
  vi.mocked(projectRepo.findById).mockResolvedValue(stubProject)
  vi.mocked(projectRepo.create).mockResolvedValue(stubProject)
})

describe('GET /api/projects', () => {
  it('returns 200 with an array of projects for an authenticated user', async () => {
    const req = makeRequest('http://localhost:3000/api/projects')
    const res = await getProjects(req as any)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })

  it('returns 401 when the user is not authenticated', async () => {
    vi.mocked(requireUser).mockRejectedValue(new Error('Unauthorized'))

    const req = makeRequest('http://localhost:3000/api/projects')
    const res = await getProjects(req as any)

    expect(res.status).toBe(401)
  })
})

describe('GET /api/projects/:id', () => {
  it('returns 200 with the project for an authenticated owner', async () => {
    const req = makeRequest(
      `http://localhost:3000/api/projects/${stubProject.id}`,
    )
    const res = await getProject(req as any, {
      params: Promise.resolve({ id: stubProject.id }),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(stubProject.id)
  })

  it('returns 404 when project does not exist', async () => {
    vi.mocked(projectRepo.findById).mockResolvedValue(null)

    const req = makeRequest(
      'http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440099',
    )
    const res = await getProject(req as any, {
      params: Promise.resolve({ id: '550e8400-e29b-41d4-a716-446655440099' }),
    })

    expect(res.status).toBe(404)
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(requireUser).mockRejectedValue(new Error('Unauthorized'))

    const req = makeRequest(
      `http://localhost:3000/api/projects/${stubProject.id}`,
    )
    const res = await getProject(req as any, {
      params: Promise.resolve({ id: stubProject.id }),
    })

    expect(res.status).toBe(401)
  })
})

describe('POST /api/projects', () => {
  it('returns 201 with the created project', async () => {
    const req = makeRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer test-token',
      },
      body: JSON.stringify({ name: 'New Project' }),
    })
    const res = await postProject(req as any)

    expect(res.status).toBe(201)
  })
})
