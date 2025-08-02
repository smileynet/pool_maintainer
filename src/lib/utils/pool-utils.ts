/**
 * Pool maintenance specific utility functions
 */

/**
 * Chemical reading types
 */
export interface ChemicalReading {
  id: string
  timestamp: Date | string
  chlorine: number
  ph: number
  alkalinity: number
  temperature: number
  notes?: string
}

/**
 * Pool status levels
 */
export type PoolStatusLevel = 'excellent' | 'good' | 'caution' | 'critical'

/**
 * Chemical range definitions
 */
export const CHEMICAL_RANGES = {
  chlorine: { min: 1.0, max: 3.0, ideal: 2.0 },
  ph: { min: 7.2, max: 7.6, ideal: 7.4 },
  alkalinity: { min: 80, max: 120, ideal: 100 },
  temperature: { min: 78, max: 84, ideal: 80 }
} as const

/**
 * Validates chemical reading values
 */
export function validateChemicalReading(reading: Partial<ChemicalReading>): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (reading.chlorine !== undefined) {
    if (reading.chlorine < 0) {
      errors.push('Chlorine level cannot be negative')
    } else if (reading.chlorine < CHEMICAL_RANGES.chlorine.min) {
      warnings.push(`Chlorine level (${reading.chlorine}) is below recommended minimum (${CHEMICAL_RANGES.chlorine.min})`)
    } else if (reading.chlorine > CHEMICAL_RANGES.chlorine.max) {
      warnings.push(`Chlorine level (${reading.chlorine}) is above recommended maximum (${CHEMICAL_RANGES.chlorine.max})`)
    }
  }
  
  if (reading.ph !== undefined) {
    if (reading.ph < 0 || reading.ph > 14) {
      errors.push('pH must be between 0 and 14')
    } else if (reading.ph < CHEMICAL_RANGES.ph.min) {
      warnings.push(`pH level (${reading.ph}) is below recommended minimum (${CHEMICAL_RANGES.ph.min})`)
    } else if (reading.ph > CHEMICAL_RANGES.ph.max) {
      warnings.push(`pH level (${reading.ph}) is above recommended maximum (${CHEMICAL_RANGES.ph.max})`)
    }
  }
  
  if (reading.alkalinity !== undefined) {
    if (reading.alkalinity < 0) {
      errors.push('Alkalinity cannot be negative')
    } else if (reading.alkalinity < CHEMICAL_RANGES.alkalinity.min) {
      warnings.push(`Alkalinity (${reading.alkalinity}) is below recommended minimum (${CHEMICAL_RANGES.alkalinity.min})`)
    } else if (reading.alkalinity > CHEMICAL_RANGES.alkalinity.max) {
      warnings.push(`Alkalinity (${reading.alkalinity}) is above recommended maximum (${CHEMICAL_RANGES.alkalinity.max})`)
    }
  }
  
  if (reading.temperature !== undefined) {
    if (reading.temperature < 32 || reading.temperature > 120) {
      errors.push('Temperature must be between 32°F and 120°F')
    } else if (reading.temperature < CHEMICAL_RANGES.temperature.min) {
      warnings.push(`Temperature (${reading.temperature}°F) is below recommended minimum (${CHEMICAL_RANGES.temperature.min}°F)`)
    } else if (reading.temperature > CHEMICAL_RANGES.temperature.max) {
      warnings.push(`Temperature (${reading.temperature}°F) is above recommended maximum (${CHEMICAL_RANGES.temperature.max}°F)`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Gets the overall pool status based on chemical readings
 */
export function getPoolStatus(reading: ChemicalReading): {
  level: PoolStatusLevel
  message: string
  issues: string[]
} {
  const validation = validateChemicalReading(reading)
  const issues: string[] = []
  
  if (validation.errors.length > 0) {
    return {
      level: 'critical',
      message: 'Critical chemical imbalance detected',
      issues: validation.errors
    }
  }
  
  let warningCount = 0
  
  // Check each chemical level
  if (reading.chlorine < CHEMICAL_RANGES.chlorine.min || reading.chlorine > CHEMICAL_RANGES.chlorine.max) {
    warningCount++
    issues.push(`Chlorine: ${reading.chlorine} ppm`)
  }
  
  if (reading.ph < CHEMICAL_RANGES.ph.min || reading.ph > CHEMICAL_RANGES.ph.max) {
    warningCount++
    issues.push(`pH: ${reading.ph}`)
  }
  
  if (reading.alkalinity < CHEMICAL_RANGES.alkalinity.min || reading.alkalinity > CHEMICAL_RANGES.alkalinity.max) {
    warningCount++
    issues.push(`Alkalinity: ${reading.alkalinity} ppm`)
  }
  
  if (reading.temperature < CHEMICAL_RANGES.temperature.min || reading.temperature > CHEMICAL_RANGES.temperature.max) {
    warningCount++
    issues.push(`Temperature: ${reading.temperature}°F`)
  }
  
  // Determine status level
  if (warningCount === 0) {
    return {
      level: 'excellent',
      message: 'All chemical levels are optimal',
      issues: []
    }
  } else if (warningCount === 1) {
    return {
      level: 'good',
      message: 'Minor adjustment needed',
      issues
    }
  } else if (warningCount === 2) {
    return {
      level: 'caution',
      message: 'Multiple chemical adjustments needed',
      issues
    }
  } else {
    return {
      level: 'critical',
      message: 'Immediate attention required',
      issues
    }
  }
}

/**
 * Calculates chemical adjustment recommendations
 */
export function getChemicalAdjustments(reading: ChemicalReading): {
  chlorine?: { action: 'increase' | 'decrease'; amount: number; unit: string }
  ph?: { action: 'increase' | 'decrease'; amount: number; unit: string }
  alkalinity?: { action: 'increase' | 'decrease'; amount: number; unit: string }
} {
  const adjustments: any = {}
  
  // Chlorine adjustments
  if (reading.chlorine < CHEMICAL_RANGES.chlorine.min) {
    const deficit = CHEMICAL_RANGES.chlorine.ideal - reading.chlorine
    adjustments.chlorine = {
      action: 'increase',
      amount: Math.round(deficit * 10) / 10,
      unit: 'ppm'
    }
  } else if (reading.chlorine > CHEMICAL_RANGES.chlorine.max) {
    const excess = reading.chlorine - CHEMICAL_RANGES.chlorine.ideal
    adjustments.chlorine = {
      action: 'decrease',
      amount: Math.round(excess * 10) / 10,
      unit: 'ppm'
    }
  }
  
  // pH adjustments
  if (reading.ph < CHEMICAL_RANGES.ph.min) {
    const deficit = CHEMICAL_RANGES.ph.ideal - reading.ph
    adjustments.ph = {
      action: 'increase',
      amount: Math.round(deficit * 10) / 10,
      unit: 'pH units'
    }
  } else if (reading.ph > CHEMICAL_RANGES.ph.max) {
    const excess = reading.ph - CHEMICAL_RANGES.ph.ideal
    adjustments.ph = {
      action: 'decrease',
      amount: Math.round(excess * 10) / 10,
      unit: 'pH units'
    }
  }
  
  // Alkalinity adjustments
  if (reading.alkalinity < CHEMICAL_RANGES.alkalinity.min) {
    const deficit = CHEMICAL_RANGES.alkalinity.ideal - reading.alkalinity
    adjustments.alkalinity = {
      action: 'increase',
      amount: Math.round(deficit),
      unit: 'ppm'
    }
  } else if (reading.alkalinity > CHEMICAL_RANGES.alkalinity.max) {
    const excess = reading.alkalinity - CHEMICAL_RANGES.alkalinity.ideal
    adjustments.alkalinity = {
      action: 'decrease',
      amount: Math.round(excess),
      unit: 'ppm'
    }
  }
  
  return adjustments
}

/**
 * Formats chemical value with appropriate precision
 */
export function formatChemicalValue(value: number, type: keyof typeof CHEMICAL_RANGES): string {
  switch (type) {
    case 'chlorine':
    case 'ph':
      return value.toFixed(1)
    case 'alkalinity':
      return Math.round(value).toString()
    case 'temperature':
      return Math.round(value).toString()
    default:
      return value.toString()
  }
}

/**
 * Gets the color for a chemical status
 */
export function getChemicalStatusColor(value: number, type: keyof typeof CHEMICAL_RANGES): string {
  const range = CHEMICAL_RANGES[type]
  
  if (value >= range.min && value <= range.max) {
    return 'green' // Good range
  } else if (
    (value >= range.min * 0.9 && value < range.min) ||
    (value > range.max && value <= range.max * 1.1)
  ) {
    return 'yellow' // Close to range
  } else {
    return 'red' // Out of range
  }
}

/**
 * Calculates trending direction for chemical readings
 */
export function getChemicalTrend(readings: ChemicalReading[], chemical: keyof typeof CHEMICAL_RANGES): {
  direction: 'up' | 'down' | 'stable'
  percentage: number
} {
  if (readings.length < 2) {
    return { direction: 'stable', percentage: 0 }
  }
  
  // Sort by timestamp (most recent first)
  const sorted = [...readings].sort((a, b) => {
    const dateA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp
    const dateB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp
    return dateB.getTime() - dateA.getTime()
  })
  
  const latest = sorted[0][chemical]
  const previous = sorted[1][chemical]
  
  const change = latest - previous
  const percentage = Math.abs((change / previous) * 100)
  
  if (Math.abs(change) < 0.1) {
    return { direction: 'stable', percentage: 0 }
  } else if (change > 0) {
    return { direction: 'up', percentage: Math.round(percentage * 10) / 10 }
  } else {
    return { direction: 'down', percentage: Math.round(percentage * 10) / 10 }
  }
}

/**
 * Generates pool maintenance schedule
 */
export function generateMaintenanceSchedule(poolSize: number): {
  daily: string[]
  weekly: string[]
  monthly: string[]
  seasonal: string[]
} {
  return {
    daily: [
      'Check pool skimmer and remove debris',
      'Test chlorine and pH levels',
      'Run pool pump for 8-12 hours',
      'Check pool equipment operation'
    ],
    weekly: [
      'Brush pool walls and floor',
      'Vacuum pool thoroughly',
      'Clean skimmer baskets',
      'Test total alkalinity',
      'Shock pool if needed',
      'Clean pool deck area'
    ],
    monthly: [
      'Test calcium hardness',
      'Clean pool filter',
      'Inspect pool equipment',
      'Check pool lighting',
      'Test and calibrate chemical feeders',
      'Trim vegetation around pool area'
    ],
    seasonal: [
      'Professional equipment inspection',
      'Deep clean pool tiles',
      'Inspect and replace worn gaskets',
      'Check pool heater efficiency',
      'Winterization preparation (if applicable)',
      'Update pool equipment warranties'
    ]
  }
}

/**
 * Calculates chemical costs estimation
 */
export function estimateChemicalCosts(
  poolSize: number, // in gallons
  frequency: 'weekly' | 'monthly' | 'yearly'
): {
  chlorine: number
  phAdjuster: number
  alkalinityAdjuster: number
  shock: number
  total: number
} {
  // Base costs per 10,000 gallons per week
  const baseCosts = {
    chlorine: 15.00,
    phAdjuster: 5.00,
    alkalinityAdjuster: 8.00,
    shock: 12.00
  }
  
  const multiplier = poolSize / 10000
  const weeklyCosts = {
    chlorine: baseCosts.chlorine * multiplier,
    phAdjuster: baseCosts.phAdjuster * multiplier,
    alkalinityAdjuster: baseCosts.alkalinityAdjuster * multiplier,
    shock: baseCosts.shock * multiplier
  }
  
  let costs = { ...weeklyCosts }
  
  if (frequency === 'monthly') {
    costs = Object.fromEntries(
      Object.entries(costs).map(([key, value]) => [key, value * 4.33])
    ) as typeof costs
  } else if (frequency === 'yearly') {
    costs = Object.fromEntries(
      Object.entries(costs).map(([key, value]) => [key, value * 52])
    ) as typeof costs
  }
  
  const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0)
  
  return {
    ...costs,
    total: Math.round(total * 100) / 100
  }
}