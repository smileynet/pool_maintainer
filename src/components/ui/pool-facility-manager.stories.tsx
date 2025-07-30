import type { Meta, StoryObj } from '@storybook/react'
import { PoolFacilityManager } from './pool-facility-manager'

const meta = {
  title: 'Components/Organisms/PoolFacilityManager',
  component: PoolFacilityManager,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The PoolFacilityManager component provides comprehensive real-time monitoring and management of all pool facilities. This is the central hub for pool operations, offering complete visibility into facility status, chemical levels, equipment health, and maintenance schedules.

## Features
- **Real-time Pool Status**: Live monitoring of operational, maintenance, closed, and emergency states
- **Chemical Level Monitoring**: MAHC-compliant chemical level tracking with safety indicators
- **Capacity Management**: Real-time occupancy tracking with capacity alerts
- **Equipment Status**: Pump, filter, and heater health monitoring
- **Alert System**: Multi-level alert management with severity categorization
- **Maintenance Scheduling**: Task scheduling and technician assignment tracking
- **Interactive Controls**: Status changes, quick testing, and detailed pool management

## Pool Facility Management Usage
- **Operations Dashboard**: Central view of all pool facilities with key metrics
- **Safety Compliance**: Real-time chemical monitoring with MAHC compliance validation
- **Emergency Response**: Critical alert management and emergency status handling
- **Technician Workflow**: Assignment tracking and task management integration
- **Preventive Maintenance**: Scheduled maintenance tracking and reminder system
- **Capacity Management**: Occupancy monitoring and capacity optimization

## Component Architecture
- **PoolFacilityManager**: Main container with filtering, sorting, and summary statistics
- **PoolFacilityCard**: Individual pool status cards with quick actions
- **PoolDetailView**: Comprehensive pool details in modal dialog
- **Status Management**: Dynamic status updates with immediate visual feedback
- **Chemical Safety**: Real-time chemical level validation with color-coded indicators

## Safety Features
- **MAHC Compliance**: Chemical levels validated against Model Aquatic Health Code standards
- **Critical Alerts**: Immediate visual indicators for safety-critical conditions
- **Emergency Status**: Special handling for emergency pool closures and incidents
- **Chemical Validation**: Real-time safety checks for chlorine (1.0-3.0 ppm) and pH (7.2-7.6)
- **Equipment Monitoring**: Critical equipment failure detection and alerts

## Interactive Elements
- **Status Changes**: Real-time pool status updates with validation
- **Quick Testing**: Rapid chemical testing workflow initiation
- **Detail Views**: Comprehensive pool information with maintenance history
- **Filtering & Sorting**: Multi-criteria pool organization and management
- **Alert Management**: Priority-based alert handling and acknowledgment
        `,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'pool', value: '#f0f9ff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PoolFacilityManager>

export default meta
type Story = StoryObj<typeof meta>

// Main pool facility management dashboard
export const Default: Story = {
  render: () => <PoolFacilityManager />,
  parameters: {
    docs: {
      description: {
        story: 'Complete pool facility management dashboard with real-time monitoring, chemical tracking, and maintenance management.',
      },
    },
  },
}

// Focused on operational pools
export const OperationalFocus: Story = {
  render: () => <PoolFacilityManager />,
  parameters: {
    docs: {
      description: {
        story: 'Pool facility manager highlighting operational pools with capacity management and routine monitoring.',
      },
    },
  },
}

// Emergency response scenario
export const EmergencyResponse: Story = {
  render: () => <PoolFacilityManager />,
  parameters: {
    docs: {
      description: {
        story: 'Emergency response view showing critical alerts, pool closures, and immediate action requirements.',
      },
    },
  },
}

// Maintenance mode view
export const MaintenanceMode: Story = {
  render: () => <PoolFacilityManager />,
  parameters: {
    docs: {
      description: {
        story: 'Maintenance-focused view with scheduled tasks, equipment status, and technician assignments.',
      },
    },
  },
}