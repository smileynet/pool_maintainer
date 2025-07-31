import type { Meta, StoryObj } from '@storybook/react'
import {
  Container,
  AdaptiveGrid,
  ResponsiveCard,
  Stack,
  DashboardLayout,
  MetricGrid,
  ChemicalReadingLayout,
  Breakpoint,
  Spacer,
} from './layout-system'
import { Card, CardContent } from './card'
import { Button } from './button'
import { TestTube, Droplet, Thermometer, FlaskConical, Activity, Users, Clock, AlertTriangle } from 'lucide-react'

const meta = {
  title: 'Pool Management/Layout System',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Advanced Layout System with Container Queries

A comprehensive layout system designed for pool maintenance applications using modern CSS container queries for component-level responsiveness.

## Key Features

- **Container Queries**: Components adapt to their container size, not viewport
- **Responsive Grids**: Auto-fit and explicit column systems
- **Flexible Stacking**: Row, column, and responsive stack layouts
- **Dashboard Layouts**: Purpose-built for management interfaces
- **Pool-Specific Components**: Metric grids and chemical reading layouts
- **Accessibility First**: Focus management and screen reader support

## Container Query Benefits

Unlike traditional responsive design that relies on viewport breakpoints, container queries allow components to:
- Adapt to their container size
- Be truly reusable across different contexts
- Create more predictable layouts
- Enable better component composition

## Pool Maintenance Optimizations

Layouts are specifically optimized for:
- Chemical reading displays
- Equipment status monitoring
- Emergency alert visibility
- Mobile technician interfaces
- Compliance reporting layouts
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

// Mock data for demonstrations
const mockChemicalReadings = [
  { label: 'Free Chlorine', value: '2.1', unit: 'ppm', status: 'safe', icon: TestTube },
  { label: 'pH Level', value: '7.4', unit: '', status: 'safe', icon: FlaskConical },
  { label: 'Total Alkalinity', value: '95', unit: 'ppm', status: 'safe', icon: TestTube },
  { label: 'Temperature', value: '82', unit: '°F', status: 'safe', icon: Thermometer },
  { label: 'Cyanuric Acid', value: '45', unit: 'ppm', status: 'caution', icon: FlaskConical },
  { label: 'Calcium Hardness', value: '280', unit: 'ppm', status: 'safe', icon: TestTube },
]

const mockMetrics = [
  { label: 'Active Pools', value: '4', status: 'success', icon: Droplet },
  { label: 'Staff On Duty', value: '6', status: 'success', icon: Users },
  { label: 'Open Issues', value: '2', status: 'warning', icon: AlertTriangle },
  { label: 'Last Inspection', value: '2h ago', status: 'success', icon: Clock },
]

// Demo components
const ChemicalCard = ({ reading }: { reading: typeof mockChemicalReadings[0] }) => {
  const Icon = reading.icon
  const statusColors = {
    safe: 'text-green-600 bg-green-50 border-green-200',
    caution: 'text-amber-600 bg-amber-50 border-amber-200',
    critical: 'text-red-600 bg-red-50 border-red-200',
  }

  return (
    <Card className={`${statusColors[reading.status as keyof typeof statusColors]} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{reading.label}</p>
            <p className="text-2xl font-bold">
              {reading.value}
              <span className="text-sm font-normal ml-1">{reading.unit}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const MetricCard = ({ metric }: { metric: typeof mockMetrics[0] }) => {
  const Icon = metric.icon
  const statusColors = {
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
          <Icon className={`h-8 w-8 ${statusColors[metric.status as keyof typeof statusColors]}`} />
        </div>
      </CardContent>
    </Card>
  )
}

export const ContainerQueries: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Container Query Demonstration</h3>
        <p className="text-sm text-gray-600 mb-6">
          Resize the containers below to see how components adapt to their container size, not the viewport size.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Small Container */}
        <div>
          <h4 className="font-medium mb-3">Small Container (300px)</h4>
          <Container className="w-80 border-2 border-dashed border-gray-300 p-4">
            <AdaptiveGrid columns={{ default: 1, sm: 2, md: 3 }}>
              {mockChemicalReadings.slice(0, 3).map((reading, index) => (
                <ChemicalCard key={index} reading={reading} />
              ))}
            </AdaptiveGrid>
          </Container>
        </div>

        {/* Large Container */}
        <div>
          <h4 className="font-medium mb-3">Large Container (600px)</h4>
          <Container className="w-[600px] border-2 border-dashed border-gray-300 p-4">
            <AdaptiveGrid columns={{ default: 1, sm: 2, md: 3 }}>
              {mockChemicalReadings.slice(0, 3).map((reading, index) => (
                <ChemicalCard key={index} reading={reading} />
              ))}
            </AdaptiveGrid>
          </Container>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how container queries enable components to adapt to their container size rather than viewport size.',
      },
    },
  },
}

export const AdaptiveGridSystem: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Adaptive Grid Layouts</h3>
      </div>

      {/* Auto-fit Grid */}
      <div>
        <h4 className="font-medium mb-3">Auto-fit Grid (min 250px per item)</h4>
        <Container>
          <AdaptiveGrid minItemWidth="250px" gap="md">
            {mockChemicalReadings.map((reading, index) => (
              <ChemicalCard key={index} reading={reading} />
            ))}
          </AdaptiveGrid>
        </Container>
      </div>

      <Spacer size={{ mobile: 'lg', desktop: 'xl' }} />

      {/* Explicit Columns Grid */}
      <div>
        <h4 className="font-medium mb-3">Explicit Columns (1 → 2 → 4)</h4>
        <Container>
          <AdaptiveGrid columns={{ default: 1, sm: 2, lg: 4 }} gap="lg">
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </AdaptiveGrid>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows different grid strategies: auto-fit based on minimum item width and explicit column definitions.',
      },
    },
  },
}

export const ResponsiveStackLayouts: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive Stack Layouts</h3>
      </div>

      {/* Vertical Stack */}
      <div>
        <h4 className="font-medium mb-3">Vertical Stack</h4>
        <Container className="max-w-md">
          <Stack direction="column" gap="md">
            <Button className="w-full">Primary Action</Button>
            <Button variant="outline" className="w-full">Secondary Action</Button>
            <Button variant="ghost" className="w-full">Tertiary Action</Button>
          </Stack>
        </Container>
      </div>

      <Spacer />

      {/* Horizontal Stack */}
      <div>
        <h4 className="font-medium mb-3">Horizontal Stack</h4>
        <Container>
          <Stack direction="row" justify="center" gap="lg">
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="ghost">Reset</Button>
          </Stack>
        </Container>
      </div>

      <Spacer />

      {/* Responsive Stack */}
      <div>
        <h4 className="font-medium mb-3">Responsive Stack (Column → Row)</h4>
        <Container>
          <Stack direction="responsive" gap="md" justify="between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Pool Status Dashboard</span>
            </div>
            <Stack direction="row" gap="sm">
              <Button size="sm">Export</Button>
              <Button size="sm" variant="outline">Settings</Button>
            </Stack>
          </Stack>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Flexible stack layouts that can be vertical, horizontal, or responsive (changing based on container size).',
      },
    },
  },
}

export const DashboardLayoutDemo: Story = {
  render: () => (
    <DashboardLayout
      header={
        <Stack direction="responsive" justify="between" align="center">
          <div className="flex items-center gap-3">
            <Droplet className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold">Pool Management System</h1>
          </div>
          <Stack direction="row" gap="sm">
            <Button size="sm" variant="outline">Export Report</Button>
            <Button size="sm">Emergency Protocol</Button>
          </Stack>
        </Stack>
      }
      sidebar={
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Navigation</h3>
          <div className="space-y-1">
            {['Dashboard', 'Chemical Monitoring', 'Equipment Status', 'Staff Management', 'Reports'].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className="w-full justify-start text-sm"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metrics Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <MetricGrid>
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </MetricGrid>
        </div>

        <Spacer />

        {/* Chemical Readings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Current Chemical Levels</h2>
          <ChemicalReadingLayout variant="grid">
            {mockChemicalReadings.map((reading, index) => (
              <ChemicalCard key={index} reading={reading} />
            ))}
          </ChemicalReadingLayout>
        </div>
      </div>
    </DashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete dashboard layout with header, sidebar, and responsive main content area optimized for pool management.',
      },
    },
  },
}

export const PoolSpecificLayouts: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pool-Specific Layout Components</h3>
      </div>

      {/* Metric Grid */}
      <div>
        <h4 className="font-medium mb-3">Metric Grid (1 → 2 → 4 columns)</h4>
        <Container>
          <MetricGrid>
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </MetricGrid>
        </Container>
      </div>

      <Spacer />

      {/* Chemical Reading Grid Layout */}
      <div>
        <h4 className="font-medium mb-3">Chemical Reading Grid</h4>
        <Container>
          <ChemicalReadingLayout variant="grid">
            {mockChemicalReadings.map((reading, index) => (
              <ChemicalCard key={index} reading={reading} />
            ))}
          </ChemicalReadingLayout>
        </Container>
      </div>

      <Spacer />

      {/* Chemical Reading Card Layout */}
      <div>
        <h4 className="font-medium mb-3">Chemical Reading Cards</h4>
        <Container>
          <ChemicalReadingLayout variant="cards">
            {mockChemicalReadings.slice(0, 3).map((reading, index) => (
              <ResponsiveCard key={index} variant="default" orientation="auto">
                <div className="flex items-center gap-3">
                  <reading.icon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{reading.label}</h3>
                    <p className="text-sm text-gray-600">Current reading</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {reading.value}
                    <span className="text-lg font-normal text-gray-500 ml-1">
                      {reading.unit}
                    </span>
                  </p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    reading.status === 'safe' ? 'bg-green-100 text-green-800' :
                    reading.status === 'caution' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reading.status === 'safe' ? 'Optimal' : 
                     reading.status === 'caution' ? 'Monitor' : 'Critical'}
                  </div>
                </div>
              </ResponsiveCard>
            ))}
          </ChemicalReadingLayout>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pool maintenance-specific layout components optimized for chemical readings and facility metrics.',
      },
    },
  },
}

export const BreakpointControls: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Breakpoint Control Components</h3>
        <p className="text-sm text-gray-600 mb-6">
          Resize your browser window to see components show/hide at different container sizes.
        </p>
      </div>

      <Container className="border-2 border-dashed border-gray-300 p-6">
        <Stack direction="column" gap="lg">
          <Breakpoint show="xs" hide="sm">
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              <p className="font-medium">Extra Small Containers Only</p>
              <p className="text-sm">This appears only in very small containers</p>
            </div>
          </Breakpoint>

          <Breakpoint show="sm" hide="lg">
            <div className="p-4 bg-amber-100 text-amber-800 rounded-lg">
              <p className="font-medium">Small to Medium Containers</p>
              <p className="text-sm">This appears in small to medium sized containers</p>
            </div>
          </Breakpoint>

          <Breakpoint show="lg">
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-medium">Large Containers and Up</p>
              <p className="text-sm">This appears only in large containers</p>
            </div>
          </Breakpoint>

          {/* Always visible content */}
          <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
            <p className="font-medium">Always Visible</p>
            <p className="text-sm">This content is visible at all container sizes</p>
          </div>
        </Stack>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Utility components for showing/hiding content based on container query breakpoints.',
      },
    },
  },
}