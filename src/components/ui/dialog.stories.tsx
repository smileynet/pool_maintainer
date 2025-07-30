import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import {
  pools,
  technicians,
  chemicalReadings,
  maintenanceTasks,
} from '../../test/fixtures/pool-maintenance-data'
import { useState } from 'react'
import {
  AlertTriangle,
  TestTube,
  User,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Save,
  X,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react'

const meta = {
  title: 'Components/Organisms/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Dialog component provides modal overlays for important actions, confirmations, and forms. Built on Radix UI Dialog primitive with pool maintenance-specific patterns for safety-critical interactions.

## Features
- **Accessible Modal**: Full keyboard navigation and screen reader support
- **Flexible Layout**: Header, content, and footer sections
- **Overlay Management**: Proper focus trapping and scroll lock
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Animation Support**: Smooth enter/exit transitions
- **Safety Patterns**: Critical action confirmations and warnings

## Pool Maintenance Usage
- Chemical reading confirmation dialogs
- Equipment maintenance task forms
- Critical alert acknowledgments
- Pool closure confirmations
- Technician assignment modals
- Data entry and editing forms

## Accessibility
- Focus is trapped within the dialog when open
- Escape key closes the dialog
- Click outside overlay closes dialog (configurable)
- Screen reader announcements for dialog state
- Proper ARIA labeling and descriptions
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
    open: {
      description: 'Whether the dialog is open',
      table: { category: 'State' },
      control: 'boolean',
    },
    onOpenChange: {
      description: 'Callback when dialog open state changes',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

// Basic dialog examples
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a basic dialog with header, content, and footer sections.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// Critical chemical confirmation dialog
export const ChemicalReadingConfirmation: Story = {
  render: () => {
    const criticalReading = {
      pool: pools[0],
      chlorine: 0.3,
      ph: 6.8,
      temperature: 85,
      technician: technicians[0].name,
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Submit Critical Reading
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Critical Chemical Reading
            </DialogTitle>
            <DialogDescription>
              This reading indicates dangerous conditions that require immediate action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="font-medium text-red-800">Critical Issues Detected:</h4>
              <ul className="mt-2 space-y-1 text-sm text-red-700">
                <li>
                  • Chlorine level {criticalReading.chlorine} ppm is below safe minimum (1.0 ppm)
                </li>
                <li>• pH level {criticalReading.ph} is dangerously low (equipment damage risk)</li>
                <li>• Temperature {criticalReading.temperature}°F may promote bacterial growth</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Pool: {criticalReading.pool.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span>Technician: {criticalReading.technician}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Time: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="font-medium text-amber-800">Immediate Actions Required:</h4>
              <ul className="mt-2 space-y-1 text-sm text-amber-700">
                <li>1. Close pool to swimmers immediately</li>
                <li>2. Add chlorine to reach minimum 1.0 ppm</li>
                <li>3. Adjust pH to 7.2-7.6 range</li>
                <li>4. Notify supervisor and document incident</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm & Close Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical chemical reading confirmation with safety warnings and required actions.',
      },
    },
  },
}

// Chemical reading entry form
export const ChemicalReadingForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      poolId: '',
      chlorine: '',
      ph: '',
      temperature: '',
      alkalinity: '',
      notes: '',
    })

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <TestTube className="mr-2 h-4 w-4" />
            New Chemical Reading
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chemical Reading Entry</DialogTitle>
            <DialogDescription>
              Record new chemical test results for pool maintenance tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pool-select">Pool Location *</Label>
              <select
                id="pool-select"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.poolId}
                onChange={(e) => setFormData({ ...formData, poolId: e.target.value })}
              >
                <option value="">Select pool...</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name} - {pool.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chlorine">Free Chlorine (ppm) *</Label>
                <Input
                  id="chlorine"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="2.4"
                  value={formData.chlorine}
                  onChange={(e) => setFormData({ ...formData, chlorine: e.target.value })}
                  className={
                    formData.chlorine && parseFloat(formData.chlorine) < 1.0
                      ? 'border-red-500'
                      : formData.chlorine &&
                          parseFloat(formData.chlorine) >= 1.0 &&
                          parseFloat(formData.chlorine) <= 3.0
                        ? 'border-green-500'
                        : ''
                  }
                />
                <p className="text-muted-foreground text-xs">Target: 1.0-3.0 ppm</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ph">pH Level *</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  min="6.0"
                  max="8.5"
                  placeholder="7.4"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  className={
                    formData.ph && (parseFloat(formData.ph) < 7.2 || parseFloat(formData.ph) > 7.6)
                      ? 'border-amber-500'
                      : formData.ph &&
                          parseFloat(formData.ph) >= 7.2 &&
                          parseFloat(formData.ph) <= 7.6
                        ? 'border-green-500'
                        : ''
                  }
                />
                <p className="text-muted-foreground text-xs">Target: 7.2-7.6</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="60"
                  max="100"
                  placeholder="78"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alkalinity">Total Alkalinity (ppm)</Label>
                <Input
                  id="alkalinity"
                  type="number"
                  min="0"
                  max="300"
                  placeholder="100"
                  value={formData.alkalinity}
                  onChange={(e) => setFormData({ ...formData, alkalinity: e.target.value })}
                />
                <p className="text-muted-foreground text-xs">Target: 80-120 ppm</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional observations or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {formData.chlorine && parseFloat(formData.chlorine) < 1.0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex items-center gap-2 text-sm text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Warning: Low Chlorine Level</span>
                </div>
                <p className="mt-1 text-sm text-red-700">
                  Pool may need to be closed until chlorine reaches safe levels.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!formData.poolId || !formData.chlorine || !formData.ph}>
              <Save className="mr-2 h-4 w-4" />
              Save Reading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Chemical reading entry form with real-time validation and safety warnings.',
      },
    },
  },
}

