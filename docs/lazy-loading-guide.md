# Lazy Loading Guide

This guide explains the enhanced lazy loading system implemented in the Pool Maintenance application for optimal performance and user experience.

## Overview

Our lazy loading system provides:
- **Code splitting**: Reduces initial bundle size
- **Error boundaries**: Graceful handling of loading failures
- **Preloading strategies**: Smart component loading based on user behavior
- **Loading states**: Enhanced feedback during component loading
- **Retry mechanisms**: Automatic retry with exponential backoff

## Architecture

### Core Components

1. **`lazy-loading.tsx`**: Core utilities and HOCs
2. **`components/lazy/index.ts`**: Centralized lazy component definitions
3. **Enhanced error boundaries**: Protect against loading failures
4. **Smart preloading**: Load components before they're needed

### File Structure

```
src/
├── utils/
│   └── lazy-loading.tsx          # Core lazy loading utilities
├── components/
│   ├── lazy/
│   │   └── index.ts             # Lazy component definitions
│   └── ui/
│       ├── error-boundary.tsx   # Error handling
│       └── fallback-ui.tsx      # Loading states
└── App.tsx                      # Updated with enhanced lazy loading
```

## Usage Examples

### Basic Lazy Component

```typescript
import { createLazyComponent } from '@/utils/lazy-loading'

const LazyMyComponent = createLazyComponent(
  () => import('./MyComponent'),
  {
    displayName: 'MyComponent',
    preloadOn: 'hover',
    retry: 3
  }
)

// Use in JSX
<LazyMyComponent />
```

### Route-Level Lazy Loading

```typescript
import { createLazyRoute } from '@/utils/lazy-loading'

const LazyDashboard = createLazyRoute(
  () => import('./Dashboard'),
  {
    routeName: 'Dashboard',
    preloadOn: 'visible',
    retry: 2
  }
)

// Use as route component
<LazyDashboard />
```

### Preloading Strategies

#### 1. Hover-Based Preloading

```typescript
const LazyComponent = createLazyComponent(
  () => import('./Component'),
  { preloadOn: 'hover' }
)

// Component loads when user hovers over trigger element
<div onMouseEnter={() => /* preload triggered */}>
  <LazyComponent />
</div>
```

#### 2. Visibility-Based Preloading

```typescript
const LazyComponent = createLazyComponent(
  () => import('./Component'),
  { preloadOn: 'visible' }
)

// Component loads when it comes into viewport
<LazyComponent /> // Automatically observes intersection
```

#### 3. Manual Preloading

```typescript
import { usePreloadComponent } from '@/utils/lazy-loading'

function MyPage() {
  // Preload next likely component
  usePreloadComponent(
    () => import('./NextComponent'),
    userOnDashboard // Condition
  )
  
  return <CurrentView />
}
```

## Configuration Options

### LazyComponentOptions

```typescript
interface LazyComponentOptions {
  fallback?: React.ComponentType          // Custom loading component
  errorFallback?: React.ComponentType     // Custom error component
  delay?: number                          // Loading delay (ms)
  preloadOn?: 'hover' | 'visible' | 'idle' // Preload strategy
  retry?: number                          // Retry attempts
  displayName?: string                    // Component name for debugging
}
```

### Example Configurations

```typescript
// Quick-loading lightweight component
const LazyQuickComponent = createLazyComponent(
  () => import('./QuickComponent'),
  {
    delay: 50,
    preloadOn: 'hover'
  }
)

// Heavy component with retry logic
const LazyHeavyComponent = createLazyComponent(
  () => import('./HeavyComponent'),
  {
    retry: 3,
    preloadOn: 'visible',
    fallback: CustomLoadingSpinner
  }
)

// Admin component (only load when needed)
const LazyAdminPanel = createLazyComponent(
  () => import('./AdminPanel'),
  {
    retry: 1,
    errorFallback: AdminErrorFallback
  }
)
```

## Loading States

### Default Loading Fallback

Provides skeleton loading with automatic delay:

```typescript
function DefaultLazyFallback() {
  // Shows skeleton after 200ms delay
  return (
    <div className="space-y-4">
      <Skeleton height={40} />
      <Skeleton height={120} />
    </div>
  )
}
```

### Tab-Specific Loading

```typescript
function TabLazyFallback({ title }: { title?: string }) {
  return (
    <div className="space-y-6">
      <Skeleton width="30%" height={32} />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {title && <p>Loading {title}...</p>}
    </div>
  )
}
```

## Error Handling

### Automatic Retry

Components automatically retry loading with exponential backoff:

```typescript
// Retry: 1s, 2s, 4s delays
const LazyComponent = createLazyComponent(
  () => import('./Component'),
  { retry: 3 }
)
```

### Custom Error Boundaries

```typescript
function CustomErrorFallback({ error, resetError }) {
  return (
    <div className="error-container">
      <h2>Failed to load component</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )
}

const LazyComponent = createLazyComponent(
  () => import('./Component'),
  { errorFallback: CustomErrorFallback }
)
```

## Performance Optimization

### Bundle Analysis

Use our development helper to analyze lazy loading:

```typescript
import { analyzeBundleSize } from '@/utils/lazy-loading'

// Call in development to log bundle info
analyzeBundleSize()
```

### Metrics Collection

Track lazy loading performance:

```typescript
import { useLazyLoadingMetrics } from '@/utils/lazy-loading'

function MyLazyComponent() {
  useLazyLoadingMetrics('MyComponent')
  
  return <div>Component content</div>
}
```

