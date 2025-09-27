import { describe, it, expect } from 'vitest'
import { 
  getDatesInYear, 
  isWeekend, 
  formatDate, 
  isToday, 
  getWeekStart,
  getWeekEnd,
  getDateRange,
  isSameDay,
  addDays,
  daysDifference,
  getCurrentYear
} from '~/utils/dateUtils'

describe('dateUtils', () => {
  describe('getDatesInYear', () => {
    it('should return all dates in a year', () => {
      const dates = getDatesInYear(2024)
      expect(dates).toHaveLength(366) // 2024 is a leap year
      expect(dates[0]).toEqual(new Date(2024, 0, 1))
      expect(dates[dates.length - 1]).toEqual(new Date(2024, 11, 31))
    })

    it('should handle non-leap years', () => {
      const dates = getDatesInYear(2023)
      expect(dates).toHaveLength(365)
    })
  })

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      const saturday = new Date(2024, 0, 6) // January 6, 2024 is a Saturday
      expect(isWeekend(saturday)).toBe(true)
    })

    it('should return true for Sunday', () => {
      const sunday = new Date(2024, 0, 7) // January 7, 2024 is a Sunday
      expect(isWeekend(sunday)).toBe(true)
    })

    it('should return false for weekdays', () => {
      const monday = new Date(2024, 0, 8) // January 8, 2024 is a Monday
      expect(isWeekend(monday)).toBe(false)
    })
  })

  describe('formatDate', () => {
    const testDate = new Date(2024, 0, 15) // January 15, 2024

    it('should format date in short format', () => {
      expect(formatDate(testDate, 'short')).toBe('01/15')
    })

    it('should format date in long format', () => {
      expect(formatDate(testDate, 'long')).toBe('Monday, January 15, 2024')
    })

    it('should format date in ISO format', () => {
      expect(formatDate(testDate, 'iso')).toBe('2024-01-15')
    })
  })

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('should return false for different dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('getWeekStart', () => {
    it('should return the start of the week (Sunday)', () => {
      const wednesday = new Date(2024, 0, 10) // January 10, 2024 is a Wednesday
      const weekStart = getWeekStart(wednesday)
      expect(weekStart.getDay()).toBe(0) // Sunday
      expect(weekStart.getDate()).toBe(7) // January 7, 2024
    })
  })

  describe('getWeekEnd', () => {
    it('should return the end of the week (Saturday)', () => {
      const wednesday = new Date(2024, 0, 10) // January 10, 2024 is a Wednesday
      const weekEnd = getWeekEnd(wednesday)
      expect(weekEnd.getDay()).toBe(6) // Saturday
      expect(weekEnd.getDate()).toBe(13) // January 13, 2024
    })
  })

  describe('getDateRange', () => {
    it('should return array of dates between start and end', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 5)
      const range = getDateRange(start, end)
      
      expect(range).toHaveLength(5)
      expect(range[0]).toEqual(start)
      expect(range[4]).toEqual(end)
    })

    it('should return single date when start equals end', () => {
      const date = new Date(2024, 0, 1)
      const range = getDateRange(date, date)
      
      expect(range).toHaveLength(1)
      expect(range[0]).toEqual(date)
    })
  })

  describe('isSameDay', () => {
    it('should return true for same dates', () => {
      const date1 = new Date(2024, 0, 15, 10, 30)
      const date2 = new Date(2024, 0, 15, 15, 45)
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('should return false for different dates', () => {
      const date1 = new Date(2024, 0, 15)
      const date2 = new Date(2024, 0, 16)
      expect(isSameDay(date1, date2)).toBe(false)
    })
  })

  describe('addDays', () => {
    it('should add days to a date', () => {
      const date = new Date(2024, 0, 15)
      const result = addDays(date, 5)
      expect(result.getDate()).toBe(20)
    })

    it('should handle negative days', () => {
      const date = new Date(2024, 0, 15)
      const result = addDays(date, -5)
      expect(result.getDate()).toBe(10)
    })

    it('should handle month boundaries', () => {
      const date = new Date(2024, 0, 30) // January 30
      const result = addDays(date, 5)
      expect(result.getMonth()).toBe(1) // February
      expect(result.getDate()).toBe(4)
    })
  })

  describe('daysDifference', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date(2024, 0, 1)
      const date2 = new Date(2024, 0, 6)
      expect(daysDifference(date1, date2)).toBe(5)
    })

    it('should return absolute difference', () => {
      const date1 = new Date(2024, 0, 6)
      const date2 = new Date(2024, 0, 1)
      expect(daysDifference(date1, date2)).toBe(5)
    })
  })

  describe('getCurrentYear', () => {
    it('should return current year as number', () => {
      const currentYear = getCurrentYear()
      const actualYear = new Date().getFullYear()
      expect(currentYear).toBe(actualYear)
      expect(typeof currentYear).toBe('number')
    })
  })
})
