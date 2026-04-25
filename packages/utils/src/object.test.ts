import { describe, expect, it } from 'vitest'
import { omit, pick } from './object'

describe('pick', () => {
  it('returns only the specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})

describe('omit', () => {
  it('removes the specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
  })
})
