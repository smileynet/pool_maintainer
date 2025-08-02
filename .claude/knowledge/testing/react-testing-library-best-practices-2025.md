# React Testing Library Best Practices 2025

## Overview
Current best practices for React Testing Library in 2025, focusing on maintainable, accessible, and user-centric testing approaches.

## Core Testing Philosophy

### User-Centric Testing Approach
React Testing Library focuses on testing React components from the user's perspective. Rather than testing internal component logic, it emphasizes interactions and how components render to the DOM.

**Key Principles**:
- Test behavior, not implementation
- Query elements as users would find them
- Focus on accessibility and semantic meaning
- Write tests that survive refactoring

## Query Priority Guide (2025 Update)

### 1. Accessible to Everyone (Highest Priority)
Use these queries for elements that are accessible to everyone:

```tsx
// ✅ Preferred queries
getByRole('button', { name: /submit/i })
getByLabelText(/email address/i)
getByPlaceholderText(/enter your email/i)
getByText(/welcome back/i)
getByDisplayValue(/current value/i)
```

### 2. Semantic Queries (Second Priority)
For HTML5 and ARIA compliant selectors:

```tsx
// ✅ Good semantic queries
getByAltText(/product image/i)
getByTitle(/tooltip text/i)
```

### 3. Test IDs (Last Resort)
Use only when semantic queries don't work:

```tsx
// ⚠️ Use sparingly
getByTestId('complex-component-container')
```

## Query Method Selection

### getBy* Queries
- **Use for**: Elements that should be present
- **Behavior**: Throws error if not found
- **Best for**: Required elements, assertions

```tsx
// Element must be present
const submitButton = screen.getByRole('button', { name: /submit/i })
expect(submitButton).toBeEnabled()
```

### queryBy* Queries  
- **Use for**: Elements that may or may not be present
- **Behavior**: Returns null if not found
- **Best for**: Conditional rendering, negative assertions

```tsx
// Element might not exist
const errorMessage = screen.queryByRole('alert')
expect(errorMessage).not.toBeInTheDocument()
```

### findBy* Queries
- **Use for**: Elements that appear asynchronously
- **Behavior**: Returns promise, waits up to 1000ms
- **Best for**: Loading states, async operations

```tsx
// Wait for async element
const loadedContent = await screen.findByText(/data loaded/i)
expect(loadedContent).toBeInTheDocument()
```

## Modern Testing Patterns (2025)

### 1. User Event Over Fire Event
Always prefer `@testing-library/user-event` for more realistic interactions:

```tsx
// ❌ Avoid fireEvent
fireEvent.click(button)
fireEvent.change(input, { target: { value: 'test' } })

// ✅ Use userEvent
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'test')
```

### 2. Async Testing with waitFor
Handle async operations properly:

```tsx
// ✅ Proper async testing
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})

// ✅ With timeout customization
await waitFor(
  () => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument()
  },
  { timeout: 3000 }
)
```

### 3. Custom Render Utilities
Create reusable render helpers:

