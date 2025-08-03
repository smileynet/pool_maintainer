/**
 * Centralized lazy loading configuration for all application components
 * This file defines how components are split and loaded for optimal performance
 */

import { createLazyRoute, createLazyComponent, TabLazyFallback } from '@/utils/lazy-loading'

// Route-level components (heavy components that benefit from code splitting)
export const LazyPoolFacilityManager = createLazyRoute(
  () => import('@/components/ui/pool-facility-manager'),
  {
    routeName: 'Pool Facilities',
    preloadOn: 'hover',
    retry: 3
  }
)

export const LazyChemicalTestHistory = createLazyRoute(
  () => import('@/components/ui/chemical-test-history'),
  {
    routeName: 'Test History',
    preloadOn: 'hover',
    retry: 3
  }
)

export const LazyChemicalTrendChart = createLazyRoute(
  () => import('@/components/ui/lazy-chemical-trend-chart').then(m => ({ 
    default: m.LazyChemicalTrendChart 
  })),
  {
    routeName: 'Analytics',
    preloadOn: 'visible',
    retry: 2
  }
)

// Feature-specific components (can be loaded on demand)
export const LazyChemicalTestForm = createLazyComponent(
  () => import('@/components/ui/chemical-test-form'),
  {
    displayName: 'ChemicalTestForm',
    fallback: () => (
      <TabLazyFallback title="Chemical Test Form" />
    ),
    preloadOn: 'hover'
  }
)

export const LazyDesktopTable = createLazyComponent(
  () => import('@/components/ui/desktop-table').then(m => ({ 
    default: m.DesktopDataTable 
  })),
  {
    displayName: 'DesktopDataTable',
    preloadOn: 'visible'
  }
)

export const LazyVibrantThemeSelector = createLazyComponent(
  () => import('@/components/ui/vibrant-theme-selector'),
  {
    displayName: 'VibrantThemeSelector',
    delay: 100
  }
)

// Heavy UI components that are rarely used initially
export const LazyDesktopDashboard = createLazyComponent(
  () => import('@/components/ui/desktop-dashboard'),
  {
    displayName: 'DesktopDashboard',
    preloadOn: 'idle'
  }
)

export const LazyDesktopForms = createLazyComponent(
  () => import('@/components/ui/desktop-forms').then(m => ({ 
    default: m.DesktopMultiStepForm 
  })),
  {
    displayName: 'DesktopMultiStepForm',
    preloadOn: 'hover'
  }
)

// Specialized components for specific features
export const LazyOfflineIndicator = createLazyComponent(
  () => import('@/components/ui/offline-indicator'),
  {
    displayName: 'OfflineIndicator',
    delay: 50 // Quick load for this lightweight component
  }
)

export const LazyThemeToggle = createLazyComponent(
  () => import('@/components/ui/theme-toggle'),
  {
    displayName: 'ThemeToggle',
    delay: 50
  }
)

// Admin/settings components (loaded only when needed)
export const LazyPoolSettings = createLazyComponent(
  () => import('@/components/ui/pool-settings').catch(() => ({
    // Fallback component if pool-settings doesn't exist yet
    default: () => (
      <div className="p-4 text-center text-muted-foreground">
        Pool settings component not yet implemented
      </div>
    )
  })),
  {
    displayName: 'PoolSettings',
    retry: 1
  }
)

export const LazyReportsGenerator = createLazyComponent(
  () => import('@/components/ui/reports-generator').catch(() => ({
    // Fallback for not-yet-implemented component
    default: () => (
      <div className="p-4 text-center text-muted-foreground">
        Reports generator coming soon
      </div>
    )
  })),
  {
    displayName: 'ReportsGenerator',
    preloadOn: 'hover',
    retry: 1
  }
)

// Export bundle information for development
export const LAZY_COMPONENTS_INFO = {
  routes: [
    'LazyPoolFacilityManager',
    'LazyChemicalTestHistory', 
    'LazyChemicalTrendChart'
  ],
  components: [
    'LazyChemicalTestForm',
    'LazyDesktopTable',
    'LazyVibrantThemeSelector',
    'LazyDesktopDashboard',
    'LazyDesktopForms'
  ],
  optional: [
    'LazyPoolSettings',
    'LazyReportsGenerator'
  ]
} as const

// Development helper to log lazy loading info
if (import.meta.env.DEV) {
  console.log('Lazy components configured:', LAZY_COMPONENTS_INFO)
}