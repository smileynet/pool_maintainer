/**
 * Pool maintenance data fixtures for Storybook stories
 * Used to provide realistic examples in component documentation
 */

// Pool data
export const pools = [
  {
    id: 'pool-001',
    name: 'Main Community Pool',
    location: 'Recreation Center',
    capacity: 150,
    status: 'active' as const,
    dimensions: '25m x 12m',
    depth: '1.2m - 3.0m',
    type: 'outdoor',
  },
  {
    id: 'pool-002',
    name: 'Kiddie Pool',
    location: 'Recreation Center',
    capacity: 30,
    status: 'maintenance' as const,
    dimensions: '8m x 6m',
    depth: '0.6m',
    type: 'outdoor',
  },
  {
    id: 'pool-003',
    name: 'Indoor Therapy Pool',
    location: 'Wellness Center',
    capacity: 20,
    status: 'closed' as const,
    dimensions: '6m x 4m',
    depth: '1.0m',
    type: 'indoor',
  },
]

// Chemical data
export const chemicalReadings = [
  {
    id: 'reading-001',
    poolId: 'pool-001',
    timestamp: '2025-07-30T08:00:00Z',
    chlorine: 2.1,
    ph: 7.2,
    alkalinity: 95,
    cyanuricAcid: 35,
    calcium: 220,
    temperature: 26.5,
    status: 'good' as const,
    technician: 'John Smith',
  },
  {
    id: 'reading-002',
    poolId: 'pool-001',
    timestamp: '2025-07-30T16:00:00Z',
    chlorine: 1.8,
    ph: 7.4,
    alkalinity: 102,
    cyanuricAcid: 38,
    calcium: 225,
    temperature: 28.2,
    status: 'warning' as const,
    technician: 'Sarah Johnson',
  },
  {
    id: 'reading-003',
    poolId: 'pool-002',
    timestamp: '2025-07-30T10:00:00Z',
    chlorine: 0.8,
    ph: 6.9,
    alkalinity: 78,
    cyanuricAcid: 42,
    calcium: 180,
    temperature: 24.1,
    status: 'critical' as const,
    technician: 'Mike Chen',
  },
]

// Maintenance tasks
export const maintenanceTasks = [
  {
    id: 'task-001',
    poolId: 'pool-001',
    title: 'Weekly Chlorine Shock Treatment',
    description: 'Add 2kg calcium hypochlorite to raise chlorine to 10ppm',
    type: 'chemical' as const,
    priority: 'medium' as const,
    status: 'pending' as const,
    scheduledDate: '2025-07-31T09:00:00Z',
    estimatedDuration: 30,
    assignedTo: 'John Smith',
    equipment: ['Chemical feeder', 'Test kit', 'Safety gear'],
  },
  {
    id: 'task-002',
    poolId: 'pool-001',
    title: 'Filter Cleaning',
    description: 'Clean and backwash sand filters, check pressure gauges',
    type: 'equipment' as const,
    priority: 'high' as const,
    status: 'in_progress' as const,
    scheduledDate: '2025-07-30T14:00:00Z',
    estimatedDuration: 90,
    assignedTo: 'Sarah Johnson',
    equipment: ['Backwash hose', 'Pressure gauge', 'Filter cleaner'],
  },
  {
    id: 'task-003',
    poolId: 'pool-002',
    title: 'Emergency Pool Closure',
    description: 'Close pool due to low chlorine levels, test and treat water',
    type: 'safety' as const,
    priority: 'critical' as const,
    status: 'completed' as const,
    scheduledDate: '2025-07-30T07:00:00Z',
    estimatedDuration: 120,
    assignedTo: 'Mike Chen',
    completedDate: '2025-07-30T09:15:00Z',
    equipment: ['Closure signs', 'Test kit', 'Chemical treatment'],
  },
]

// Technicians
export const technicians = [
  {
    id: 'tech-001',
    name: 'John Smith',
    role: 'Senior Pool Technician',
    email: 'john.smith@poolmaint.com',
    phone: '+1-555-0101',
    certifications: ['CPO', 'NSPF', 'MAHC'],
    availability: 'available' as const,
    specialties: ['Chemical balancing', 'Equipment repair'],
  },
  {
    id: 'tech-002',
    name: 'Sarah Johnson',
    role: 'Pool Technician',
    email: 'sarah.johnson@poolmaint.com',
    phone: '+1-555-0102',
    certifications: ['CPO', 'NSPF'],
    availability: 'busy' as const,
    specialties: ['Filter maintenance', 'Safety compliance'],
  },
  {
    id: 'tech-003',
    name: 'Mike Chen',
    role: 'Emergency Response Technician',
    email: 'mike.chen@poolmaint.com',
    phone: '+1-555-0103',
    certifications: ['CPO', 'NSPF', 'First Aid', 'Hazmat'],
    availability: 'on_call' as const,
    specialties: ['Emergency response', 'Chemical incidents'],
  },
]

