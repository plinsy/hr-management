/**
 * Date utility functions for the HR management application
 */

/**
 * Get all dates in a year
 * @param year - The year to get dates for
 * @returns Array of Date objects for each day of the year
 */
export function getDatesInYear(year: number): Date[] {
  const dates: Date[] = []
  const startDate = new Date(year, 0, 1) // January 1st
  const endDate = new Date(year, 11, 31) // December 31st

  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * @param date - Date to check
 * @returns True if the date is a weekend
 */
export function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6 // Sunday = 0, Saturday = 6
}

/**
 * Format date for display
 * @param date - Date to format
 * @param format - Format type ('short', 'long', 'iso')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit'
      })
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'iso':
      return date.toISOString().split('T')[0]!
    default:
      return date.toLocaleDateString()
  }
}

/**
 * Get month name from date
 * @param date - Date to get month from
 * @returns Month name
 */
export function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long' })
}

/**
 * Get day name from date
 * @param date - Date to get day from
 * @returns Day name (Mon, Tue, etc.)
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if the date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * Get the start of the week for a given date
 * @param date - Date to get week start for
 * @returns Date object representing the start of the week (Sunday)
 */
export function getWeekStart(date: Date): Date {
  const result = new Date(date)
  const dayOfWeek = result.getDay()
  result.setDate(result.getDate() - dayOfWeek)
  return result
}

/**
 * Get the end of the week for a given date
 * @param date - Date to get week end for
 * @returns Date object representing the end of the week (Saturday)
 */
export function getWeekEnd(date: Date): Date {
  const result = new Date(date)
  const dayOfWeek = result.getDay()
  result.setDate(result.getDate() + (6 - dayOfWeek))
  return result
}

/**
 * Create date range array between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of dates between start and end (inclusive)
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

/**
 * Add days to a date
 * @param date - Base date
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Calculate the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between the dates
 */
export function daysDifference(date1: Date, date2: Date): number {
  const timeDifference = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
}

/**
 * Get the current year
 * @returns Current year as number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}
