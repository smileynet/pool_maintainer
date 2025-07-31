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

// Import functionality for migrating from existing spreadsheets
export interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: Array<{
    row: number
    message: string
    data?: unknown
  }>
}

export const importTestsFromCSV = (csvContent: string): ImportResult => {
  const result: ImportResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
  }

  try {
    const lines = csvContent.trim().split('\n')
    if (lines.length < 2) {
      result.errors.push({ row: 0, message: 'CSV file appears to be empty or has no data rows' })
      return result
    }

    // Parse header row to determine column mapping
    const headerLine = lines[0]
    const headers = parseCSVRow(headerLine).map((h) => h.toLowerCase().trim())

    // Expected headers (flexible matching)
    const columnMap = mapCSVColumns(headers)

    if (!columnMap.isValid) {
      result.errors.push({
        row: 0,
        message:
          'CSV headers do not match expected format. Required: Pool Name, Technician, and at least one chemical reading',
      })
      return result
    }

    const existingTests = getChemicalTests()
    const existingIds = new Set(existingTests.map((t) => t.id))
    const importedTests: ChemicalTest[] = []

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue // Skip empty lines

      try {
        const values = parseCSVRow(line)
        const test = parseCSVRowToTest(values, columnMap, i + 1)

        if (!test) {
          result.skipped++
          continue
        }

        // Check for duplicate IDs
        if (existingIds.has(test.id)) {
          result.errors.push({
            row: i + 1,
            message: `Test ID ${test.id} already exists - skipping`,
            data: { id: test.id },
          })
          result.skipped++
          continue
        }

        importedTests.push(test)
        existingIds.add(test.id)
        result.imported++
      } catch (error) {
        result.errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : 'Failed to parse row',
          data: { line },
        })
      }
    }

    // Save imported tests
    if (importedTests.length > 0) {
      const allTests = [...existingTests, ...importedTests]
      localStorage.setItem(STORAGE_KEYS.CHEMICAL_TESTS, JSON.stringify(allTests))

      // Add new technician names
      const newTechnicians = [...new Set(importedTests.map((t) => t.technician))]
      const existingTechnicians = getTechnicianNames()
      const uniqueNewTechnicians = newTechnicians.filter((t) => !existingTechnicians.includes(t))

      if (uniqueNewTechnicians.length > 0) {
        const updatedTechnicians = [...existingTechnicians, ...uniqueNewTechnicians]
        localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(updatedTechnicians))
      }
    }

    result.success = result.imported > 0 || result.errors.length === 0
    return result
  } catch (error) {
    result.errors.push({
      row: 0,
      message: error instanceof Error ? error.message : 'Failed to parse CSV file',
    })
    return result
  }
}

// Helper function to parse CSV row (handles quoted values)
const parseCSVRow = (row: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < row.length) {
    const char = row[i]
    const nextChar = row[i + 1]

    if (char === '"' && !inQuotes) {
      inQuotes = true
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = false
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
    i++
  }

  result.push(current.trim())
  return result
}

