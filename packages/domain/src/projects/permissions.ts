import type { Project } from '@repo/api-contracts/projects'
import type { User } from '@repo/api-contracts/users'

/**
 * Pure domain rule: can the user read this project?
 *
 * No framework, no database, no HTTP. Just the rule.
 * This is easy to unit-test and completely portable.
 */
export function canReadProject(user: User, project: Project): boolean {
  return project.ownerId === user.id
}

export function ensureCanReadProject(user: User, project: Project): void {
  if (!canReadProject(user, project)) {
    throw new Error('Forbidden: user does not have access to this project')
  }
}

export function canUpdateProject(user: User, project: Project): boolean {
  return project.ownerId === user.id
}

export function ensureCanUpdateProject(user: User, project: Project): void {
  if (!canUpdateProject(user, project)) {
    throw new Error('Forbidden: user cannot update this project')
  }
}
