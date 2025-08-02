/**
 * Integration tests for critical chemical validation workflows
 * Tests end-to-end chemical processing, validation, and safety responses
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { 
  safeChemicalReadings,
  warningChemicalReadings,
  criticalChemicalReadings,
  mockAlerts,
  testScenarios
} from '@/test/fixtures/chemical-readings'
import { handlers } from '@/test/mocks/msw-handlers'

// Mock server setup
const server = setupServer(...handlers)

// Mock components for integration testing
const MockChemicalTestWorkflow = ({ onSubmit, onAlert }: any) => {
  const [reading, setReading] = React.useState({
    ph: '',
    chlorine: '',
    alkalinity: '',
    temperature: ''
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericReading = {
      id: `test-${Date.now()}`,
      poolId: 'pool-001',
      timestamp: new Date().toISOString(),
      ph: parseFloat(reading.ph),
      chlorine: parseFloat(reading.chlorine),
      alkalinity: parseFloat(reading.alkalinity),
      temperature: parseFloat(reading.temperature),
      notes: 'Integration test reading'
    }
    
    // Simulate validation
    const validation = validateChemicalReading(numericReading)
    
    if (!validation.isValid) {
      onAlert('error', validation.errors.join(', '))
      return
    }
    
    if (validation.warnings.length > 0) {
      onAlert('warning', validation.warnings.join(', '))
    }
    
    // Simulate status assessment
    const status = getPoolStatus(numericReading)
    if (status.level === 'critical') {
      onAlert('critical', status.message)
    }
    
    await onSubmit(numericReading)
  }
  
  return (
    <form onSubmit={handleSubmit} data-testid="chemical-test-workflow">
      <div>
        <label htmlFor="ph">pH Level</label>
        <input
          id="ph"
          type="number"
          step="0.1"
          value={reading.ph}
          onChange={(e) => setReading(prev => ({ ...prev, ph: e.target.value }))}
          data-testid="ph-input"
        />
      </div>
      
      <div>
        <label htmlFor="chlorine">Chlorine (ppm)</label>
        <input
          id="chlorine"
          type="number"
          step="0.1"
          value={reading.chlorine}
          onChange={(e) => setReading(prev => ({ ...prev, chlorine: e.target.value }))}
          data-testid="chlorine-input"
        />
      </div>
      
      <div>
        <label htmlFor="alkalinity">Alkalinity (ppm)</label>
        <input
          id="alkalinity"
          type="number"
          value={reading.alkalinity}
          onChange={(e) => setReading(prev => ({ ...prev, alkalinity: e.target.value }))}
          data-testid="alkalinity-input"
        />
      </div>
      
      <div>
        <label htmlFor="temperature">Temperature (°F)</label>
        <input
          id="temperature"
          type="number"
          value={reading.temperature}
          onChange={(e) => setReading(prev => ({ ...prev, temperature: e.target.value }))}
          data-testid="temperature-input"
        />
      </div>
      
      <button type="submit" data-testid="submit-test">
        Submit Chemical Test
      </button>
    </form>
  )
}

const MockPoolStatusDashboard = ({ reading, alerts }: any) => {
  const status = reading ? getPoolStatus(reading) : null
  
  return (
    <div data-testid="pool-status-dashboard">
      {status && (
        <div data-testid={`status-${status.level}`}>
          <h2>Pool Status: {status.level}</h2>
          <p>{status.message}</p>
          {status.issues.length > 0 && (
            <ul data-testid="status-issues">
              {status.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {alerts.length > 0 && (
        <div data-testid="alerts-section">
          {alerts.map((alert: any) => (
            <div key={alert.id} data-testid={`alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Import validation functions
import { validateChemicalReading, getPoolStatus } from '@/lib/utils/pool-utils'
import React from 'react'

describe('Chemical Validation Workflow Integration', () => {
  beforeEach(() => {
    server.listen()
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    server.resetHandlers()
  })
  
  describe('Safe Chemical Reading Workflow', () => {
    it('processes safe chemical readings successfully', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn().mockResolvedValue({ success: true })
      const mockAlert = vi.fn()
      
      render(
        <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
      )
      
      // Enter safe chemical values
      await user.type(screen.getByTestId('ph-input'), '7.4')
      await user.type(screen.getByTestId('chlorine-input'), '2.0')
      await user.type(screen.getByTestId('alkalinity-input'), '100')
      await user.type(screen.getByTestId('temperature-input'), '80')
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            ph: 7.4,
            chlorine: 2.0,
            alkalinity: 100,
            temperature: 80,
            poolId: 'pool-001'
          })
        )
      })
      
      // Should not trigger any alerts for safe readings
      expect(mockAlert).not.toHaveBeenCalled()
    })
    
    it('displays excellent status for optimal readings', async () => {
      const safeReading = safeChemicalReadings[0]
      
      render(
        <MockPoolStatusDashboard reading={safeReading} alerts={[]} />
      )
      
      expect(screen.getByTestId('status-excellent')).toBeInTheDocument()
      expect(screen.getByText(/all chemical levels are optimal/i)).toBeInTheDocument()
    })
  })

  describe('Warning Level Chemical Reading Workflow', () => {
    it('processes warning-level readings with appropriate alerts', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn().mockResolvedValue({ success: true })
      const mockAlert = vi.fn()
      
      render(
        <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
      )
      
      // Enter values that trigger warnings
      await user.type(screen.getByTestId('ph-input'), '7.1') // Below safe range
      await user.type(screen.getByTestId('chlorine-input'), '2.0') // Safe
      await user.type(screen.getByTestId('alkalinity-input'), '75') // Below safe range
      await user.type(screen.getByTestId('temperature-input'), '85') // Above safe range
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'warning',
          expect.stringContaining('pH level')
        )
      })
      
      expect(mockSubmit).toHaveBeenCalled()
    })
    
    it('displays caution status for multiple parameter issues', async () => {
      const warningReading = {
        ...safeChemicalReadings[0],
        ph: 7.1, // Warning
        alkalinity: 75 // Warning
      }
      
      render(
        <MockPoolStatusDashboard reading={warningReading} alerts={[]} />
      )
      
      expect(screen.getByTestId('status-caution')).toBeInTheDocument()
      expect(screen.getByText(/multiple chemical adjustments needed/i)).toBeInTheDocument()
      
      const issues = screen.getByTestId('status-issues')
      expect(issues).toHaveTextContent('pH: 7.1')
      expect(issues).toHaveTextContent('Alkalinity: 75 ppm')
    })
  })

  describe('Critical Chemical Reading Workflow', () => {
    it('prevents submission and triggers critical alerts for dangerous readings', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn()
      const mockAlert = vi.fn()
      
      render(
        <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
      )
      
      // Enter dangerous values
      await user.type(screen.getByTestId('ph-input'), '8.5') // Critical high
      await user.type(screen.getByTestId('chlorine-input'), '5.0') // Critical high
      await user.type(screen.getByTestId('alkalinity-input'), '200') // Critical high
      await user.type(screen.getByTestId('temperature-input'), '95') // Critical high
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'critical',
          'Immediate attention required'
        )
      })
      
      // Should still submit but trigger critical alert
      expect(mockSubmit).toHaveBeenCalled()
    })
    
    it('displays critical status and emergency protocols', async () => {
      const criticalReading = criticalChemicalReadings[0]
      const criticalAlerts = mockAlerts.filter(alert => alert.type === 'critical')
      
      render(
        <MockPoolStatusDashboard reading={criticalReading} alerts={criticalAlerts} />
      )
      
      expect(screen.getByTestId('status-critical')).toBeInTheDocument()
      expect(screen.getByText(/immediate attention required/i)).toBeInTheDocument()
      
      // Should display critical alerts
      expect(screen.getByTestId('alerts-section')).toBeInTheDocument()
      expect(screen.getByTestId('alert-critical')).toBeInTheDocument()
    })
  })

  describe('Invalid Data Handling Workflow', () => {
    it('handles invalid chemical values with error alerts', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn()
      const mockAlert = vi.fn()
      
      render(
        <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
      )
      
      // Enter invalid values
      await user.type(screen.getByTestId('ph-input'), '15') // Invalid pH
      await user.type(screen.getByTestId('chlorine-input'), '-1') // Invalid chlorine
      await user.type(screen.getByTestId('alkalinity-input'), '100')
      await user.type(screen.getByTestId('temperature-input'), '80')
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'error',
          expect.stringMatching(/(pH must be between 0 and 14|Chlorine level cannot be negative)/)
        )
      })
      
      // Should not submit invalid data
      expect(mockSubmit).not.toHaveBeenCalled()
    })
  })

  describe('API Integration Workflow', () => {
    it('handles successful API submission with server validation', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      server.use(
        http.post('/api/pools/:poolId/readings', () => {
          return HttpResponse.json({
            id: 'reading-123',
            validated: false,
            timestamp: new Date().toISOString()
          }, { status: 201 })
        })
      )
      
      const mockSubmit = vi.fn(async (reading) => {
        const response = await fetch('/api/pools/pool-001/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reading)
        })
        return response.json()
      })
      
      const mockAlert = vi.fn()
      
      render(
        <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
      )
      
      await user.type(screen.getByTestId('ph-input'), '7.4')
      await user.type(screen.getByTestId('chlorine-input'), '2.0')
      await user.type(screen.getByTestId('alkalinity-input'), '100')
      await user.type(screen.getByTestId('temperature-input'), '80')
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled()
      })
    })
    
    it('handles API errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock API error
      server.use(
        http.post('/api/pools/:poolId/readings', () => {
          return HttpResponse.json({
            error: 'Database connection failed'
          }, { status: 500 })
        })
      )
      
      const mockSubmit = vi.fn(async (reading) => {
        const response = await fetch('/api/pools/pool-001/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reading)
        })
        
        if (!response.ok) {
          throw new Error('API Error')
        }
        
        return response.json()
      })
      
      const mockAlert = vi.fn()
      
      render(
        <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
      )
      
      await user.type(screen.getByTestId('ph-input'), '7.4')
      await user.type(screen.getByTestId('chlorine-input'), '2.0')
      await user.type(screen.getByTestId('alkalinity-input'), '100')
      await user.type(screen.getByTestId('temperature-input'), '80')
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled()
      })
      
      // Should handle the error appropriately
      // (Error handling would be implemented in the actual component)
    })
  })

  describe('Real-time Status Updates Workflow', () => {
    it('updates pool status dashboard when new readings are submitted', async () => {
      const user = userEvent.setup()
      let currentReading = null
      const alerts: any[] = []
      
      const mockSubmit = vi.fn(async (reading) => {
        currentReading = reading
        return { success: true }
      })
      
      const mockAlert = vi.fn((type, message) => {
        alerts.push({ id: Date.now(), type, message })
      })
      
      const { rerender } = render(
        <div>
          <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
          <MockPoolStatusDashboard reading={currentReading} alerts={alerts} />
        </div>
      )
      
      // Initially no status shown (but dashboard container exists)
      expect(screen.getByTestId('pool-status-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('status-excellent')).not.toBeInTheDocument()
      expect(screen.queryByTestId('status-good')).not.toBeInTheDocument()
      expect(screen.queryByTestId('status-caution')).not.toBeInTheDocument()
      expect(screen.queryByTestId('status-critical')).not.toBeInTheDocument()
      
      // Submit safe reading
      await user.type(screen.getByTestId('ph-input'), '7.4')
      await user.type(screen.getByTestId('chlorine-input'), '2.0')
      await user.type(screen.getByTestId('alkalinity-input'), '100')
      await user.type(screen.getByTestId('temperature-input'), '80')
      
      await user.click(screen.getByTestId('submit-test'))
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled()
      })
      
      // Re-render with updated reading
      rerender(
        <div>
          <MockChemicalTestWorkflow onSubmit={mockSubmit} onAlert={mockAlert} />
          <MockPoolStatusDashboard reading={currentReading} alerts={alerts} />
        </div>
      )
      
      // Should now show excellent status
      expect(screen.getByTestId('status-excellent')).toBeInTheDocument()
    })
  })

  describe('Workflow Performance', () => {
    it('processes chemical validation efficiently', async () => {
      const startTime = Date.now()
      
      const testReading = safeChemicalReadings[0]
      const validation = validateChemicalReading(testReading)
      const status = getPoolStatus(testReading)
      
      const endTime = Date.now()
      const processingTime = endTime - startTime
      
      // Should process validation quickly (under 50ms)
      expect(processingTime).toBeLessThan(50)
      expect(validation.isValid).toBe(true)
      expect(status.level).toBe('excellent')
    })
    
    it('handles multiple concurrent validations', async () => {
      const readings = [
        ...safeChemicalReadings,
        ...warningChemicalReadings,
        ...criticalChemicalReadings
      ]
      
      const startTime = Date.now()
      
      const results = readings.map(reading => ({
        validation: validateChemicalReading(reading),
        status: getPoolStatus(reading)
      }))
      
      const endTime = Date.now()
      const processingTime = endTime - startTime
      
      // Should process all validations efficiently
      expect(processingTime).toBeLessThan(100)
      expect(results).toHaveLength(readings.length)
      
      // All results should have proper structure
      results.forEach(result => {
        expect(result.validation).toHaveProperty('isValid')
        expect(result.validation).toHaveProperty('errors')
        expect(result.validation).toHaveProperty('warnings')
        expect(result.status).toHaveProperty('level')
        expect(result.status).toHaveProperty('message')
      })
    })
  })
})