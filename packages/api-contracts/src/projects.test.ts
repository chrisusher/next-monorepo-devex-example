import { describe, expect, it } from 'vitest'
import { createProjectSchema, projectIdSchema, projectSchema } from './projects'

describe('projectIdSchema', () => {
  it('accepts a valid UUID', () => {
    const result = projectIdSchema.safeParse('550e8400-e29b-41d4-a716-446655440000')
    expect(result.success).toBe(true)
  })

  it('rejects a non-UUID string', () => {
    const result = projectIdSchema.safeParse('not-a-uuid')
    expect(result.success).toBe(false)
  })
})

describe('projectSchema', () => {
  it('parses a valid project', () => {
    const valid = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Project',
      description: null,
      ownerId: '550e8400-e29b-41d4-a716-446655440001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    expect(projectSchema.safeParse(valid).success).toBe(true)
  })
})

describe('createProjectSchema', () => {
  it('rejects an empty name', () => {
    const result = createProjectSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })
})
