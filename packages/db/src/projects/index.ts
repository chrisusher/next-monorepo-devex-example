import type { Project } from '@repo/api-contracts/projects'
import { seedProjects } from '../client'

// In a real app, these functions would use Prisma/Drizzle/Kysely.
// The narrow repo interface means consumers don't depend on the ORM directly.

let projects: Project[] = [...seedProjects]

export const projectRepo = {
  async findById(id: string): Promise<Project | null> {
    return projects.find((p) => p.id === id) ?? null
  },

  async listForUser(ownerId: string): Promise<Project[]> {
    return projects.filter((p) => p.ownerId === ownerId)
  },

  async create(project: Project): Promise<Project> {
    projects.push(project)
    return project
  },

  /** Reset store – used in tests */
  _reset() {
    projects = [...seedProjects]
  },
}
