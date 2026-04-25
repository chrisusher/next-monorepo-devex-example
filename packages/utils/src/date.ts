/**
 * Format a date to a human-readable string.
 * Isolated here so all packages use a consistent format.
 */
export function formatDate(date: Date, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Returns true if the given date is in the past.
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now()
}
