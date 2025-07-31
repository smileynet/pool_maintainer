import type { Meta, StoryObj } from '@storybook/react'
import { ChemicalHistoryTimeline } from './chemical-history-timeline'
import { action } from '@storybook/addon-actions'

const meta = {
  title: 'Pool Management/Chemical History Timeline',
  component: ChemicalHistoryTimeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Chemical History Timeline component for tracking chemical trends over time with MAHC compliance monitoring.

## Features

- **Interactive Timeline**: View chemical readings chronologically with visual status indicators
- **Chemical Selection**: Focus on specific chemical parameters (Free Chlorine, pH, Alkalinity, etc.)
- **Time Range Filtering**: Filter data by 24 hours, 7 days, 30 days, or 90 days
- **Trend Analysis**: Automatic trend detection with directional indicators
- **MAHC Compliance**: Visual compliance status with acceptable ranges
- **Detailed View**: Expandable reading details with all chemical parameters
- **Export Functionality**: CSV export for compliance reporting
- **Pool Selection**: Multi-pool support with individual tracking

## Safety Features

- Color-coded status indicators (Green: Compliant, Yellow: Warning, Red: Critical/Emergency)
- MAHC range overlays showing acceptable and ideal ranges
- Trend arrows showing chemical level changes over time
- Emergency status highlighting for immediate attention
- Compliance recommendations for corrective actions

## Usage

Perfect for:
- Daily chemical monitoring review
- Trend analysis for preventive maintenance
- Compliance reporting and audits
- Technician performance tracking
- Historical data analysis for pattern recognition
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialPoolId: {
      control: 'select',
      options: ['POOL-001', 'POOL-002', 'POOL-003', 'POOL-004'],
      description: 'Initial pool selection',
    },
    initialChemical: {
      control: 'select',
      options: ['freeChlorine', 'totalChlorine', 'ph', 'alkalinity', 'cyanuricAcid', 'calcium', 'temperature'],
      description: 'Initial chemical parameter to display',
    },
    onExport: {
      action: 'exported',
      description: 'Callback function when export is triggered',
    },
  },
} satisfies Meta<typeof ChemicalHistoryTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    initialPoolId: 'POOL-001',
    initialChemical: 'freeChlorine',
    onExport: action('exported'),
  },
}

export const PHMonitoring: Story = {
  args: {
    initialPoolId: 'POOL-001',
    initialChemical: 'ph',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Timeline focused on pH level monitoring, crucial for chlorine effectiveness and swimmer comfort.',
      },
    },
  },
}

export const AlkalinityTracking: Story = {
  args: {
    initialPoolId: 'POOL-001',
    initialChemical: 'alkalinity',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Monitor total alkalinity levels for pH stability and water balance.',
      },
    },
  },
}

export const TemperatureMonitoring: Story = {
  args: {
    initialPoolId: 'POOL-001',
    initialChemical: 'temperature',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Track water temperature for comfort and chemical effectiveness.',
      },
    },
  },
}

export const KiddiePool: Story = {
  args: {
    initialPoolId: 'POOL-002',
    initialChemical: 'freeChlorine',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Chemical history for the kiddie pool, which may have different maintenance patterns due to higher bather load.',
      },
    },
  },
}

export const TherapyPool: Story = {
  args: {
    initialPoolId: 'POOL-003',
    initialChemical: 'temperature',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Therapy pool monitoring with focus on temperature, which is typically maintained at higher levels for therapeutic benefits.',
      },
    },
  },
}

export const LapPool: Story = {
  args: {
    initialPoolId: 'POOL-004',
    initialChemical: 'freeChlorine',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Lap pool chemical monitoring, typically requiring consistent chemical levels for athletic use.',
      },
    },
  },
}

// Interactive playground story
export const Interactive: Story = {
  args: {
    initialPoolId: 'POOL-001',
    initialChemical: 'freeChlorine',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: `
Interactive timeline with full controls available. Use the controls below to:

- **Switch Chemicals**: Compare different parameter trends
- **Change Pools**: View data from different facilities
- **Adjust Time Range**: See how trends change over different periods
- **Export Data**: Test the CSV export functionality
- **Toggle Compliance**: Show/hide MAHC compliance information

## Real-World Usage Patterns

1. **Morning Review**: Check overnight chemical changes
2. **Trend Analysis**: Identify patterns requiring attention
3. **Compliance Reporting**: Export data for health department audits
4. **Staff Training**: Review proper chemical maintenance practices
5. **Preventive Maintenance**: Spot issues before they become critical
        `,
      },
    },
  },
}

// Story demonstrating error states
export const NoData: Story = {
  args: {
    initialPoolId: 'POOL-005', // Pool with no data
    initialChemical: 'freeChlorine',
    onExport: action('exported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no chemical readings are available for the selected time range and pool.',
      },
    },
  },
}