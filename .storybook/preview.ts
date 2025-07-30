import type { Preview } from '@storybook/react-vite'
import { withTheme, withA11y } from '../src/utils/storybook-decorators'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    // Story sorting configuration
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Design System',
          ['Colors', 'Typography', 'Spacing'],
          'Components',
          ['Atoms', 'Molecules', 'Organisms'],
          'Patterns',
          ['Forms', 'Data Display', 'Navigation'],
          'Pages',
          '*',
        ],
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: undefined, // Can be customized with pool maintenance theme later
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'pool',
          value: '#e6f4f1', // Light turquoise for pool maintenance theme
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
    },
    // Accessibility addon configuration
    a11y: {
      // Configure axe-core rules
      config: {
        rules: [
          {
            // Ensure all interactive elements are keyboard accessible
            id: 'keyboard-accessible',
            enabled: true,
          },
          {
            // Check for proper ARIA labels
            id: 'aria-label',
            enabled: true,
          },
          {
            // Ensure sufficient color contrast (WCAG 2.1 AA)
            id: 'color-contrast',
            enabled: true,
          },
          {
            // Pool maintenance specific: ensure emergency controls are prominent
            id: 'landmark-one-main',
            enabled: true,
          },
        ],
      },
      // Customize the addon panel
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        showName: true,
      },
    },
  },
  decorators: [withTheme, withA11y],
}

export default preview
