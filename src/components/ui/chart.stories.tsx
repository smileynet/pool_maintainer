import type { Meta, StoryObj } from '@storybook/react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  TestTube,
  Users,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

const meta = {
  title: 'Components/Organisms/Charts',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Chart components for pool maintenance data visualization using Recharts. These components provide insights into chemical levels, maintenance trends, occupancy patterns, and technician performance.

## Features
- **Responsive Design**: Charts adapt to container size automatically
- **Interactive Tooltips**: Hover for detailed data points
- **Color-coded Data**: Status-based coloring for safety indicators
- **Reference Lines**: MAHC compliance ranges and safety thresholds
- **Multiple Chart Types**: Line, area, bar, pie, and composed charts
- **Real-time Updates**: Support for live data streaming

## Pool Maintenance Usage
- Chemical level monitoring with safety ranges
- Occupancy tracking and capacity management
- Maintenance task completion analytics
- Technician workload distribution
- Trend analysis for preventive maintenance
- Compliance reporting and audit trails

## Chart Types
- **Line Charts**: Time-series data for chemical readings
- **Area Charts**: Cumulative metrics and occupancy trends
- **Bar Charts**: Comparative data and completion rates
- **Pie Charts**: Distribution analysis and resource allocation
- **Composed Charts**: Multi-metric dashboards with overlays

## Data Safety Features
- Red zones for critical chemical levels
- Yellow zones for caution ranges
- Green zones for optimal conditions
- MAHC compliance indicators
- Emergency threshold alerts
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
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Mock data for charts
const chemicalTrendData = [
  { time: '06:00', freeChlorine: 2.1, ph: 7.4, alkalinity: 95, temperature: 76 },
  { time: '08:00', freeChlorine: 2.3, ph: 7.3, alkalinity: 98, temperature: 77 },
  { time: '10:00', freeChlorine: 2.0, ph: 7.2, alkalinity: 102, temperature: 78 },
  { time: '12:00', freeChlorine: 1.8, ph: 7.1, alkalinity: 105, temperature: 82 },
  { time: '14:00', freeChlorine: 1.5, ph: 7.0, alkalinity: 108, temperature: 84 },
  { time: '16:00', freeChlorine: 1.2, ph: 6.9, alkalinity: 110, temperature: 83 },
  { time: '18:00', freeChlorine: 1.0, ph: 6.8, alkalinity: 112, temperature: 81 },
  { time: '20:00', freeChlorine: 1.4, ph: 7.1, alkalinity: 108, temperature: 79 },
]

const occupancyData = [
  { time: '06:00', mainPool: 5, kiddiePool: 0, therapyPool: 2, lapPool: 8 },
  { time: '07:00', mainPool: 12, kiddiePool: 3, therapyPool: 4, lapPool: 15 },
  { time: '08:00', mainPool: 28, kiddiePool: 8, therapyPool: 6, lapPool: 25 },
  { time: '09:00', mainPool: 45, kiddiePool: 15, therapyPool: 8, lapPool: 35 },
  { time: '10:00', mainPool: 65, kiddiePool: 22, therapyPool: 12, lapPool: 42 },
  { time: '11:00', mainPool: 85, kiddiePool: 28, therapyPool: 15, lapPool: 48 },
  { time: '12:00', mainPool: 120, kiddiePool: 30, therapyPool: 18, lapPool: 55 },
  { time: '13:00', mainPool: 140, kiddiePool: 25, therapyPool: 20, lapPool: 60 },
  { time: '14:00', mainPool: 135, kiddiePool: 20, therapyPool: 16, lapPool: 52 },
  { time: '15:00', mainPool: 110, kiddiePool: 18, therapyPool: 14, lapPool: 45 },
  { time: '16:00', mainPool: 85, kiddiePool: 12, therapyPool: 10, lapPool: 35 },
  { time: '17:00', mainPool: 55, kiddiePool: 8, therapyPool: 6, lapPool: 25 },
  { time: '18:00', mainPool: 35, kiddiePool: 5, therapyPool: 4, lapPool: 18 },
  { time: '19:00', mainPool: 20, kiddiePool: 2, therapyPool: 2, lapPool: 12 },
  { time: '20:00', mainPool: 8, kiddiePool: 0, therapyPool: 1, lapPool: 5 },
]

const maintenanceCompletionData = [
  { task: 'Chemical Testing', completed: 28, pending: 2, overdue: 0 },
  { task: 'Filter Cleaning', completed: 12, pending: 3, overdue: 1 },
  { task: 'Skimming', completed: 45, pending: 5, overdue: 0 },
  { task: 'Vacuuming', completed: 18, pending: 4, overdue: 2 },
  { task: 'Equipment Check', completed: 22, pending: 6, overdue: 1 },
  { task: 'Safety Inspection', completed: 8, pending: 2, overdue: 0 },
]

const technicianWorkloadData = [
  { name: 'John Smith', value: 35, color: '#0ea5e9' },
  { name: 'Sarah Johnson', value: 28, color: '#10b981' },
  { name: 'Mike Davis', value: 42, color: '#f59e0b' },
  { name: 'Emily Wilson', value: 25, color: '#ef4444' },
]

const weeklyTrendsData = [
  { day: 'Mon', tasks: 24, chemicals: 8, occupancy: 85, incidents: 0 },
  { day: 'Tue', tasks: 28, chemicals: 12, occupancy: 92, incidents: 1 },
  { day: 'Wed', tasks: 22, chemicals: 10, occupancy: 78, incidents: 0 },
  { day: 'Thu', tasks: 30, chemicals: 15, occupancy: 95, incidents: 2 },
  { day: 'Fri', tasks: 35, chemicals: 18, occupancy: 125, incidents: 0 },
  { day: 'Sat', tasks: 42, chemicals: 20, occupancy: 150, incidents: 1 },
  { day: 'Sun', tasks: 38, chemicals: 16, occupancy: 135, incidents: 0 },
]

// Custom tooltip component
const ChemicalTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium mb-2">{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.dataKey}: {entry.value}</span>
            {entry.dataKey === 'freeChlorine' && (
              <Badge className={
                entry.value < 1.0 ? 'bg-red-500' : 
                entry.value > 3.0 ? 'bg-orange-500' : 'bg-green-500'
              }>
                {entry.value < 1.0 ? 'Low' : entry.value > 3.0 ? 'High' : 'Safe'}
              </Badge>
            )}
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Chemical levels line chart
export const ChemicalLevelsChart: Story = {
  render: () => (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Chemical Levels - Main Community Pool
          </CardTitle>
          <CardDescription>
            Real-time monitoring of water chemistry with MAHC compliance ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chemicalTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<ChemicalTooltip />} />
              <Legend />
              
              {/* MAHC Reference Lines for Free Chlorine */}
              <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={3.0} stroke="#ef4444" strokeDasharray="5 5" />
              
              <Line 
                type="monotone" 
                dataKey="freeChlorine" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                name="Free Cl (ppm)"
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="ph" 
                stroke="#10b981" 
                strokeWidth={2}
                name="pH Level"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Temp (°F)"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Safe Range (1.0-3.0 ppm Cl)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Critical Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>MAHC Compliance Thresholds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-time chemical level monitoring with safety thresholds and MAHC compliance indicators.',
      },
    },
  },
}

