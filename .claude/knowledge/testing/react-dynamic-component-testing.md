# React Dynamic Component Testing Strategies

## Overview
Comprehensive testing strategies for React components with dynamic behavior, emergency states, and complex form validation - specifically addressing challenges in safety-critical applications like pool maintenance systems.

## Core Testing Challenges

### 1. Dynamic Button Text and Emergency States
**Problem**: Tests break when components change button text based on validation states (e.g., "Submit Test" → "Submit Emergency Test").

**Solutions**:
- Use partial text matching: `getByRole('button', { name: /submit/i })`
- Query by current state: Test the actual state, not hardcoded expectations
- Test state transitions explicitly
- Use `queryBy*` methods for conditional elements

```tsx
// ❌ Brittle - expects exact text
screen.getByRole('button', { name: /submit test/i })

// ✅ Flexible - matches any submit variant
screen.getByRole('button', { name: /submit/i })

// ✅ State-aware testing
const isEmergency = getByTestId('emergency-alert')
const submitButton = isEmergency 
  ? getByRole('button', { name: /submit emergency/i })
  : getByRole('button', { name: /submit test/i })
```

### 2. Complex Form Validation Testing
**Problem**: Traditional validation messages don't match MAHC (Model Aquatic Health Code) validation patterns.

**Solutions**:
- Test validation feedback existence, not exact messages
- Focus on visual indicators (colors, icons, alerts)
- Test validation state changes
- Use semantic queries for accessible validation

```tsx
// ❌ Tests exact message that may change
expect(screen.getByText(/pH must be between 0 and 14/i)).toBeInTheDocument()

// ✅ Tests validation presence and type
await user.type(phInput, '8.5')
await waitFor(() => {
  // Look for any validation feedback
  const validationContainer = screen.getByRole('alert') || 
                             screen.querySelector('[class*="validation"]') ||
                             screen.querySelector('[class*="error"]')
  expect(validationContainer).toBeInTheDocument()
})

// ✅ Test validation state changes
expect(phInput).toHaveClass(/error|warning|critical/)
```

### 3. Emergency State Testing Patterns
**Problem**: Safety-critical applications need robust testing of emergency/critical states.

**Solutions**:
- Test emergency triggers and responses
- Verify alert accessibility (aria-live)
- Test state cascading effects
- Validate safety mechanisms

```tsx
// Emergency state testing pattern
const testEmergencyState = async () => {
  const user = userEvent.setup()
  
  // Trigger emergency conditions
  await user.type(screen.getByLabelText(/pH/i), '8.5')
  await user.type(screen.getByLabelText(/chlorine/i), '5.0')
  
  await waitFor(() => {
    // Verify emergency alert appears
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
    expect(alert).toHaveTextContent(/emergency/i)
    
    // Verify button state changes
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toHaveTextContent(/emergency/i)
    expect(submitButton).toHaveClass(/destructive|error|critical/)
    
    // Verify pool closure recommendation
    expect(screen.getByText(/pool closure/i)).toBeInTheDocument()
  })
}
```

## Testing Complex UI Components

### 1. Radix UI Select Components
**Problem**: Select dropdowns with portals don't render options during testing.

**Solutions**:
- Mock PointerEvent for JSDOM compatibility
- Mock ResizeObserver
- Use keyboard events as fallback
- Test with userEvent.selectOptions when possible

```tsx
// Setup mocks for Radix UI testing
beforeEach(() => {
  // Mock ResizeObserver
  global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
  
  // Mock PointerEvent if needed
  global.PointerEvent = class PointerEvent extends Event {
    constructor(type: string, eventInitDict: PointerEventInit = {}) {
      super(type, eventInitDict)
      this.pointerId = eventInitDict.pointerId || 0
      this.button = eventInitDict.button || 0
    }
  } as any
})

// Test select interaction
const testSelectComponent = async () => {
  const user = userEvent.setup()
  
  // Find select trigger
  const selectTrigger = screen.getByRole('combobox')
  
  // Try multiple interaction methods
  try {
    // Method 1: User event (preferred)
    await user.click(selectTrigger)
  } catch {
    // Method 2: Keyboard event (fallback)
    await user.keyboard('{Enter}')
  }
  
  // Look for options in portal or within component
  await waitFor(() => {
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength.greaterThan(0)
  })
}
```

### 2. Portal Content Testing
**Problem**: Radix UI portals content outside component tree.

**Solutions**:
- Query the entire document
- Use container queries
- Test portal mounting
- Focus on user interactions, not DOM structure

```tsx
// Test portal content
const testPortalContent = async () => {
  const user = userEvent.setup()
  
  await user.click(screen.getByRole('combobox'))
  
  // Query portal content in document
  await waitFor(() => {
    // Look for portal container
    const portal = document.querySelector('[data-radix-portal]')
    expect(portal).toBeInTheDocument()
    
    // Query within portal or globally
    const options = within(portal || document.body).getAllByRole('option')
    expect(options).toHaveLength.greaterThan(0)
  })
}
```

## Test ID vs Semantic Query Strategy

### When to Use Test IDs
- **Dynamic content**: When text changes frequently
- **Complex containers**: For scoping queries to specific areas
- **Portal components**: When semantic queries fail due to rendering outside component tree
- **Emergency fallback**: When no other query method works

