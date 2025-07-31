// Local storage utilities for chemical test data management
// Provides spreadsheet-like data persistence for test results

export interface ChemicalReading {
  freeChlorine: number
  totalChlorine: number
  ph: number
  alkalinity: number
  cyanuricAcid: number
  calcium: number
  temperature: number
}

export interface ChemicalTest {
  id: string
  poolId: string
  poolName: string
  readings: ChemicalReading
  technician: string
  timestamp: string
  notes: string
  status: 'draft' | 'submitted' | 'approved' | 'flagged' | 'emergency'
  corrections?: {
    chemical: string
    amount: string
    action: string
  }[]
}

const STORAGE_KEYS = {
  CHEMICAL_TESTS: 'pool_maintenance_chemical_tests',
  DRAFTS: 'pool_maintenance_drafts',
  TECHNICIANS: 'pool_maintenance_technicians',
  POOLS: 'pool_maintenance_pools',
} as const

// Chemical test data management
export const saveChemicalTest = (test: ChemicalTest): boolean => {
  try {
    const existingTests = getChemicalTests()
    const updatedTests = existingTests.filter((t) => t.id !== test.id)
    updatedTests.push(test)

    localStorage.setItem(STORAGE_KEYS.CHEMICAL_TESTS, JSON.stringify(updatedTests))

    // Remove from drafts if it exists there
    if (test.status !== 'draft') {
      removeDraft(test.id)
    }

    return true
  } catch (error) {
    console.error('Failed to save chemical test:', error)
    return false
  }
}

export const getChemicalTests = (): ChemicalTest[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHEMICAL_TESTS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load chemical tests:', error)
    return []
  }
}

export const getChemicalTestById = (id: string): ChemicalTest | null => {
  const tests = getChemicalTests()
  return tests.find((test) => test.id === id) || null
}

export const deleteChemicalTest = (id: string): boolean => {
  try {
    const tests = getChemicalTests()
    const filteredTests = tests.filter((test) => test.id !== id)
    localStorage.setItem(STORAGE_KEYS.CHEMICAL_TESTS, JSON.stringify(filteredTests))
    return true
  } catch (error) {
    console.error('Failed to delete chemical test:', error)
    return false
  }
}

// Draft management for incomplete tests
export const saveDraft = (draft: Partial<ChemicalTest> & { id: string }): boolean => {
  try {
    const existingDrafts = getDrafts()
    const updatedDrafts = existingDrafts.filter((d) => d.id !== draft.id)
    updatedDrafts.push({ ...draft, status: 'draft' as const })

    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(updatedDrafts))
    return true
  } catch (error) {
    console.error('Failed to save draft:', error)
    return false
  }
}

export const getDrafts = (): Array<Partial<ChemicalTest> & { id: string }> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DRAFTS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load drafts:', error)
    return []
  }
}

export const removeDraft = (id: string): boolean => {
  try {
    const drafts = getDrafts()
    const filteredDrafts = drafts.filter((draft) => draft.id !== id)
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(filteredDrafts))
    return true
  } catch (error) {
    console.error('Failed to remove draft:', error)
    return false
  }
}

// Technician name management for auto-fill
export const addTechnicianName = (name: string): void => {
  try {
    const technicians = getTechnicianNames()
    if (!technicians.includes(name)) {
      technicians.push(name)
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(technicians))
    }
  } catch (error) {
    console.error('Failed to add technician name:', error)
  }
}

export const getTechnicianNames = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TECHNICIANS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load technician names:', error)
    return []
  }
}

// Pool data management
export const getPoolsByTests = (): Array<{ id: string; name: string; lastTested?: string }> => {
  try {
    const tests = getChemicalTests()
    const poolMap = new Map<string, { id: string; name: string; lastTested?: string }>()

    tests.forEach((test) => {
      const existing = poolMap.get(test.poolId)
      if (!existing || test.timestamp > (existing.lastTested || '')) {
        poolMap.set(test.poolId, {
          id: test.poolId,
          name: test.poolName,
          lastTested: test.timestamp,
        })
      }
    })

    return Array.from(poolMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Failed to get pools from tests:', error)
    return []
  }
}

// Export functionality for spreadsheet compatibility
export const exportTestsToCSV = (tests?: ChemicalTest[]): string => {
  const testsToExport = tests || getChemicalTests()

  const headers = [
    'ID',
    'Pool ID',
    'Pool Name',
    'Technician',
    'Date',
    'Time',
    'Free Chlorine (ppm)',
    'Total Chlorine (ppm)',
    'pH',
    'Alkalinity (ppm)',
    'Cyanuric Acid (ppm)',
    'Calcium Hardness (ppm)',
    'Temperature (°F)',
    'Status',
    'Notes',
  ]

  const rows = testsToExport.map((test) => {
    const date = new Date(test.timestamp)
    return [
      test.id,
      test.poolId,
      test.poolName,
      test.technician,
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      test.readings.freeChlorine,
      test.readings.totalChlorine,
      test.readings.ph,
      test.readings.alkalinity,
      test.readings.cyanuricAcid,
      test.readings.calcium,
      test.readings.temperature,
      test.status,
      test.notes,
    ]
  })

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

// Clear all data (for development/testing)
export const clearAllData = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error('Failed to clear data:', error)
    return false
  }
}

// Get summary statistics for dashboard
export const getTestSummary = () => {
  const tests = getChemicalTests()
  const drafts = getDrafts()

  return {
    totalTests: tests.length,
    draftCount: drafts.length,
    emergencyTests: tests.filter((t) => t.status === 'emergency').length,
    flaggedTests: tests.filter((t) => t.status === 'flagged').length,
    recentTests: tests
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5),
  }
}
