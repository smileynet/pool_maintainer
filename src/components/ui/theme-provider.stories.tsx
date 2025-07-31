import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider, useTheme, useChemicalStatusColors } from './theme-provider'
import { Card, CardContent, CardHeader } from './card'
import { TestTube, Droplet, AlertTriangle, CheckCircle, Play, Settings } from 'lucide-react'

const meta = {
  title: 'Pool Management/Theme System',
  component: ThemeProvider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Comprehensive Theming System for Pool Maintenance

The ThemeProvider component provides a comprehensive theming system specifically designed for pool maintenance applications with safety-critical features.

## Key Features

- **Safety-Critical Color System**: Specialized color palettes for chemical status (safe, caution, critical, emergency)
- **High Contrast Mode**: Enhanced visibility for outdoor pool environments
- **Dark Mode Support**: System preference detection with manual override
- **Accessibility Features**: Dyslexic font support, font scaling, reduced motion
- **Chemical Status Helpers**: Utility hooks for consistent chemical level styling
- **Design Token System**: CSS custom properties for consistent theming

## Safety-First Design

This theming system prioritizes safety over aesthetics:
- Color-coded chemical status indicators
- High contrast emergency states
- Outdoor visibility optimizations
- Print-friendly compliance reporting styles

## Usage Patterns

Perfect for:
- Pool chemical monitoring interfaces
- Equipment status dashboards
- Emergency response systems
- Compliance reporting tools
- Outdoor maintenance applications
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

// Demo component to showcase theming features
const ThemeDemo = () => {
  const { config, updateTheme, isDarkMode, isHighContrast, isReducedMotion } = useTheme()
  const { getChemicalStatusClasses } = useChemicalStatusColors()

  const chemicalStatuses = [
    { status: 'compliant' as const, label: 'Safe Levels', value: '2.1 ppm', chemical: 'Free Chlorine' },
    { status: 'warning' as const, label: 'Monitor Closely', value: '7.8', chemical: 'pH Level' },
    { status: 'critical' as const, label: 'Immediate Action', value: '0.8 ppm', chemical: 'Free Chlorine' },
    { status: 'emergency' as const, label: 'Pool Closure', value: '0.2 ppm', chemical: 'Free Chlorine' },
  ]

  const equipmentStatuses = [
    { status: 'running', label: 'Pool Pump', icon: Play },
    { status: 'maintenance', label: 'Filter System', icon: Settings },
    { status: 'stopped', label: 'Heater', icon: AlertTriangle },
    { status: 'error', label: 'Chemical Feeder', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Theme Controls */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Theme Controls</h3>
          <p className="text-sm text-gray-600">
            Adjust theming options to see real-time changes
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Color Mode</label>
              <select
                value={config.mode}
                onChange={(e) => updateTheme({ mode: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contrast</label>
              <select
                value={config.contrast}
                onChange={(e) => updateTheme({ contrast: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="system">System</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Motion</label>
              <select
                value={config.motion}
                onChange={(e) => updateTheme({ motion: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="system">System</option>
                <option value="normal">Normal</option>
                <option value="reduced">Reduced</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Scale: {config.fontScale}x
              </label>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={config.fontScale}
                onChange={(e) => updateTheme({ fontScale: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.dyslexicFont}
                  onChange={(e) => updateTheme({ dyslexicFont: e.target.checked })}
                />
                <span className="text-sm font-medium">Dyslexic Font</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm space-y-1">
              <div><strong>Current State:</strong></div>
              <div>Mode: {isDarkMode ? 'Dark' : 'Light'}</div>
              <div>High Contrast: {isHighContrast ? 'Yes' : 'No'}</div>
              <div>Reduced Motion: {isReducedMotion ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chemical Status Examples */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-500" />
            Chemical Status Indicators
          </h3>
          <p className="text-sm text-gray-600">
            Safety-critical color coding for chemical levels
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chemicalStatuses.map((item, index) => (
              <div
                key={index}
                className={`chemical-reading ${getChemicalStatusClasses(item.status)}`}
              >
                <div>
                  <div className="chemical-reading-label">{item.chemical}</div>
                  <div className="chemical-reading-value">
                    {item.value}
                  </div>
                </div>
                <div className={`chemical-reading-status ${getChemicalStatusClasses(item.status)}`}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Status Examples */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Equipment Status Indicators
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentStatuses.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`status-dot status-dot-${item.status}`}></div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className={`equipment-status equipment-status-${item.status}`}>
                        <Icon className="h-3 w-3" />
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Emergency Actions
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="safety-alert safety-alert-emergency">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Emergency Pool Closure Required</h4>
                  <p className="text-sm mt-1">
                    Free chlorine levels have dropped below safe limits. Immediate action required.
                  </p>
                  <div className="mt-3">
                    <button className="emergency-button">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Close Pool
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="safety-alert safety-alert-warning">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Chemical Levels Need Attention</h4>
                  <p className="text-sm mt-1">
                    pH levels are slightly elevated. Monitor closely and adjust as needed.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="safety-alert safety-alert-success">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold">All Systems Operating Normally</h4>
                  <p className="text-sm mt-1">
                    Chemical levels are within optimal ranges. Continue regular monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pool Status Cards */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Pool Status Overview
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="pool-status-card pool-status-card-safe">
              <h4 className="font-semibold text-green-800">Main Community Pool</h4>
              <p className="text-sm text-green-700 mt-1">All chemical levels optimal</p>
              <div className="mt-3 text-xs text-green-600">
                Last tested: 30 minutes ago
              </div>
            </div>
            
            <div className="pool-status-card pool-status-card-caution">
              <h4 className="font-semibold text-amber-800">Kiddie Pool</h4>
              <p className="text-sm text-amber-700 mt-1">pH slightly elevated - monitoring</p>
              <div className="mt-3 text-xs text-amber-600">
                Last tested: 15 minutes ago
              </div>
            </div>
            
            <div className="pool-status-card pool-status-card-critical">
              <h4 className="font-semibold text-red-800">Therapy Pool</h4>
              <p className="text-sm text-red-700 mt-1">Low chlorine - immediate attention needed</p>
              <div className="mt-3 text-xs text-red-600">
                Last tested: 5 minutes ago
              </div>
            </div>
            
            <div className="pool-status-card pool-status-card-emergency">
              <h4 className="font-semibold text-red-900">Lap Pool</h4>
              <p className="text-sm text-red-800 mt-1 font-semibold">CLOSED - Chemical emergency</p>
              <div className="mt-3 text-xs text-red-700">
                Requires immediate supervisor attention
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Wrapper component for stories
const ThemeStoryWrapper = ({ children, ...themeProps }: any) => (
  <ThemeProvider {...themeProps}>
    {children}
  </ThemeProvider>
)

export const Default: Story = {
  render: () => (
    <ThemeStoryWrapper>
      <ThemeDemo />
    </ThemeStoryWrapper>
  ),
}

export const LightMode: Story = {
  render: () => (
    <ThemeStoryWrapper defaultConfig={{ mode: 'light' }}>
      <ThemeDemo />
    </ThemeStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Light mode theme with standard contrast and color palette optimized for indoor use.',
      },
    },
  },
}

export const DarkMode: Story = {
  render: () => (
    <ThemeStoryWrapper defaultConfig={{ mode: 'dark' }}>
      <ThemeDemo />
    </ThemeStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dark mode theme with enhanced safety colors for better visibility in low-light conditions.',
      },
    },
  },
}

export const HighContrast: Story = {
  render: () => (
    <ThemeStoryWrapper defaultConfig={{ contrast: 'high' }}>
      <ThemeDemo />
    </ThemeStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'High contrast mode designed for outdoor visibility and accessibility compliance.',
      },
    },
  },
}

export const AccessibilityMode: Story = {
  render: () => (
    <ThemeStoryWrapper 
      defaultConfig={{ 
        contrast: 'high',
        motion: 'reduced',
        fontScale: 1.2,
        dyslexicFont: true
      }}
    >
      <ThemeDemo />
    </ThemeStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full accessibility mode with high contrast, reduced motion, larger fonts, and dyslexic-friendly typography.',
      },
    },
  },
}

export const EmergencyMode: Story = {
  render: () => (
    <ThemeStoryWrapper defaultConfig={{ contrast: 'high' }}>
      <div className="p-6 space-y-4">
        <div className="safety-alert safety-alert-emergency">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg">CRITICAL POOL SAFETY ALERT</h3>
              <p className="mt-2">
                Multiple pools have chemical levels requiring immediate attention. 
                Emergency protocols have been activated.
              </p>
              <div className="mt-4 space-y-2">
                <button className="emergency-button emergency-button-large">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Activate Emergency Response
                </button>
                <div className="text-sm font-medium">
                  Contact supervisor immediately: (555) 123-4567
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="pool-status-card pool-status-card-emergency">
            <h4 className="font-bold text-red-900">Pool A - EMERGENCY</h4>
            <p className="text-red-800 font-semibold">Free Chlorine: 0.1 ppm (Critical)</p>
            <p className="text-red-800 font-semibold">Status: CLOSED</p>
          </div>
          
          <div className="pool-status-card pool-status-card-critical">
            <h4 className="font-bold text-red-800">Pool B - CRITICAL</h4>
            <p className="text-red-700">pH: 8.5 (High)</p>
            <p className="text-red-700">Status: Restricted Access</p>
          </div>
        </div>
      </div>
    </ThemeStoryWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Emergency response interface with maximum visibility alerts and critical action buttons.',
      },
    },
  },
}