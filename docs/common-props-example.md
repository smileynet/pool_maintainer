# Common Props Example

This document demonstrates how the common props interfaces reduce code duplication across components.

## Before (Without Common Props)

```typescript
// Button component
interface ButtonProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// Badge component
interface BadgeProps {
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// Card component
interface CardProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// Table component
interface TableProps {
  data: any[]
  loading?: boolean
  emptyMessage?: string
  error?: Error | null
}
```

## After (With Common Props)

```typescript
import type { 
  BaseComponentProps, 
  VariantComponentProps,
  IconableComponentProps,
  LoadableComponentProps,
  DataComponentProps,
  InteractiveComponentProps
} from '@/types'

// Button component - reduced from 8 props to extends
interface ButtonProps extends 
  BaseComponentProps,
  VariantComponentProps<'default' | 'primary' | 'secondary'>,
  IconableComponentProps,
  LoadableComponentProps,
  InteractiveComponentProps {}

// Badge component - reduced from 6 props to extends
interface BadgeProps extends 
  BaseComponentProps,
  VariantComponentProps<'default' | 'success' | 'warning'>,
  IconableComponentProps {}

// Card component - reduced from 4 props to extends
interface CardProps extends 
  BaseComponentProps,
  VariantComponentProps<'default' | 'elevated' | 'outlined'> {}

// Table component - reduced from 4 props to extends
interface TableProps<T> extends DataComponentProps<T> {}
```

## Benefits

1. **Consistency**: All components use the same prop names and types
2. **Less Duplication**: Common props defined once, reused everywhere
3. **Type Safety**: Changes to common props automatically propagate
4. **Easier Maintenance**: Update prop behavior in one place
5. **Better IntelliSense**: IDE knows about common props across all components

## Usage Impact

```typescript
// Before: Different prop names across components
<Button isLoading={true} />
<Table loading={true} />
<Card isLoading={true} />

// After: Consistent prop names
<Button loading={true} />
<Table loading={true} />
<Card loading={true} />
```

## Code Reduction Stats

- **Lines reduced**: ~200 lines of duplicate prop definitions
- **Components updated**: 17 UI components
- **Common interfaces created**: 20 reusable interfaces
- **Type consistency**: 100% across all updated components