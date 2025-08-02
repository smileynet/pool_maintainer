/**
 * MSW (Mock Service Worker) handlers for comprehensive API testing
 * Provides realistic API responses for different test scenarios
 */

import { http, HttpResponse } from 'msw'
import { 
  mockApiResponses, 
  safeChemicalReadings, 
  warningChemicalReadings, 
  criticalChemicalReadings,
  mockAlerts,
  testScenarios
} from '../fixtures/chemical-readings'

/**
 * Base API configuration
 */
const API_BASE = process.env.VITE_API_BASE_URL || '/api'

/**
 * Pool Management API Handlers
 */
export const poolHandlers = [
  // Get all pools
  http.get(`${API_BASE}/pools`, () => {
    return HttpResponse.json({
      pools: [
        {
          id: 'pool-001',
          name: 'Community Recreation Pool',
          type: 'public',
          status: 'operational',
          capacity: 150,
          volume: 50000,
          location: 'Main Building',
          lastInspection: '2024-01-10T00:00:00Z'
        },
        {
          id: 'pool-002',
          name: 'Therapy Pool',
          type: 'therapeutic',
          status: 'operational',
          capacity: 25,
          volume: 8000,
          location: 'Therapy Wing',
          lastInspection: '2024-01-12T00:00:00Z'
        },
        {
          id: 'pool-003',
          name: 'Olympic Competition Pool',
          type: 'competition',
          status: 'maintenance',
          capacity: 500,
          volume: 660000,
          location: 'Competition Center',
          lastInspection: '2024-01-08T00:00:00Z'
        }
      ],
      total: 3,
      timestamp: new Date().toISOString()
    })
  }),

  // Get specific pool details
  http.get(`${API_BASE}/pools/:poolId`, ({ params }) => {
    const { poolId } = params
    
    const poolData = {
      'pool-001': {
        id: 'pool-001',
        name: 'Community Recreation Pool',
        type: 'public',
        status: 'operational',
        capacity: 150,
        volume: 50000,
        location: 'Main Building',
        operatingHours: '6:00 AM - 10:00 PM',
        lastInspection: '2024-01-10T00:00:00Z',
        nextMaintenance: '2024-01-20T08:00:00Z',
        equipment: {
          pumps: 2,
          filters: 2,
          heaters: 1,
          chemicalFeeders: 3
        }
      },
      'pool-002': {
        id: 'pool-002',
        name: 'Therapy Pool',
        type: 'therapeutic',
        status: 'operational',
        capacity: 25,
        volume: 8000,
        location: 'Therapy Wing',
        operatingHours: '7:00 AM - 8:00 PM',
        lastInspection: '2024-01-12T00:00:00Z',
        nextMaintenance: '2024-01-25T09:00:00Z',
        equipment: {
          pumps: 1,
          filters: 1,
          heaters: 2,
          chemicalFeeders: 2
        }
      }
    }

    const pool = poolData[poolId as keyof typeof poolData]
    if (!pool) {
      return HttpResponse.json({ error: 'Pool not found' }, { status: 404 })
    }

    return HttpResponse.json(pool)
  })
]

/**
 * Chemical Reading API Handlers
 */