// Pool occupancy area chart
export const PoolOccupancyChart: Story = {
  render: () => (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daily Pool Occupancy Trends
          </CardTitle>
          <CardDescription>
            Hourly visitor patterns across all pool facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="mainPool"
                stackId="1"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.8}
                name="Main Pool"
              />
              <Area
                type="monotone"
                dataKey="lapPool"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name="Lap Pool"
              />
              <Area
                type="monotone"
                dataKey="kiddiePool"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.8}
                name="Kiddie Pool"
              />
              <Area
                type="monotone"
                dataKey="therapyPool"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.8}
                name="Therapy Pool"
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <div>
                <div className="font-medium">Main Pool</div>
                <div className="text-gray-500">Capacity: 150</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <div className="font-medium">Lap Pool</div>
                <div className="text-gray-500">Capacity: 80</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div>
                <div className="font-medium">Kiddie Pool</div>
                <div className="text-gray-500">Capacity: 30</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div>
                <div className="font-medium">Therapy Pool</div>
                <div className="text-gray-500">Capacity: 20</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Stacked area chart showing hourly occupancy patterns across all pool facilities.',
      },
    },
  },
}

// Maintenance completion bar chart
export const MaintenanceCompletionChart: Story = {
  render: () => (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Maintenance Task Completion
          </CardTitle>
          <CardDescription>
            Weekly completion rates by task category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={maintenanceCompletionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="task" type="category" width={120} />
              <Tooltip />
              <Legend />
              
              <Bar 
                dataKey="completed" 
                fill="#10b981" 
                name="Completed"
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="pending" 
                fill="#f59e0b" 
                name="Pending"
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="overdue" 
                fill="#ef4444" 
                name="Overdue"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>On Schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Attention Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Critical Delays</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Overall completion rate: 85%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal bar chart showing maintenance task completion status by category.',
      },
    },
  },
}

