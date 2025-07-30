import type { Meta, StoryObj } from '@storybook/react'
import { ChemicalTestForm } from './chemical-test-form'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof ChemicalTestForm> = {
  title: 'Pool Management/Chemical Test Form',
  component: ChemicalTestForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `# Chemical Test Form Component

A comprehensive form for recording pool chemical readings with MAHC compliance validation.

## Features
- **MAHC Compliance**: Automatic validation against Model Aquatic Health Code standards
- **Real-time Feedback**: Visual indicators for chemical levels (good/warning/critical)
- **Responsive Design**: Works on desktop and mobile devices
- **Validation**: Required field checking and data validation
- **Critical Alerts**: Automatic flagging for out-of-range readings

## MAHC Standards Implemented
- **Free Chlorine**: 1.0-3.0 ppm (Ideal: 1.5-2.5 ppm)
- **Total Chlorine**: 1.0-4.0 ppm (Ideal: 1.5-3.0 ppm)  
- **pH Level**: 7.2-7.6 (Ideal: 7.3-7.5)
- **Total Alkalinity**: 80-120 ppm (Ideal: 90-110 ppm)
- **Cyanuric Acid**: 30-50 ppm (Ideal: 35-45 ppm)
- **Calcium Hardness**: 200-400 ppm (Ideal: 250-350 ppm)
- **Water Temperature**: 78-84°F (Ideal: 80-82°F)

## Usage
\`\`\`tsx
<ChemicalTestForm
  onSubmit={(test) => console.log('Test submitted:', test)}
  onCancel={() => console.log('Form cancelled')}
/>
\`\`\`
        `,
      },
    },
  },
  args: {
    onSubmit: action('test-submitted'),
    onCancel: action('form-cancelled'),
  },
  argTypes: {
    initialData: {
      description: 'Pre-populate form with existing test data',
      control: 'object',
    },
    onSubmit: {
      description: 'Callback when test is submitted',
      action: 'submitted',
    },
    onCancel: {
      description: 'Callback when form is cancelled',
      action: 'cancelled',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story - Empty form
export const Default: Story = {
  name: 'New Chemical Test',
  parameters: {
    docs: {
      description: {
        story:
          'Default empty form for creating a new chemical test. All validation is performed in real-time as values are entered.',
      },
    },
  },
}

// Pre-filled form with good readings
export const WithGoodReadings: Story = {
  name: 'Good Chemical Levels',
  args: {
    initialData: {
      poolId: 'POOL-001',
      technician: 'John Smith',
      readings: {
        freeChlorine: 2.0,
        totalChlorine: 2.2,
        ph: 7.4,
        alkalinity: 100,
        cyanuricAcid: 40,
        calcium: 300,
        temperature: 81,
      },
      notes: 'All levels within ideal range. Pool operating normally.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Form pre-filled with chemical readings that are all within ideal MAHC ranges. Notice the green validation indicators.',
      },
    },
  },
}

// Form with warning levels
export const WithWarningLevels: Story = {
  name: 'Warning Chemical Levels',
  args: {
    initialData: {
      poolId: 'POOL-002',
      technician: 'Sarah Johnson',
      readings: {
        freeChlorine: 1.2, // Low but acceptable
        totalChlorine: 1.3,
        ph: 7.7, // High but acceptable
        alkalinity: 75, // Low but acceptable
        cyanuricAcid: 28, // Low but acceptable
        calcium: 180, // Low but acceptable
        temperature: 85, // High but acceptable
      },
      notes: 'Several readings outside ideal range but within MAHC compliance. Monitor closely.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Form with chemical levels that are outside ideal ranges but still within MAHC compliance limits. Orange validation indicators show warnings.',
      },
    },
  },
}

// Form with critical levels
export const WithCriticalLevels: Story = {
  name: 'Critical Chemical Levels',
  args: {
    initialData: {
      poolId: 'POOL-004',
      technician: 'Emily Wilson',
      readings: {
        freeChlorine: 0.5, // Critical - too low
        totalChlorine: 0.8, // Critical - too low
        ph: 6.8, // Critical - too low
        alkalinity: 60, // Critical - too low
        cyanuricAcid: 55, // Critical - too high
        calcium: 450, // Critical - too high
        temperature: 77, // Critical - too low
      },
      notes:
        'EMERGENCY: Multiple critical readings detected. Pool should be closed immediately until chemical balance is restored.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Form with multiple critical chemical levels that are outside MAHC compliance. Red validation indicators and critical alert banner are shown. This test would be automatically flagged.',
      },
    },
  },
}

// Mobile viewport story
export const MobileView: Story = {
  name: 'Mobile Interface',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Chemical test form optimized for mobile devices. Form layout adapts to smaller screens with single-column layout.',
      },
    },
  },
  args: {
    initialData: {
      poolId: 'POOL-003',
      technician: 'Mike Davis',
      readings: {
        freeChlorine: 2.1,
        totalChlorine: 2.3,
        ph: 7.3,
        alkalinity: 95,
        cyanuricAcid: 42,
        calcium: 275,
        temperature: 80,
      },
    },
  },
}

// Editing existing test
export const EditingExistingTest: Story = {
  name: 'Edit Existing Test',
  args: {
    initialData: {
      id: 'TEST-123456789',
      poolId: 'POOL-001',
      technician: 'Alex Chen',
      readings: {
        freeChlorine: 1.8,
        totalChlorine: 2.0,
        ph: 7.5,
        alkalinity: 110,
        cyanuricAcid: 38,
        calcium: 320,
        temperature: 82,
      },
      notes: 'Previous test from morning shift. Need to recheck chlorine levels.',
      status: 'draft' as const,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Form pre-populated with existing test data for editing. Useful for correcting or updating previously submitted tests.',
      },
    },
  },
}

// Form validation states
export const ValidationDemo: Story = {
  name: 'Validation States Demo',
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Chemical Level Validation Examples</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Good levels */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-600">✅ Good Levels</h4>
            <ChemicalTestForm
              initialData={{
                poolId: 'POOL-001',
                technician: 'John Smith',
                readings: {
                  freeChlorine: 2.0,
                  totalChlorine: 2.2,
                  ph: 7.4,
                  alkalinity: 100,
                  cyanuricAcid: 40,
                  calcium: 300,
                  temperature: 81,
                },
              }}
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </div>

          {/* Warning levels */}
          <div className="space-y-4">
            <h4 className="font-medium text-orange-600">⚡ Warning Levels</h4>
            <ChemicalTestForm
              initialData={{
                poolId: 'POOL-002',
                technician: 'Sarah Johnson',
                readings: {
                  freeChlorine: 1.2,
                  totalChlorine: 1.3,
                  ph: 7.7,
                  alkalinity: 75,
                  cyanuricAcid: 28,
                  calcium: 180,
                  temperature: 85,
                },
              }}
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </div>

          {/* Critical levels */}
          <div className="space-y-4">
            <h4 className="font-medium text-red-600">⚠️ Critical Levels</h4>
            <ChemicalTestForm
              initialData={{
                poolId: 'POOL-004',
                technician: 'Emily Wilson',
                readings: {
                  freeChlorine: 0.5,
                  totalChlorine: 0.8,
                  ph: 6.8,
                  alkalinity: 60,
                  cyanuricAcid: 55,
                  calcium: 450,
                  temperature: 77,
                },
              }}
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Side-by-side comparison of different validation states: good (green), warning (orange), and critical (red) chemical levels.',
      },
    },
  },
}