// Chemical types and safety ranges
export const chemicalTypes = [
  {
    id: 'chlorine',
    name: 'Free Chlorine',
    unit: 'ppm',
    idealRange: { min: 1.0, max: 3.0 },
    safetyRange: { min: 0.5, max: 5.0 },
    criticalThreshold: 0.5,
    description: 'Primary sanitizer for killing bacteria and algae',
  },
  {
    id: 'ph',
    name: 'pH Level',
    unit: 'pH',
    idealRange: { min: 7.2, max: 7.6 },
    safetyRange: { min: 6.8, max: 8.2 },
    criticalThreshold: 6.8,
    description: 'Measure of water acidity/alkalinity',
  },
  {
    id: 'alkalinity',
    name: 'Total Alkalinity',
    unit: 'ppm',
    idealRange: { min: 80, max: 120 },
    safetyRange: { min: 60, max: 180 },
    criticalThreshold: 60,
    description: 'Buffer for pH stability',
  },
  {
    id: 'cyanuric',
    name: 'Cyanuric Acid',
    unit: 'ppm',
    idealRange: { min: 30, max: 50 },
    safetyRange: { min: 0, max: 100 },
    criticalThreshold: 100,
    description: 'Stabilizer to protect chlorine from UV degradation',
  },
]

// Compliance statuses
export const complianceStatuses = [
  {
    id: 'compliant',
    label: 'Compliant',
    color: 'green',
    description: 'All parameters within MAHC guidelines',
  },
  {
    id: 'minor-violation',
    label: 'Minor Violation',
    color: 'yellow',
    description: 'Non-critical parameters outside guidelines',
  },
  {
    id: 'major-violation',
    label: 'Major Violation',
    color: 'orange',
    description: 'Critical parameters require immediate attention',
  },
  {
    id: 'closure-required',
    label: 'Closure Required',
    color: 'red',
    description: 'Safety risk - pool must be closed immediately',
  },
]

// Equipment types
export const equipmentTypes = [
  {
    id: 'pump',
    name: 'Circulation Pump',
    category: 'circulation',
    maintenanceInterval: 30, // days
    criticalComponent: true,
  },
  {
    id: 'filter',
    name: 'Sand Filter',
    category: 'filtration',
    maintenanceInterval: 7, // days
    criticalComponent: true,
  },
  {
    id: 'heater',
    name: 'Pool Heater',
    category: 'heating',
    maintenanceInterval: 90, // days
    criticalComponent: false,
  },
  {
    id: 'chlorinator',
    name: 'Automatic Chlorinator',
    category: 'chemical',
    maintenanceInterval: 14, // days
    criticalComponent: true,
  },
]

// Utility functions for generating realistic data
export const generateChemicalReading = (
  poolId: string,
  overrides: Partial<(typeof chemicalReadings)[0]> = {}
) => ({
  id: `reading-${Date.now()}`,
  poolId,
  timestamp: new Date().toISOString(),
  chlorine: Math.random() * 3 + 0.5, // 0.5-3.5 ppm
  ph: Math.random() * 1.4 + 6.8, // 6.8-8.2 pH
  alkalinity: Math.random() * 60 + 70, // 70-130 ppm
  cyanuricAcid: Math.random() * 40 + 20, // 20-60 ppm
  calcium: Math.random() * 100 + 150, // 150-250 ppm
  temperature: Math.random() * 10 + 22, // 22-32°C
  status: 'good' as const,
  technician: technicians[Math.floor(Math.random() * technicians.length)].name,
  ...overrides,
})

export const generateMaintenanceTask = (
  poolId: string,
  overrides: Partial<(typeof maintenanceTasks)[0]> = {}
) => ({
  id: `task-${Date.now()}`,
  poolId,
  title: 'Routine Maintenance',
  description: 'Standard pool maintenance procedure',
  type: 'routine' as const,
  priority: 'medium' as const,
  status: 'pending' as const,
  scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  estimatedDuration: 60,
  assignedTo: technicians[Math.floor(Math.random() * technicians.length)].name,
  equipment: ['Basic tools', 'Test kit'],
  ...overrides,
})

// Type definitions for TypeScript support
export type Pool = (typeof pools)[0]
export type ChemicalReading = (typeof chemicalReadings)[0]
export type MaintenanceTask = (typeof maintenanceTasks)[0]
export type Technician = (typeof technicians)[0]
export type ChemicalType = (typeof chemicalTypes)[0]
export type ComplianceStatus = (typeof complianceStatuses)[0]
export type EquipmentType = (typeof equipmentTypes)[0]

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskType = 'chemical' | 'equipment' | 'safety' | 'routine' | 'emergency'
export type PoolStatus = 'active' | 'maintenance' | 'closed'
export type ChemicalStatus = 'good' | 'warning' | 'critical'
export type TechnicianAvailability = 'available' | 'busy' | 'on_call' | 'off_duty'
