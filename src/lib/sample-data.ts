/**
 * Sample data generator for Pool Maintenance System
 * Creates realistic demo data showcasing various pool scenarios
 */

import type { ChemicalTest, PoolFacility } from './localStorage'

// Helper to generate dates
const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const hoursAgo = (hours: number) => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

// Pool Facilities
export const samplePoolFacilities: PoolFacility[] = [
  {
    id: 'pool-main',
    name: 'Main Community Pool',
    type: 'outdoor',
    location: '123 Aquatic Center Dr',
    capacity: 250000, // gallons
    status: 'active',
    lastInspection: daysAgo(5),
    notes: 'Olympic-sized pool with diving area. Heavy usage during summer months.',
    contactEmail: 'mainpool@aquaticcenter.com',
    contactPhone: '555-0100'
  },
  {
    id: 'pool-kids',
    name: 'Children\'s Splash Pool',
    type: 'outdoor',
    location: '123 Aquatic Center Dr',
    capacity: 15000,
    status: 'active',
    lastInspection: daysAgo(3),
    notes: 'Shallow pool with water features. Max depth 3 feet.',
    contactEmail: 'kidspool@aquaticcenter.com',
    contactPhone: '555-0101'
  },
  {
    id: 'pool-therapy',
    name: 'Therapy Pool',
    type: 'indoor',
    location: '456 Health Center Blvd',
    capacity: 30000,
    status: 'active',
    lastInspection: daysAgo(7),
    notes: 'Heated to 88°F. Used for physical therapy and senior programs.',
    contactEmail: 'therapy@healthcenter.com',
    contactPhone: '555-0200'
  },
  {
    id: 'pool-lap',
    name: 'Lap Pool - East Wing',
    type: 'indoor',
    location: '789 Fitness Complex',
    capacity: 75000,
    status: 'active',
    lastInspection: daysAgo(10),
    notes: '8-lane competition pool. Maintained at 78°F.',
    contactEmail: 'lappool@fitnesscomplex.com',
    contactPhone: '555-0300'
  },
  {
    id: 'pool-resort',
    name: 'Resort Infinity Pool',
    type: 'outdoor',
    location: '321 Luxury Resort Way',
    capacity: 120000,
    status: 'maintenance',
    lastInspection: daysAgo(1),
    notes: 'Currently closed for tile repair. Reopening scheduled for next week.',
    contactEmail: 'pool@luxuryresort.com',
    contactPhone: '555-0400'
  }
]