// Task assignment dialog
export const TaskAssignmentDialog: Story = {
  render: () => {
    const task = maintenanceTasks[0]
    const [selectedTechnician, setSelectedTechnician] = useState('')
    const [scheduledDate, setScheduledDate] = useState('')
    const [priority, setPriority] = useState(task.priority)

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <User className="mr-2 h-4 w-4" />
            Assign Task
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Maintenance Task</DialogTitle>
            <DialogDescription>
              Assign this task to an available technician and set the schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-gray-50 p-4">
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-muted-foreground mt-1 text-sm">{task.description}</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span>Pool: {task.poolId}</span>
                <span>Duration: {task.estimatedDuration}min</span>
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                  {task.priority}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Assign to Technician *</Label>
              <select
                id="technician"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
              >
                <option value="">Select technician...</option>
                {technicians
                  .filter((tech) => tech.status === 'available')
                  .map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} - {tech.role} ({tech.certifications.join(', ')})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-date">Scheduled Date *</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <select
                  id="priority"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {selectedTechnician && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Info className="h-4 w-4" />
                  <span className="font-medium">Technician Selected</span>
                </div>
                <p className="mt-1 text-sm text-blue-700">
                  {technicians.find((t) => t.id === selectedTechnician)?.name} will be notified of
                  this assignment.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!selectedTechnician || !scheduledDate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Task assignment dialog with technician selection and scheduling.',
      },
    },
  },
}

