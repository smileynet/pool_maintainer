# Color Implementation Patterns

## CSS Architecture for Modern Color Systems

### 1. OKLCH-First Design Tokens

```css
/* Base color configuration */
:root {
  /* Brand colors as HSL-like values */
  --brand-h: 220; /* Hue */
  --brand-s: 0.85; /* Saturation (as chroma multiplier) */
  --brand-l: 0.6; /* Base lightness */

  /* Generate color scale programmatically */
  --brand-50: oklch(0.98 calc(0.02 * var(--brand-s)) var(--brand-h));
  --brand-100: oklch(0.95 calc(0.04 * var(--brand-s)) var(--brand-h));
  --brand-200: oklch(0.88 calc(0.08 * var(--brand-s)) var(--brand-h));
  --brand-300: oklch(0.78 calc(0.12 * var(--brand-s)) var(--brand-h));
  --brand-400: oklch(0.68 calc(0.16 * var(--brand-s)) var(--brand-h));
  --brand-500: oklch(var(--brand-l) calc(0.2 * var(--brand-s)) var(--brand-h));
  --brand-600: oklch(0.52 calc(0.22 * var(--brand-s)) var(--brand-h));
  --brand-700: oklch(0.44 calc(0.2 * var(--brand-s)) var(--brand-h));
  --brand-800: oklch(0.35 calc(0.18 * var(--brand-s)) var(--brand-h));
  --brand-900: oklch(0.25 calc(0.15 * var(--brand-s)) var(--brand-h));
  --brand-950: oklch(0.15 calc(0.12 * var(--brand-s)) var(--brand-h));
}
```

### 2. Semantic Color Mapping

```css
:root {
  /* Surface colors */
  --surface-primary: var(--neutral-0);
  --surface-secondary: var(--neutral-50);
  --surface-tertiary: var(--neutral-100);
  --surface-inverse: var(--neutral-900);

  /* Text colors */
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-700);
  --text-tertiary: var(--neutral-500);
  --text-disabled: var(--neutral-400);
  --text-inverse: var(--neutral-50);

  /* Interactive colors */
  --action-primary: var(--brand-500);
  --action-primary-hover: var(--brand-600);
  --action-primary-active: var(--brand-700);
  --action-secondary: var(--neutral-200);
  --action-secondary-hover: var(--neutral-300);

  /* Feedback colors */
  --feedback-success: oklch(0.62 0.18 145);
  --feedback-warning: oklch(0.75 0.15 85);
  --feedback-error: oklch(0.58 0.22 25);
  --feedback-info: var(--brand-500);
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    /* Invert surface colors */
    --surface-primary: var(--neutral-900);
    --surface-secondary: var(--neutral-850);
    --surface-tertiary: var(--neutral-800);
    --surface-inverse: var(--neutral-50);

    /* Invert text colors */
    --text-primary: var(--neutral-50);
    --text-secondary: var(--neutral-200);
    --text-tertiary: var(--neutral-400);
    --text-inverse: var(--neutral-900);

    /* Adjust interactive colors for dark backgrounds */
    --action-primary: var(--brand-400);
    --action-primary-hover: var(--brand-300);
    --action-secondary: var(--neutral-800);
    --action-secondary-hover: var(--neutral-700);
  }
}
```

### 3. Component-Specific Implementation

```css
/* Button component with color system */
.btn {
  /* Base styles */
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;

  /* Primary variant */
  &--primary {
    background: var(--action-primary);
    color: var(--text-inverse);
    border: 1px solid transparent;

    &:hover {
      background: var(--action-primary-hover);
    }

    &:active {
      background: var(--action-primary-active);
    }

    &:disabled {
      background: oklch(from var(--action-primary) l calc(c * 0.3) h);
      cursor: not-allowed;
    }
  }

  /* Secondary variant */
  &--secondary {
    background: var(--action-secondary);
    color: var(--text-primary);
    border: 1px solid var(--neutral-300);

    &:hover {
      background: var(--action-secondary-hover);
      border-color: var(--neutral-400);
    }
  }

  /* Ghost variant */
  &--ghost {
    background: transparent;
    color: var(--action-primary);
    border: 1px solid currentColor;

    &:hover {
      background: oklch(from var(--action-primary) l c h / 0.1);
    }
  }
}

/* Card component */
.card {
  background: var(--surface-secondary);
  border: 1px solid oklch(from var(--neutral-200) l c h / 0.5);
  border-radius: 0.5rem;
  padding: 1.5rem;

  /* Elevated variant */
  &--elevated {
    background: var(--surface-primary);
    box-shadow:
      0 1px 3px oklch(0.2 0 0 / 0.1),
      0 1px 2px oklch(0.2 0 0 / 0.06);
    border: none;
  }

  /* Interactive variant */
  &--interactive {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--action-primary);
      box-shadow: 0 0 0 1px var(--action-primary);
    }
  }
}
```

