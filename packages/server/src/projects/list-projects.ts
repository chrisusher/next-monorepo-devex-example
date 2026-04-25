import type { ProjectList } from '@repo/api-contracts/projects'
import { requireUser } from '@repo/auth/server/require-user'
import { projectRepo } from '@repo/db/projects'

export async function listProjects(
  input: { request: Request },
  deps = {
    requireUser,
    listForUser: projectRepo.listForUser,
  },
): Promise<ProjectList> {
  const user = await deps.requireUser(input.request)
  return deps.listForUser(user.id)
}
