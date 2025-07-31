# Color Schemes Quick Reference Extract

## Light Blue Background Schemes (Modern & Accessible)

### Top 5 Light Blue Palettes for 2024

#### 1. Sky Trust (SaaS Dashboard)

```css
/* Background */
--bg-primary: #e3f2fd; /* OKLCH: oklch(0.95 0.03 220) */
--bg-secondary: #bbdefb; /* OKLCH: oklch(0.87 0.07 220) */

/* Text (WCAG AA Compliant) */
--text-primary: #0d47a1; /* Contrast: 9.2:1 */
--text-secondary: #1976d2; /* Contrast: 5.8:1 */

/* Accents */
--accent-primary: #ff6b35; /* Orange */
--accent-success: #00c853; /* Green */
```

#### 2. Ocean Breeze (Productivity)

```css
/* Gradient Background */
--bg-start: #caf0f8; /* OKLCH: oklch(0.92 0.06 200) */
--bg-end: #90e0ef; /* OKLCH: oklch(0.87 0.09 195) */

/* Supporting Colors */
--deep: #03045e; /* Text */
--mid: #0077b6; /* Links */
--light: #00b4d8; /* Buttons */
```

#### 3. Ice Minimal (Modern Tech)

```css
/* Monochrome Base */
--bg: #f0f8ff; /* Alice Blue */
--surface: #e1f5fe; /* Light Cyan */

/* Contrast Colors */
--primary: #01579b; /* Dark Blue */
--secondary: #0288d1; /* Medium Blue */
--accent: #ff7043; /* Deep Orange */
```

## 2024-2025 Trending Palettes

### Hyperpop Energy

```css
--brat-green: #8ace00;
--barbie-pink: #e0218a;
--celestial-blue: #4997d0;
--electric-violet: #bf40bf;
```

### Chrome Luxe (Dark Mode)

```css
--bg-dark: #0a0a0a;
--chrome: #b5b5bd;
--accent-gold: #ffd700;
--text-light: #f5f5f5;
```

### Soft Tech (Approachable SaaS)

```css
--lavender: #e6e6fa;
--mint: #98ff98;
--blush: #ffb6c1;
--sky: #87ceeb;
```

## Color Psychology Cheat Sheet

| Color  | Tech Usage           | Emotional Impact             | Conversion Impact     |
| ------ | -------------------- | ---------------------------- | --------------------- |
| Blue   | 59% of tech brands   | Trust, calm, professional    | +15% form completion  |
| Green  | Success states, CTAs | Growth, positive, go         | +21% click-through    |
| Red    | Errors, urgency      | Alert, important, stop       | +34% urgency response |
| Purple | Premium features     | Creative, luxury, innovative | +18% premium upgrades |
| Orange | CTAs, energy         | Friendly, confident, fun     | +26% engagement       |

## OKLCH Implementation Template

```css
:root {
  /* Define base hue */
  --hue: 220; /* Blue */

  /* Generate scale */
  --color-50: oklch(0.97 0.02 var(--hue));
  --color-100: oklch(0.93 0.04 var(--hue));
  --color-200: oklch(0.87 0.06 var(--hue));
  --color-300: oklch(0.79 0.09 var(--hue));
  --color-400: oklch(0.68 0.13 var(--hue));
  --color-500: oklch(0.58 0.17 var(--hue)); /* Primary */
  --color-600: oklch(0.48 0.19 var(--hue));
  --color-700: oklch(0.39 0.18 var(--hue));
  --color-800: oklch(0.31 0.16 var(--hue));
  --color-900: oklch(0.23 0.13 var(--hue));
}

/* Auto dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    /* Invert lightness scale */
    --bg: var(--color-900);
    --surface: var(--color-800);
    --text: var(--color-100);
  }
}
```

## Accessibility Quick Checks

### On Light Blue (#ADD8E6)

✅ **Safe Colors:**

- Black (#000000): 11.2:1
- Dark Blue (#003366): 7.8:1
- Charcoal (#333333): 8.4:1

❌ **Avoid:**

- Light Gray (#CCCCCC): 1.6:1
- Yellow (#FFFF00): 1.3:1
- White (#FFFFFF): 1.4:1

## Tools & Resources

### Essential Tools

1. **OKLCH Color Picker**: oklch.com
2. **Contrast Checker**: webaim.org/resources/contrastchecker
3. **Palette Generator**: coolors.co
4. **Accessibility**: stark.co

### Design System References

- Material Design 3: m3.material.io
- IBM Carbon: carbondesignsystem.com
- Ant Design: ant.design
- Apple HIG: developer.apple.com/design
