import { describe, it, expect } from 'vitest'
import { normalizePlate, formatPlateDisplay } from '@/lib/utils'

describe('Plate Utilities', () => {
  describe('normalizePlate', () => {
    it('should remove spaces and convert to uppercase', () => {
      expect(normalizePlate('01 a 777 aa')).toBe('01A777AA')
    })

    it('should remove dashes', () => {
      expect(normalizePlate('01-A-777-AA')).toBe('01A777AA')
    })

    it('should handle mixed spaces and dashes', () => {
      expect(normalizePlate('01 A-777 AA')).toBe('01A777AA')
    })
  })

  describe('formatPlateDisplay', () => {
    it('should format UZ plates correctly', () => {
      expect(formatPlateDisplay('01A777AA', 'UZ')).toBe('01 | A 777 AA')
    })

    it('should format RU plates correctly', () => {
      expect(formatPlateDisplay('A123AA77', 'RU')).toBe('A 123 AA | 77')
    })

    it('should format KZ plates correctly', () => {
      expect(formatPlateDisplay('123ABC01', 'KZ')).toBe('123 | ABC | 01')
    })

    it('should use fallback formatting for unknown country', () => {
      // 123456 -> 123 45 6 (based on current regex logic)
      expect(formatPlateDisplay('123456', 'US')).toBe('123 45 6')
    })
  })
})
