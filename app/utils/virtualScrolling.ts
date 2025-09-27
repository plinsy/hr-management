/**
 * Virtual scrolling utilities for handling large datasets efficiently
 */

/**
 * Calculate visible range for virtual scrolling
 * @param scrollTop - Current scroll position
 * @param containerHeight - Height of the container
 * @param itemHeight - Height of each item
 * @param totalItems - Total number of items
 * @param overscan - Number of items to render outside visible area
 * @returns Object with startIndex and endIndex
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
): { startIndex: number; endIndex: number; totalHeight: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  return {
    startIndex,
    endIndex,
    totalHeight: totalItems * itemHeight
  }
}

/**
 * Calculate horizontal visible range for calendar dates
 * @param scrollLeft - Current horizontal scroll position
 * @param containerWidth - Width of the container
 * @param cellWidth - Width of each date cell
 * @param totalDates - Total number of date columns
 * @param overscan - Number of cells to render outside visible area
 * @returns Object with startIndex and endIndex for date columns
 */
export function calculateHorizontalVisibleRange(
  scrollLeft: number,
  containerWidth: number,
  cellWidth: number,
  totalDates: number,
  overscan: number = 10
): { startIndex: number; endIndex: number; totalWidth: number } {
  const startIndex = Math.max(0, Math.floor(scrollLeft / cellWidth) - overscan)
  const endIndex = Math.min(
    totalDates - 1,
    Math.ceil((scrollLeft + containerWidth) / cellWidth) + overscan
  )
  
  return {
    startIndex,
    endIndex,
    totalWidth: totalDates * cellWidth
  }
}

/**
 * Debounce function for scroll events
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for scroll events
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Get optimized scroll position for smooth scrolling
 * @param targetPosition - Target scroll position
 * @param currentPosition - Current scroll position
 * @param maxPosition - Maximum scroll position
 * @returns Optimized scroll position
 */
export function getOptimizedScrollPosition(
  targetPosition: number,
  currentPosition: number,
  maxPosition: number
): number {
  return Math.max(0, Math.min(maxPosition, targetPosition))
}
