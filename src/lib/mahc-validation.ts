/**
 * MAHC (Model Aquatic Health Code) Compliance Validation Utilities
 *
 * This module provides comprehensive validation functions for pool chemical levels
 * according to MAHC standards and best practices for aquatic facility safety.
 */

// MAHC Chemical Standards with source references
export const MAHC_STANDARDS = {
  freeChlorine: {
    min: 1.0,
    max: 3.0,
    unit: 'ppm',
    ideal: { min: 1.5, max: 2.5 },
    description: 'Free Available Chlorine',
    regulation: 'MAHC 5.7.3.1.1',
    criticalLow: 0.5, // Below this level requires immediate pool closure
    criticalHigh: 5.0, // Above this level requires immediate attention
  },
  totalChlorine: {
    min: 1.0,
    max: 4.0,
    unit: 'ppm',
    ideal: { min: 1.5, max: 3.0 },
    description: 'Total Available Chlorine',
    regulation: 'MAHC 5.7.3.1.2',
    criticalLow: 0.5,
    criticalHigh: 6.0,
  },
  ph: {
    min: 7.2,
    max: 7.6,
    unit: '',
    ideal: { min: 7.3, max: 7.5 },
    description: 'pH Level',
    regulation: 'MAHC 5.7.3.2',
    criticalLow: 6.8,
    criticalHigh: 8.0,
  },
  alkalinity: {
    min: 80,
    max: 120,
    unit: 'ppm',
    ideal: { min: 90, max: 110 },
    description: 'Total Alkalinity',
    regulation: 'MAHC 5.7.3.3',
    criticalLow: 60,
    criticalHigh: 180,
  },
  cyanuricAcid: {
    min: 30,
    max: 50,
    unit: 'ppm',
    ideal: { min: 35, max: 45 },
    description: 'Cyanuric Acid (Stabilizer)',
    regulation: 'MAHC 5.7.3.4',
    criticalLow: 10,
    criticalHigh: 100,
  },
  calcium: {
    min: 200,
    max: 400,
    unit: 'ppm',
    ideal: { min: 250, max: 350 },
    description: 'Calcium Hardness',
    regulation: 'MAHC 5.7.3.5',
    criticalLow: 150,
    criticalHigh: 500,
  },
  temperature: {
    min: 78,
    max: 84,
    unit: '°F',
    ideal: { min: 80, max: 82 },
    description: 'Water Temperature',
    regulation: 'MAHC 4.7.3.1',
    criticalLow: 75,
    criticalHigh: 90,
  },
} as const

export type ChemicalType = keyof typeof MAHC_STANDARDS

// Validation result types
export interface ValidationResult {
  status: 'good' | 'warning' | 'critical' | 'emergency'
  severity: 'low' | 'medium' | 'high' | 'critical'
  color: string
  bgColor: string
  borderColor: string
  message: string
  recommendation?: string
  requiresAction: boolean
  requiresClosure: boolean
}

export interface ComplianceReport {
  overall: 'compliant' | 'warning' | 'non-compliant' | 'emergency'
  totalTests: number
  passedTests: number
  warningTests: number
  criticalTests: number
  emergencyTests: number
  details: Array<{
    chemical: ChemicalType
    value: number
    validation: ValidationResult
  }>
  recommendations: string[]
  requiredActions: string[]
}

/**
 * Validates a single chemical reading against MAHC standards
 */
export function validateChemical(value: number, chemical: ChemicalType): ValidationResult {
  const standard = MAHC_STANDARDS[chemical]

  // Emergency level check (immediate pool closure required)
  if (value <= standard.criticalLow || value >= standard.criticalHigh) {
    return {
      status: 'emergency',
      severity: 'critical',
      color: 'text-red-900',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500',
      message: `EMERGENCY: ${standard.description} critically out of range`,
      recommendation: `Immediate pool closure required. Contact facility manager.`,
      requiresAction: true,
      requiresClosure: true,
    }
  }

  // Critical level check (outside MAHC compliance)
  if (value < standard.min || value > standard.max) {
    const direction = value < standard.min ? 'low' : 'high'
    return {
      status: 'critical',
      severity: 'high',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      message: `CRITICAL: ${standard.description} too ${direction} (${value} ${standard.unit})`,
      recommendation: getRecommendation(chemical, value, direction),
      requiresAction: true,
      requiresClosure: false,
    }
  }

  // Warning level check (outside ideal range but within compliance)
  if (value < standard.ideal.min || value > standard.ideal.max) {
    const direction = value < standard.ideal.min ? 'low' : 'high'
    return {
      status: 'warning',
      severity: 'medium',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      message: `WARNING: ${standard.description} outside ideal range (${value} ${standard.unit})`,
      recommendation: getRecommendation(chemical, value, direction),
      requiresAction: true,
      requiresClosure: false,
    }
  }

  // Good level (within ideal range)
  return {
    status: 'good',
    severity: 'low',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    message: `GOOD: ${standard.description} within ideal range (${value} ${standard.unit})`,
    requiresAction: false,
    requiresClosure: false,
  }
}

/**
 * Generates specific recommendations for chemical adjustments
 */
