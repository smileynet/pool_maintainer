# Default Styling System

A comprehensive design system that ensures components work properly without explicit styling parameters while maintaining full customization flexibility.

## 🎯 Overview

The default styling system provides a foundation that prevents components from requiring explicit styling for basic functionality. It includes component base classes, comprehensive CSS custom properties, responsive layout wrappers, and enhanced component props.

## 🏗️ Architecture

### Component Base Classes (`src/styles/component-base-classes.css`)

Foundation classes that all UI components inherit:

```css
.button-base     /* Interactive button foundation */
.input-base      /* Form input foundation */
.card-base       /* Content container foundation */
.badge-base      /* Status indicator foundation */
.table-base      /* Data table foundation */
.label-base      /* Form label foundation */
.alert-base      /* Notification foundation */
.nav-base        /* Navigation foundation */
```

### Default Properties (`src/styles/default-properties.css`)

200+ CSS custom properties with fallback values organized by category:

- **Layout & Sizing**: Container widths, spacing scale, component dimensions
- **Typography**: Font families, sizes, weights, line heights
- **Colors**: Design tokens mapped to semantic usage
- **Animation**: Durations, easing functions, transitions
- **Accessibility**: Focus rings, touch targets, reduced motion

### Layout Wrappers (`src/components/ui/layout-wrappers.tsx`)

Reusable layout components with automatic constraints:

```typescript
<ContentWrapper maxWidth="xl" spacing="md">
  {/* Content automatically constrained and spaced */}
</ContentWrapper>

<GridWrapper cols={3} gap="md" responsive>
  {/* Responsive grid with proper spacing */}
</GridWrapper>
```

## 🎨 Component Enhancement System

### Enhanced Props Pattern

Components now include comprehensive default props and enhanced functionality:

#### Button Component
```typescript
interface ButtonProps {
  loading?: boolean      // Built-in loading state
  icon?: React.ReactNode // Icon support
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean    // Auto-width handling
}

<Button loading icon={<Save />} fullWidth>
  Save Changes
</Button>
```

#### Input Component
```typescript
interface InputProps {
  error?: boolean        // Error state styling
  helperText?: string    // Helper text display
  label?: string         // Label integration
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

<Input 
  label="Email Address" 
  error={hasError}
  helperText="Please enter a valid email"
  startIcon={<Mail />}
/>
```

#### Badge Component
```typescript
interface BadgeProps {
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  removable?: boolean    // Remove functionality
  onRemove?: () => void
}

<Badge icon={<Star />} removable onRemove={handleRemove}>
  Featured
</Badge>
```

### Base Class Integration

All components automatically inherit appropriate base classes:

```typescript
// Button component
className={cn(
  'button-base',  // Inherits default button styling
  buttonVariants({ variant, size }),
  className
)}

// Card component  
className={cn(
  'card-base',    // Inherits default card styling
  cardVariants({ variant, size }),
  className
)}
```

## 🖥️ Responsive Design System

### Viewport-Aware Sizing

Components automatically adapt to prevent viewport overflow:

```css
/* Dialog components */
max-w-[calc(100vw-2rem)]  /* Never exceed viewport */
max-h-[calc(100vh-2rem)]  /* Handle vertical overflow */

/* Layout constraints */
max-w-[90vw] sm:max-w-lg md:max-w-2xl  /* Responsive breakpoints */
```

### Layout Wrapper System

Automatic width constraints and responsive behavior:

```typescript
// Page-level wrapper
<PageWrapper>
  <ContentWrapper maxWidth="xl">
    {/* Content automatically constrained */}
  </ContentWrapper>
</PageWrapper>

// Grid layouts
<GridWrapper cols={4} responsive>
  {/* Automatically responsive: 1 col mobile, 2 tablet, 4 desktop */}
</GridWrapper>
```

## 📐 Design Token System

### CSS Custom Properties with Fallbacks

Every property includes fallback values to ensure components work even when tokens are missing:

```css
:root {
  /* Spacing with fallbacks */
  --default-component-padding: var(--space-4, 1rem);
  --default-button-height: var(--height-button-md, 2.5rem);
  --default-touch-target: max(44px, var(--default-button-height, 2.5rem));
  
  /* Typography with fallbacks */
  --default-font-family: var(--font-family-sans, system-ui, sans-serif);
  --default-font-size: var(--text-base, 1rem);
  --default-line-height: var(--leading-normal, 1.5);
  
  /* Colors with fallbacks */
  --default-primary: var(--color-primary, oklch(0.55 0.15 200));
  --default-background: var(--color-background, oklch(0.98 0.01 200));
}
```