export const chemicalHandlers = [
  // Get chemical readings for a pool
  http.get(`${API_BASE}/pools/:poolId/readings`, ({ params, request }) => {
    const { poolId } = params
    const url = new URL(request.url)
    const limit = url.searchParams.get('limit') || '10'
    const scenario = url.searchParams.get('scenario') || 'safe'
    
    let readings = safeChemicalReadings
    
    // Return different data based on test scenario
    switch (scenario) {
      case 'warning':
        readings = warningChemicalReadings
        break
      case 'critical':
        readings = criticalChemicalReadings
        break
      case 'mixed':
        readings = [...safeChemicalReadings, ...warningChemicalReadings]
        break
    }
    
    const filteredReadings = readings
      .filter(reading => reading.poolId === poolId)
      .slice(0, parseInt(limit))
    
    return HttpResponse.json({
      poolId,
      readings: filteredReadings,
      total: filteredReadings.length,
      lastUpdated: new Date().toISOString()
    })
  }),

  // Create new chemical reading
  http.post(`${API_BASE}/pools/:poolId/readings`, async ({ params, request }) => {
    const { poolId } = params
    const body = await request.json() as any
    
    // Validate required fields
    const requiredFields = ['ph', 'chlorine', 'alkalinity', 'temperature']
    const missingFields = requiredFields.filter(field => !(field in body))
    
    if (missingFields.length > 0) {
      return HttpResponse.json({
        error: 'Missing required fields',
        missingFields
      }, { status: 400 })
    }
    
    // Validate chemical ranges
    const errors = []
    if (body.ph < 0 || body.ph > 14) errors.push('pH must be between 0 and 14')
    if (body.chlorine < 0) errors.push('Chlorine cannot be negative')
    if (body.alkalinity < 0) errors.push('Alkalinity cannot be negative')
    if (body.temperature < 32 || body.temperature > 120) errors.push('Temperature must be between 32°F and 120°F')
    
    if (errors.length > 0) {
      return HttpResponse.json({ error: 'Invalid chemical values', errors }, { status: 400 })
    }
    
    const newReading = {
      id: `reading-${Date.now()}`,
      poolId,
      timestamp: new Date().toISOString(),
      ...body,
      validated: false,
      technicianId: body.technicianId || 'unknown'
    }
    
    return HttpResponse.json(newReading, { status: 201 })
  }),

  // Validate a chemical reading
  http.patch(`${API_BASE}/readings/:readingId/validate`, ({ params }) => {
    const { readingId } = params
    
    return HttpResponse.json({
      id: readingId,
      validated: true,
      validatedAt: new Date().toISOString(),
      validatedBy: 'supervisor-001'
    })
  })
]

/**
 * Alert Management API Handlers
 */
export const alertHandlers = [
  // Get alerts for a pool
  http.get(`${API_BASE}/pools/:poolId/alerts`, ({ params, request }) => {
    const { poolId } = params
    const url = new URL(request.url)
    const unreadOnly = url.searchParams.get('unread') === 'true'
    
    let alerts = mockAlerts.filter(alert => alert.poolId === poolId)
    
    if (unreadOnly) {
      alerts = alerts.filter(alert => !alert.resolved)
    }
    
    return HttpResponse.json({
      poolId,
      alerts,
      unreadCount: alerts.filter(alert => !alert.resolved).length,
      total: alerts.length
    })
  }),

  // Create new alert
  http.post(`${API_BASE}/pools/:poolId/alerts`, async ({ params, request }) => {
    const { poolId } = params
    const body = await request.json() as any
    
    const newAlert = {
      id: `alert-${Date.now()}`,
      poolId,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...body
    }
    
    return HttpResponse.json(newAlert, { status: 201 })
  }),

  // Resolve an alert
  http.patch(`${API_BASE}/alerts/:alertId/resolve`, ({ params }) => {
    const { alertId } = params
    
    return HttpResponse.json({
      id: alertId,
      resolved: true,
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'pool-manager-001'
    })
  })
]

/**
 * User Authentication API Handlers
 */