// Pool closure confirmation
export const PoolClosureConfirmation: Story = {
  render: () => {
    const pool = pools[0]
    const [reason, setReason] = useState('')
    const [estimatedReopening, setEstimatedReopening] = useState('')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Close Pool
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Close Pool
            </DialogTitle>
            <DialogDescription>
              This action will immediately close the pool to all swimmers. Please provide closure
              details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-gray-50 p-4">
              <h4 className="font-medium">{pool.name}</h4>
              <p className="text-muted-foreground text-sm">{pool.location}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Badge className="bg-green-500">Currently Active</Badge>
                <span>Capacity: {pool.capacity}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closure-reason">Reason for Closure *</Label>
              <select
                id="closure-reason"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Select reason...</option>
                <option value="chemical-imbalance">Chemical Imbalance</option>
                <option value="equipment-failure">Equipment Failure</option>
                <option value="maintenance">Scheduled Maintenance</option>
                <option value="safety-incident">Safety Incident</option>
                <option value="weather">Weather Conditions</option>
                <option value="contamination">Water Contamination</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-reopening">Estimated Reopening</Label>
              <Input
                id="estimated-reopening"
                type="datetime-local"
                value={estimatedReopening}
                onChange={(e) => setEstimatedReopening(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-muted-foreground text-xs">
                Leave blank if reopening time is unknown
              </p>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="font-medium text-red-800">Closure Impact:</h4>
              <ul className="mt-2 space-y-1 text-sm text-red-700">
                <li>• All swimmers will be asked to exit immediately</li>
                <li>• Pool access will be restricted</li>
                <li>• Automated systems will be notified</li>
                <li>• Incident report will be generated</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive" disabled={!reason}>
              <XCircle className="mr-2 h-4 w-4" />
              Confirm Closure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Pool closure confirmation dialog with reason selection and impact warning.',
      },
    },
  },
}

// Deletion confirmation dialog
export const DeleteConfirmationDialog: Story = {
  render: () => {
    const taskToDelete = maintenanceTasks[2]

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Task
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Maintenance Task
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The task and all associated data will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="font-medium text-red-800">{taskToDelete.title}</h4>
              <p className="mt-1 text-sm text-red-700">{taskToDelete.description}</p>
              <div className="mt-2 space-y-1 text-sm text-red-600">
                <div>Pool: {taskToDelete.poolId}</div>
                <div>Assigned to: {taskToDelete.assignedTo}</div>
                <div>Status: {taskToDelete.status}</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Destructive action confirmation with clear warning and task details.',
      },
    },
  },
}

// Information dialog
export const InformationDialog: Story = {
  render: () => {
    const reading = chemicalReadings[0]

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Info className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-blue-600" />
              Chemical Reading Details
            </DialogTitle>
            <DialogDescription>
              Complete information for this chemical test reading.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">FREE CHLORINE</Label>
                <div className="font-mono text-2xl font-bold text-green-600">
                  {reading.chlorine} ppm
                </div>
                <p className="text-muted-foreground text-xs">Target: 1.0-3.0 ppm</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">PH LEVEL</Label>
                <div className="font-mono text-2xl font-bold text-green-600">{reading.ph}</div>
                <p className="text-muted-foreground text-xs">Target: 7.2-7.6</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">TEMPERATURE</Label>
                <div className="font-mono text-lg font-semibold">{reading.temperature}°F</div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">ALKALINITY</Label>
                <div className="font-mono text-lg font-semibold">{reading.alkalinity} ppm</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Pool: {reading.poolId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Technician: {reading.technician}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Date: {new Date(reading.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Time: {new Date(reading.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">All levels within safe range</span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                Chemical balance is optimal for safe swimming conditions.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Information dialog displaying detailed chemical reading data with status indicators.',
      },
    },
  },
}

// Responsive dialog example
export const ResponsiveDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Responsive Dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Responsive Dialog</DialogTitle>
          <DialogDescription>
            This dialog adapts to different screen sizes and maintains usability on mobile devices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm">
            On mobile devices, this dialog takes up most of the screen width while maintaining
            proper margins. On larger screens, it has a fixed maximum width.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pool Selection</Label>
              <select className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                <option>Main Community Pool</option>
                <option>Kiddie Pool</option>
                <option>Therapy Pool</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Test Date</Label>
              <Input type="date" />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button className="w-full sm:w-auto">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog that adapts to different screen sizes with responsive layout adjustments.',
      },
    },
  },
}
