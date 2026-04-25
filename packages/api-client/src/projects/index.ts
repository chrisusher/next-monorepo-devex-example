import { projectListSchema, projectSchema } from '@repo/api-contracts/projects'
import type { CreateProjectInput, Project, ProjectList } from '@repo/api-contracts/projects'

/**
 * Typed browser-safe API client for the projects resource.
 *
 * Keeps fetch logic out of components and co-locates runtime validation
 * at the client/server boundary using the shared zod schemas.
 */

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`)

  if (!res.ok) {
    throw new ApiError(res.status, `Failed to fetch project ${id}`)
  }

  const json = await res.json()
  return projectSchema.parse(json)
}

export async function fetchProjects(): Promise<ProjectList> {
  const res = await fetch('/api/projects')

  if (!res.ok) {
    throw new ApiError(res.status, 'Failed to fetch projects')
  }

  const json = await res.json()
  return projectListSchema.parse(json)
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    throw new ApiError(res.status, 'Failed to create project')
  }

  const json = await res.json()
  return projectSchema.parse(json)
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
