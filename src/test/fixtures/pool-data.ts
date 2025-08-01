// Pool Maintenance System Test Fixtures
// Realistic test data for pool maintenance scenarios

import { ChemicalTest, PoolFacility } from '@/types'

// Realistic chemical test data for various scenarios
export const SAMPLE_CHEMICAL_TESTS: ChemicalTest[] = [
  // Ideal conditions
  {
    id: 'test-ideal-1',
    poolId: 'pool-community-center',
    timestamp: '2025-08-01T08:00:00Z',
    freeChlorine: 2.0,
    pH: 7.4,
    totalAlkalinity: 100,
    temperature: 80,
    notes: 'Morning test - all levels ideal',
  },
  
  // High chlorine scenario
  {
    id: 'test-high-chlorine',
    poolId: 'pool-community-center',
    timestamp: '2025-08-01T14:00:00Z',
    freeChlorine: 4.2,
    pH: 7.3,
    totalAlkalinity: 95,
    temperature: 82,
    notes: 'Post-shock treatment - elevated chlorine levels',
  },
  
  // Low pH warning
  {
    id: 'test-low-ph',
    poolId: 'pool-aquatic-center',
    timestamp: '2025-08-01T10:30:00Z',
    freeChlorine: 1.8,
    pH: 6.9,
    totalAlkalinity: 85,
    temperature: 79,
    notes: 'pH trending low - may need soda ash',
  },
  
  // Dangerous conditions
  {
    id: 'test-dangerous',
    poolId: 'pool-hotel',
    timestamp: '2025-08-01T16:00:00Z',
    freeChlorine: 0.3,
    pH: 6.5,
    totalAlkalinity: 45,
    temperature: 88,
    notes: 'URGENT: Multiple parameters out of range - pool closed',
  },
  
  // After maintenance
  {
    id: 'test-post-maintenance',
    poolId: 'pool-hotel',
    timestamp: '2025-08-01T18:00:00Z',
    freeChlorine: 2.5,
    pH: 7.5,
    totalAlkalinity: 90,
    temperature: 81,
    notes: 'Post-treatment - levels stabilizing',
  },
  
  // Weekend busy period
  {
    id: 'test-busy-weekend',
    poolId: 'pool-recreation-center',
    timestamp: '2025-08-02T15:00:00Z',
    freeChlorine: 1.2,
    pH: 7.8,
    totalAlkalinity: 130,
    temperature: 83,
    notes: 'Heavy bather load - pH rising, chlorine consumption high',
  },
  
  // Early morning baseline
  {
    id: 'test-morning-baseline',
    poolId: 'pool-recreation-center',
    timestamp: '2025-08-03T06:00:00Z',
    freeChlorine: 2.2,
    pH: 7.2,
    totalAlkalinity: 110,
    temperature: 78,
    notes: 'Pre-opening test - overnight recovery',
  },
]

// Sample pool facilities with different characteristics
export const SAMPLE_POOL_FACILITIES: PoolFacility[] = [
  {
    id: 'pool-community-center',
    name: 'Community Center Pool',
    type: 'public',
    location: 'Downtown Community Center',
    capacity: 150,
    status: 'active',
    lastInspection: '2025-07-28T10:00:00Z',
  },
  
  {
    id: 'pool-aquatic-center',
    name: 'Municipal Aquatic Center',
    type: 'public',
    location: 'North Side Recreation Complex',
    capacity: 300,
    status: 'active',
    lastInspection: '2025-07-30T14:00:00Z',
  },
  
  {
    id: 'pool-hotel',
    name: 'Grand Hotel Pool & Spa',
    type: 'commercial',
    location: 'Luxury Hotel Resort',
    capacity: 80,
    status: 'maintenance',
    lastInspection: '2025-08-01T09:00:00Z',
  },
  
  {
    id: 'pool-recreation-center',
    name: 'Westside Recreation Pool',
    type: 'public',
    location: 'Westside Community Center',
    capacity: 200,
    status: 'active',
    lastInspection: '2025-07-25T11:00:00Z',
  },
  
  {
    id: 'pool-fitness-club',
    name: 'Elite Fitness Club Pool',
    type: 'private',
    location: 'Premium Fitness Center',
    capacity: 60,
    status: 'active',
    lastInspection: '2025-07-29T16:00:00Z',
  },
]