// Helper function to map CSV columns to our data structure
const mapCSVColumns = (headers: string[]) => {
  const map: Record<string, number> = {}
  let isValid = false

  // Required fields
  const requiredMappings = [
    { field: 'poolName', patterns: ['pool name', 'pool', 'facility', 'pool facility'] },
    { field: 'technician', patterns: ['technician', 'tech', 'operator', 'staff'] },
  ]

  // Optional fields with flexible matching
  const optionalMappings = [
    { field: 'id', patterns: ['id', 'test id', 'test_id'] },
    { field: 'poolId', patterns: ['pool id', 'pool_id', 'facility id'] },
    { field: 'date', patterns: ['date', 'test date', 'timestamp'] },
    { field: 'time', patterns: ['time', 'test time'] },
    { field: 'freeChlorine', patterns: ['free chlorine', 'free chlorine (ppm)', 'cl', 'chlorine'] },
    { field: 'totalChlorine', patterns: ['total chlorine', 'total chlorine (ppm)', 'total cl'] },
    { field: 'ph', patterns: ['ph', 'ph level', 'ph value'] },
    {
      field: 'alkalinity',
      patterns: ['alkalinity', 'total alkalinity', 'alkalinity (ppm)', 'alk'],
    },
    {
      field: 'cyanuricAcid',
      patterns: ['cyanuric acid', 'cyanuric acid (ppm)', 'cya', 'stabilizer'],
    },
    { field: 'calcium', patterns: ['calcium', 'calcium hardness', 'calcium hardness (ppm)', 'ch'] },
    { field: 'temperature', patterns: ['temperature', 'temp', 'water temp', 'temperature (°f)'] },
    { field: 'status', patterns: ['status', 'test status'] },
    { field: 'notes', patterns: ['notes', 'comments', 'observations'] },
  ]

  // Map headers to fields
  headers.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().trim()

    const allMappings = [...requiredMappings, ...optionalMappings]
    allMappings.forEach((mapping) => {
      if (mapping.patterns.some((pattern) => normalizedHeader.includes(pattern))) {
        if (!map[mapping.field]) {
          // Use first match
          map[mapping.field] = index
        }
      }
    })
  })

  // Check if we have minimum required fields
  const hasPoolName = 'poolName' in map
  const hasTechnician = 'technician' in map
  const hasChemicalData = ['freeChlorine', 'ph', 'alkalinity'].some((field) => field in map)

  isValid = hasPoolName && hasTechnician && hasChemicalData

  return { map, isValid }
}

// Helper function to convert CSV row to ChemicalTest
const parseCSVRowToTest = (
  values: string[],
  columnMap: ReturnType<typeof mapCSVColumns>,
  rowNumber: number
): ChemicalTest | null => {
  const { map } = columnMap

  try {
    // Required fields
    const poolName = values[map.poolName]?.trim()
    const technician = values[map.technician]?.trim()

    if (!poolName || !technician) {
      throw new Error('Missing required fields: Pool Name and Technician')
    }

    // Generate IDs if not provided
    const id = values[map.id]?.trim() || `IMPORT-${Date.now()}-${rowNumber}`
    const poolId =
      values[map.poolId]?.trim() || `POOL-${poolName.replace(/\s+/g, '-').toUpperCase()}`

    // Parse date and time
    let timestamp = new Date().toISOString()
    if (map.date !== undefined && values[map.date]) {
      const dateStr = values[map.date].trim()
      const timeStr = map.time !== undefined ? values[map.time]?.trim() : ''

      const combinedDateTime = timeStr ? `${dateStr} ${timeStr}` : dateStr
      const parsedDate = new Date(combinedDateTime)

      if (!isNaN(parsedDate.getTime())) {
        timestamp = parsedDate.toISOString()
      }
    }

    // Parse chemical readings
    const readings: ChemicalReading = {
      freeChlorine: parseFloat(values[map.freeChlorine] || '0') || 0,
      totalChlorine: parseFloat(values[map.totalChlorine] || '0') || 0,
      ph: parseFloat(values[map.ph] || '0') || 0,
      alkalinity: parseFloat(values[map.alkalinity] || '0') || 0,
      cyanuricAcid: parseFloat(values[map.cyanuricAcid] || '0') || 0,
      calcium: parseFloat(values[map.calcium] || '0') || 0,
      temperature: parseFloat(values[map.temperature] || '0') || 0,
    }

    // Validate that we have at least some chemical data
    const hasAnyReadings = Object.values(readings).some((val) => val > 0)
    if (!hasAnyReadings) {
      throw new Error('No valid chemical readings found')
    }

    // Parse status
    const statusValue = values[map.status]?.trim().toLowerCase()
    let status: ChemicalTest['status'] = 'submitted'

    if (statusValue) {
      const validStatuses = ['draft', 'submitted', 'approved', 'flagged', 'emergency']
      if (validStatuses.includes(statusValue)) {
        status = statusValue as ChemicalTest['status']
      }
    }

    // Parse notes
    const notes = values[map.notes]?.trim() || ''

    const test: ChemicalTest = {
      id,
      poolId,
      poolName,
      readings,
      technician,
      timestamp,
      notes,
      status,
    }

    return test
  } catch (error) {
    throw new Error(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Parse error'}`)
  }
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
