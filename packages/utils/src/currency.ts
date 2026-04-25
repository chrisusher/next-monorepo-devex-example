/**
 * Formats a monetary amount (in cents) to a locale string.
 * E.g. formatCurrency(1200, 'USD') => '$12.00'
 */
export function formatCurrency(
  amountInCents: number,
  currency: string,
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amountInCents / 100)
}
