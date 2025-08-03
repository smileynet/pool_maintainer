import { vi } from 'vitest'

// Mock MAHC validation module
export const validateChemical = vi.fn((value: number, chemical: string) => ({
  status: 'good',
  severity: 'low',
  color: 'text-green-700',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-400',
  message: `${chemical} within ideal range`,
  requiresAction: false,
  requiresClosure: false,
}))

export const generateComplianceReport = vi.fn((readings) => ({
  overall: 'compliant',
  totalTests: Object.keys(readings).length,
  passedTests: Object.keys(readings).length,
  warningTests: 0,
  criticalTests: 0,
  emergencyTests: 0,
  details: [],
  recommendations: [],
  requiredActions: [],
}))

export const shouldClosePool = vi.fn(() => ({
  shouldClose: false,
  reasons: [],
}))

export const formatChemicalValue = vi.fn((value: number, chemical: string) => {
  return `${value} ppm`
})

export const getAcceptableRange = vi.fn((chemical: string) => {
  const ranges: Record<string, string> = {
    freeChlorine: '1.0-3.0 ppm',
    totalChlorine: '1.0-4.0 ppm',
    ph: '7.2-7.6',
    alkalinity: '80-120 ppm',
    cyanuricAcid: '30-50 ppm',
    calcium: '200-400 ppm',
    temperature: '78-84 °F',
  }
  return ranges[chemical] || '0-100'
})

export const getIdealRange = vi.fn((chemical: string) => {
  const ranges: Record<string, string> = {
    freeChlorine: '1.5-2.5 ppm',
    totalChlorine: '1.5-3.0 ppm',
    ph: '7.3-7.5',
    alkalinity: '90-110 ppm',
    cyanuricAcid: '35-45 ppm',
    calcium: '250-350 ppm',
    temperature: '80-82 °F',
  }
  return ranges[chemical] || '0-100'
})

export const getChemicalPriority = vi.fn(() => 1)

export const MAHC_STANDARDS = {
  freeChlorine: {
    min: 1.0,
    max: 3.0,
    unit: 'ppm',
    ideal: { min: 1.5, max: 2.5 },
    description: 'Free Available Chlorine',
    regulation: 'MAHC 5.7.3.1.1',
    criticalLow: 0.5,
    criticalHigh: 5.0,
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
}