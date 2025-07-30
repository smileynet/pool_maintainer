import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import {
  technicians,
  pools,
  chemicalTypes,
  maintenanceTasks,
} from '../../test/fixtures/pool-maintenance-data'
import { useState, useEffect } from 'react'
import { User, MapPin, TestTube, Clock, Loader2 } from 'lucide-react'

const meta = {
  title: 'Components/Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Select component provides a dropdown selection interface with support for single and multi-value selections. It's built on Radix UI Select primitive with custom styling and pool maintenance specific functionality.

## Features
- Accessible dropdown with keyboard navigation
- Custom trigger and content styling
- Search and filter capabilities  
- Async data loading support
- Grouping and categorization
- Icon and description support
- Mobile-friendly touch targets

## Pool Maintenance Usage
- Technician assignment and selection
- Pool selection for tasks and readings
- Chemical type selection for inventory management
- Equipment selection for maintenance scheduling
- Task type and priority selection
- Time slot and scheduling selections
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
    disabled: {
      description: 'Whether the select is disabled',
      table: { category: 'State' },
      control: 'boolean',
    },
    required: {
      description: 'Whether the select is required',
      table: { category: 'Validation' },
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

// Basic examples
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Select Pool *</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a pool..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pool1">Main Community Pool</SelectItem>
          <SelectItem value="pool2">Kiddie Pool</SelectItem>
          <SelectItem value="pool3">Indoor Therapy Pool</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Disabled Select</label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Not available..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="disabled">This won't show</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

// Pool maintenance specific examples
export const TechnicianSelection: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Assign Technician *</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select technician..." />
        </SelectTrigger>
        <SelectContent>
          {technicians.map((tech) => (
            <SelectItem key={tech.id} value={tech.id}>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {tech.role} • {tech.certifications.join(', ')}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Technician selection with role and certification details for task assignment.',
      },
    },
  },
}

export const PoolSelection: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Select Pool for Maintenance</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose pool..." />
        </SelectTrigger>
        <SelectContent>
          {pools.map((pool) => (
            <SelectItem key={pool.id} value={pool.id}>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <div>
                  <div className="font-medium">{pool.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {pool.location} • Capacity: {pool.capacity} • {pool.status}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pool selection with location details and capacity information.',
      },
    },
  },
}

export const ChemicalTypeSelection: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Chemical Type for Testing</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select chemical..." />
        </SelectTrigger>
        <SelectContent>
          {chemicalTypes.map((chemical) => (
            <SelectItem key={chemical.id} value={chemical.id}>
              <div className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                <div>
                  <div className="font-medium">{chemical.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {chemical.unit} • Range: {chemical.idealRange.min}-{chemical.idealRange.max}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chemical type selection with measurement units and ideal ranges.',
      },
    },
  },
}

// Async loading pattern
export const AsyncTechnicianLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)
    const [technicianList, setTechnicianList] = useState<typeof technicians>([])
    const [selectedTechnician, setSelectedTechnician] = useState<string>('')

    // Simulate async loading
    useEffect(() => {
      const loadTechnicians = async () => {
        setLoading(true)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setTechnicianList(technicians)
        setLoading(false)
      }

      loadTechnicians()
    }, [])

    return (
      <div className="w-80">
        <label className="mb-2 block text-sm font-medium">Available Technicians</label>
        <Select disabled={loading} value={selectedTechnician} onValueChange={setSelectedTechnician}>
          <SelectTrigger>
            <SelectValue
              placeholder={loading ? 'Loading technicians...' : 'Select technician...'}
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {technicianList.map((tech) => (
              <SelectItem key={tech.id} value={tech.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      tech.status === 'available'
                        ? 'bg-green-500'
                        : tech.status === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{tech.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {tech.role} • {tech.status}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedTechnician && !loading && (
          <p className="text-muted-foreground mt-2 text-sm">
            Selected: {technicianList.find((t) => t.id === selectedTechnician)?.name}
          </p>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Async technician loading with loading states and real-time availability.',
      },
    },
  },
}

// Task priority selection
export const TaskPrioritySelection: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Task Priority Level</label>
      <Select defaultValue="medium">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-400" />
              <span>Low Priority</span>
            </div>
          </SelectItem>
          <SelectItem value="medium">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Medium Priority</span>
            </div>
          </SelectItem>
          <SelectItem value="high">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span>High Priority</span>
            </div>
          </SelectItem>
          <SelectItem value="critical">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span>Critical Priority</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Task priority selection with visual indicators and default values.',
      },
    },
  },
}

