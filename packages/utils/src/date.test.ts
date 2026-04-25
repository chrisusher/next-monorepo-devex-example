import { describe, expect, it } from 'vitest'
import { formatDate, isPast } from './date'

describe('formatDate', () => {
  it('formats a date in en-GB locale', () => {
    const date = new Date('2024-01-15T00:00:00Z')
    expect(formatDate(date, 'en-GB')).toMatch(/15/)
    expect(formatDate(date, 'en-GB')).toMatch(/2024/)
  })
})

describe('isPast', () => {
  it('returns true for past dates', () => {
    expect(isPast(new Date('2000-01-01'))).toBe(true)
  })

  it('returns false for future dates', () => {
    expect(isPast(new Date('2099-01-01'))).toBe(false)
  })
})
