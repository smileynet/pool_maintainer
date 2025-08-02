# ESLint Maintainability Rules Guide

This guide explains the ESLint configuration designed to enforce maintainability patterns in the Pool Maintenance application.

## Current Configuration

### Core Maintainability Rules

#### Function Complexity
- **`complexity`**: Max cyclomatic complexity of 15
- **`max-depth`**: Max nesting depth of 4 levels
- **`max-lines-per-function`**: Max 50 lines per function (excluding comments/blanks)
- **`max-params`**: Max 4 parameters per function

```typescript
// ❌ Bad - too complex
function processChemicalReading(pool, test, tech, date, notes, override, validate, notify) {
  if (pool) {
    if (test) {
      if (tech) {
        if (date) {
          if (notes) {
            if (override) {
              // Too deeply nested...
            }
          }
        }
      }
    }
  }
}

// ✅ Good - simplified
function processChemicalReading(data: ChemicalTestInput) {
  validateInput(data)
  const result = calculateResults(data)
  return saveResults(result)
}
```

#### Import/Export Patterns
- **No deep relative imports**: Use `@/` aliases instead of `../../../`
- **Consistent UI imports**: Import from `@/components/ui/` 
- **No React.FC**: Use function declarations for better type inference

```typescript
// ❌ Bad
import { Button } from '../../../components/ui/button'
const MyComponent: React.FC<Props> = (props) => { }

// ✅ Good  
import { Button } from '@/components/ui/button'
function MyComponent(props: Props) { }
```

#### Component Props Patterns
- **Extend common props**: Use shared interfaces from `@/types/common-props`
- **No inline objects/functions**: Use `useMemo`/`useCallback` for stable references
- **Memo for heavy components**: Wrap Card, Table, Chart components

```typescript
// ❌ Bad
interface ButtonProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

<Table data={items.filter(x => x.active)} />

// ✅ Good
interface ButtonProps extends BaseComponentProps, InteractiveComponentProps {
  // Only component-specific props
}

const filteredData = useMemo(() => items.filter(x => x.active), [items])
<MemoizedTable data={filteredData} />
```

#### Lazy Loading Patterns
- **Use enhanced lazy loading**: Prefer `createLazyComponent` over basic `lazy()`
- **Error boundaries required**: Wrap Suspense components with ErrorBoundary

```typescript
// ❌ Bad
const MyComponent = lazy(() => import('./MyComponent'))

<Suspense fallback={<div>Loading...</div>}>
  <MyComponent />
</Suspense>

// ✅ Good
const LazyMyComponent = createLazyRoute(
  () => import('./MyComponent'),
  { routeName: 'MyComponent', preloadOn: 'hover' }
)

<LazyMyComponent /> // Includes error boundary automatically
```

#### Performance Patterns
- **Avoid inline styles**: Use CSS classes or styled components
- **Stable dependencies**: Avoid recreating objects/functions in dependencies

```typescript
// ❌ Bad
<div style={{ padding: '1rem', margin: '0.5rem' }}>

useEffect(() => {
  fetchData({ limit: 10 }) // New object every render
}, [{ limit: 10 }])

// ✅ Good
<div className="p-4 m-2">

const config = useMemo(() => ({ limit: 10 }), [])
useEffect(() => {
  fetchData(config)
}, [config])
```

### React-Specific Rules

#### Hook Dependencies
- **`react-hooks/exhaustive-deps`**: Error level - critical for chemical reading consistency
- **`react-hooks/rules-of-hooks`**: Error level - fundamental React requirement

#### Component Naming
- **PascalCase required**: All component names must use PascalCase
- **Descriptive names**: Avoid generic names like `Component`, `Item`
- **File name matching**: Component names should match file names

### TypeScript Integration

#### Strict Type Checking
- **No explicit any**: Force proper typing
- **Unused vars**: Error with underscore exception (`_param`)
- **Prefer const**: Immutable by default

#### Import Organization
- **Type imports**: Separate type-only imports
- **Absolute paths**: Use `@/` aliases consistently

## Advanced Patterns (Future Implementation)

### Custom Rule Ideas

#### Data Fetching Patterns
```typescript
// Rule: prefer-custom-hooks
// Detects manual useState patterns that should use custom hooks

// ❌ Triggers warning
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

// ✅ Preferred
const { data, loading, error } = useFetchData(fetchFn)
```