export const authHandlers = [
  // Login
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as any
    
    // Mock authentication - accept test credentials
    const testUsers = {
      'test@poolmanager.com': {
        id: 'user-001',
        email: 'test@poolmanager.com',
        name: 'Test Pool Manager',
        role: 'pool_manager',
        permissions: ['read_pools', 'write_readings', 'manage_alerts']
      },
      'tech@poolmanager.com': {
        id: 'user-002',
        email: 'tech@poolmanager.com',
        name: 'Test Technician',
        role: 'technician',
        permissions: ['read_pools', 'write_readings']
      }
    }
    
    const user = testUsers[body.email as keyof typeof testUsers]
    
    if (!user || body.password !== 'testpass123') {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    return HttpResponse.json({
      user,
      token: 'mock-jwt-token',
      expiresIn: 3600
    })
  }),

  // Get current user
  http.get(`${API_BASE}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'No token provided' }, { status: 401 })
    }
    
    return HttpResponse.json({
      id: 'user-001',
      email: 'test@poolmanager.com',
      name: 'Test Pool Manager',
      role: 'pool_manager',
      permissions: ['read_pools', 'write_readings', 'manage_alerts']
    })
  })
]

/**
 * Emergency Response API Handlers
 */
export const emergencyHandlers = [
  // Create emergency incident
  http.post(`${API_BASE}/emergency/incidents`, async ({ request }) => {
    const body = await request.json() as any
    
    const incident = {
      id: `incident-${Date.now()}`,
      type: body.type,
      poolId: body.poolId,
      severity: body.severity || 'high',
      description: body.description,
      timestamp: new Date().toISOString(),
      reportedBy: body.reportedBy || 'system',
      status: 'active',
      actions: body.actions || []
    }
    
    return HttpResponse.json(incident, { status: 201 })
  }),

  // Update pool status
  http.patch(`${API_BASE}/pools/:poolId/status`, async ({ params, request }) => {
    const { poolId } = params
    const body = await request.json() as any
    
    return HttpResponse.json({
      poolId,
      status: body.status,
      reason: body.reason,
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || 'system'
    })
  })
]

/**
 * Error Simulation Handlers for Testing
 */
export const errorHandlers = [
  // Simulate server errors
  http.get(`${API_BASE}/test/error/:code`, ({ params }) => {
    const { code } = params
    const statusCode = parseInt(code as string)
    
    const errorMessages = {
      400: 'Bad Request - Invalid parameters',
      401: 'Unauthorized - Please login again',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - Resource does not exist',
      500: 'Internal Server Error - Please try again later',
      503: 'Service Unavailable - System maintenance in progress'
    }
    
    const message = errorMessages[statusCode as keyof typeof errorMessages] || 'Unknown error'
    
    return HttpResponse.json({ error: message }, { status: statusCode })
  }),

  // Simulate network timeouts
  http.get(`${API_BASE}/test/timeout`, async () => {
    await new Promise(resolve => setTimeout(resolve, 30000)) // 30 second delay
    return HttpResponse.json({ message: 'This should timeout' })
  }),

  // Simulate offline scenario
  http.get(`${API_BASE}/test/offline`, () => {
    return HttpResponse.error()
  })
]

/**
 * Complete MSW handler configuration
 */
export const handlers = [
  ...poolHandlers,
  ...chemicalHandlers,
  ...alertHandlers,
  ...authHandlers,
  ...emergencyHandlers,
  ...errorHandlers
]

/**
 * Scenario-specific handler overrides
 */
export const scenarioHandlers = {
  // Override for testing normal operations
  normalOperations: [
    http.get(`${API_BASE}/pools/:poolId/readings`, ({ params }) => {
      return HttpResponse.json(mockApiResponses.getPoolReadings(params.poolId as string))
    }),
    http.get(`${API_BASE}/pools/:poolId/alerts`, ({ params }) => {
      const alerts = mockAlerts.filter(alert => alert.poolId === params.poolId && alert.type !== 'critical')
      return HttpResponse.json({ poolId: params.poolId, alerts, unreadCount: 0 })
    })
  ],

  // Override for testing emergency scenarios
  emergency: [
    http.get(`${API_BASE}/pools/:poolId/readings`, ({ params }) => {
      const criticalData = mockApiResponses.getPoolReadings(params.poolId as string)
      criticalData.readings = criticalChemicalReadings.filter(r => r.poolId === params.poolId)
      return HttpResponse.json(criticalData)
    }),
    http.get(`${API_BASE}/pools/:poolId/alerts`, ({ params }) => {
      const criticalAlerts = mockAlerts.filter(alert => alert.poolId === params.poolId && alert.type === 'critical')
      return HttpResponse.json({ poolId: params.poolId, alerts: criticalAlerts, unreadCount: criticalAlerts.length })
    })
  ],

  // Override for testing system errors
  systemErrors: [
    http.get(`${API_BASE}/pools/:poolId/readings`, () => {
      return HttpResponse.json({ error: 'Database connection failed' }, { status: 500 })
    })
  ]
}

export default handlers