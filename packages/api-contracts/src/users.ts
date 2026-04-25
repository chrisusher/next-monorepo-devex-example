import { z } from 'zod'

export const userIdSchema = z.string().uuid()

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
})

export type User = z.infer<typeof userSchema>

export const sessionSchema = z.object({
  user: userSchema,
  expiresAt: z.string().datetime(),
})

export type Session = z.infer<typeof sessionSchema>