// Time slot selection
export const TimeSlotSelection: Story = {
  render: () => {
    const timeSlots = [
      { value: '06:00', label: '6:00 AM', available: true },
      { value: '07:00', label: '7:00 AM', available: true },
      { value: '08:00', label: '8:00 AM', available: false },
      { value: '09:00', label: '9:00 AM', available: true },
      { value: '10:00', label: '10:00 AM', available: true },
      { value: '11:00', label: '11:00 AM', available: false },
      { value: '12:00', label: '12:00 PM', available: true },
      { value: '13:00', label: '1:00 PM', available: true },
      { value: '14:00', label: '2:00 PM', available: true },
      { value: '15:00', label: '3:00 PM', available: false },
    ]

    return (
      <div className="w-80">
        <label className="mb-2 block text-sm font-medium">Maintenance Time Slot</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select time..." />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot.value} value={slot.value} disabled={!slot.available}>
                <div className="flex w-full items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className={!slot.available ? 'text-muted-foreground' : ''}>
                    {slot.label}
                  </span>
                  {!slot.available && (
                    <span className="text-muted-foreground ml-auto text-xs">Unavailable</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Time slot selection with availability status and disabled options.',
      },
    },
  },
}

// Grouped selection example
export const GroupedTaskTypes: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">Maintenance Task Type</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select task type..." />
        </SelectTrigger>
        <SelectContent>
          {/* Chemical Tasks */}
          <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
            Chemical Tasks
          </div>
          <SelectItem value="chlorine-test">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span>Chlorine Testing</span>
            </div>
          </SelectItem>
          <SelectItem value="ph-adjustment">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span>pH Adjustment</span>
            </div>
          </SelectItem>
          <SelectItem value="shock-treatment">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span>Shock Treatment</span>
            </div>
          </SelectItem>

          {/* Physical Maintenance */}
          <div className="text-muted-foreground mt-1 border-t px-2 py-1.5 pt-2 text-xs font-semibold">
            Physical Maintenance
          </div>
          <SelectItem value="filter-cleaning">
            <span>Filter Cleaning</span>
          </SelectItem>
          <SelectItem value="skimmer-cleaning">
            <span>Skimmer Cleaning</span>
          </SelectItem>
          <SelectItem value="vacuum-cleaning">
            <span>Vacuum Cleaning</span>
          </SelectItem>

          {/* Equipment Service */}
          <div className="text-muted-foreground mt-1 border-t px-2 py-1.5 pt-2 text-xs font-semibold">
            Equipment Service
          </div>
          <SelectItem value="pump-maintenance">
            <span>Pump Maintenance</span>
          </SelectItem>
          <SelectItem value="heater-service">
            <span>Heater Service</span>
          </SelectItem>
          <SelectItem value="equipment-inspection">
            <span>Equipment Inspection</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grouped task type selection with categorized maintenance options.',
      },
    },
  },
}

// Search-like functionality with detailed descriptions
export const MaintenanceTaskSelection: Story = {
  render: () => {
    // Pre-filtered tasks for display (in real app would be searchable)
    const filteredTasks = maintenanceTasks

    return (
      <div className="w-96">
        <label className="mb-2 block text-sm font-medium">Select Similar Task Template</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Browse existing tasks..." />
          </SelectTrigger>
          <SelectContent>
            {filteredTasks.slice(0, 8).map((task) => (
              <SelectItem key={task.id} value={task.id}>
                <div className="py-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-muted-foreground mt-1 text-xs">{task.description}</div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
                    <span>Priority: {task.priority}</span>
                    <span>Duration: {task.estimatedDuration}min</span>
                    <span>Type: {task.type}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Maintenance task template selection with detailed descriptions and metadata.',
      },
    },
  },
}

// Multiple selections (compound component pattern)
export const ChemicalReadingForm: Story = {
  render: () => {
    const [selectedPool, setSelectedPool] = useState('')
    const [selectedTechnician, setSelectedTechnician] = useState('')
    const [selectedChemical, setSelectedChemical] = useState('')

    return (
      <div className="bg-background w-96 space-y-4 rounded-lg border p-4">
        <h3 className="text-lg font-semibold">New Chemical Reading</h3>

        <div>
          <label className="mb-2 block text-sm font-medium">Pool Location *</label>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger>
              <SelectValue placeholder="Select pool..." />
            </SelectTrigger>
            <SelectContent>
              {pools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{pool.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Technician *</label>
          <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
            <SelectTrigger>
              <SelectValue placeholder="Select technician..." />
            </SelectTrigger>
            <SelectContent>
              {technicians
                .filter((t) => t.status === 'available')
                .map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>{tech.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Primary Chemical Test *</label>
          <Select value={selectedChemical} onValueChange={setSelectedChemical}>
            <SelectTrigger>
              <SelectValue placeholder="Select chemical..." />
            </SelectTrigger>
            <SelectContent>
              {chemicalTypes.map((chemical) => (
                <SelectItem key={chemical.id} value={chemical.id}>
                  <div className="flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    <div>
                      <div>{chemical.name}</div>
                      <div className="text-muted-foreground text-xs">
                        Range: {chemical.idealRange.min}-{chemical.idealRange.max} {chemical.unit}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPool && selectedTechnician && selectedChemical && (
          <div className="bg-muted rounded-md p-3 text-sm">
            <div className="mb-1 font-medium">Ready to Create Reading</div>
            <div className="text-muted-foreground">
              Pool: {pools.find((p) => p.id === selectedPool)?.name}
              <br />
              Technician: {technicians.find((t) => t.id === selectedTechnician)?.name}
              <br />
              Chemical: {chemicalTypes.find((c) => c.id === selectedChemical)?.name}
            </div>
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete form with multiple select components working together for chemical reading entry.',
      },
    },
  },
}

// Error states and validation
export const SelectWithValidation: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleValueChange = (value: string) => {
      setSelectedValue(value)
      // Validate selection
      if (value === 'unavailable-tech') {
        setError('This technician is currently unavailable')
      } else {
        setError('')
      }
    }

    return (
      <div className="w-80">
        <label className="mb-2 block text-sm font-medium">Emergency Response Technician *</label>
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select emergency technician..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech-001">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>John Smith - Senior Technician</span>
              </div>
            </SelectItem>
            <SelectItem value="tech-002">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Sarah Johnson - Pool Technician</span>
              </div>
            </SelectItem>
            <SelectItem value="unavailable-tech">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>Mike Wilson - Not Available</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
        <p className="text-muted-foreground mt-1 text-sm">
          Only available technicians can be assigned to emergency tasks
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Select with validation and error states for emergency technician assignment.',
      },
    },
  },
}