// Chemical Test Data - Main Community Pool (showing various scenarios)
const mainPoolTests: ChemicalTest[] = [
  // Current day - multiple readings showing improvement
  {
    id: 'test-main-1',
    poolId: 'pool-main',
    poolName: 'Main Community Pool',
    timestamp: hoursAgo(1),
    technician: 'John Smith',
    readings: {
      freeChlorine: 2.0,
      totalChlorine: 2.2,
      ph: 7.4,
      alkalinity: 100,
      cyanuricAcid: 45,
      calcium: 300,
      temperature: 82
    },
    status: 'approved',
    notes: 'All levels optimal after morning adjustment'
  },
  {
    id: 'test-main-2',
    poolId: 'pool-main',
    poolName: 'Main Community Pool',
    timestamp: hoursAgo(7),
    technician: 'Sarah Johnson',
    readings: {
      freeChlorine: 1.5,
      totalChlorine: 1.8,
      ph: 7.5,
      alkalinity: 95,
      cyanuricAcid: 45,
      calcium: 300,
      temperature: 80
    },
    status: 'approved',
    notes: 'Morning reading - chlorine slightly low, added 10 lbs'
  },
  
  // Yesterday - showing typical daily pattern
  {
    id: 'test-main-3',
    poolId: 'pool-main',
    poolName: 'Main Community Pool',
    timestamp: hoursAgo(25),
    technician: 'Mike Chen',
    readings: {
      freeChlorine: 2.5,
      totalChlorine: 2.8,
      ph: 7.3,
      alkalinity: 105,
      cyanuricAcid: 45,
      calcium: 300,
      temperature: 83
    },
    status: 'approved',
    notes: 'Evening test after busy day'
  },
  {
    id: 'test-main-4',
    poolId: 'pool-main',
    poolName: 'Main Community Pool',
    timestamp: hoursAgo(31),
    technician: 'John Smith',
    readings: {
      freeChlorine: 2.8,
      totalChlorine: 3.0,
      ph: 7.4,
      alkalinity: 105,
      cyanuricAcid: 45,
      calcium: 300,
      temperature: 81
    },
    status: 'approved',
    notes: 'Afternoon peak usage period'
  },
  
  // 3 days ago - pH issue detected and corrected
  {
    id: 'test-main-5',
    poolId: 'pool-main',
    poolName: 'Main Community Pool',
    timestamp: daysAgo(3),
    technician: 'Sarah Johnson',
    readings: {
      freeChlorine: 2.2,
      totalChlorine: 2.5,
      ph: 7.8, // High pH
      alkalinity: 110,
      cyanuricAcid: 45,
      calcium: 300,
      temperature: 82
    },
    status: 'warning',
    notes: 'pH elevated - added 2 gallons muriatic acid'
  },
  
  // Week's worth of historical data
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `test-main-hist-${i}`,
    poolId: 'pool-main',
    poolName: 'Main Community Pool',
    timestamp: hoursAgo(96 + i * 12), // Every 12 hours for past week
    technician: i % 3 === 0 ? 'John Smith' : i % 3 === 1 ? 'Sarah Johnson' : 'Mike Chen',
    readings: {
      freeChlorine: 1.8 + Math.random() * 0.8,
      totalChlorine: 2.0 + Math.random() * 0.8,
      ph: 7.3 + Math.random() * 0.3,
      alkalinity: 95 + Math.random() * 15,
      cyanuricAcid: 45,
      calcium: 300,
      temperature: 80 + Math.random() * 4
    },
    status: 'approved' as const,
    notes: ''
  }))
]

// Children's Pool - Recent chlorine issue
const kidsPoolTests: ChemicalTest[] = [
  {
    id: 'test-kids-1',
    poolId: 'pool-kids',
    poolName: 'Children\'s Splash Pool',
    timestamp: hoursAgo(2),
    technician: 'Sarah Johnson',
    readings: {
      freeChlorine: 1.8,
      totalChlorine: 2.0,
      ph: 7.4,
      alkalinity: 100,
      cyanuricAcid: 40,
      calcium: 250,
      temperature: 84
    },
    status: 'approved',
    notes: 'Levels restored to normal after treatment'
  },
  {
    id: 'test-kids-2',
    poolId: 'pool-kids',
    poolName: 'Children\'s Splash Pool',
    timestamp: hoursAgo(8),
    technician: 'Mike Chen',
    readings: {
      freeChlorine: 0.8, // Low chlorine - critical
      totalChlorine: 1.0,
      ph: 7.5,
      alkalinity: 100,
      cyanuricAcid: 40,
      calcium: 250,
      temperature: 84
    },
    status: 'critical',
    notes: 'LOW CHLORINE - Pool closed for shock treatment'
  },
  {
    id: 'test-kids-3',
    poolId: 'pool-kids',
    poolName: 'Children\'s Splash Pool',
    timestamp: hoursAgo(26),
    technician: 'John Smith',
    readings: {
      freeChlorine: 2.5,
      totalChlorine: 2.7,
      ph: 7.4,
      alkalinity: 100,
      cyanuricAcid: 40,
      calcium: 250,
      temperature: 83
    },
    status: 'approved',
    notes: 'Normal daily reading'
  }
]