function getRecommendation(
  chemical: ChemicalType,
  value: number,
  direction: 'low' | 'high'
): string {
  const recommendations: Record<ChemicalType, Record<'low' | 'high', string>> = {
    freeChlorine: {
      low: 'Add liquid chlorine or granular chlorine. Check chlorine feeder operation.',
      high: 'Reduce chlorine addition. Allow natural dissipation or add sodium thiosulfate.',
    },
    totalChlorine: {
      low: 'Increase chlorine levels. Check for chloramine formation.',
      high: 'Shock treatment may be needed to break chloramines. Test combined chlorine levels.',
    },
    ph: {
      low: 'Add sodium carbonate (soda ash) to raise pH. Check alkalinity first.',
      high: 'Add muriatic acid or sodium bisulfate to lower pH. Test in small increments.',
    },
    alkalinity: {
      low: 'Add sodium bicarbonate (baking soda) to increase alkalinity.',
      high: 'Add muriatic acid to lower alkalinity. Monitor pH changes closely.',
    },
    cyanuricAcid: {
      low: 'Add cyanuric acid (stabilizer). Only needed for outdoor pools with chlorine.',
      high: 'Partial drain and refill required. Cannot be chemically reduced.',
    },
    calcium: {
      low: 'Add calcium chloride to increase hardness. Prevents equipment corrosion.',
      high: 'Partial drain and refill required. Check for scale formation on surfaces.',
    },
    temperature: {
      low: 'Check heater operation. Adjust thermostat settings.',
      high: 'Check cooling system. Reduce heater temperature or increase circulation.',
    },
  }

  return recommendations[chemical][direction]
}

/**
 * Validates multiple chemical readings and generates compliance report
 */
export function generateComplianceReport(
  readings: Partial<Record<ChemicalType, number>>
): ComplianceReport {
  const details: ComplianceReport['details'] = []
  const recommendations: string[] = []
  const requiredActions: string[] = []

  let passedTests = 0
  let warningTests = 0
  let criticalTests = 0
  let emergencyTests = 0

  // Validate each chemical reading
  Object.entries(readings).forEach(([chemical, value]) => {
    if (value !== undefined && value !== null) {
      const validation = validateChemical(value, chemical as ChemicalType)

      details.push({
        chemical: chemical as ChemicalType,
        value,
        validation,
      })

      // Count by severity
      switch (validation.status) {
        case 'good':
          passedTests++
          break
        case 'warning':
          warningTests++
          if (validation.recommendation) recommendations.push(validation.recommendation)
          break
        case 'critical':
          criticalTests++
          if (validation.recommendation) requiredActions.push(validation.recommendation)
          break
        case 'emergency':
          emergencyTests++
          requiredActions.push('IMMEDIATE POOL CLOSURE REQUIRED')
          if (validation.recommendation) requiredActions.push(validation.recommendation)
          break
      }
    }
  })

  const totalTests = details.length

  // Determine overall compliance status
  let overall: ComplianceReport['overall'] = 'compliant'
  if (emergencyTests > 0) {
    overall = 'emergency'
  } else if (criticalTests > 0) {
    overall = 'non-compliant'
  } else if (warningTests > 0) {
    overall = 'warning'
  }

  return {
    overall,
    totalTests,
    passedTests,
    warningTests,
    criticalTests,
    emergencyTests,
    details,
    recommendations: [...new Set(recommendations)], // Remove duplicates
    requiredActions: [...new Set(requiredActions)], // Remove duplicates
  }
}

/**
 * Checks if pool should be closed based on chemical readings
 */
export function shouldClosePool(readings: Partial<Record<ChemicalType, number>>): {
  shouldClose: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  Object.entries(readings).forEach(([chemical, value]) => {
    if (value !== undefined && value !== null) {
      const validation = validateChemical(value, chemical as ChemicalType)
      if (validation.requiresClosure) {
        reasons.push(
          `${MAHC_STANDARDS[chemical as ChemicalType].description}: ${validation.message}`
        )
      }
    }
  })

  return {
    shouldClose: reasons.length > 0,
    reasons,
  }
}

/**
 * Formats chemical value with appropriate precision and units
 */
export function formatChemicalValue(value: number, chemical: ChemicalType): string {
  const standard = MAHC_STANDARDS[chemical]
  const precision =
    chemical === 'ph' ? 1 : chemical === 'freeChlorine' || chemical === 'totalChlorine' ? 1 : 0

  return `${value.toFixed(precision)} ${standard.unit}`.trim()
}

/**
 * Gets the acceptable range string for a chemical
 */
export function getAcceptableRange(chemical: ChemicalType): string {
  const standard = MAHC_STANDARDS[chemical]
  return `${standard.min}-${standard.max} ${standard.unit}`.trim()
}

/**
 * Gets the ideal range string for a chemical
 */
export function getIdealRange(chemical: ChemicalType): string {
  const standard = MAHC_STANDARDS[chemical]
  return `${standard.ideal.min}-${standard.ideal.max} ${standard.unit}`.trim()
}

/**
 * Priority scoring for chemical issues (higher = more urgent)
 */
export function getChemicalPriority(chemical: ChemicalType, validation: ValidationResult): number {
  const basePriority: Record<ChemicalType, number> = {
    freeChlorine: 10, // Highest priority - safety critical
    ph: 9, // High priority - affects chlorine effectiveness
    totalChlorine: 8, // High priority - indicates chloramine issues
    alkalinity: 6, // Medium priority - affects pH stability
    cyanuricAcid: 4, // Lower priority - affects chlorine efficiency
    calcium: 3, // Lower priority - equipment protection
    temperature: 2, // Lowest priority - comfort issue
  }

  const severityMultiplier = {
    emergency: 4,
    critical: 3,
    warning: 2,
    good: 1,
  }

  return basePriority[chemical] * severityMultiplier[validation.status]
}
