import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import {
  pools,
  technicians,
  chemicalReadings,
  maintenanceTasks,
} from '../../test/fixtures/pool-maintenance-data'
import {
  MapPin,
  Users,
  Clock,
  Calendar,
  TestTube,
  Droplet,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'

const meta = {
  title: 'Components/Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Card component provides a flexible container for displaying related information with consistent styling and structure. It's essential for organizing pool maintenance data, displaying status information, and creating dashboard layouts.

## Features
- Structured content areas (header, content, footer)
- Consistent spacing and typography
- Responsive design with mobile-friendly layouts
- Support for interactive elements
- Semantic HTML structure for accessibility
- Flexible styling with shadcn/ui variants

## Pool Maintenance Usage
- Pool status dashboards and overview cards
- Technician profiles and availability status
- Chemical reading displays with trend indicators  
- Maintenance task cards with priority and status
- Equipment status monitoring cards
- Report summaries and data visualizations
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
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Basic card examples
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Main content area with relevant information and data.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Action Button</Button>
      </CardFooter>
    </Card>
  ),
}

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Simple Card</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            A basic card with just content area for minimal layouts.
          </p>
        </div>
      </CardContent>
    </Card>
  ),
}

// Pool status cards
export const PoolStatusCard: Story = {
  render: () => {
    const pool = pools[0] // Main Community Pool

    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {pool.name}
            </CardTitle>
            <Badge
              className={
                pool.status === 'active'
                  ? 'bg-green-500 hover:bg-green-500/80'
                  : pool.status === 'maintenance'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                    : 'bg-red-500 hover:bg-red-500/80'
              }
            >
              {pool.status === 'active' && <CheckCircle className="mr-1 h-3 w-3" />}
              {pool.status === 'maintenance' && <Clock className="mr-1 h-3 w-3" />}
              {pool.status === 'closed' && <XCircle className="mr-1 h-3 w-3" />}
              {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>{pool.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="text-muted-foreground h-4 w-4" />
            <span>Capacity: {pool.capacity} swimmers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="text-muted-foreground h-4 w-4" />
            <span>Type: {pool.type} pool</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TestTube className="text-muted-foreground h-4 w-4" />
            <span>Last tested: 2 hours ago</span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" className="flex-1">
            <TestTube className="mr-2 h-4 w-4" />
            Test Water
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </CardFooter>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Pool status card showing current operational status, capacity, and quick actions.',
      },
    },
  },
}

