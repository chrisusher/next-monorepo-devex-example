import { z } from 'zod'

export const projectIdSchema = z.string().uuid()

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Project = z.infer<typeof projectSchema>

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const projectListSchema = z.array(projectSchema)

export type ProjectList = z.infer<typeof projectListSchema>
