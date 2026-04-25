import { projectIdSchema } from '@repo/api-contracts/projects'
import type { Project } from '@repo/api-contracts/projects'
import { requireUser } from '@repo/auth/server/require-user'
import { projectRepo } from '@repo/db/projects'
import { ensureCanReadProject } from '@repo/domain/projects/permissions'

/**
 * Use-case: get a single project by ID.
 *
 * This is deliberately kept in a separate package from the Next.js app.
 * The route handler in apps/web calls this and is responsible only for
 * mapping HTTP concerns (request/response parsing, status codes).
 *
 * Pattern: dependency injection via `deps` argument makes this easy to test.
 */
export async function getProject(
  input: { projectId: string; request: Request },
  deps = {
    requireUser,
    findProjectById: projectRepo.findById,
    ensureCanReadProject,
  },
): Promise<Project> {
  const user = await deps.requireUser(input.request)
  const projectId = projectIdSchema.parse(input.projectId)

  const project = await deps.findProjectById(projectId)

  if (!project) {
    throw new NotFoundError(`Project ${projectId} not found`)
  }

  deps.ensureCanReadProject(user, project)

  return project
}

export class NotFoundError extends Error {
  readonly status = 404
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ForbiddenError extends Error {
  readonly status = 403
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}
