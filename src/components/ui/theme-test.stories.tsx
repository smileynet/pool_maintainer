import type { Meta, StoryObj } from '@storybook/react'
import { ThemeTest } from './theme-test'

const meta = {
  title: 'Pool Management/Theme Test',
  component: ThemeTest,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Community Pool Theme Test

This component demonstrates the new outdoor community pool color palette applied to the application.

## Color Palette Features

- **Pool Water Blues**: Robin egg blue (#0AD1E0) for primary actions and water-themed elements
- **Sunshine Yellows**: Warm yellow (#FFD962) for secondary actions and summer atmosphere
- **Grass Greens**: Fresh green (#4CAF50) for success states and community feel
- **Coral Accents**: Coral (#FF7F50) for critical states and summer fun accents

## Design Principles

- **Outdoor Visibility**: Deep indigo text (#1A237E) for maximum contrast in bright sunlight
- **Community Atmosphere**: Warm, inviting colors that evoke neighborhood pool feelings
- **Safety First**: Clear differentiation between safe, caution, critical, and emergency states
- **Light Mode Default**: Optimized for outdoor daytime use with optional dark mode for evening
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeTest>

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
        story: 'The theme in dark mode for evening pool operations. Notice how the pool identity is maintained with deeper blues and warmer yellows.',
      },
    },
  },
}

export const HighContrast: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ '--color-text': 'var(--color-hc-text)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'High contrast mode for maximum outdoor visibility. Uses the darkest shades of each color for optimal readability.',
      },
    },
  },
}