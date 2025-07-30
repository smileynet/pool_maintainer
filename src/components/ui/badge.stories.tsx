import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Droplet,
  Activity,
  Shield,
  AlertCircle,
} from 'lucide-react'
import { chemicalReadings, maintenanceTasks } from '../../test/fixtures/pool-maintenance-data'

const meta: Meta<typeof Badge> = {
  title: 'Components/Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Badge component displays small pieces of information like status indicators, counts, or labels. It's essential for showing pool status, chemical levels, compliance states, and task priorities in the pool maintenance system.

## Features
- Multiple visual variants (default, secondary, destructive, outline)
- Consistent sizing and typography
- Icon support for better recognition
- Semantic color coding for pool maintenance contexts
- Accessible with proper contrast ratios

## Pool Maintenance Usage
- Pool status indicators (active, maintenance, closed)
- Chemical level status (good, warning, critical)
- Compliance badges (MAHC compliant, violations)
- Task priority markers (low, medium, high, critical)
- Equipment status indicators
        `,
      },
    },
    backgrounds: {
      default: 'pool',
      values: [
        { name: 'pool', value: '#f0f9ff' },
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant',
      table: { category: 'Appearance' },
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    children: {
      description: 'Badge content',
      table: { category: 'Content' },
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic examples
export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Badge',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Badge',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Badge',
  },
}

// Badge variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

// Pool status badges
export const PoolStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Pool Status Indicators</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500 hover:bg-green-500/80">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Maintenance
          </Badge>
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Closed
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status badges for pool operational states with semantic colors and icons.',
      },
    },
  },
}

// Chemical level status badges
export const ChemicalStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Chemical Level Status</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500 hover:bg-green-500/80">
            <Droplet className="mr-1 h-3 w-3" />
            Good
          </Badge>
          <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Critical
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Chemical Types</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            <Activity className="mr-1 h-3 w-3" />
            Chlorine: 2.1 ppm
          </Badge>
          <Badge variant="outline">pH: 7.2</Badge>
          <Badge variant="outline">Alkalinity: 95 ppm</Badge>
          <Badge variant="outline">Temp: 26.5°C</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chemical level status indicators with current readings and safety levels.',
      },
    },
  },
}

// Compliance status badges
export const ComplianceStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">MAHC Compliance Status</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500 hover:bg-green-500/80">
            <Shield className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
          <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Minor Violation
          </Badge>
          <Badge className="bg-orange-500 hover:bg-orange-500/80">
            <AlertCircle className="mr-1 h-3 w-3" />
            Major Violation
          </Badge>
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Closure Required
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'MAHC compliance status badges with appropriate severity colors.',
      },
    },
  },
}

// Task priority badges
export const TaskPriority: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Maintenance Task Priorities</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-gray-600">
            Low Priority
          </Badge>
          <Badge variant="secondary">Medium Priority</Badge>
          <Badge className="bg-orange-500 hover:bg-orange-500/80">High Priority</Badge>
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Critical
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Task priority indicators for maintenance scheduling and urgency.',
      },
    },
  },
}

// Equipment status badges
export const EquipmentStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Equipment Status</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500 hover:bg-green-500/80">
            <CheckCircle className="mr-1 h-3 w-3" />
            Operational
          </Badge>
          <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            <Clock className="mr-1 h-3 w-3" />
            Maintenance Due
          </Badge>
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Out of Service
          </Badge>
          <Badge variant="outline">Offline</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Equipment status indicators for pumps, filters, and other pool equipment.',
      },
    },
  },
}

// Realistic data examples
export const ChemicalReadingBadges: Story = {
  render: () => {
    const reading = chemicalReadings[1] // Warning status reading

    const getChemicalBadge = (value: number, chemical: string) => {
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
      let className = ''

      if (chemical === 'chlorine') {
        if (value >= 1.0 && value <= 3.0) {
          variant = 'default'
          className = 'bg-green-500 hover:bg-green-500/80'
        } else if (value >= 0.5 && value <= 5.0) {
          className = 'bg-yellow-500 hover:bg-yellow-500/80 text-black'
        } else {
          variant = 'destructive'
        }
      } else if (chemical === 'ph') {
        if (value >= 7.2 && value <= 7.6) {
          variant = 'default'
          className = 'bg-green-500 hover:bg-green-500/80'
        } else if (value >= 6.8 && value <= 8.2) {
          className = 'bg-yellow-500 hover:bg-yellow-500/80 text-black'
        } else {
          variant = 'destructive'
        }
      }

      return { variant, className }
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">
            Chemical Reading - {reading.poolId} ({reading.timestamp.split('T')[0]})
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge {...getChemicalBadge(reading.chlorine, 'chlorine')}>
              <Droplet className="mr-1 h-3 w-3" />
              Cl: {reading.chlorine} ppm
            </Badge>
            <Badge {...getChemicalBadge(reading.ph, 'ph')}>pH: {reading.ph}</Badge>
            <Badge variant="outline">Alk: {reading.alkalinity} ppm</Badge>
            <Badge variant="outline">{reading.temperature}°C</Badge>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Overall Status</h3>
          <Badge className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {reading.status.toUpperCase()}
          </Badge>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Real chemical reading data with contextual badge colors based on safety ranges.',
      },
    },
  },
}

// Maintenance task badges
export const MaintenanceTaskBadges: Story = {
  render: () => {
    const task = maintenanceTasks[1] // In progress task

    const getPriorityBadge = (priority: string) => {
      switch (priority) {
        case 'low':
          return { variant: 'outline' as const, className: 'text-gray-600' }
        case 'medium':
          return { variant: 'secondary' as const, className: '' }
        case 'high':
          return { variant: 'default' as const, className: 'bg-orange-500 hover:bg-orange-500/80' }
        case 'critical':
          return { variant: 'destructive' as const, className: '' }
        default:
          return { variant: 'outline' as const, className: '' }
      }
    }

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'pending':
          return { variant: 'outline' as const, icon: Clock }
        case 'in_progress':
          return { variant: 'secondary' as const, icon: Activity }
        case 'completed':
          return {
            variant: 'default' as const,
            className: 'bg-green-500 hover:bg-green-500/80',
            icon: CheckCircle,
          }
        case 'cancelled':
          return { variant: 'destructive' as const, icon: XCircle }
        default:
          return { variant: 'outline' as const, icon: Clock }
      }
    }

    const priorityBadge = getPriorityBadge(task.priority)
    const statusBadge = getStatusBadge(task.status)
    const StatusIcon = statusBadge.icon

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Task: {task.title}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge {...priorityBadge}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
            <Badge {...statusBadge}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {task.status.replace('_', ' ').charAt(0).toUpperCase() +
                task.status.replace('_', ' ').slice(1)}
            </Badge>
            <Badge variant="outline">
              {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
            </Badge>
            <Badge variant="outline">{task.estimatedDuration}min</Badge>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Maintenance task with priority, status, type, and duration badges.',
      },
    },
  },
}

// Interactive badges (with counts)
export const CountBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Notification Counts</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span>Active Pools</span>
            <Badge>3</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Pending Tasks</span>
            <Badge className="bg-orange-500 hover:bg-orange-500/80">12</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Critical Alerts</span>
            <Badge variant="destructive">2</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Online Technicians</span>
            <Badge className="bg-green-500 hover:bg-green-500/80">5</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Count badges for notifications and system status indicators.',
      },
    },
  },
}
