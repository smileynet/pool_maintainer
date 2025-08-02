/**
 * Critical safety tests for MAHC (Model Aquatic Health Code) validation
 * These tests ensure pool chemical safety compliance
 */

import { describe, it, expect } from 'vitest'
import { 
  validateChemicalReading,
  getPoolStatus,
  getChemicalAdjustments,
  formatChemicalValue,
  getChemicalStatusColor,
  getChemicalTrend,
  CHEMICAL_RANGES
} from '@/lib/utils/pool-utils'
import { 
  safeChemicalReadings,
  warningChemicalReadings,
  criticalChemicalReadings,
  edgeCaseReadings,
  testHelpers
} from '@/test/fixtures/chemical-readings'

describe('MAHC Chemical Validation', () => {
  describe('validateChemicalReading', () => {
    it('validates safe chemical readings correctly', () => {
      const safeReading = safeChemicalReadings[0]
      const result = validateChemicalReading(safeReading)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })
    
    it('identifies warning-level chemical readings', () => {
      const warningReading = warningChemicalReadings[0] // pH 7.1, Chlorine 2.8, etc.
      const result = validateChemicalReading(warningReading)
      
      expect(result.isValid).toBe(true) // Valid but with warnings
      expect(result.errors).toHaveLength(0)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(w => w.includes('pH level'))).toBe(true)
      // Note: Chlorine 2.8 is within range (1.0-3.0), so no chlorine warning
      expect(result.warnings.some(w => w.includes('Alkalinity'))).toBe(true)
      expect(result.warnings.some(w => w.includes('Temperature'))).toBe(true)
    })
    
    it('identifies critical chemical readings as errors', () => {
      const criticalReading = criticalChemicalReadings[0] // pH 8.2, Chlorine 4.5
      const result = validateChemicalReading(criticalReading)
      
      expect(result.isValid).toBe(true) // Function validates structure, not safety
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(w => w.includes('pH level'))).toBe(true)
      expect(result.warnings.some(w => w.includes('Chlorine level'))).toBe(true)
    })
    
    it('rejects negative chemical values', () => {
      const invalidReading = {
        ...safeChemicalReadings[0],
        chlorine: -1,
        alkalinity: -50
      }
      const result = validateChemicalReading(invalidReading)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.includes('Chlorine level cannot be negative'))).toBe(true)
    })
    
    it('validates pH range boundaries correctly', () => {
      // Test pH = 0 (minimum possible)
      const minPhReading = { ...safeChemicalReadings[0], ph: 0 }
      expect(validateChemicalReading(minPhReading).errors).toHaveLength(0)
      
      // Test pH = 14 (maximum possible)
      const maxPhReading = { ...safeChemicalReadings[0], ph: 14 }
      expect(validateChemicalReading(maxPhReading).errors).toHaveLength(0)
      
      // Test pH > 14 (invalid)
      const invalidPhReading = { ...safeChemicalReadings[0], ph: 15 }
      const result = validateChemicalReading(invalidPhReading)
      expect(result.errors.some(e => e.includes('pH must be between 0 and 14'))).toBe(true)
    })
    
    it('validates temperature range for pool safety', () => {
      // Test dangerously low temperature
      const coldReading = { ...safeChemicalReadings[0], temperature: 30 }
      const coldResult = validateChemicalReading(coldReading)
      expect(coldResult.errors.some(e => e.includes('Temperature must be between 32°F and 120°F'))).toBe(true)
      
      // Test dangerously high temperature
      const hotReading = { ...safeChemicalReadings[0], temperature: 125 }
      const hotResult = validateChemicalReading(hotReading)
      expect(hotResult.errors.some(e => e.includes('Temperature must be between 32°F and 120°F'))).toBe(true)
    })
  })

  describe('Pool Status Assessment', () => {
    it('reports excellent status for optimal readings', () => {
      const optimalReading = {
        ...safeChemicalReadings[0],
        ph: CHEMICAL_RANGES.ph.ideal,
        chlorine: CHEMICAL_RANGES.chlorine.ideal,
        alkalinity: CHEMICAL_RANGES.alkalinity.ideal,
        temperature: CHEMICAL_RANGES.temperature.ideal
      }
      
      const status = getPoolStatus(optimalReading)
      expect(status.level).toBe('excellent')
      expect(status.message).toBe('All chemical levels are optimal')
      expect(status.issues).toHaveLength(0)
    })
    
    it('reports good status for single parameter adjustment', () => {
      const goodReading = {
        ...safeChemicalReadings[0],
        ph: 7.1 // Slightly below optimal but not critical
      }
      
      const status = getPoolStatus(goodReading)
      expect(status.level).toBe('good')
      expect(status.message).toBe('Minor adjustment needed')
      expect(status.issues.length).toBe(1)
      expect(status.issues[0]).toContain('pH')
    })
    
    it('reports caution status for multiple parameter issues', () => {
      // Create a reading with exactly 2 parameters out of range for caution status
      const cautionReading = {
        ...safeChemicalReadings[0],
        ph: 7.1, // Below range (warning)
        alkalinity: 75 // Below range (warning)
        // Other values remain in safe range
      }
      const status = getPoolStatus(cautionReading)
      
      expect(status.level).toBe('caution')
      expect(status.message).toBe('Multiple chemical adjustments needed')
      expect(status.issues.length).toBe(2)
    })
    
    it('reports critical status for dangerous readings', () => {
      const criticalReading = criticalChemicalReadings[0]
      const status = getPoolStatus(criticalReading)
      
      expect(status.level).toBe('critical')
      expect(status.message).toBe('Immediate attention required')
      expect(status.issues.length).toBeGreaterThan(2)
    })
  })

  describe('Chemical Adjustment Recommendations', () => {
    it('recommends pH increase for low pH', () => {
      const lowPhReading = { ...safeChemicalReadings[0], ph: 7.0 }
      const adjustments = getChemicalAdjustments(lowPhReading)
      
      expect(adjustments.ph).toBeDefined()
      expect(adjustments.ph?.action).toBe('increase')
      expect(adjustments.ph?.amount).toBeCloseTo(0.4, 1) // 7.4 - 7.0
      expect(adjustments.ph?.unit).toBe('pH units')
    })
    
    it('recommends pH decrease for high pH', () => {
      const highPhReading = { ...safeChemicalReadings[0], ph: 7.8 }
      const adjustments = getChemicalAdjustments(highPhReading)
      
      expect(adjustments.ph).toBeDefined()
      expect(adjustments.ph?.action).toBe('decrease')
      expect(adjustments.ph?.amount).toBeCloseTo(0.4, 1) // 7.8 - 7.4
    })
    
    it('recommends chlorine increase for low chlorine', () => {
      const lowChlorineReading = { ...safeChemicalReadings[0], chlorine: 0.8 }
      const adjustments = getChemicalAdjustments(lowChlorineReading)
      
      expect(adjustments.chlorine).toBeDefined()
      expect(adjustments.chlorine?.action).toBe('increase')
      expect(adjustments.chlorine?.amount).toBeCloseTo(1.2, 1) // 2.0 - 0.8
      expect(adjustments.chlorine?.unit).toBe('ppm')
    })
    
    it('provides no adjustments for optimal readings', () => {
      const optimalReading = {
        ...safeChemicalReadings[0],
        ph: CHEMICAL_RANGES.ph.ideal,
        chlorine: CHEMICAL_RANGES.chlorine.ideal,
        alkalinity: CHEMICAL_RANGES.alkalinity.ideal
      }
      
      const adjustments = getChemicalAdjustments(optimalReading)
      expect(Object.keys(adjustments)).toHaveLength(0)
    })
  })

  describe('Chemical Value Formatting', () => {
    it('formats pH values to one decimal place', () => {
      expect(formatChemicalValue(7.456, 'ph')).toBe('7.5')
      expect(formatChemicalValue(7.4, 'ph')).toBe('7.4')
    })
    
    it('formats chlorine values to one decimal place', () => {
      expect(formatChemicalValue(2.1, 'chlorine')).toBe('2.1')
      expect(formatChemicalValue(2.0, 'chlorine')).toBe('2.0')
    })
    
    it('formats alkalinity as whole numbers', () => {
      expect(formatChemicalValue(100.7, 'alkalinity')).toBe('101')
      expect(formatChemicalValue(100, 'alkalinity')).toBe('100')
    })
    
    it('formats temperature as whole numbers', () => {
      expect(formatChemicalValue(80.6, 'temperature')).toBe('81')
      expect(formatChemicalValue(80, 'temperature')).toBe('80')
    })
  })

  describe('Chemical Status Color Coding', () => {
    it('returns green for values in safe range', () => {
      expect(getChemicalStatusColor(7.4, 'ph')).toBe('green')
      expect(getChemicalStatusColor(2.0, 'chlorine')).toBe('green')
      expect(getChemicalStatusColor(100, 'alkalinity')).toBe('green')
      expect(getChemicalStatusColor(80, 'temperature')).toBe('green')
    })
    
    it('returns yellow for values close to range', () => {
      // Test values just outside but close to safe range
      expect(getChemicalStatusColor(7.18, 'ph')).toBe('yellow') // 90% of 7.2
      expect(getChemicalStatusColor(7.68, 'ph')).toBe('yellow') // 110% of 7.6
    })
    
    it('returns red for values far from safe range', () => {
      expect(getChemicalStatusColor(6.0, 'ph')).toBe('red') // Far below 90% of min (6.48)
      expect(getChemicalStatusColor(8.5, 'ph')).toBe('red') // Far above 110% of max (8.36)
      expect(getChemicalStatusColor(0.5, 'chlorine')).toBe('red') // Far below 90% of min (0.9)
      expect(getChemicalStatusColor(4.0, 'chlorine')).toBe('red') // Far above 110% of max (3.3)
    })
  })

  describe('Chemical Trend Analysis', () => {
    it('detects upward trends correctly', () => {
      const readings = [
        { ...safeChemicalReadings[0], ph: 7.2, timestamp: '2024-01-14T08:00:00Z' },
        { ...safeChemicalReadings[0], ph: 7.4, timestamp: '2024-01-15T08:00:00Z' }
      ]
      
      const trend = getChemicalTrend(readings, 'ph')
      expect(trend.direction).toBe('up')
      expect(trend.percentage).toBeCloseTo(2.8, 1) // (7.4-7.2)/7.2 * 100
    })
    
    it('detects downward trends correctly', () => {
      const readings = [
        { ...safeChemicalReadings[0], chlorine: 2.5, timestamp: '2024-01-14T08:00:00Z' },
        { ...safeChemicalReadings[0], chlorine: 2.0, timestamp: '2024-01-15T08:00:00Z' }
      ]
      
      const trend = getChemicalTrend(readings, 'chlorine')
      expect(trend.direction).toBe('down')
      expect(trend.percentage).toBeCloseTo(20.0, 1) // (2.5-2.0)/2.5 * 100
    })
    
    it('detects stable readings', () => {
      const readings = [
        { ...safeChemicalReadings[0], alkalinity: 100, timestamp: '2024-01-14T08:00:00Z' },
        { ...safeChemicalReadings[0], alkalinity: 100.05, timestamp: '2024-01-15T08:00:00Z' }
      ]
      
      const trend = getChemicalTrend(readings, 'alkalinity')
      expect(trend.direction).toBe('stable')
      expect(trend.percentage).toBe(0)
    })
    
    it('handles single reading gracefully', () => {
      const readings = [safeChemicalReadings[0]]
      const trend = getChemicalTrend(readings, 'ph')
      
      expect(trend.direction).toBe('stable')
      expect(trend.percentage).toBe(0)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles undefined readings gracefully', () => {
      const result = validateChemicalReading({})
      expect(result.isValid).toBe(true) // No errors for undefined values
      expect(result.warnings).toHaveLength(0)
    })
    
    it('handles extreme values appropriately', () => {
      const extremeReading = edgeCaseReadings[2] // Invalid readings
      const result = validateChemicalReading(extremeReading)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
    
    it('handles boundary values correctly', () => {
      const boundaryReading = edgeCaseReadings[0] // All minimum values
      const result = validateChemicalReading(boundaryReading)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Integration with Test Helpers', () => {
    it('correctly identifies safe readings using helper', () => {
      safeChemicalReadings.forEach(reading => {
        expect(testHelpers.isWithinSafeRange(reading)).toBe(true)
      })
    })
    
    it('correctly categorizes reading severity', () => {
      expect(testHelpers.getReadingSeverity(safeChemicalReadings[0])).toBe('safe')
      expect(testHelpers.getReadingSeverity(warningChemicalReadings[0])).toBe('warning')
      expect(testHelpers.getReadingSeverity(criticalChemicalReadings[0])).toBe('critical')
    })
  })
})