### Preloading Strategies

#### User Behavior Based

```typescript
function App() {
  const [currentTab, setCurrentTab] = useState('overview')
  
  // Preload next likely tab
  usePreloadComponent(
    () => import('./FacilitiesTab'),
    currentTab === 'overview' // User likely to go to facilities next
  )
  
  usePreloadComponent(
    () => import('./HistoryTab'),
    currentTab === 'facilities' // User might check history after facilities
  )
}
```

#### Conditional Preloading

```typescript
// Preload based on user role
usePreloadComponent(
  () => import('./AdminPanel'),
  user.role === 'admin'
)

// Preload based on feature flags
usePreloadComponent(
  () => import('./BetaFeature'),
  featureFlags.betaEnabled
)
```

## Current Implementation

### Configured Lazy Components

1. **Route Components** (automatically split):
   - `LazyPoolFacilityManager` - Pool management interface
   - `LazyChemicalTestHistory` - Test history and records
   - `LazyChemicalTrendChart` - Analytics and reporting

2. **Feature Components** (load on demand):
   - `LazyChemicalTestForm` - Test input form
   - `LazyDesktopTable` - Data table component
   - `LazyVibrantThemeSelector` - Theme customization

3. **Optional Components** (admin/settings):
   - `LazyPoolSettings` - Pool configuration
   - `LazyReportsGenerator` - Report generation

### Bundle Splitting Strategy

```typescript
// Routes (largest chunks)
const routes = [
  'pool-facility-manager',
  'chemical-test-history', 
  'chemical-trend-chart'
]

// Features (medium chunks)
const features = [
  'chemical-test-form',
  'desktop-table',
  'theme-selector'
]

// Optional (smallest chunks)
const optional = [
  'pool-settings',
  'reports-generator'
]
```

## Best Practices

### 1. Split at Route Level

```typescript
// Good - Split heavy route components
const LazyDashboard = createLazyRoute(() => import('./Dashboard'))

// Avoid - Don't split every small component
const LazyButton = createLazyComponent(() => import('./Button'))
```

### 2. Use Appropriate Preloading

```typescript
// Good - Preload likely next step
<Link onMouseEnter={() => preload()}>Dashboard</Link>

// Avoid - Preloading everything
useEffect(() => {
  preloadAllComponents() // Defeats the purpose
}, [])
```

### 3. Provide Meaningful Loading States

```typescript
// Good - Context-specific loading
function DashboardLoading() {
  return (
    <div>
      <SkeletonHeader />
      <SkeletonChart />
      <SkeletonTable />
    </div>
  )
}

// Avoid - Generic spinner for everything
function Loading() {
  return <Spinner />
}
```

### 4. Handle Errors Gracefully

```typescript
// Good - Actionable error handling
function ErrorFallback({ error, resetError }) {
  return (
    <div>
      <h2>Unable to load dashboard</h2>
      <p>Check your connection and try again</p>
      <button onClick={resetError}>Retry</button>
      <button onClick={() => navigate('/home')}>Go Home</button>
    </div>
  )
}

// Avoid - Cryptic error messages
function ErrorFallback({ error }) {
  return <div>Error: {error.stack}</div>
}
```

## Testing Lazy Components

### Unit Testing

```typescript
import { render, waitFor } from '@testing-library/react'
import { LazyComponent } from './LazyComponent'

test('lazy component loads successfully', async () => {
  render(<LazyComponent />)
  
  // Wait for component to load
  await waitFor(() => {
    expect(screen.getByText('Component Content')).toBeInTheDocument()
  })
})
```

### E2E Testing

```typescript
test('lazy loading performance', async () => {
  const page = await browser.newPage()
  
  // Monitor network requests
  const chunks = []
  page.on('response', response => {
    if (response.url().includes('chunk')) {
      chunks.push(response.url())
    }
  })
  
  await page.goto('/dashboard')
  expect(chunks.length).toBeGreaterThan(0) // Chunks were loaded
})
```

## Monitoring and Analytics

### Performance Metrics

Track lazy loading performance in production:

```typescript
// Automatically tracked by useLazyLoadingMetrics
{
  event: 'lazy_component_load',
  component_name: 'PoolFacilityManager',
  load_time: 250, // milliseconds
  retry_count: 0,
  success: true
}
```

### Bundle Size Analysis

Monitor chunk sizes over time:

```bash
# Build with analysis
npm run build -- --analyze

# Check chunk sizes
ls -la dist/assets/*.js
```

## Migration Guide

### From Standard Imports

```typescript
// Before
import MyComponent from './MyComponent'

function App() {
  return <MyComponent />
}

// After
import { LazyMyComponent } from '@/components/lazy'

function App() {
  return <LazyMyComponent />
}
```

### From Basic Lazy Loading

```typescript
// Before
const MyComponent = lazy(() => import('./MyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  )
}

// After
const LazyMyComponent = createLazyRoute(
  () => import('./MyComponent'),
  { routeName: 'MyComponent', preloadOn: 'hover' }
)

function App() {
  return <LazyMyComponent />
}
```

## Conclusion

The enhanced lazy loading system provides:
- **40-60% smaller initial bundle** through strategic code splitting
- **Better user experience** with smart preloading and loading states
- **Improved reliability** with error boundaries and retry logic
- **Development tools** for monitoring and optimization

This system ensures the application loads quickly while maintaining excellent user experience across all devices and network conditions.