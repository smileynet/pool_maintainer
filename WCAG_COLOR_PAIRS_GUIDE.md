# WCAG Color Pairs System Guide

## Overview

The WCAG Color Pairs System provides pre-tested, accessibility-compliant color combinations for the Pool Maintenance application. All color pairs have been automatically validated against WCAG 2.1 standards to ensure excellent contrast ratios.

## 🎯 Key Benefits

- **✅ Guaranteed Accessibility**: All combinations tested against WCAG AA/AAA standards
- **🚀 Developer Productivity**: No need to manually test contrast ratios
- **🔒 Consistency**: Standardized color usage across the application
- **⚡ TypeScript Support**: Full type safety and IntelliSense support
- **🧪 Automated Testing**: Integrated with build process for continuous validation

## 📊 Test Results Summary

**Current Status**: 56% of tested combinations pass WCAG AA standards

**Passing Combinations** (10/18):
- ✅ All primary text combinations (17.64-17.68:1 contrast)
- ✅ All secondary text combinations (13.70-13.73:1 contrast)  
- ✅ Yellow button combinations (9.23:1 contrast)
- ✅ Selected shadcn/ui combinations

**Failing Combinations** (8/18):
- ❌ Green/coral on light backgrounds (2.88-3.75:1 contrast)
- ❌ Some shadcn/ui color pairs (2.33-2.82:1 contrast)

## 🔧 Usage Methods

### Method 1: CSS Classes (Recommended)

Use pre-tested CSS classes for guaranteed accessibility:

```css
/* AAA Standard (7.0:1+ contrast) */
.wcag-surface-primary-text-aaa
.wcag-surface-elevated-text-aaa
.wcag-button-primary
.wcag-status-caution

/* AA Standard (4.5:1+ contrast) */
.wcag-button-secondary
.wcag-status-safe
.wcag-status-critical
```

```jsx
// React Example
function AccessibleButton({ variant = 'primary' }) {
  return (
    <button className={`wcag-button-${variant}`}>
      Click me
    </button>
  );
}
```

### Method 2: React Hook (Dynamic)

Use the `useWcagColors` hook for programmatic access:

```typescript
import { useWcagColors, WcagStandard } from '@/hooks/useWcagColors';

function StatusBadge({ status }: { status: 'safe' | 'caution' | 'critical' }) {
  const { getColorPair, validateCustomColors } = useWcagColors();
  
  // Get pre-tested color pair
  const colors = getColorPair('status', status, WcagStandard.AA);
  
  // Validate custom colors
  const validation = validateCustomColors('#ff0000', '#ffffff');
  
  if (!validation.isValid) {
    console.warn('Accessibility issue:', validation.recommendation);
  }
  
  return (
    <div 
      className={colors?.cssClass}
      style={{ 
        backgroundColor: colors?.background,
        color: colors?.foreground 
      }}
    >
      Status: {status}
      <span>Contrast: {colors?.contrastRatio.toFixed(2)}:1</span>
    </div>
  );
}
```

### Method 3: TypeScript Utility Functions

Use utility functions for validation and suggestions:

```typescript
import { 
  validateColorPair, 
  suggestAlternatives,
  checkKnownFailure,
  WcagStandard 
} from '@/utils/wcag-color-pairs';

// Validate custom color combination
const validation = validateColorPair('#65a33c', '#f8f8f8', WcagStandard.AA);
console.log(validation);
// Output: { isValid: false, contrastRatio: 2.88, recommendation: "..." }

// Check known failures
const failure = checkKnownFailure('var(--primitive-green-500)', 'var(--primitive-gray-50)');
console.log(failure);
// Output: { reason: "Light green on white fails AA standard", contrastRatio: 2.88 }

// Get alternatives
const alternatives = suggestAlternatives('button', WcagStandard.AA);
console.log(alternatives);
// Output: Array of suggested ColorPair objects
```

## 🎨 Available Color Categories

### Text Combinations
Best for body text, headings, and general content:

```css
.wcag-surface-primary-text-aaa     /* 17.68:1 - Excellent for all text */
.wcag-surface-elevated-text-aaa    /* 17.64:1 - Card/panel text */
.wcag-surface-secondary-text-aaa   /* 16.41:1 - Secondary surface text */
```

### Button Combinations
Pre-tested button color schemes:

```css
.wcag-button-primary     /* Yellow bg, dark text - 9.23:1 */
.wcag-button-secondary   /* Dark green bg, light text - ~4.8:1 */
.wcag-button-destructive /* Dark coral bg, light text - ~4.6:1 */
```

### Status Indicators
Safety-critical status colors:

```css
.wcag-status-safe       /* Dark green - Safe conditions */
.wcag-status-caution    /* Yellow - Attention needed - 7.48:1 */
.wcag-status-critical   /* Dark coral - Critical issues */
.wcag-status-emergency  /* Darker coral - Emergency situations */
```

