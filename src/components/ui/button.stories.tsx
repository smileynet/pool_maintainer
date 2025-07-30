import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import {
  Droplet,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  Trash2,
  FileText,
  Download,
  ArrowRight,
} from 'lucide-react'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Button component is a core UI element used throughout the pool maintenance system. 
It supports multiple variants, sizes, and can be rendered as different HTML elements using the asChild prop.

## Features
- Multiple visual variants for different contexts
- Size variations for different UI densities
- Full keyboard navigation support
- ARIA-compliant for accessibility
- Supports icons and text
- Can be rendered as any element with asChild prop
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Basic button examples
export const Default: Story = {
  args: {
    children: 'Add Pool',
    variant: 'default',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="h-4 w-4" />
        Add Maintenance Task
      </>
    ),
    variant: 'default',
  },
}

// Variant examples
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">
        <CheckCircle className="h-4 w-4" />
        Complete Check
      </Button>
      <Button variant="secondary">
        <Calendar className="h-4 w-4" />
        Schedule Task
      </Button>
      <Button variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        Emergency Stop
      </Button>
      <Button variant="outline">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
      <Button variant="ghost">
        <FileText className="h-4 w-4" />
        View Report
      </Button>
      <Button variant="link">
        View Documentation
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  ),
}

// Size examples
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  ),
}

// Pool maintenance specific examples
export const PoolMaintenanceActions: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Chemical Management</h3>
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            <Droplet className="h-4 w-4" />
            Add Chemical
          </Button>
          <Button variant="outline" size="sm">
            Test Water
          </Button>
          <Button variant="secondary" size="sm">
            View History
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Maintenance Tasks</h3>
        <div className="flex gap-2">
          <Button variant="default">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Reporting</h3>
        <div className="flex gap-2">
          <Button variant="secondary">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  ),
}

// State examples
export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button aria-invalid="true">Error State</Button>
    </div>
  ),
}

// Loading state example
export const Loading: Story = {
  render: () => {
    const LoadingSpinner = () => (
      <svg
        className="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    return (
      <div className="flex gap-4">
        <Button disabled>
          <LoadingSpinner />
          Saving...
        </Button>
        <Button variant="secondary" disabled>
          <LoadingSpinner />
          Processing...
        </Button>
      </div>
    )
  },
}

// Button group example
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex">
      <Button variant="outline" className="rounded-r-none">
        Previous
      </Button>
      <Button variant="outline" className="rounded-none border-x-0">
        Current
      </Button>
      <Button variant="outline" className="rounded-l-none">
        Next
      </Button>
    </div>
  ),
}

// Responsive example
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        These buttons adapt their size and layout based on screen size
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="w-full sm:w-auto">
          <CheckCircle className="h-4 w-4" />
          Complete Maintenance
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Calendar className="h-4 w-4" />
          Schedule Next
        </Button>
      </div>
    </div>
  ),
}

// AsChild example
export const AsChild: Story = {
  render: () => (
    <div className="space-y-4">
      <Button asChild>
        <a href="#" onClick={(e) => e.preventDefault()}>
          Link Button
        </a>
      </Button>
      <Button asChild variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer">
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            onChange={(e) => console.log('File selected:', e.target.files)}
          />
          Upload Chemical Report
        </label>
      </Button>
    </div>
  ),
}
