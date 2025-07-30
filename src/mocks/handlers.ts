import { http, HttpResponse } from 'msw'

// Define types for API responses
export interface Pool {
  id: string
  name: string
  location: string
  capacity: number
  status: 'active' | 'maintenance' | 'closed'
}

export interface MaintenanceTask {
  id: string
  poolId: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  assignedTo?: string
  dueDate: string
  createdAt: string
}

export interface ChemicalReading {
  id: string
  poolId: string
  pH: number
  chlorine: number
  alkalinity: number
  temperature: number
  recordedAt: string
  recordedBy: string
}

// Mock data
const pools: Pool[] = [
  {
    id: '1',
    name: 'Main Pool',
    location: 'Community Center',
    capacity: 500,
    status: 'active',
  },
  {
    id: '2',
    name: 'Kids Pool',
    location: 'Recreation Area',
    capacity: 150,
    status: 'active',
  },
]

const maintenanceTasks: MaintenanceTask[] = [
  {
    id: '1',
    poolId: '1',
    title: 'Weekly Chemical Balance Check',
    description: 'Test and adjust chemical levels for optimal water quality',
    priority: 'high',
    status: 'pending',
    assignedTo: 'john.doe@pool.com',
    dueDate: '2025-07-30T10:00:00Z',
    createdAt: '2025-07-29T08:00:00Z',
  },
]

const chemicalReadings: ChemicalReading[] = [
  {
    id: '1',
    poolId: '1',
    pH: 7.4,
    chlorine: 2.1,
    alkalinity: 120,
    temperature: 78.5,
    recordedAt: '2025-07-29T12:00:00Z',
    recordedBy: 'jane.smith@pool.com',
  },
]

// API handlers
export const handlers = [
  // Pools endpoints
  http.get('/api/pools', () => {
    return HttpResponse.json({ pools })
  }),

  http.get('/api/pools/:poolId', ({ params }) => {
    const { poolId } = params
    const pool = pools.find((p) => p.id === poolId)

    if (!pool) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ pool })
  }),

  http.post('/api/pools', async ({ request }) => {
    const newPool = (await request.json()) as Omit<Pool, 'id'>
    const pool: Pool = {
      ...newPool,
      id: String(pools.length + 1),
    }
    pools.push(pool)

    return HttpResponse.json({ pool }, { status: 201 })
  }),

  // Maintenance tasks endpoints
  http.get('/api/pools/:poolId/maintenance', ({ params }) => {
    const { poolId } = params
    const tasks = maintenanceTasks.filter((task) => task.poolId === poolId)

    return HttpResponse.json({ tasks })
  }),

  http.post('/api/pools/:poolId/maintenance', async ({ params, request }) => {
    const { poolId } = params
    const newTask = (await request.json()) as Omit<MaintenanceTask, 'id' | 'poolId' | 'createdAt'>

    const task: MaintenanceTask = {
      ...newTask,
      id: String(maintenanceTasks.length + 1),
      poolId: poolId as string,
      createdAt: new Date().toISOString(),
    }
    maintenanceTasks.push(task)

    return HttpResponse.json({ task }, { status: 201 })
  }),

  // Chemical readings endpoints
  http.get('/api/pools/:poolId/readings', ({ params }) => {
    const { poolId } = params
    const readings = chemicalReadings.filter((reading) => reading.poolId === poolId)

    return HttpResponse.json({ readings })
  }),

  http.post('/api/pools/:poolId/readings', async ({ params, request }) => {
    const { poolId } = params
    const newReading = (await request.json()) as Omit<
      ChemicalReading,
      'id' | 'poolId' | 'recordedAt'
    >

    const reading: ChemicalReading = {
      ...newReading,
      id: String(chemicalReadings.length + 1),
      poolId: poolId as string,
      recordedAt: new Date().toISOString(),
    }
    chemicalReadings.push(reading)

    return HttpResponse.json({ reading }, { status: 201 })
  }),

  // Auth endpoints (for future use)
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }

    // Simple mock authentication
    if (email === 'admin@pool.com' && password === 'password123') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'admin@pool.com',
          name: 'Pool Administrator',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      })
    }

    return new HttpResponse(null, { status: 401 })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),
]