## ⚠️ Known Failing Combinations

**DO NOT USE** these combinations as they fail WCAG standards:

```css
/* ❌ Light green on white - 2.88:1 contrast (needs 4.5:1) */
background: var(--primitive-green-500);
color: var(--primitive-gray-50);

/* ❌ Light coral on white - 2.93:1 contrast (needs 4.5:1) */
background: var(--primitive-coral-500);
color: var(--primitive-gray-50);

/* ❌ Medium coral on white - 3.75:1 contrast (needs 4.5:1) */
background: var(--primitive-coral-600);
color: var(--primitive-gray-50);
```

## 🧪 Testing & Validation

### Automated Testing

The system includes automated contrast testing integrated with the build process:

```bash
# Run contrast testing
npm run test:contrast

# Generate JSON report
npm run test:contrast:json

# Test AAA standard
npm run test:contrast:aaa
```

### Development Validation

Use the validation hook to catch issues early:

```typescript
import { useWcagValidation } from '@/hooks/useWcagColors';

function MyComponent({ backgroundColor, textColor }: Props) {
  // Automatically validates colors in development and shows warnings
  useWcagValidation(backgroundColor, textColor, WcagStandard.AA, 'MyComponent');
  
  return <div style={{ backgroundColor, color: textColor }}>Content</div>;
}
```

### Manual Testing Tools

1. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
2. **Color Oracle** (color blindness simulation): https://colororacle.org/
3. **Browser DevTools**: Accessibility panel for contrast analysis

## 🎯 Best Practices

### ✅ DO

- **Use pre-tested combinations** from the WCAG color pairs system
- **Test all custom combinations** with `npm run test:contrast`
- **Use AAA standard** for critical text (body text, important information)
- **Use AA standard** for non-critical text (captions, secondary information)
- **Prefer darker color variants** for better contrast on light backgrounds
- **Use the TypeScript utilities** for programmatic color selection

### ❌ DON'T

- Use light colors on light backgrounds without testing
- Override tested combinations without re-validation
- Assume a color pair is accessible without verification
- Use medium-lightness colors on light backgrounds
- Ignore console warnings in development mode

### 🔄 Safe Upgrade Path

If you have existing components using failing combinations:

1. **Identify usage**: Search for failing color variables in your codebase
2. **Replace with tested alternatives**: Use suggested replacements
3. **Test visually**: Ensure the new colors work in your design
4. **Validate**: Run contrast tests to confirm compliance

```typescript
// ❌ Before (fails WCAG)
<div style={{ 
  backgroundColor: 'var(--primitive-green-500)',
  color: 'var(--primitive-gray-50)' 
}}>
  Status: Safe
</div>

// ✅ After (passes WCAG)
<div className="wcag-status-safe">
  Status: Safe
</div>
```

## 📱 Responsive Considerations

### Text Size Classifications

The system accounts for WCAG text size requirements:

- **Normal text** (14px+): Requires higher contrast ratios
- **Large text** (18px+ or 14px bold): Allows slightly lower contrast ratios

```typescript
// Validate for different text sizes
const normalTextValidation = validateColorPair(bg, fg, WcagStandard.AA, WcagSize.NORMAL);
const largeTextValidation = validateColorPair(bg, fg, WcagStandard.AA, WcagSize.LARGE);
```

### Dark Mode Considerations

The color pairs system currently focuses on light mode. Dark mode adaptations maintain the same contrast ratios but with inverted relationships:

- Light backgrounds become dark
- Dark text becomes light
- Contrast ratios remain consistent

## 🚀 Integration with Build Process

### Pre-commit Hooks

The system integrates with your existing pre-commit hooks:

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "npm run test:contrast",
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### CI/CD Pipeline

Add contrast testing to your CI pipeline:

```yaml
# GitHub Actions example
- name: Test Color Accessibility
  run: npm run test:contrast
```

### Development Workflow

1. **Write component** using WCAG color pairs
2. **Test locally** with `npm run test:contrast`
3. **Commit changes** (pre-commit hook validates)
4. **Deploy** with confidence in accessibility compliance

## 📚 Additional Resources

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Requirements**: https://webaim.org/articles/contrast/
- **Color Universal Design**: https://jfly.uni-koeln.de/color/
- **Pool Maintenance Color System Documentation**: `COLOR_SYSTEM_DOCUMENTATION.md`

## 🔄 Maintenance & Updates

The WCAG color pairs system is automatically tested and should be updated when:

1. **New colors are added** to the design system
2. **Existing colors are modified** in the token system
3. **WCAG standards are updated** or requirements change
4. **Accessibility feedback** identifies new issues

To update the system:

1. Add new combinations to the test suite
2. Run `npm run test:contrast` to validate
3. Update the TypeScript definitions if needed
4. Document new combinations in this guide

---

**Last Updated**: 2025-07-31  
**Next Review**: 2025-10-31