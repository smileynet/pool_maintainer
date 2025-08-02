/**
 * Script to generate CSS theme files from OKLCH color definitions
 */

import { formatCss } from 'culori'
import { baseColors, lightTheme, darkTheme, poolColors } from '../src/lib/colors.js'
import { writeFileSync, mkdirSync } from 'fs'

// Ensure styles directory exists
const stylesDir = './src/styles'
mkdirSync(stylesDir, { recursive: true })

/**
 * Generate CSS custom properties from color object
 */
function generateCSSProperties(colors, prefix = '') {
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = prefix ? `${prefix}-${key}` : key
      if (typeof value === 'object' && value !== null && !value.mode) {
        // It's a nested object (like color scale)
        return generateCSSProperties(value, cssKey)
      } else {
        // It's a color value
        const cssValue = formatCss(value)
        return `  --color-${cssKey}: ${cssValue};`
      }
    })
    .flat()
    .join('\n')
}

/**
 * Generate base color scale CSS variables
 */
function generateBaseColorCSS() {
  return `/**
 * Base Color Scales
 * Generated from OKLCH color definitions
 */

:root {
${generateCSSProperties(baseColors)}

  /* Pool-specific semantic colors */
  --color-pool-safe: ${formatCss(poolColors.safe)};
  --color-pool-caution: ${formatCss(poolColors.caution)};
  --color-pool-critical: ${formatCss(poolColors.critical)};
  --color-pool-unknown: ${formatCss(poolColors.unknown)};
}
`
}

/**
 * Generate light theme semantic tokens
 */
function generateLightThemeCSS() {
  return `/**
 * Light Theme
 * Semantic color tokens for light mode
 */

:root {
${generateCSSProperties(lightTheme)}
}
`
}

/**
 * Generate dark theme semantic tokens
 */
function generateDarkThemeCSS() {
  return `/**
 * Dark Theme
 * Semantic color tokens for dark mode
 */

[data-theme="dark"] {
${generateCSSProperties(darkTheme)}
}

/* Also apply dark theme when user prefers dark mode and no explicit theme is set */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
${generateCSSProperties(darkTheme)}
  }
}
`
}

/**
 * Generate main theme tokens CSS
 */
function generateThemeTokensCSS() {
  return `/**
 * Theme Tokens
 * Three-layer token architecture for dynamic theming
 * 
 * Layer 1: Base colors (defined in this file)
 * Layer 2: Semantic tokens (theme-light.css, theme-dark.css)
 * Layer 3: Component tokens (defined in components)
 */

/* Import base color scales */
@import './theme-base.css';

/* Import theme-specific semantic tokens */
@import './theme-light.css';
@import './theme-dark.css';

/* Component-level tokens that reference semantic colors */
:root {
  /* Button component tokens */
  --button-primary-bg: var(--color-primary);
  --button-primary-fg: var(--color-primary-foreground);
  --button-secondary-bg: var(--color-secondary);
  --button-secondary-fg: var(--color-secondary-foreground);
  --button-destructive-bg: var(--color-destructive);
  --button-destructive-fg: var(--color-destructive-foreground);
  
  /* Card component tokens */
  --card-bg: var(--color-card);
  --card-fg: var(--color-card-foreground);
  --card-border: var(--color-border);
  
  /* Input component tokens */
  --input-bg: var(--color-background);
  --input-fg: var(--color-foreground);
  --input-border: var(--color-input);
  --input-ring: var(--color-ring);
  
  /* Badge component tokens */
  --badge-default-bg: var(--color-secondary);
  --badge-default-fg: var(--color-secondary-foreground);
  --badge-success-bg: var(--color-success);
  --badge-success-fg: var(--color-success-foreground);
  --badge-warning-bg: var(--color-warning);
  --badge-warning-fg: var(--color-warning-foreground);
  --badge-destructive-bg: var(--color-destructive);
  --badge-destructive-fg: var(--color-destructive-foreground);
  
  /* Pool status component tokens */
  --pool-status-safe-bg: var(--color-pool-safe);
  --pool-status-caution-bg: var(--color-pool-caution);
  --pool-status-critical-bg: var(--color-pool-critical);
  --pool-status-unknown-bg: var(--color-pool-unknown);
}

/* Smooth transitions for theme switching */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Disable transitions during theme switch to prevent flash */
.theme-switching * {
  transition: none !important;
}
`
}

// Generate and write CSS files
try {
  writeFileSync(`${stylesDir}/theme-base.css`, generateBaseColorCSS())
  writeFileSync(`${stylesDir}/theme-light.css`, generateLightThemeCSS())
  writeFileSync(`${stylesDir}/theme-dark.css`, generateDarkThemeCSS())
  writeFileSync(`${stylesDir}/theme-tokens.css`, generateThemeTokensCSS())
  
  console.log('✅ Generated theme CSS files:')
  console.log('  - src/styles/theme-base.css')
  console.log('  - src/styles/theme-light.css')
  console.log('  - src/styles/theme-dark.css')
  console.log('  - src/styles/theme-tokens.css')
} catch (error) {
  console.error('❌ Error generating theme CSS:', error)
  process.exit(1)
}