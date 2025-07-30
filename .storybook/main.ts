import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  viteFinal: async (config) => {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src'),
          '@components': resolve(__dirname, '../src/components'),
          '@lib': resolve(__dirname, '../src/lib'),
          '@types': resolve(__dirname, '../src/types'),
          '@utils': resolve(__dirname, '../src/utils'),
          '@hooks': resolve(__dirname, '../src/hooks'),
          '@mocks': resolve(__dirname, '../src/mocks'),
        },
      },
    })
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
}

export default config