### When to Use Semantic Queries
- **Static UI elements**: Buttons, labels, headings
- **Form elements**: Use getByLabelText for accessibility
- **User interactions**: Focus on how users actually interact
- **Accessibility validation**: Ensures proper ARIA implementation

```tsx
// Strategic test ID usage
const ChemicalTestForm = () => (
  <div data-testid="chemical-test-form">
    {/* Use semantic queries for these */}
    <h2>Chemical Test Entry</h2>
    <label htmlFor="ph-input">pH Level</label>
    <input id="ph-input" type="number" />
    
    {/* Use test ID for dynamic/complex content */}
    <div data-testid="validation-alerts">
      {emergencyAlerts.map(alert => (
        <div key={alert.id} data-testid={`alert-${alert.type}`}>
          {alert.message}
        </div>
      ))}
    </div>
    
    {/* Use test ID for portal components */}
    <Select>
      <SelectTrigger data-testid="pool-selector">
        <SelectValue placeholder="Select pool" />
      </SelectTrigger>
      <SelectContent data-testid="pool-options">
        {pools.map(pool => (
          <SelectItem key={pool.id} value={pool.id}>
            {pool.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)
```

## E2E Test Data Attribute Strategies

### Naming Conventions
- **Feature-Element-Action**: `data-testid="chemical-form-submit-button"`
- **State-aware**: `data-testid="alert-emergency"`, `data-testid="alert-warning"`
- **Container scoping**: `data-testid="pool-status-grid"`, `data-testid="test-history-table"`

### Implementation Strategy
```tsx
// Component with strategic test IDs
export const PoolStatusDashboard = () => (
  <div data-testid="pool-status-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {pools.map(pool => (
      <Card key={pool.id} data-testid={`pool-card-${pool.id}`}>
        <CardHeader>
          <h3>{pool.name}</h3>
          {pool.status === 'critical' && (
            <Alert data-testid="critical-alert" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Alert</AlertTitle>
              <AlertDescription>{pool.alertMessage}</AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <Button 
            data-testid="record-chemical-test"
            onClick={() => recordTest(pool.id)}
          >
            Record Chemical Test
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
)
```

### E2E Test Implementation
```typescript
// Playwright E2E test
test('should handle emergency chemical readings', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Use test IDs for reliable element selection
  await page.locator('[data-testid="record-chemical-test"]').first().click()
  
  // Fill form with emergency values
  await page.locator('[data-testid="ph-input"]').fill('8.5')
  await page.locator('[data-testid="chlorine-input"]').fill('5.0')
  
  // Verify emergency state
  await expect(page.locator('[data-testid="critical-alert"]')).toBeVisible()
  await expect(page.locator('[data-testid="submit-button"]')).toContainText('Emergency')
  
  // Test pool closure recommendation
  await expect(page.locator('[data-testid="pool-closure-warning"]')).toBeVisible()
})
```

## Maintenance Best Practices

### 1. Test Robustness
- Write tests that survive UI changes
- Focus on user behavior, not implementation
- Use partial matching for dynamic content
- Test state transitions, not just final states

### 2. Emergency State Coverage
- Test all critical thresholds
- Verify alert accessibility
- Test cascading safety effects
- Validate user guidance (next steps)

### 3. Form Validation Testing
- Test validation triggers (blur, submit, real-time)
- Verify visual feedback (colors, icons)
- Test validation state persistence
- Check accessibility compliance

### 4. Component Integration
- Test component interactions
- Verify data flow between components
- Test error propagation
- Validate loading states

## Common Patterns for Pool Maintenance Testing

```tsx
// Comprehensive test pattern
describe('ChemicalTestForm Safety Critical Testing', () => {
  const testCriticalScenarios = [
    { ph: 8.5, chlorine: 5.0, expected: 'emergency' },
    { ph: 8.2, chlorine: 4.0, expected: 'critical' },
    { ph: 7.8, chlorine: 3.5, expected: 'warning' },
    { ph: 7.4, chlorine: 2.0, expected: 'safe' }
  ]
  
  testCriticalScenarios.forEach(({ ph, chlorine, expected }) => {
    it(`should handle ${expected} state for pH ${ph}, chlorine ${chlorine}`, async () => {
      const user = userEvent.setup()
      render(<ChemicalTestForm {...defaultProps} />)
      
      // Fill required fields
      await user.type(screen.getByLabelText(/technician/i), 'Test Tech')
      await user.selectOptions(screen.getByLabelText(/pool/i), 'POOL-001')
      
      // Enter chemical values
      await user.type(screen.getByLabelText(/pH/i), ph.toString())
      await user.type(screen.getByLabelText(/chlorine/i), chlorine.toString())
      
      await waitFor(() => {
        if (expected === 'emergency') {
          expect(screen.getByRole('alert')).toHaveTextContent(/emergency/i)
          expect(screen.getByRole('button', { name: /submit/i })).toHaveTextContent(/emergency/i)
        } else if (expected === 'safe') {
          expect(screen.queryByRole('alert')).not.toBeInTheDocument()
          expect(screen.getByRole('button', { name: /submit/i })).toHaveTextContent(/^submit test$/i)
        }
      })
    })
  })
})
```

This comprehensive testing strategy ensures your React components are thoroughly tested while remaining maintainable and resistant to UI changes.