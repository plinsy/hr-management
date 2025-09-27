import { describe, it, expect, beforeEach } from 'vitest'
import { 
  calculateVisibleRange, 
  calculateHorizontalVisibleRange,
  debounce,
  throttle,
  getOptimizedScrollPosition
} from '~/utils/virtualScrolling'

describe('virtualScrolling', () => {
  describe('calculateVisibleRange', () => {
    it('should calculate visible range correctly', () => {
      const result = calculateVisibleRange(
        100, // scrollTop
        400, // containerHeight
        50,  // itemHeight
        100, // totalItems
        5    // overscan
      )

      expect(result.startIndex).toBe(0) // Math.max(0, Math.floor(100/50) - 5) = 0
      expect(result.endIndex).toBe(14)  // Math.min(99, Math.ceil((100+400)/50) + 5) = 14
      expect(result.totalHeight).toBe(5000) // 100 * 50
    })

    it('should handle edge cases with small datasets', () => {
      const result = calculateVisibleRange(0, 400, 50, 5, 2)

      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(4) // totalItems - 1
      expect(result.totalHeight).toBe(250)
    })

    it('should respect overscan parameter', () => {
      const result = calculateVisibleRange(200, 200, 50, 50, 10)

      expect(result.startIndex).toBe(0) // Math.max(0, 4 - 10)
      expect(result.endIndex).toBe(18)  // Math.min(49, 8 + 10)
    })
  })

  describe('calculateHorizontalVisibleRange', () => {
    it('should calculate horizontal visible range correctly', () => {
      const result = calculateHorizontalVisibleRange(
        200, // scrollLeft
        800, // containerWidth
        40,  // cellWidth
        365, // totalDates
        10   // overscan
      )

      expect(result.startIndex).toBe(0) // Math.max(0, Math.floor(200/40) - 10) = 0
      expect(result.endIndex).toBe(34)  // Math.min(364, Math.ceil((200+800)/40) + 10) = 34
      expect(result.totalWidth).toBe(14600) // 365 * 40
    })

    it('should handle large scroll positions', () => {
      const result = calculateHorizontalVisibleRange(5000, 800, 40, 365, 5)

      expect(result.startIndex).toBe(120) // Math.max(0, 125 - 5)
      expect(result.endIndex).toBe(150)   // Math.min(364, 145 + 5)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
      }, 50)

      // Call multiple times rapidly
      debouncedFn()
      debouncedFn()
      debouncedFn()

      // Should not be called immediately
      expect(callCount).toBe(0)

      // Should be called once after delay
      await new Promise(resolve => setTimeout(resolve, 60))
      expect(callCount).toBe(1)
    })

    it('should pass arguments correctly', async () => {
      let receivedArgs: any[] = []
      const debouncedFn = debounce((...args: any[]) => {
        receivedArgs = args
      }, 10)

      debouncedFn('test', 123, { key: 'value' })

      await new Promise(resolve => setTimeout(resolve, 20))
      expect(receivedArgs).toEqual(['test', 123, { key: 'value' }])
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      let callCount = 0
      const throttledFn = throttle(() => {
        callCount++
      }, 50)

      // First call should execute immediately
      throttledFn()
      expect(callCount).toBe(1)

      // Subsequent calls should be throttled
      throttledFn()
      throttledFn()
      expect(callCount).toBe(1)

      // Should be able to call again after throttle period
      await new Promise(resolve => setTimeout(resolve, 60))
      throttledFn()
      expect(callCount).toBe(2)
    })
  })

  describe('getOptimizedScrollPosition', () => {
    it('should return target position when within bounds', () => {
      const result = getOptimizedScrollPosition(500, 100, 1000)
      expect(result).toBe(500)
    })

    it('should clamp to minimum (0)', () => {
      const result = getOptimizedScrollPosition(-100, 200, 1000)
      expect(result).toBe(0)
    })

    it('should clamp to maximum', () => {
      const result = getOptimizedScrollPosition(1500, 200, 1000)
      expect(result).toBe(1000)
    })

    it('should handle zero max position', () => {
      const result = getOptimizedScrollPosition(100, 0, 0)
      expect(result).toBe(0)
    })
  })
})