## JavaScript Color System Management

### 1. Color Theme Manager

```javascript
class ColorSystem {
  constructor() {
    this.root = document.documentElement
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Color configuration
    this.config = {
      brand: {
        hue: 220,
        saturation: 0.85,
        lightness: 0.6,
      },
      scales: {
        light: [0.98, 0.95, 0.88, 0.78, 0.68, 0.6, 0.52, 0.44, 0.35, 0.25, 0.15],
        chroma: [0.02, 0.04, 0.08, 0.12, 0.16, 0.2, 0.22, 0.2, 0.18, 0.15, 0.12],
      },
    }

    this.init()
  }

  init() {
    // Set initial theme
    this.applyTheme(this.getPreferredTheme())

    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (!this.hasManualTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  generateColorScale(hue, baseSaturation) {
    const { scales } = this.config
    const colors = {}

    scales.light.forEach((lightness, index) => {
      const step = index === 0 ? 50 : index * 100
      const chroma = scales.chroma[index] * baseSaturation

      colors[`--brand-${step}`] = `oklch(${lightness} ${chroma} ${hue})`
    })

    return colors
  }

  applyTheme(theme) {
    // Set theme attribute
    this.root.setAttribute('data-theme', theme)

    // Store preference
    localStorage.setItem('preferred-theme', theme)

    // Emit custom event
    window.dispatchEvent(
      new CustomEvent('themechange', {
        detail: { theme },
      })
    )
  }

  updateBrandColor(hue, saturation, lightness) {
    // Update CSS variables
    this.root.style.setProperty('--brand-h', hue)
    this.root.style.setProperty('--brand-s', saturation)
    this.root.style.setProperty('--brand-l', lightness)

    // Generate and apply new scale
    const scale = this.generateColorScale(hue, saturation)
    Object.entries(scale).forEach(([prop, value]) => {
      this.root.style.setProperty(prop, value)
    })
  }

  getContrastRatio(color1, color2) {
    // Implementation would use WCAG formula
    // This is a placeholder
    return 4.5
  }

  suggestTextColor(backgroundColor) {
    // Simple implementation
    const bg = this.parseOKLCH(backgroundColor)
    return bg.l > 0.5 ? 'var(--text-primary)' : 'var(--text-inverse)'
  }

  parseOKLCH(colorString) {
    const match = colorString.match(/oklch\((\d*\.?\d+)\s+(\d*\.?\d+)\s+(\d+)\)/)
    if (match) {
      return {
        l: parseFloat(match[1]),
        c: parseFloat(match[2]),
        h: parseInt(match[3]),
      }
    }
    return null
  }

  getPreferredTheme() {
    // Check for stored preference
    const stored = localStorage.getItem('preferred-theme')
    if (stored) return stored

    // Fall back to system preference
    return this.mediaQuery.matches ? 'dark' : 'light'
  }

  hasManualTheme() {
    return localStorage.getItem('preferred-theme') !== null
  }
}

// Initialize color system
const colorSystem = new ColorSystem()
```

### 2. React Color System Hook

```typescript
import { useState, useEffect, useCallback } from 'react'

interface ColorConfig {
  hue: number
  saturation: number
  lightness: number
}

interface UseColorSystemReturn {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  updateBrandColor: (config: ColorConfig) => void
  generatePalette: (baseColor: string) => Record<string, string>
}

export function useColorSystem(): UseColorSystemReturn {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'

    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  const updateBrandColor = useCallback((config: ColorConfig) => {
    const root = document.documentElement

    // Update CSS variables
    root.style.setProperty('--brand-h', config.hue.toString())
    root.style.setProperty('--brand-s', config.saturation.toString())
    root.style.setProperty('--brand-l', config.lightness.toString())

    // Generate color scale
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const lightnesses = [0.98, 0.95, 0.88, 0.78, 0.68, 0.6, 0.52, 0.44, 0.35, 0.25, 0.15]
    const chromas = [0.02, 0.04, 0.08, 0.12, 0.16, 0.2, 0.22, 0.2, 0.18, 0.15, 0.12]

    steps.forEach((step, index) => {
      const l = lightnesses[index]
      const c = chromas[index] * config.saturation
      root.style.setProperty(`--brand-${step}`, `oklch(${l} ${c} ${config.hue})`)
    })
  }, [])

  const generatePalette = useCallback((baseColor: string): Record<string, string> => {
    // Parse base color (simplified)
    const match = baseColor.match(/#([0-9A-F]{6})/i)
    if (!match) return {}

    // Convert to OKLCH (simplified - would need proper conversion)
    const hue = 220 // Placeholder
    const palette: Record<string, string> = {}

    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    steps.forEach((step) => {
      const lightness = 1 - step / 1000
      const chroma = 0.2 * (1 - Math.abs(step - 500) / 500)
      palette[step] = `oklch(${lightness} ${chroma} ${hue})`
    })

    return palette
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme')
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme])

  return {
    theme,
    setTheme,
    toggleTheme,
    updateBrandColor,
    generatePalette,
  }
}
```