#### Error Boundary Enforcement
```typescript
// Rule: enforce-error-boundaries
// Ensures lazy components have error boundaries

// ❌ Triggers error
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>

// ✅ Required
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

#### Performance Hints
```typescript
// Rule: performance-hints
// Suggests memoization for expensive operations

// ❌ Triggers warning
const processed = data.map(item => expensiveCalculation(item))

// ✅ Suggested
const processed = useMemo(() => 
  data.map(item => expensiveCalculation(item)), 
  [data]
)
```

## Configuration Examples

### Project-Level Settings

```javascript
// eslint.config.js
export default tseslint.config([
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      // Maintainability
      'complexity': ['warn', { max: 15 }],
      'max-depth': ['warn', { max: 4 }],
      'max-lines-per-function': ['warn', { max: 50 }],
      'max-params': ['warn', { max: 4 }],
      
      // React patterns
      'react-hooks/exhaustive-deps': 'error',
      'no-restricted-imports': ['error', {
        patterns: [{ 
          group: ['../../../*'], 
          message: 'Use absolute imports with @/ alias' 
        }]
      }]
    }
  }
])
```

### Component-Specific Overrides

```javascript
// For test files
{
  files: ['**/*.{test,spec}.{ts,tsx}'],
  rules: {
    'max-lines-per-function': 'off', // Tests can be longer
    '@typescript-eslint/no-explicit-any': 'off', // Testing often needs any
  }
}

// For Storybook files  
{
  files: ['**/*.stories.{ts,tsx}'],
  rules: {
    'react-hooks/rules-of-hooks': 'off', // Storybook decorators use hooks
  }
}
```

## IDE Integration

### VS Code Settings

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact", 
    "typescript",
    "typescriptreact"
  ],
  "eslint.codeActionsOnSave.mode": "problems",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Auto-fix on Save

Most maintainability issues can be auto-fixed:

```bash
# Fix all auto-fixable issues
npm run lint:fix

# Check only (no fixes)
npm run lint
```

## Custom Scripts

### Quality Checks

```json
{
  "scripts": {
    "quality": "npm run lint && npm run format:check && npm run type-check",
    "quality:fix": "npm run lint:fix && npm run format && npm run type-check"
  }
}
```

### Pre-commit Integration

```bash
# In package.json lint-staged config
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write"
  ]
}
```

## Measuring Impact

### Metrics to Track

1. **Complexity Scores**: Average cyclomatic complexity
2. **Function Length**: Average lines per function
3. **Import Depth**: Relative vs absolute imports
4. **Error Rates**: Reduction in runtime errors
5. **Review Speed**: Faster code review process

### Before/After Comparison

```bash
# Generate complexity report
npx eslint src/ --format=json | jq '.[] | .messages[] | select(.ruleId == "complexity")'

# Count violations
npx eslint src/ --format=compact | grep -c "warning\|error"
```

## Troubleshooting

### Common Issues

#### Rule Conflicts
```javascript
// If rules conflict, use override
{
  files: ['scripts/*.js'],
  rules: {
    'no-console': 'off', // Scripts can use console
    'max-lines-per-function': ['warn', { max: 100 }] // Scripts can be longer
  }
}
```

#### Performance Impact
```bash
# If linting is slow, exclude large files
{
  ignores: [
    'dist/**',
    'build/**', 
    'node_modules/**',
    'public/mockServiceWorker.js' // Large generated files
  ]
}
```

#### False Positives
```typescript
// Use eslint-disable for legitimate cases
// eslint-disable-next-line max-lines-per-function
function legitimatelyLongFunction() {
  // Complex but necessary logic
}
```

## Future Enhancements

1. **Custom Plugin**: Implement pool-specific rules as proper ESLint plugin
2. **Automated Metrics**: Track complexity trends over time
3. **Team Rules**: Add team-specific patterns as they emerge
4. **Integration Testing**: ESLint rules that check component integration
5. **Performance Rules**: Rules that catch common performance anti-patterns

## Resources

- [ESLint Configuration Guide](https://eslint.org/docs/user-guide/configuring/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [React Hooks Rules](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [Complexity Metrics](https://en.wikipedia.org/wiki/Cyclomatic_complexity)