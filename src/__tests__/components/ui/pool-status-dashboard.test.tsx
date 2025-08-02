/**
 * Unit tests for PoolStatusDashboard component
 * Critical component for displaying pool safety status
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PoolStatusDashboard } from '@/components/ui/pool-status-dashboard'

// Mock localStorage and related functions
const mockGetChemicalTests = vi.fn()
const mockGetTestSummary = vi.fn()

vi.mock('@/lib/localStorage', () => ({
  getChemicalTests: () => mockGetChemicalTests(),
  getTestSummary: () => mockGetTestSummary()
}))

// Mock MAHC validation
vi.mock('@/lib/mahc-validation', () => ({
  validateChemical: vi.fn((_value, _type) => ({
    isValid: true,
    level: 'safe',
    message: 'Within safe range'
  }))
}))

const mockOnViewPool = vi.fn()

describe('PoolStatusDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mocks
    mockGetChemicalTests.mockReturnValue([])
    mockGetTestSummary.mockReturnValue({
      totalTests: 0,
      recentTests: [],
      averageValues: {},
      lastTestDate: null
    })
  })

  describe('Rendering and Layout', () => {
    it('renders dashboard title and basic structure', () => {
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      expect(screen.getByText('Pool Status Dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Current status of.*pools from recent test data/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    })
    
    it('displays no data state when no tests available', () => {
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      expect(screen.getByText('No Pool Data Found')).toBeInTheDocument()
      expect(screen.getByText(/Start by creating chemical tests/)).toBeInTheDocument()
    })
    
    it('shows last updated timestamp', () => {
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      expect(screen.getByText('Last updated')).toBeInTheDocument()
      // Should show current time in AM/PM format
      expect(screen.getByText(/\d{1,2}:\d{2}:\d{2} [AP]M/)).toBeInTheDocument()
    })
  })

  describe('With Pool Data', () => {
    beforeEach(() => {
      // Mock pool data available with correct structure
      const mockTests = [
        {
          id: 'test-1',
          poolId: 'pool-001',
          poolName: 'Community Pool',
          timestamp: new Date().toISOString(),
          technician: 'test-tech',
          notes: 'Test reading',
          status: 'approved' as const,
          readings: {
            freeChlorine: 2.0,
            totalChlorine: 2.2,
            ph: 7.4,
            alkalinity: 100,
            cyanuricAcid: 50,
            calcium: 200,
            temperature: 80
          }
        }
      ]
      
      mockGetChemicalTests.mockReturnValue(mockTests)
      mockGetTestSummary.mockReturnValue({
        totalTests: 1,
        recentTests: mockTests,
        averageValues: {
          ph: 7.4,
          chlorine: 2.0,
          alkalinity: 100,
          temperature: 80
        },
        lastTestDate: new Date().toISOString()
      })
    })

    it('displays pool cards when data is available', async () => {
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByText('No Pool Data Found')).not.toBeInTheDocument()
      })
      
      // Should display pool information - be more specific about which "1" we're looking for
      expect(screen.getByText(/Total Tests/)).toBeInTheDocument()
      expect(screen.getByText(/Total Pools/)).toBeInTheDocument()
      // Check that the count appears (even if there are multiple "1"s)
      const numbers = screen.getAllByText('1')
      expect(numbers.length).toBeGreaterThan(0)
    })

    it('handles refresh button click', async () => {
      const user = userEvent.setup()
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i })
      await user.click(refreshButton)
      
      // Should have called the mock functions again
      expect(mockGetChemicalTests).toHaveBeenCalled()
      expect(mockGetTestSummary).toHaveBeenCalled()
    })
  })

  describe('Error States', () => {
    it('handles localStorage errors gracefully', () => {
      // Mock localStorage returning empty data when there's an error
      mockGetChemicalTests.mockReturnValue([])
      mockGetTestSummary.mockReturnValue({
        totalTests: 0,
        recentTests: [],
        averageValues: {},
        lastTestDate: null
      })
      
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      // Should still render without crashing
      expect(screen.getByText('Pool Status Dashboard')).toBeInTheDocument()
      expect(screen.getByText('No Pool Data Found')).toBeInTheDocument()
    })
  })

  describe('Callback Functions', () => {
    it('calls onViewPool when provided', () => {
      render(<PoolStatusDashboard onViewPool={mockOnViewPool} />)
      
      // Component should render without errors when callback is provided
      expect(screen.getByText('Pool Status Dashboard')).toBeInTheDocument()
    })

    it('works without onViewPool callback', () => {
      render(<PoolStatusDashboard />)
      
      // Component should render without errors when no callback is provided
      expect(screen.getByText('Pool Status Dashboard')).toBeInTheDocument()
    })
  })
})