import type { Meta, StoryObj } from '@storybook/react'
import { ColorDistributionDemo } from './color-distribution-demo'

const meta = {
  title: 'Pool Management/60-30-10 Color Distribution',
  component: ColorDistributionDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 60-30-10 Color Distribution System

This component demonstrates the research-backed 60-30-10 color distribution rule applied to our outdoor community pool theme.

## Distribution Breakdown

### 60% Robin Egg Blue Family (Dominant)
- **Usage**: Page backgrounds, content areas, card backgrounds
- **Psychology**: Trust, cleanliness, water association (perfect for pool credibility)
- **Colors**: #F8FDFF (lighter), #E3FAFF (light), #0AD1E0 (primary)
- **Purpose**: Creates calm, trustworthy foundation for the entire interface

### 30% Grass Green Family (Secondary/Structural)
- **Usage**: Navigation, headers, structural elements, section organization
- **Psychology**: Nature, freshness, growth (outdoor recreation connection)
- **Colors**: #C8E6C9 (lighter), #81C784 (light), #4CAF50 (primary)
- **Purpose**: Provides natural structure and organizational hierarchy

### 10% Yellow/Coral Accents (Split 7%/3%)
- **7% Sunshine Yellow**: Primary CTAs, important highlights, attention-grabbing elements
- **3% Coral**: Secondary CTAs, hover states, friendly interactive elements
- **Psychology**: Energy + approachability (community engagement + welcoming atmosphere)
- **Colors**: #FFD962 (yellow), #FF7F50 (coral)
- **Purpose**: Drives action and creates warm, engaging interaction points

## Visual Hierarchy Strategy

1. **Primary Attention**: Sunshine yellow buttons immediately draw the eye to main actions
2. **Secondary Focus**: Grass green navigation and structure create clear information architecture
3. **Content Flow**: Robin egg blue backgrounds provide readable, calm content areas
4. **Interactive Warmth**: Coral accents add friendliness to secondary interactions

## Accessibility Features

- All color combinations meet WCAG AA standards (4.5:1 contrast ratio minimum)
- Deep indigo text (#1A237E) provides excellent outdoor readability
- Color-blind friendly due to temperature and brightness differences
- High contrast mode support with enhanced color variants

## Implementation Benefits

- **Professional Credibility**: Blue dominance creates trust and reliability
- **Natural Connection**: Green elements reinforce outdoor recreation theme  
- **Energetic Engagement**: Strategic yellow placement drives user action
- **Welcoming Atmosphere**: Coral touches add approachable, community feel
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorDistributionDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const DarkMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'The 60-30-10 distribution in dark mode for evening pool operations. Notice how the proportions remain consistent while colors adapt for low-light visibility.',
      },
    },
  },
}

export const HighContrast: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="high-contrast">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'High contrast mode showing how the 60-30-10 distribution maintains visual hierarchy even with enhanced contrast for outdoor visibility.',
      },
    },
  },
}
