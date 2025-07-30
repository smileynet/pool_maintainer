import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Input } from './input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { cn } from '@/lib/utils'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  TestTube,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Users,
  Filter,
} from 'lucide-react'

// Import calendar CSS
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup localizer for date-fns
const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const meta = {
  title: 'Components/Organisms/Calendar',
  component: Calendar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Calendar components for pool maintenance scheduling and task management using React Big Calendar. These components provide comprehensive scheduling capabilities for maintenance tasks, chemical testing, staff assignments, and facility management.

## Features
- **Multiple Views**: Month, week, day, and agenda views
- **Interactive Scheduling**: Drag-and-drop event management
- **Resource Assignment**: Technician and facility resource views
- **Event Categories**: Color-coded task types and priorities
- **Time Slot Management**: Precise scheduling with time blocks
- **Recurring Events**: Support for scheduled maintenance routines

## Pool Maintenance Usage
- Daily maintenance task scheduling
- Chemical testing schedules with technician assignments
- Equipment inspection and maintenance planning
- Staff scheduling and shift management
- Emergency response coordination
- Compliance audit scheduling

## Event Types
- **Chemical Testing**: Regular water quality assessments
- **Maintenance Tasks**: Equipment and facility maintenance
- **Inspections**: Safety and compliance inspections
- **Staff Assignments**: Technician scheduling and shifts
- **Emergency Response**: Urgent safety and maintenance issues
- **Training Sessions**: Staff certification and training events

## Accessibility Features
- Full keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators on interactive elements
- ARIA labels for calendar navigation
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
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

// Define event types for pool maintenance
interface PoolMaintenanceEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource?: string
  type: 'chemical' | 'maintenance' | 'inspection' | 'emergency' | 'training' | 'staff'
  priority: 'low' | 'medium' | 'high' | 'critical'
  technician: string
  pool?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  description?: string
}

