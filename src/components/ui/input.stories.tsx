import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'
// Removed template imports - using direct story definitions
import { chemicalReadings } from '../../test/fixtures/pool-maintenance-data'
import { Search, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const meta = {
  title: 'Components/Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Input component provides text input functionality with support for various types, validation states, and pool maintenance specific features.

## Features
- Multiple input types (text, email, password, number, search)
- Validation states with visual feedback
- Built-in accessibility with proper ARIA attributes
- Chemical measurement inputs with unit indicators
- Responsive design with mobile-friendly touch targets

## Pool Maintenance Usage
- Chemical level inputs with proper validation ranges
- Technician information forms
- Search functionality for maintenance records
- Numeric inputs for measurements and quantities
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
    type: {
      description: 'Input type',
      table: { category: 'Input' },
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: {
      description: 'Placeholder text',
      table: { category: 'Input' },
      control: 'text',
    },
    disabled: {
      description: 'Whether the input is disabled',
      table: { category: 'State' },
      control: 'boolean',
    },
    readOnly: {
      description: 'Whether the input is read-only',
      table: { category: 'State' },
      control: 'boolean',
    },
    required: {
      description: 'Whether the input is required',
      table: { category: 'Validation' },
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

// Basic examples
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Sample input text',
    placeholder: 'Enter text...',
  },
}

// Input types
export const InputTypes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Text Input</label>
        <Input type="text" placeholder="Enter pool name..." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Email Input</label>
        <Input type="email" placeholder="technician@poolmaint.com" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Password Input</label>
        <Input type="password" placeholder="Enter password..." />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Number Input</label>
        <Input type="number" placeholder="7.2" step="0.1" min="0" max="14" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Search Input</label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input type="search" placeholder="Search maintenance records..." className="pl-10" />
        </div>
      </div>
    </div>
  ),
}

// State variations
export const Focused: Story = {
  args: {
    placeholder: 'Enter text...',
    autoFocus: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Disabled input',
    placeholder: 'Enter text...',
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Read-only value',
  },
}

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field *',
  },
}

// Pool maintenance specific examples
export const ChlorineLevel: Story = {
  args: {
    type: 'number',
    placeholder: '2.0',
    step: '0.1',
    min: '0',
    max: '10',
    'aria-label': 'Free chlorine level in ppm',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input for free chlorine measurements. Technician entering daily chlorine test results.',
      },
    },
  },
}

export const PHLevel: Story = {
  args: {
    type: 'number',
    placeholder: '7.4',
    step: '0.1',
    min: '6.0',
    max: '8.5',
    'aria-label': 'pH level',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input for pH measurements. Recording pH test results for water balance.',
      },
    },
  },
}

export const Temperature: Story = {
  args: {
    type: 'number',
    placeholder: '26.5',
    step: '0.1',
    min: '0',
    max: '50',
    'aria-label': 'Water temperature in Celsius',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input for water temperature. Recording water temperature for maintenance logs.',
      },
    },
  },
}

export const TechnicianEmail: Story = {
  args: {
    type: 'email',
    placeholder: 'john.smith@poolmaint.com',
    'aria-label': 'Technician email address',
  },
  parameters: {
    docs: {
      description: {
        story: 'Email input for technician information. Adding new technician to the system.',
      },
    },
  },
}

// Enhanced chemical input with validation
export const ChemicalInputWithValidation: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const validateChlorine = (val: string) => {
      const num = parseFloat(val)
      if (isNaN(num)) {
        setError('Please enter a valid number')
      } else if (num < 0.5) {
        setError('Chlorine level too low - pool should be closed')
      } else if (num > 5.0) {
        setError('Chlorine level too high - reduce chemical dosing')
      } else if (num < 1.0 || num > 3.0) {
        setError('Chlorine level outside ideal range (1.0-3.0 ppm)')
      } else {
        setError('')
      }
    }

    return (
      <div className="w-80">
        <label className="mb-2 block text-sm font-medium">Free Chlorine Level (ppm) *</label>
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            validateChlorine(e.target.value)
          }}
          placeholder="2.0"
          step="0.1"
          min="0"
          max="10"
          className={error ? 'border-destructive' : ''}
          aria-describedby={error ? 'chlorine-error' : undefined}
        />
        {error && (
          <p id="chlorine-error" className="text-destructive mt-1 text-sm">
            {error}
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          Ideal range: 1.0-3.0 ppm | Safety range: 0.5-5.0 ppm
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Chemical input with real-time validation showing MAHC compliance ranges.',
      },
    },
  },
}

// Search functionality
export const PoolMaintenanceSearch: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<string[]>([])

    const searchItems = [
      'Pool 001 - Main Community Pool',
      'Pool 002 - Kiddie Pool',
      'Pool 003 - Indoor Therapy Pool',
      'Chlorine shock treatment',
      'Filter cleaning',
      'pH adjustment',
      'John Smith - Senior Technician',
      'Sarah Johnson - Pool Technician',
      'Emergency pool closure',
    ]

    const handleSearch = (term: string) => {
      setSearchTerm(term)
      if (term.length > 0) {
        const filtered = searchItems.filter((item) =>
          item.toLowerCase().includes(term.toLowerCase())
        )
        setResults(filtered.slice(0, 5))
      } else {
        setResults([])
      }
    }

    return (
      <div className="w-80">
        <label className="mb-2 block text-sm font-medium">Search Maintenance Records</label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search pools, tasks, or technicians..."
            className="pl-10"
          />
        </div>
        {results.length > 0 && (
          <div className="bg-background mt-2 rounded-md border shadow-sm">
            {results.map((result, index) => (
              <div
                key={index}
                className="hover:bg-muted cursor-pointer border-b px-3 py-2 last:border-b-0"
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Search input with live results for pool maintenance records.',
      },
    },
  },
}

// Interactive password input
export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="w-80">
        <label className="mb-2 block text-sm font-medium">Pool System Password</label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter secure password..."
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input with visibility toggle for secure system access.',
      },
    },
  },
}

// Realistic data example
export const ChemicalDataEntry: Story = {
  render: () => {
    const reading = chemicalReadings[0]

    return (
      <div className="bg-background w-96 rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Chemical Reading Entry</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Pool ID</label>
              <Input defaultValue={reading.poolId} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Technician</label>
              <Input defaultValue={reading.technician} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Chlorine (ppm)</label>
              <Input type="number" defaultValue={reading.chlorine} step="0.1" min="0" max="10" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">pH</label>
              <Input type="number" defaultValue={reading.ph} step="0.1" min="6.0" max="8.5" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Temp (°C)</label>
              <Input type="number" defaultValue={reading.temperature} step="0.1" min="0" max="50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Alkalinity (ppm)</label>
              <Input type="number" defaultValue={reading.alkalinity} min="0" max="300" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Cyanuric Acid (ppm)</label>
              <Input type="number" defaultValue={reading.cyanuricAcid} min="0" max="100" />
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete chemical reading entry form using realistic pool maintenance data.',
      },
    },
  },
}

// Responsive behavior
export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Input adapts to different screen sizes and touch interfaces
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Input placeholder="Mobile-first design" />
        <Input placeholder="Tablet optimization" />
        <Input placeholder="Desktop precision" />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Input component responsive behavior across different device sizes.',
      },
    },
  },
}