// Therapy Pool - Stable readings (well-maintained)
const therapyPoolTests: ChemicalTest[] = [
  {
    id: 'test-therapy-1',
    poolId: 'pool-therapy',
    poolName: 'Therapy Pool',
    timestamp: hoursAgo(3),
    technician: 'Dr. Emily Watson',
    readings: {
      freeChlorine: 2.2,
      totalChlorine: 2.4,
      ph: 7.4,
      alkalinity: 100,
      cyanuricAcid: 0, // Indoor pool - no CYA needed
      calcium: 280,
      temperature: 88
    },
    status: 'approved',
    notes: 'Temperature verified at 88°F for therapy sessions'
  },
  {
    id: 'test-therapy-2',
    poolId: 'pool-therapy',
    poolName: 'Therapy Pool',
    timestamp: hoursAgo(27),
    technician: 'Dr. Emily Watson',
    readings: {
      freeChlorine: 2.3,
      totalChlorine: 2.5,
      ph: 7.4,
      alkalinity: 98,
      cyanuricAcid: 0,
      calcium: 280,
      temperature: 88
    },
    status: 'approved',
    notes: 'Consistent readings - excellent water quality'
  }
]

// Lap Pool - Showing alkalinity drift
const lapPoolTests: ChemicalTest[] = [
  {
    id: 'test-lap-1',
    poolId: 'pool-lap',
    poolName: 'Lap Pool - East Wing',
    timestamp: hoursAgo(4),
    technician: 'Mike Chen',
    readings: {
      freeChlorine: 2.0,
      totalChlorine: 2.3,
      ph: 7.3,
      alkalinity: 75, // Low alkalinity warning
      cyanuricAcid: 0,
      calcium: 320,
      temperature: 78
    },
    status: 'warning',
    notes: 'Alkalinity dropping - added 50 lbs sodium bicarbonate'
  },
  {
    id: 'test-lap-2',
    poolId: 'pool-lap',
    poolName: 'Lap Pool - East Wing',
    timestamp: hoursAgo(28),
    technician: 'Sarah Johnson',
    readings: {
      freeChlorine: 2.1,
      totalChlorine: 2.4,
      ph: 7.2,
      alkalinity: 85,
      cyanuricAcid: 0,
      calcium: 320,
      temperature: 78
    },
    status: 'approved',
    notes: 'Morning test before swim team practice'
  }
]

// Resort Pool - Emergency scenario (before maintenance)
const resortPoolTests: ChemicalTest[] = [
  {
    id: 'test-resort-1',
    poolId: 'pool-resort',
    poolName: 'Resort Infinity Pool',
    timestamp: hoursAgo(30),
    technician: 'Resort Staff',
    readings: {
      freeChlorine: 0.3, // Emergency - very low
      totalChlorine: 0.5,
      ph: 8.2, // Emergency - very high
      alkalinity: 140,
      cyanuricAcid: 80,
      calcium: 450,
      temperature: 86
    },
    status: 'emergency',
    notes: 'POOL CLOSED - Multiple parameters out of range. Maintenance scheduled.'
  }
]

// Combine all test data
export const sampleChemicalTests: ChemicalTest[] = [
  ...mainPoolTests,
  ...kidsPoolTests,
  ...therapyPoolTests,
  ...lapPoolTests,
  ...resortPoolTests
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

// Demo data loader function
export function loadSampleData() {
  // Clear existing data
  localStorage.removeItem('pool-maintenance-facilities')
  localStorage.removeItem('pool-maintenance-chemical-tests')
  
  // Load sample data
  localStorage.setItem('pool-maintenance-facilities', JSON.stringify(samplePoolFacilities))
  localStorage.setItem('pool-maintenance-chemical-tests', JSON.stringify(sampleChemicalTests))
  
  // Reload the page to show new data
  window.location.reload()
}

// Export for use in development
if (import.meta.env.DEV) {
  (window as any).loadSampleData = loadSampleData
  console.log('Sample data loader available. Run loadSampleData() in console to load demo data.')
}