// Mock data for calendar events
const getMaintenanceEvents = (): PoolMaintenanceEvent[] => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  return [
    // Chemical testing events
    {
      id: 'CHE-001',
      title: 'Chemical Test - Main Pool',
      start: new Date(today.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      end: new Date(today.getTime() + 2.5 * 60 * 60 * 1000),
      type: 'chemical',
      priority: 'high',
      technician: 'John Smith',
      pool: 'Main Community Pool',
      status: 'scheduled',
      description: 'Weekly chemical balance testing',
    },
    {
      id: 'CHE-002',
      title: 'pH Adjustment - Kiddie Pool',
      start: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // Tomorrow at 9 AM
      end: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
      type: 'chemical',
      priority: 'medium',
      technician: 'Sarah Johnson',
      pool: 'Kiddie Pool',
      status: 'scheduled',
      description: 'pH level correction based on morning readings',
    },
    
    // Maintenance tasks
    {
      id: 'MAIN-001',
      title: 'Filter Cleaning - All Pools',
      start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Day after tomorrow at 8 AM
      end: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
      type: 'maintenance',
      priority: 'medium',
      technician: 'Mike Davis',
      status: 'scheduled',
      description: 'Weekly filter maintenance and cleaning',
    },
    {
      id: 'MAIN-002',
      title: 'Pump Inspection - Building A',
      start: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
      type: 'maintenance',
      priority: 'high',
      technician: 'Emily Wilson',
      status: 'scheduled',
      description: 'Monthly pump performance inspection',
    },
    
    // Safety inspections
    {
      id: 'INSP-001',
      title: 'Safety Equipment Inspection',
      start: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
      type: 'inspection',
      priority: 'high',
      technician: 'John Smith',
      status: 'scheduled',
      description: 'Monthly safety equipment and emergency response check',
    },
    
    // Emergency response
    {
      id: 'EMER-001',
      title: 'URGENT: Chlorine Level Critical',
      start: new Date(today.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
      end: new Date(today.getTime() + 7 * 60 * 60 * 1000),
      type: 'emergency',
      priority: 'critical',
      technician: 'Sarah Johnson',
      pool: 'Therapy Pool',
      status: 'in-progress',
      description: 'Emergency chemical adjustment - chlorine below safe levels',
    },
    
    // Training sessions
    {
      id: 'TRAIN-001',
      title: 'CPO Certification Training',
      start: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
      type: 'training',
      priority: 'medium',
      technician: 'All Staff',
      status: 'scheduled',
      description: 'Annual CPO certification renewal training',
    },
    
    // Staff scheduling
    {
      id: 'STAFF-001',
      title: 'Morning Shift - John Smith',
      start: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
      type: 'staff',
      priority: 'medium',
      technician: 'John Smith',
      status: 'scheduled',
      description: 'Regular morning shift coverage',
    },
    {
      id: 'STAFF-002',
      title: 'Evening Shift - Sarah Johnson',  
      start: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
      type: 'staff',
      priority: 'medium',
      technician: 'Sarah Johnson',
      status: 'scheduled',
      description: 'Regular evening shift coverage',
    },
  ]
}

// Event style function
const eventStyleGetter = (event: PoolMaintenanceEvent) => {
  let backgroundColor = '#3174ad'
  const color = 'white'
  
  switch (event.type) {
    case 'chemical':
      backgroundColor = '#0ea5e9'
      break
    case 'maintenance':
      backgroundColor = '#10b981'
      break
    case 'inspection':
      backgroundColor = '#f59e0b'
      break
    case 'emergency':
      backgroundColor = '#ef4444'
      break
    case 'training':
      backgroundColor = '#8b5cf6'
      break
    case 'staff':
      backgroundColor = '#6b7280'
      break
  }
  
  if (event.priority === 'critical') {
    backgroundColor = '#dc2626'
  }
  
  return {
    style: {
      backgroundColor,
      color,
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
    }
  }
}

// Custom event component
const EventComponent = ({ event }: { event: PoolMaintenanceEvent }) => (
  <div className="flex items-center gap-1 p-1">
    {event.type === 'chemical' && <TestTube className="w-3 h-3" />}
    {event.type === 'maintenance' && <Wrench className="w-3 h-3" />}
    {event.type === 'inspection' && <CheckCircle className="w-3 h-3" />}
    {event.type === 'emergency' && <AlertTriangle className="w-3 h-3" />}
    {event.type === 'training' && <Users className="w-3 h-3" />}
    {event.type === 'staff' && <User className="w-3 h-3" />}
    <span className="truncate text-xs">{event.title}</span>
  </div>
)

// Month view calendar
export const MonthViewCalendar: Story = {
  render: () => {
    const [events] = useState<PoolMaintenanceEvent[]>(getMaintenanceEvents())
    const [view, setView] = useState<View>(Views.MONTH)
    const [date, setDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<PoolMaintenanceEvent | null>(null)
    const [showEventDialog, setShowEventDialog] = useState(false)

    const handleSelectEvent = useCallback((event: PoolMaintenanceEvent) => {
      setSelectedEvent(event)
      setShowEventDialog(true)
    }, [])

    const handleNavigate = useCallback((newDate: Date) => {
      setDate(newDate)
    }, [])

    const handleViewChange = useCallback((newView: View) => {
      setView(newView)
    }, [])

    return (
      <div className="w-full p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Pool Maintenance Schedule - Month View
            </CardTitle>
            <CardDescription>
              Complete monthly overview of all maintenance activities, staff schedules, and safety inspections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500">
                  <TestTube className="w-3 h-3 mr-1" />
                  Chemical Testing
                </Badge>
                <Badge className="bg-green-500">
                  <Wrench className="w-3 h-3 mr-1" />
                  Maintenance
                </Badge>
                <Badge className="bg-yellow-500 text-black">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Inspections
                </Badge>
                <Badge className="bg-red-500">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency
                </Badge>
                <Badge className="bg-purple-500">
                  <Users className="w-3 h-3 mr-1" />
                  Training
                </Badge>
                <Badge className="bg-gray-500">
                  <User className="w-3 h-3 mr-1" />
                  Staff Shifts
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                view={view}
                date={date}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: EventComponent,
                }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                step={30}
                showMultiDayTimes
                className="pool-maintenance-calendar"
              />
            </div>

            {/* Event Details Dialog */}
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedEvent?.type === 'chemical' && <TestTube className="w-5 h-5" />}
                    {selectedEvent?.type === 'maintenance' && <Wrench className="w-5 h-5" />}
                    {selectedEvent?.type === 'inspection' && <CheckCircle className="w-5 h-5" />}
                    {selectedEvent?.type === 'emergency' && <AlertTriangle className="w-5 h-5" />}
                    {selectedEvent?.type === 'training' && <Users className="w-5 h-5" />}
                    {selectedEvent?.type === 'staff' && <User className="w-5 h-5" />}
                    {selectedEvent?.title}
                  </DialogTitle>
                  <DialogDescription>
                    Event details and management options
                  </DialogDescription>
                </DialogHeader>
                
                {selectedEvent && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <p className="text-sm text-gray-600">
                          {selectedEvent.start.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <p className="text-sm text-gray-600">
                          {selectedEvent.end.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Assigned Technician</label>
                      <p className="text-sm text-gray-600">{selectedEvent.technician}</p>
                    </div>
                    
                    {selectedEvent.pool && (
                      <div>
                        <label className="text-sm font-medium">Pool Location</label>
                        <p className="text-sm text-gray-600">{selectedEvent.pool}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Badge className={
                        selectedEvent.priority === 'critical' ? 'bg-red-500' :
                        selectedEvent.priority === 'high' ? 'bg-orange-500' :
                        selectedEvent.priority === 'medium' ? 'bg-yellow-500 text-black' :
                        'bg-gray-500'
                      }>
                        {selectedEvent.priority}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge className={
                        selectedEvent.status === 'completed' ? 'bg-green-500' :
                        selectedEvent.status === 'in-progress' ? 'bg-blue-500' :
                        selectedEvent.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gray-500'
                      }>
                        {selectedEvent.status}
                      </Badge>
                    </div>
                    
                    {selectedEvent.description && (
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        Reassign
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Full-featured month view calendar with color-coded events, filtering, and detailed event management.',
      },
    },
  },
}

// Week view with technician focus
export const WeekViewWithTechnicians: Story = {
  render: () => {
    const [events] = useState<PoolMaintenanceEvent[]>(getMaintenanceEvents())
    const [selectedTechnician, setSelectedTechnician] = useState<string>('all')

    const technicians = ['all', 'John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson']
    
    const filteredEvents = selectedTechnician === 'all' 
      ? events 
      : events.filter(event => event.technician === selectedTechnician)

    return (
      <div className="w-full p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Technician Schedule - Week View
            </CardTitle>
            <CardDescription>
              Weekly technician assignments and task distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Filter by Technician:</label>
                <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map(tech => (
                      <SelectItem key={tech} value={tech}>
                        {tech === 'all' ? 'All Technicians' : tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {filteredEvents.length} events
              </div>
            </div>

            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                defaultView={Views.WEEK}
                views={[Views.WEEK, Views.DAY]}
                step={30}
                timeslots={2}
                showMultiDayTimes
                eventPropGetter={eventStyleGetter}
                components={{
                  event: EventComponent,
                }}
                min={new Date(0, 0, 0, 6, 0, 0)} // 6 AM
                max={new Date(0, 0, 0, 22, 0, 0)} // 10 PM
                className="pool-maintenance-calendar"
              />
            </div>

            {/* Technician Workload Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicians.slice(1).map(tech => {
                const techEvents = events.filter(event => event.technician === tech)
                const upcomingEvents = techEvents.filter(event => event.start > new Date())
                const criticalEvents = techEvents.filter(event => event.priority === 'critical')
                
                return (
                  <Card key={tech} className={cn(
                    "p-4",
                    selectedTechnician === tech && "ring-2 ring-blue-500"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{tech}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Upcoming: {upcomingEvents.length} tasks</div>
                      <div>Critical: {criticalEvents.length} tasks</div>
                      <div className="flex gap-1 mt-2">
                        {criticalEvents.length > 0 && (
                          <Badge className="bg-red-500 text-xs">
                            {criticalEvents.length} urgent
                          </Badge>
                        )}
                        {upcomingEvents.length > 5 && (
                          <Badge className="bg-yellow-500 text-black text-xs">
                            Busy
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Week view calendar with technician filtering and workload summary for efficient staff management.',
      },
    },
  },
}

// Day view with detailed scheduling
export const DayViewDetailed: Story = {
  render: () => {
    const [events] = useState<PoolMaintenanceEvent[]>(getMaintenanceEvents())
    const [date, setDate] = useState(new Date())
    const [showNewEventDialog, setShowNewEventDialog] = useState(false)

    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })

    return (
      <div className="w-full p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Schedule - {date.toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              Detailed hourly schedule with precise time management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input
                  type="date"
                  value={date.toISOString().split('T')[0]}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="w-auto"
                />
                <div className="text-sm text-gray-600">
                  {dayEvents.length} events scheduled
                </div>
              </div>
              
              <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Task</DialogTitle>
                    <DialogDescription>
                      Create a new maintenance task or appointment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Task Title</label>
                      <Input placeholder="Enter task description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Input type="time" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Task Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chemical">Chemical Testing</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Assign Technician</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Smith</SelectItem>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                          <SelectItem value="mike">Mike Davis</SelectItem>
                          <SelectItem value="emily">Emily Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button>Schedule Task</Button>
                      <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={dayEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                defaultView={Views.DAY}
                date={date}
                onNavigate={setDate}
                views={[Views.DAY]}
                step={15}
                timeslots={4}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: EventComponent,
                }}
                min={new Date(0, 0, 0, 6, 0, 0)} // 6 AM
                max={new Date(0, 0, 0, 22, 0, 0)} // 10 PM
                className="pool-maintenance-calendar"
              />
            </div>

            {/* Day Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TestTube className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Chemical Tests</span>
                </div>
                <div className="text-2xl font-bold">
                  {dayEvents.filter(e => e.type === 'chemical').length}
                </div>
                <div className="text-sm text-gray-600">
                  {dayEvents.filter(e => e.type === 'chemical' && e.priority === 'high').length} high priority
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Maintenance</span>
                </div>
                <div className="text-2xl font-bold">
                  {dayEvents.filter(e => e.type === 'maintenance').length}
                </div>
                <div className="text-sm text-gray-600">
                  {dayEvents.filter(e => e.type === 'maintenance' && e.priority === 'high').length} critical tasks
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Emergencies</span>
                </div>
                <div className="text-2xl font-bold">
                  {dayEvents.filter(e => e.type === 'emergency').length}
                </div>
                <div className="text-sm text-gray-600">
                  Immediate attention required
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed day view with 15-minute time slots, task creation dialog, and daily summary metrics.',
      },
    },
  },
}