### Responsive Property Adjustments

Properties automatically adjust for different screen sizes:

```css
/* Desktop adjustments */
@media (min-width: 1024px) {
  :root {
    --default-component-padding: calc(var(--space-4, 1rem) * 1.25);
    --default-button-height: var(--height-button-lg, 3rem);
  }
}
```

## 🛠️ Usage Guidelines

### For Component Development

1. **Always apply base classes** to new components
2. **Use CSS custom properties** with fallbacks
3. **Implement default props** for optional styling
4. **Test without explicit styling** to ensure defaults work

```typescript
// ✅ Good: Uses base class and default props
function NewComponent({ 
  variant = 'default',
  size = 'md',
  className,
  ...props 
}: ComponentProps) {
  return (
    <div 
      className={cn('component-base', variants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### For Layout Design

1. **Use layout wrappers** instead of manual constraints
2. **Apply semantic classes** for consistent spacing
3. **Leverage responsive utilities** for automatic adaptation

```typescript
// ✅ Good: Uses layout system
<PageWrapper>
  <SectionWrapper spacing="lg">
    <GridWrapper cols={3} gap="md" responsive>
      <Card>Content 1</Card>
      <Card>Content 2</Card>
      <Card>Content 3</Card>
    </GridWrapper>
  </SectionWrapper>
</PageWrapper>
```

### For Dialog/Modal Components

1. **Apply responsive constraints** to prevent overflow
2. **Use layout classes** for consistent sizing
3. **Include overflow handling** for content

```typescript
// ✅ Good: Responsive dialog
<DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
  {content}
</DialogContent>
```

## 🔧 Customization

### Override Defaults

The system is designed for easy customization while maintaining defaults:

```css
/* Project-specific overrides */
:root {
  --default-button-height: 3rem;     /* Override default height */
  --default-primary: oklch(0.6 0.2 180);  /* Override primary color */
}
```

### Component-Specific Styling

Use className prop to override defaults while keeping base functionality:

```typescript
<Button 
  className="h-16 bg-gradient-to-r from-blue-500 to-purple-600"
  loading={isLoading}
>
  Custom Styled Button
</Button>
```

### Layout Customization

Wrapper components accept custom props for specific use cases:

```typescript
<ContentWrapper 
  maxWidth="full"      // Override default constraint
  spacing="none"       // Remove default spacing
  className="bg-gradient-to-b from-gray-50 to-white"
>
  {content}
</ContentWrapper>
```

## 📊 Quality Assurance

### Validation Checklist

- ✅ **Components work without explicit styling**
- ✅ **Responsive behavior at all breakpoints**
- ✅ **No viewport overflow issues**
- ✅ **Proper accessibility standards met**
- ✅ **TypeScript types are comprehensive**
- ✅ **Performance optimized (no layout thrashing)**

### Testing Approach

1. **Test components without custom classes**
2. **Verify responsive behavior on multiple devices**
3. **Check accessibility with screen readers**
4. **Validate performance with browser dev tools**

## 🚀 Benefits

### For Developers
- **Faster development** - Components work out of the box
- **Consistent styling** - Automatic adherence to design system
- **Reduced bugs** - Fewer styling edge cases
- **Better DX** - Enhanced props with TypeScript support

### For Users
- **Better UX** - Consistent, responsive components
- **Accessibility** - Built-in a11y standards
- **Performance** - Optimized rendering and layout
- **Cross-device compatibility** - Works on all screen sizes

### For Maintenance
- **Centralized styling** - Single source of truth for defaults
- **Easy updates** - Change tokens to update entire system
- **Predictable behavior** - Components behave consistently
- **Quality assurance** - Systematic testing approach

## 📚 Related Documentation

- **Component Base Classes**: `src/styles/component-base-classes.css`
- **Default Properties**: `src/styles/default-properties.css` 
- **Layout Wrappers**: `src/components/ui/layout-wrappers.tsx`
- **Design System Reset**: `src/styles/design-system-reset.css`
- **Desktop Grid System**: `src/styles/desktop-grid.css`
- **Width Patterns**: `src/styles/desktop-width-patterns.css`

---

This system ensures components work properly without explicit styling parameters while maintaining full customization flexibility for specific use cases.