```tsx
// utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

## Testing Complex Components

### 1. Forms with Validation
Focus on user interactions and validation feedback:

```tsx
describe('ContactForm', () => {
  it('should show validation errors on invalid submission', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<ContactForm onSubmit={mockSubmit} />)
    
    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Check for validation feedback
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(mockSubmit).not.toHaveBeenCalled()
    })
  })
  
  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<ContactForm onSubmit={mockSubmit} />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello world')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      })
    })
  })
})
```

### 2. Dynamic Content and State Changes
Test components that change based on state:

```tsx
describe('StatusIndicator', () => {
  it('should display different states correctly', async () => {
    const { rerender } = render(<StatusIndicator status="loading" />)
    
    // Loading state
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    
    // Success state
    rerender(<StatusIndicator status="success" />)
    expect(screen.getByRole('status')).toHaveTextContent(/success/i)
    
    // Error state
    rerender(<StatusIndicator status="error" />)
    expect(screen.getByRole('alert')).toHaveTextContent(/error/i)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })
})
```

### 3. Portal Components (Modals, Dropdowns)
Handle components that render outside the component tree:

```tsx
describe('Modal', () => {
  it('should open and close modal', async () => {
    const user = userEvent.setup()
    
    render(<ModalExample />)
    
    // Modal should not be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    
    // Open modal
    await user.click(screen.getByRole('button', { name: /open modal/i }))
    
    // Modal should be visible
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Close modal with escape key
    await user.keyboard('{Escape}')
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
```

## Accessibility Testing

### 1. ARIA Attributes
Verify proper ARIA implementation:

```tsx
it('should have proper accessibility attributes', () => {
  render(<SearchCombobox />)
  
  const combobox = screen.getByRole('combobox')
  expect(combobox).toHaveAttribute('aria-expanded', 'false')
  expect(combobox).toHaveAttribute('aria-haspopup', 'listbox')
  expect(combobox).toHaveAttribute('aria-autocomplete', 'list')
})
```

### 2. Keyboard Navigation
Test keyboard accessibility:

```tsx
it('should support keyboard navigation', async () => {
  const user = userEvent.setup()
  render(<NavigationMenu />)
  
  // Tab through menu items
  await user.tab()
  expect(screen.getByRole('menuitem', { name: /home/i })).toHaveFocus()
  
  await user.tab()
  expect(screen.getByRole('menuitem', { name: /about/i })).toHaveFocus()
  
  // Arrow key navigation
  await user.keyboard('{ArrowDown}')
  expect(screen.getByRole('menuitem', { name: /contact/i })).toHaveFocus()
})
```

### 3. Screen Reader Announcements
Test live regions and announcements:

```tsx
it('should announce status changes to screen readers', async () => {
  const user = userEvent.setup()
  render(<FormWithLiveUpdates />)
  
  await user.type(screen.getByLabelText(/email/i), 'invalid-email')
  
  await waitFor(() => {
    const liveRegion = screen.getByRole('status')
    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    expect(liveRegion).toHaveTextContent(/please enter a valid email/i)
  })
})
```

## Error Handling and Edge Cases

### 1. Component Error Boundaries
Test error states and recovery:

```tsx
describe('ErrorBoundary', () => {
  it('should display error message when child component throws', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }
    
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
    
    consoleSpy.mockRestore()
  })
})
```

### 2. Network Error Handling
Test API failure scenarios:

```tsx
describe('UserProfile', () => {
  it('should handle API errors gracefully', async () => {
    // Mock API failure
    server.use(
      rest.get('/api/user', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    render(<UserProfile userId="123" />)
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to load user/i)
    })
  })
})
```

## Testing Performance and Optimization

### 1. React Suspense and Lazy Loading
Test async component loading:

```tsx
describe('LazyComponent', () => {
  it('should show fallback then load component', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    )
    
    // Should show fallback initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Should load actual component
    await waitFor(() => {
      expect(screen.getByText(/lazy component loaded/i)).toBeInTheDocument()
    })
  })
})
```

### 2. Memoization and Re-render Testing
Verify optimization works correctly:

```tsx
describe('OptimizedComponent', () => {
  it('should not re-render when props remain the same', () => {
    const mockRender = vi.fn()
    const TestComponent = React.memo(() => {
      mockRender()
      return <div>Memoized Component</div>
    })
    
    const { rerender } = render(<TestComponent prop="same" />)
    expect(mockRender).toHaveBeenCalledTimes(1)
    
    // Re-render with same props
    rerender(<TestComponent prop="same" />)
    expect(mockRender).toHaveBeenCalledTimes(1) // Should not re-render
    
    // Re-render with different props
    rerender(<TestComponent prop="different" />)
    expect(mockRender).toHaveBeenCalledTimes(2) // Should re-render
  })
})
```

## Modern Mocking Strategies (2025)

### 1. MSW (Mock Service Worker)
Preferred approach for API mocking:

```tsx
// setup-tests.ts
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ])
    )
  })
]
```

### 2. Module Mocking with Vitest
Modern module mocking approaches:

```tsx
// Mock external dependencies
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  identifyUser: vi.fn()
}))

// Mock React components
vi.mock('@/components/Chart', () => ({
  Chart: ({ data }: { data: any[] }) => (
    <div data-testid="mock-chart">Chart with {data.length} items</div>
  )
}))
```

### 3. Timer and Date Mocking
Handle time-dependent tests:

```tsx
describe('TimeBasedComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01'))
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  it('should update every second', async () => {
    render(<Clock />)
    
    expect(screen.getByText(/00:00:00/)).toBeInTheDocument()
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByText(/00:00:01/)).toBeInTheDocument()
    })
  })
})
```

## Test Organization and Structure

### 1. Describe Block Organization
Structure tests logically:

```tsx
describe('UserDashboard', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockAuthState({ isAuthenticated: true, user: mockUser })
    })
    
    it('should display user information', () => {
      // Test authenticated state
    })
    
    describe('when user has notifications', () => {
      it('should show notification badge', () => {
        // Nested scenario testing
      })
    })
  })
  
  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockAuthState({ isAuthenticated: false, user: null })
    })
    
    it('should redirect to login', () => {
      // Test unauthenticated state
    })
  })
})
```

### 2. Test Data Management
Use factories and fixtures:

```tsx
// test/factories/user.ts
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides
})

// In tests
const adminUser = createMockUser({ role: 'admin' })
const newUser = createMockUser({ createdAt: new Date().toISOString() })
```

## Common Anti-Patterns to Avoid

### 1. Testing Implementation Details
```tsx
// ❌ Don't test internal state
expect(component.state.isLoading).toBe(true)

// ✅ Test user-visible behavior
expect(screen.getByRole('status')).toHaveTextContent(/loading/i)
```

### 2. Overuse of Test IDs
```tsx
// ❌ Overusing test IDs
getByTestId('submit-button')
getByTestId('error-message')

// ✅ Use semantic queries
getByRole('button', { name: /submit/i })
getByRole('alert')
```

### 3. Fragile Selectors
```tsx
// ❌ Fragile CSS selectors
container.querySelector('.btn-primary.large')

// ✅ Semantic queries
getByRole('button', { name: /primary action/i })
```

This comprehensive guide provides the foundation for writing maintainable, accessible, and robust tests with React Testing Library in 2025.