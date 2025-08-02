#!/usr/bin/env node

import { formatCss, oklch } from 'culori'
import { writeFileSync, mkdirSync } from 'fs'

// Ensure styles directory exists
const stylesDir = './src/styles'
mkdirSync(stylesDir, { recursive: true })

/**
 * Vibrant theme palettes defined directly in script
 */
const vibrantThemes = {
  ocean: {
    primary: { 500: oklch({ l: 0.55, c: 0.32, h: 200 }), 400: oklch({ l: 0.65, c: 0.28, h: 200 }) },
    accent: { 500: oklch({ l: 0.52, c: 0.30, h: 180 }), 400: oklch({ l: 0.62, c: 0.28, h: 180 }) }
  },
  sunset: {
    primary: { 500: oklch({ l: 0.58, c: 0.32, h: 25 }), 400: oklch({ l: 0.65, c: 0.28, h: 25 }) },
    accent: { 500: oklch({ l: 0.55, c: 0.30, h: 350 }), 400: oklch({ l: 0.62, c: 0.28, h: 350 }) }
  },
  forest: {
    primary: { 500: oklch({ l: 0.52, c: 0.32, h: 145 }), 400: oklch({ l: 0.65, c: 0.28, h: 145 }) },
    accent: { 500: oklch({ l: 0.50, c: 0.30, h: 165 }), 400: oklch({ l: 0.62, c: 0.28, h: 165 }) }
  },
  aurora: {
    primary: { 500: oklch({ l: 0.55, c: 0.32, h: 280 }), 400: oklch({ l: 0.65, c: 0.28, h: 280 }) },
    accent: { 500: oklch({ l: 0.52, c: 0.30, h: 200 }), 400: oklch({ l: 0.62, c: 0.28, h: 200 }) }
  }
}

// Base neutral colors
const neutral = {
  50: oklch({ l: 0.98, c: 0.00, h: 0 }),
  900: oklch({ l: 0.10, c: 0.00, h: 0 }),
  950: oklch({ l: 0.05, c: 0.00, h: 0 }),
  400: oklch({ l: 0.65, c: 0.00, h: 0 })
}

const createVibrantTheme = (themeName, isDark = false) => {
  const palette = vibrantThemes[themeName]
  const hue = palette.primary[500].h || 0
  
  if (isDark) {
    return {
      background: neutral[950],
      foreground: neutral[50],
      card: oklch({ l: 0.05, c: 0.01, h: hue }),
      cardForeground: neutral[50],
      popover: oklch({ l: 0.08, c: 0.02, h: hue }),
      popoverForeground: neutral[50],
      primary: palette.primary[400],
      primaryForeground: neutral[900],
      secondary: oklch({ l: 0.20, c: 0.02, h: hue }),
      secondaryForeground: neutral[50],
      muted: oklch({ l: 0.20, c: 0.02, h: hue }),
      mutedForeground: neutral[400],
      accent: palette.accent[400],
      accentForeground: neutral[900],
      border: oklch({ l: 0.20, c: 0.03, h: hue }),
      input: oklch({ l: 0.20, c: 0.03, h: hue }),
      ring: palette.primary[400],
    }
  }
  
  return {
    background: neutral[50],
    foreground: neutral[900],
    card: oklch({ l: 0.98, c: 0.005, h: hue }),
    cardForeground: neutral[900],
    popover: oklch({ l: 0.97, c: 0.01, h: hue }),
    popoverForeground: neutral[900],
    primary: palette.primary[500],
    primaryForeground: neutral[50],
    secondary: oklch({ l: 0.95, c: 0.01, h: hue }),
    secondaryForeground: neutral[900],
    muted: oklch({ l: 0.95, c: 0.01, h: hue }),
    mutedForeground: oklch({ l: 0.50, c: 0.00, h: 0 }),
    accent: palette.accent[500],
    accentForeground: neutral[50],
    border: oklch({ l: 0.90, c: 0.02, h: hue }),
    input: oklch({ l: 0.90, c: 0.02, h: hue }),
    ring: palette.primary[500],
  }
}

const generateThemeCSS = (themeName, isLight = true) => {
  const themeData = createVibrantTheme(themeName, !isLight)
  const mode = isLight ? 'light' : 'dark'
  
  let css = `/* ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme - ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode */\n`
  css += `[data-theme="${mode}"][data-theme-variant="${themeName}"] {\n`
  
  Object.entries(themeData).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      const cssValue = formatCss(value)
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      css += `  --color-${kebabKey}: ${cssValue};\n`
    }
  })
  
  css += '}\n\n'
  return css
}

// Generate theme-specific CSS for each variant
const themes = ['ocean', 'sunset', 'forest', 'aurora']

let allVibrantThemesCSS = `/**
 * Vibrant Dynamic Themes
 * Modern, saturated color themes with OKLCH color science
 */

`

themes.forEach(themeName => {
  // Light mode
  allVibrantThemesCSS += generateThemeCSS(themeName, true)
  
  // Dark mode
  allVibrantThemesCSS += generateThemeCSS(themeName, false)
})

// Write the vibrant themes file
writeFileSync(`${stylesDir}/vibrant-themes.css`, allVibrantThemesCSS)

console.log('✅ Generated vibrant theme CSS files:')
console.log('   - vibrant-themes.css (semantic theme mappings)')
console.log('')
console.log('🎨 Available themes:')
themes.forEach(theme => {
  console.log(`   - ${theme} (light/dark modes)`)
})