// Technician workload pie chart
export const TechnicianWorkloadChart: Story = {
  render: () => (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Technician Workload Distribution
          </CardTitle>
          <CardDescription>
            Current task assignments across maintenance team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={technicianWorkloadData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {technicianWorkloadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-4">
              {technicianWorkloadData.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: tech.color }}
                    />
                    <div>
                      <div className="font-medium">{tech.name}</div>
                      <div className="text-sm text-gray-500">{tech.value} active tasks</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      tech.value > 35 ? 'bg-red-500' :
                      tech.value > 25 ? 'bg-yellow-500 text-black' :
                      'bg-green-500'
                    }>
                      {tech.value > 35 ? 'Overloaded' :
                       tech.value > 25 ? 'Busy' : 'Available'}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Team Summary</h4>
                <div className="text-sm space-y-1">
                  <div>Total Tasks: {technicianWorkloadData.reduce((sum, tech) => sum + tech.value, 0)}</div>
                  <div>Avg. Load: {Math.round(technicianWorkloadData.reduce((sum, tech) => sum + tech.value, 0) / technicianWorkloadData.length)} tasks/person</div>
                  <div>Team Capacity: 85% utilized</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pie chart with detailed breakdown showing current workload distribution across technicians.',
      },
    },
  },
}

// Composed chart with multiple metrics
export const WeeklyOverviewChart: Story = {
  render: () => (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Operations Overview
          </CardTitle>
          <CardDescription>
            Multi-metric dashboard showing tasks, chemical tests, occupancy, and incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={weeklyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              
              <Bar 
                yAxisId="left"
                dataKey="tasks" 
                fill="#0ea5e9" 
                name="Tasks Completed"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="left"
                dataKey="chemicals" 
                fill="#10b981" 
                name="Chemical Tests"
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="occupancy" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Peak Occupancy"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="incidents" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Safety Incidents"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {weeklyTrendsData.reduce((sum, day) => sum + day.tasks, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {weeklyTrendsData.reduce((sum, day) => sum + day.chemicals, 0)}
              </div>
              <div className="text-sm text-gray-600">Chemical Tests</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.max(...weeklyTrendsData.map(day => day.occupancy))}
              </div>
              <div className="text-sm text-gray-600">Peak Occupancy</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+15%</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {weeklyTrendsData.reduce((sum, day) => sum + day.incidents, 0)}
              </div>
              <div className="text-sm text-gray-600">Safety Incidents</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">-25%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Composed chart combining bars and lines to show multiple operational metrics over time.',
      },
    },
  },
}