## Tailwind CSS with OKLCH

```javascript
// tailwind.config.js
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Define brand colors using OKLCH
        brand: {
          50: 'oklch(0.98 0.02 220)',
          100: 'oklch(0.95 0.04 220)',
          200: 'oklch(0.88 0.08 220)',
          300: 'oklch(0.78 0.12 220)',
          400: 'oklch(0.68 0.16 220)',
          500: 'oklch(0.60 0.20 220)',
          600: 'oklch(0.52 0.22 220)',
          700: 'oklch(0.44 0.20 220)',
          800: 'oklch(0.35 0.18 220)',
          900: 'oklch(0.25 0.15 220)',
          950: 'oklch(0.15 0.12 220)',
        },
        // Semantic colors
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary: 'var(--surface-tertiary)',
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        ':root': {
          // Define CSS variables for dynamic theming
          '--brand-h': '220',
          '--brand-s': '0.85',
          '--brand-l': '0.6',
        },
        '[data-theme="dark"]': {
          '--surface-primary': theme('colors.neutral.900'),
          '--surface-secondary': theme('colors.neutral.800'),
          '--text-primary': theme('colors.neutral.50'),
        },
      })
    }),
  ],
}
```

## Real-World Examples

### SaaS Dashboard Color System

```css
/* Light blue-based SaaS color system */
:root {
  /* Primary - Trust Blue */
  --primary-h: 210;
  --primary-base: oklch(0.62 0.18 var(--primary-h));

  /* Secondary - Growth Green */
  --secondary-h: 145;
  --secondary-base: oklch(0.65 0.2 var(--secondary-h));

  /* Background - Sky Tint */
  --bg-base: oklch(0.97 0.02 var(--primary-h));
  --bg-elevated: oklch(0.99 0.01 var(--primary-h));
  --bg-sunken: oklch(0.95 0.03 var(--primary-h));

  /* Interactive states */
  --hover-overlay: oklch(0.5 0.1 var(--primary-h) / 0.05);
  --focus-ring: oklch(0.6 0.2 var(--primary-h) / 0.25);
  --active-overlay: oklch(0.4 0.1 var(--primary-h) / 0.1);
}

/* Component usage */
.dashboard-card {
  background: var(--bg-elevated);
  border: 1px solid oklch(0.9 0.02 var(--primary-h));

  &:hover {
    background: oklch(from var(--bg-elevated) calc(l - 0.02) c h);
    border-color: var(--primary-base);
  }
}

.metric-positive {
  color: var(--secondary-base);
  background: oklch(from var(--secondary-base) 0.97 calc(c * 0.2) h);
}
```

## Testing & Validation

```javascript
// Color contrast testing utility
function checkColorAccessibility(foreground, background) {
  // This is a simplified example
  // Real implementation would calculate actual contrast

  const tests = {
    'WCAG AA Normal': 4.5,
    'WCAG AA Large': 3,
    'WCAG AAA Normal': 7,
    'WCAG AAA Large': 4.5,
  }

  const contrast = calculateContrast(foreground, background)

  return Object.entries(tests).map(([standard, required]) => ({
    standard,
    required,
    actual: contrast,
    passes: contrast >= required,
  }))
}

// Palette validation
function validateColorPalette(palette) {
  const issues = []

  // Check color steps have proper contrast
  const steps = Object.entries(palette).sort(([a], [b]) => parseInt(a) - parseInt(b))

  // Validate adjacent steps
  for (let i = 0; i < steps.length - 1; i++) {
    const [step1, color1] = steps[i]
    const [step2, color2] = steps[i + 1]

    const contrast = calculateContrast(color1, color2)
    if (contrast < 1.5) {
      issues.push({
        type: 'warning',
        message: `Low contrast between ${step1} and ${step2}: ${contrast}`,
      })
    }
  }

  return issues
}
```