// Technician profile card
export const TechnicianProfileCard: Story = {
  render: () => {
    const technician = technicians[0] // John Smith

    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <User className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{technician.name}</CardTitle>
              <CardDescription>{technician.role}</CardDescription>
            </div>
            <Badge
              variant={technician.status === 'available' ? 'secondary' : 'outline'}
              className={
                technician.status === 'available'
                  ? 'bg-green-500 text-white hover:bg-green-500/80'
                  : technician.status === 'busy'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                    : 'bg-red-500 text-white hover:bg-red-500/80'
              }
            >
              {technician.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Certifications</h4>
            <div className="flex flex-wrap gap-1">
              {technician.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span>{technician.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span>{technician.contact.email}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" className="flex-1">
            Assign Task
          </Button>
          <Button size="sm" variant="outline">
            View Profile
          </Button>
        </CardFooter>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Technician profile card with status, certifications, and contact information.',
      },
    },
  },
}

// Chemical reading card with trend indicators
export const ChemicalReadingCard: Story = {
  render: () => {
    const reading = chemicalReadings[0]

    const getChemicalStatus = (value: number, chemical: string) => {
      if (chemical === 'chlorine') {
        if (value >= 1.0 && value <= 3.0) return { status: 'good', trend: 'stable' }
        if (value < 1.0) return { status: 'low', trend: 'down' }
        if (value > 3.0) return { status: 'high', trend: 'up' }
      }
      if (chemical === 'ph') {
        if (value >= 7.2 && value <= 7.6) return { status: 'good', trend: 'stable' }
        if (value < 7.2) return { status: 'low', trend: 'down' }
        if (value > 7.6) return { status: 'high', trend: 'up' }
      }
      return { status: 'neutral', trend: 'stable' }
    }

    const chlorineStatus = getChemicalStatus(reading.chlorine, 'chlorine')
    const phStatus = getChemicalStatus(reading.ph, 'ph')

    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Chemical Reading
            </CardTitle>
            <Badge
              variant={reading.status === 'good' ? 'secondary' : 'outline'}
              className={
                reading.status === 'good'
                  ? 'bg-green-500 text-white hover:bg-green-500/80'
                  : reading.status === 'warning'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                    : 'bg-red-500 text-white hover:bg-red-500/80'
              }
            >
              {reading.status.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            {reading.poolId} • {new Date(reading.timestamp).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Free Chlorine</span>
                {chlorineStatus.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                {chlorineStatus.trend === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {chlorineStatus.trend === 'stable' && <Minus className="h-4 w-4 text-green-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-semibold">{reading.chlorine} ppm</span>
              </div>
              <div className="text-muted-foreground text-xs">Target: 1.0-3.0 ppm</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">pH Level</span>
                {phStatus.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                {phStatus.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {phStatus.trend === 'stable' && <Minus className="h-4 w-4 text-green-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span className="text-lg font-semibold">{reading.ph}</span>
              </div>
              <div className="text-muted-foreground text-xs">Target: 7.2-7.6</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Temperature:</span>
              <span className="ml-1 font-medium">{reading.temperature}°C</span>
            </div>
            <div>
              <span className="text-muted-foreground">Alkalinity:</span>
              <span className="ml-1 font-medium">{reading.alkalinity} ppm</span>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Technician:</span>
            <span className="ml-1 font-medium">{reading.technician}</span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" variant="outline">
            New Reading
          </Button>
        </CardFooter>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Chemical reading card with status indicators, trend arrows, and key measurements.',
      },
    },
  },
}

// Maintenance task card
export const MaintenanceTaskCard: Story = {
  render: () => {
    const task = maintenanceTasks[1] // In progress task

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'critical':
          return 'bg-red-500 hover:bg-red-500/80'
        case 'high':
          return 'bg-orange-500 hover:bg-orange-500/80'
        case 'medium':
          return 'bg-blue-500 hover:bg-blue-500/80'
        case 'low':
          return 'bg-gray-500 hover:bg-gray-500/80'
        default:
          return 'bg-gray-500 hover:bg-gray-500/80'
      }
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'pending':
          return <Clock className="h-4 w-4" />
        case 'in_progress':
          return <Activity className="h-4 w-4" />
        case 'completed':
          return <CheckCircle className="h-4 w-4" />
        case 'cancelled':
          return <XCircle className="h-4 w-4" />
        default:
          return <Clock className="h-4 w-4" />
      }
    }

    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{task.title}</CardTitle>
            <div className="flex gap-1">
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              <Badge variant="outline">
                {getStatusIcon(task.status)}
                <span className="ml-1">{task.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
          <CardDescription className="line-clamp-2">{task.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span>{task.poolId}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span>{task.assignedTo}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>{new Date(task.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span>{task.estimatedDuration}min</span>
            </div>
          </div>

          {task.status === 'in_progress' && (
            <div className="mt-3 rounded-md bg-blue-50 p-2">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Activity className="h-4 w-4" />
                <span>Task in progress...</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
                <div className="h-2 w-1/3 rounded-full bg-blue-600"></div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          {task.status === 'pending' && (
            <>
              <Button size="sm" className="flex-1">
                Start Task
              </Button>
              <Button size="sm" variant="outline">
                Reschedule
              </Button>
            </>
          )}
          {task.status === 'in_progress' && (
            <>
              <Button size="sm" className="flex-1">
                Complete
              </Button>
              <Button size="sm" variant="outline">
                Update
              </Button>
            </>
          )}
          {task.status === 'completed' && (
            <Button size="sm" variant="outline" className="w-full">
              View Report
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Maintenance task card with priority badges, status tracking, and contextual actions.',
      },
    },
  },
}

// Dashboard summary cards
export const DashboardSummaryCards: Story = {
  render: () => {
    const summaryData = [
      {
        title: 'Active Pools',
        value: '3',
        change: '+0',
        trend: 'stable',
        icon: MapPin,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Pending Tasks',
        value: '12',
        change: '+3',
        trend: 'up',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
      {
        title: 'Available Technicians',
        value: '5',
        change: '+1',
        trend: 'up',
        icon: User,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Critical Alerts',
        value: '2',
        change: '-1',
        trend: 'down',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
    ]

    return (
      <div className="grid w-[600px] grid-cols-2 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">{item.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        item.trend === 'up'
                          ? 'text-green-600'
                          : item.trend === 'down'
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {item.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                      {item.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                      {item.trend === 'stable' && <Minus className="h-4 w-4" />}
                      <span>{item.change}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-full ${item.bgColor} flex items-center justify-center`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard summary cards showing key metrics with trend indicators and icons.',
      },
    },
  },
}

// Interactive card with expandable content
export const ExpandablePoolCard: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false)
    const pool = pools[0]
    const poolReadings = chemicalReadings.filter((r) => r.poolId === pool.id)

    return (
      <Card className="w-96">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {pool.name}
            </CardTitle>
            <Badge className="bg-green-500 hover:bg-green-500/80">
              <CheckCircle className="mr-1 h-3 w-3" />
              Active
            </Badge>
          </div>
          <CardDescription>{pool.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Capacity: {pool.capacity} swimmers</span>
            <span>Type: {pool.type}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Last tested: 2 hours ago</span>
            <span>Status: All good</span>
          </div>

          {expanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Recent Readings</h4>
              <div className="space-y-2">
                {poolReadings.slice(0, 3).map((reading, index) => (
                  <div key={index} className="bg-muted flex justify-between rounded p-2 text-sm">
                    <span>{new Date(reading.timestamp).toLocaleDateString()}</span>
                    <span>
                      Cl: {reading.chlorine}ppm, pH: {reading.ph}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Water
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show Less' : 'Show More Details'}
          </Button>
        </CardFooter>
      </Card>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive card with expandable content showing additional pool details and recent readings.',
      },
    },
  },
}

// Card layout patterns
export const CardLayoutPatterns: Story = {
  render: () => (
    <div className="w-[800px] space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Grid Layout</h3>
        <div className="grid grid-cols-3 gap-4">
          {pools.slice(0, 3).map((pool, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <MapPin className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-medium">{pool.name}</h4>
                <p className="text-muted-foreground text-sm">{pool.location}</p>
                <Badge className="mt-2 bg-green-500 hover:bg-green-500/80">{pool.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">List Layout</h3>
        <div className="space-y-4">
          {maintenanceTasks.slice(0, 2).map((task, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-muted-foreground mt-1 text-sm">{task.description}</p>
                    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                      <span>Pool: {task.poolId}</span>
                      <span>Duration: {task.estimatedDuration}min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.priority}</Badge>
                    <Button size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different card layout patterns including grid and list arrangements.',
      },
    },
  },
}