// Test scenarios for different pool maintenance situations
export const TEST_SCENARIOS = {
  IDEAL_CONDITIONS: SAMPLE_CHEMICAL_TESTS.filter(test => 
    test.freeChlorine >= 1.0 && test.freeChlorine <= 3.0 &&
    test.pH >= 7.2 && test.pH <= 7.6
  ),
  
  WARNING_CONDITIONS: SAMPLE_CHEMICAL_TESTS.filter(test =>
    (test.freeChlorine < 1.0 || test.freeChlorine > 3.0) ||
    (test.pH < 7.2 || test.pH > 7.6)
  ),
  
  EMERGENCY_CONDITIONS: SAMPLE_CHEMICAL_TESTS.filter(test =>
    test.freeChlorine < 0.5 || test.freeChlorine > 5.0 ||
    test.pH < 7.0 || test.pH > 8.0
  ),
  
  HIGH_TRAFFIC_PERIODS: SAMPLE_CHEMICAL_TESTS.filter(test =>
    test.notes.toLowerCase().includes('busy') || 
    test.notes.toLowerCase().includes('heavy')
  ),
}

// Time series data for trend testing
export const CHEMICAL_TREND_DATA = {
  WEEKLY_TREND: [
    { date: '2025-07-26', freeChlorine: 2.1, pH: 7.3, totalAlkalinity: 105 },
    { date: '2025-07-27', freeChlorine: 1.9, pH: 7.4, totalAlkalinity: 102 },
    { date: '2025-07-28', freeChlorine: 2.3, pH: 7.2, totalAlkalinity: 108 },
    { date: '2025-07-29', freeChlorine: 1.7, pH: 7.5, totalAlkalinity: 95 },
    { date: '2025-07-30', freeChlorine: 2.0, pH: 7.4, totalAlkalinity: 100 },
    { date: '2025-07-31', freeChlorine: 2.2, pH: 7.3, totalAlkalinity: 103 },
    { date: '2025-08-01', freeChlorine: 2.0, pH: 7.4, totalAlkalinity: 100 },
  ],
  
  CHLORINE_SHOCK_RECOVERY: [
    { time: '08:00', freeChlorine: 8.5, pH: 7.1 }, // Post-shock
    { time: '10:00', freeChlorine: 6.2, pH: 7.2 },
    { time: '12:00', freeChlorine: 4.8, pH: 7.3 },
    { time: '14:00', freeChlorine: 3.2, pH: 7.4 },
    { time: '16:00', freeChlorine: 2.1, pH: 7.4 }, // Back to normal
  ],
}

// CSV import test data
export const CSV_IMPORT_SAMPLES = {
  VALID_CSV: `Date,Time,Pool ID,Free Chlorine,pH,Total Alkalinity,Temperature,Notes
2025-08-01,08:00,pool-1,2.0,7.4,100,80,Morning test
2025-08-01,14:00,pool-1,1.8,7.3,95,82,Afternoon check
2025-08-01,20:00,pool-1,2.2,7.5,105,79,Evening reading`,
  
  INVALID_CSV: `Date,Time,Pool ID,Free Chlorine,pH,Total Alkalinity,Temperature,Notes
2025-08-01,08:00,pool-1,invalid,7.4,100,80,Bad chlorine value
2025-08-01,14:00,pool-1,1.8,15.0,95,82,Invalid pH value
2025-08-01,20:00,pool-1,2.2,7.5,-50,79,Negative alkalinity`,
  
  MISSING_HEADERS_CSV: `2025-08-01,08:00,pool-1,2.0,7.4,100,80,Missing headers
2025-08-01,14:00,pool-1,1.8,7.3,95,82,Should fail validation`,
}