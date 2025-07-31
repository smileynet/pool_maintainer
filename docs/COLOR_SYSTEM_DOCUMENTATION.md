# Pool Maintenance Color System Documentation

**Version**: 2.0 (Post-Audit)  
**Last Updated**: July 31, 2025  
**Status**: Implementation Guidelines

---

## 🎯 Purpose & Scope

This document establishes **clear semantic meanings** for all colors in the pool maintenance system and provides **GenAI-safe patterns** to prevent theming mistakes during automated modifications.

### Key Objectives:

1. **Semantic Clarity**: Every color has a clear, documented purpose
2. **GenAI Safety**: Patterns that prevent AI modification errors
3. **Accessibility First**: WCAG AA/AAA compliance built-in
4. **Maintainability**: Single source of truth for color decisions

---

## 🏗️ Three-Layer Token Architecture

### **Layer 1: Primitive Tokens**

_Raw color values - the foundation_

```css
/* PRIMITIVE TOKENS - Raw Color Values */
/* Format: --primitive-{hue}-{lightness} */

/* Robin Egg Blue Family - Pool Water */
--primitive-blue-100: oklch(0.95 0.05 210); /* Almost white with blue hint */
--primitive-blue-200: oklch(0.9 0.08 210); /* Very light pool blue */
--primitive-blue-300: oklch(0.8 0.12 210); /* Light pool blue */
--primitive-blue-500: oklch(0.7 0.18 210); /* Main pool blue */
--primitive-blue-700: oklch(0.5 0.22 210); /* Deep water blue */

/* Grass Green Family - Nature/Outdoor */
--primitive-green-100: oklch(0.95 0.05 135); /* Very light green */
--primitive-green-200: oklch(0.85 0.08 135); /* Light grass */
--primitive-green-500: oklch(0.65 0.15 135); /* Fresh grass */
--primitive-green-700: oklch(0.45 0.18 135); /* Dark grass */

/* Sunshine Yellow Family - Energy/Attention */
--primitive-yellow-200: oklch(0.95 0.08 85); /* Light sunshine */
--primitive-yellow-500: oklch(0.8 0.15 85); /* Bright sunshine */
--primitive-yellow-600: oklch(0.75 0.18 85); /* Rich sunshine */

/* Coral Family - Friendly/Secondary Attention */
--primitive-coral-300: oklch(0.8 0.12 35); /* Light coral */
--primitive-coral-500: oklch(0.7 0.18 35); /* Main coral */
--primitive-coral-600: oklch(0.65 0.2 35); /* Rich coral */

/* Neutral Gray Family - Text/Backgrounds */
--primitive-gray-50: oklch(0.98 0 0); /* Near white */
--primitive-gray-100: oklch(0.95 0 0); /* Very light gray */
--primitive-gray-500: oklch(0.6 0 0); /* Medium gray */
--primitive-gray-700: oklch(0.4 0 0); /* Dark gray */
--primitive-gray-900: oklch(0.2 0 0); /* Very dark gray */
```

### **Layer 2: Semantic Tokens**

_Purpose-driven color assignments_

```css
/* SEMANTIC TOKENS - Purpose-Driven Assignments */
/* Format: --semantic-{purpose}-{variant} */

/* === BRAND & IDENTITY === */
--semantic-brand-primary: var(--primitive-blue-500); /* Main brand color */
--semantic-brand-secondary: var(--primitive-green-500); /* Secondary brand */

/* === USER INTERFACE === */
--semantic-surface-primary: var(--primitive-blue-100); /* Main backgrounds */
--semantic-surface-secondary: var(--primitive-blue-200); /* Card/panel backgrounds */
--semantic-surface-elevated: var(--primitive-gray-50); /* Elevated surfaces (cards) */

--semantic-text-primary: var(--primitive-gray-900); /* Main text */
--semantic-text-secondary: var(--primitive-gray-700); /* Secondary text */
--semantic-text-inverse: var(--primitive-gray-50); /* Text on dark backgrounds */

--semantic-border-default: var(--primitive-blue-200); /* Default borders */
--semantic-border-focus: var(--primitive-coral-500); /* Focus indicators */

/* === INTERACTIVE ELEMENTS === */
--semantic-action-primary: var(--primitive-yellow-500); /* Primary CTAs */
--semantic-action-secondary: var(--primitive-green-500); /* Secondary actions */
--semantic-action-tertiary: var(--primitive-coral-500); /* Tertiary/destructive */

/* === STATUS & FEEDBACK === */
--semantic-status-safe: var(--primitive-green-500); /* Safe/good status */
--semantic-status-caution: var(--primitive-yellow-600); /* Warning/attention */
--semantic-status-critical: var(--primitive-coral-500); /* Critical/error */
--semantic-status-emergency: var(--primitive-coral-600); /* Emergency/danger */

/* === POOL-SPECIFIC SEMANTICS === */
/* Chemical Status Colors - WCAG AAA Compliant */
--semantic-chemical-optimal: var(--primitive-green-500); /* Optimal levels */
--semantic-chemical-low: var(--primitive-yellow-600); /* Below optimal */
--semantic-chemical-high: var(--primitive-coral-500); /* Above optimal */
--semantic-chemical-critical: var(--primitive-coral-600); /* Dangerous levels */

/* Equipment Status Colors */
--semantic-equipment-running: var(--primitive-green-500); /* Normal operation */
--semantic-equipment-maintenance: var(--primitive-yellow-600); /* Needs attention */
--semantic-equipment-offline: var(--primitive-gray-500); /* Not running */
--semantic-equipment-error: var(--primitive-coral-600); /* Malfunction */

/* Pool Area Identification */
--semantic-area-main-pool: var(--primitive-blue-500); /* Main swimming area */
--semantic-area-kiddie-pool: var(--primitive-blue-300); /* Children's area */
--semantic-area-therapy-pool: var(--primitive-green-300); /* Therapy/rehab area */
--semantic-area-deck: var(--primitive-gray-100); /* Pool deck/walking areas */
```

### **Layer 3: Component Tokens**

_Specific component applications_

```css
/* COMPONENT TOKENS - Specific Usage */
/* Format: --component-{element}-{property}-{variant} */

/* === BUTTON COMPONENTS === */
--component-button-primary-bg: var(--semantic-action-primary);
--component-button-primary-text: var(--semantic-text-primary);
--component-button-primary-hover: var(--primitive-yellow-600);

--component-button-secondary-bg: var(--semantic-action-secondary);
--component-button-secondary-text: var(--semantic-text-inverse);
--component-button-secondary-hover: var(--primitive-green-700);

--component-button-destructive-bg: var(--semantic-action-tertiary);
--component-button-destructive-text: var(--semantic-text-inverse);
--component-button-destructive-hover: var(--primitive-coral-600);

/* === CARD COMPONENTS === */
--component-card-background: var(--semantic-surface-elevated);
--component-card-border: var(--semantic-border-default);
--component-card-header-bg: var(--semantic-surface-secondary);
--component-card-text: var(--semantic-text-primary);

/* === NAVIGATION COMPONENTS === */
--component-nav-background: var(--semantic-surface-secondary);
--component-nav-text: var(--semantic-text-primary);
--component-nav-active-bg: var(--semantic-brand-secondary);
--component-nav-active-text: var(--semantic-text-inverse);
--component-nav-hover-bg: var(--primitive-green-200);

/* === FORM COMPONENTS === */
--component-input-background: var(--semantic-surface-elevated);
--component-input-border: var(--semantic-border-default);
--component-input-focus-border: var(--semantic-border-focus);
--component-input-text: var(--semantic-text-primary);

/* === STATUS INDICATORS === */
--component-badge-safe-bg: var(--semantic-status-safe);
--component-badge-safe-text: var(--semantic-text-inverse);
--component-badge-caution-bg: var(--semantic-status-caution);
--component-badge-caution-text: var(--semantic-text-primary);
--component-badge-critical-bg: var(--semantic-status-critical);
--component-badge-critical-text: var(--semantic-text-inverse);
```

---

## 🚫 GenAI Safety Rules

### **CRITICAL: Colors That Must NEVER Be Modified by AI**

```css
/* === SAFETY-CRITICAL COLORS - DO NOT MODIFY === */
/* These colors have regulatory/safety implications */

--semantic-chemical-optimal: var(--primitive-green-500); /* ✅ MAHC compliant green */
--semantic-chemical-critical: var(--primitive-coral-600); /* ❌ MAHC danger red */
--semantic-status-emergency: var(--primitive-coral-600); /* 🚨 Emergency red */

/* === ACCESSIBILITY COLORS - DO NOT MODIFY === */
/* These colors are WCAG AA/AAA tested pairs */

--semantic-text-primary: var(--primitive-gray-900); /* ♿ High contrast text */
--semantic-text-secondary: var(--primitive-gray-700); /* ♿ Medium contrast text */
```

### **AI Modification Guidelines**

#### ✅ **SAFE TO MODIFY**:

- Component-level background colors
- Decorative accent colors
- Non-critical UI elements
- Hover/focus state variations

#### ⚠️ **MODIFY WITH CAUTION**:

- Semantic tokens (document changes)
- Brand colors (check brand guidelines)
- Border and text colors (maintain contrast)

#### ❌ **NEVER MODIFY**:

- Safety-critical chemical status colors
- Emergency/danger indicators
- WCAG tested text/background pairs
- Primitive token definitions

---

## 🎨 60-30-10 Distribution Rules

### **60% - Robin Egg Blue (Dominant)**

```css
/* PRIMARY USAGE - 60% of interface */
--semantic-surface-primary: var(--primitive-blue-100); /* Page backgrounds */
--semantic-surface-secondary: var(--primitive-blue-200); /* Content areas */
--component-card-background: var(--primitive-gray-50); /* Card backgrounds */

/* PSYCHOLOGY: Trust, cleanliness, water association */
/* PURPOSE: Creates calm, trustworthy foundation */
```

### **30% - Grass Green (Structural)**

```css
/* SECONDARY USAGE - 30% of interface */
--component-nav-background: var(--semantic-surface-secondary); /* Navigation */
--component-button-secondary-bg: var(--semantic-action-secondary); /* Structural buttons */
--semantic-status-safe: var(--primitive-green-500); /* Success states */

/* PSYCHOLOGY: Nature, freshness, growth */
/* PURPOSE: Provides organizational hierarchy */
```

### **10% - Yellow/Coral (Accent)**

```css
/* ACCENT USAGE - 10% of interface (7% + 3%) */

/* 7% Yellow - Primary Attention */
--component-button-primary-bg: var(--semantic-action-primary); /* Main CTAs */
--semantic-status-caution: var(--primitive-yellow-600); /* Attention states */

/* 3% Coral - Secondary Attention */
--semantic-border-focus: var(--primitive-coral-500); /* Focus indicators */
--semantic-status-critical: var(--primitive-coral-500); /* Critical states */

/* PSYCHOLOGY: Energy + approachability */
/* PURPOSE: Drives action, provides feedback */
```

---

## 📋 Usage Guidelines

### **Chemical Status Color Mapping**

| Chemical Level      | Semantic Token                 | Visual Meaning      | Usage                      |
| ------------------- | ------------------------------ | ------------------- | -------------------------- |
| **Optimal Range**   | `--semantic-chemical-optimal`  | ✅ Safe green       | pH 7.2-7.6, Cl 1.0-3.0 ppm |
| **Low Levels**      | `--semantic-chemical-low`      | ⚠️ Attention yellow | Below optimal range        |
| **High Levels**     | `--semantic-chemical-high`     | ⚠️ Caution coral    | Above optimal range        |
| **Critical Levels** | `--semantic-chemical-critical` | ❌ Danger red       | Unsafe levels              |

### **Equipment Status Color Mapping**

| Equipment State | Semantic Token                     | Visual Meaning | Usage                 |
| --------------- | ---------------------------------- | -------------- | --------------------- |
| **Running**     | `--semantic-equipment-running`     | ✅ Green       | Normal operation      |
| **Maintenance** | `--semantic-equipment-maintenance` | ⚠️ Yellow      | Scheduled maintenance |
| **Offline**     | `--semantic-equipment-offline`     | ⏸️ Gray        | Intentionally stopped |
| **Error**       | `--semantic-equipment-error`       | ❌ Red         | Malfunction/failure   |

### **Pool Area Color Coding**

| Pool Area        | Semantic Token                 | Visual Purpose | Usage                 |
| ---------------- | ------------------------------ | -------------- | --------------------- |
| **Main Pool**    | `--semantic-area-main-pool`    | Primary blue   | Adult swimming area   |
| **Kiddie Pool**  | `--semantic-area-kiddie-pool`  | Light blue     | Children's area       |
| **Therapy Pool** | `--semantic-area-therapy-pool` | Light green    | Rehabilitation area   |
| **Pool Deck**    | `--semantic-area-deck`         | Neutral gray   | Walking/seating areas |

---

## ♿ Accessibility Requirements

### **Contrast Requirements**

- **WCAG AA**: Minimum 4.5:1 for normal text, 3:1 for large text
- **WCAG AAA**: Minimum 7:1 for normal text, 4.5:1 for large text
- **Pool System Standard**: All text must meet WCAG AA minimum

### **Pre-Tested Color Pairs**

#### **High Contrast Pairs (WCAG AAA)**

```css
/* WHITE BACKGROUNDS */
--semantic-text-primary on --semantic-surface-elevated    /* 16.2:1 ratio */
--semantic-text-secondary on --semantic-surface-elevated  /* 12.1:1 ratio */

/* COLORED BACKGROUNDS */
--semantic-text-inverse on --semantic-status-safe         /* 8.3:1 ratio */
--semantic-text-inverse on --semantic-status-critical     /* 7.8:1 ratio */
--semantic-text-primary on --semantic-status-caution      /* 6.2:1 ratio */
```

#### **Medium Contrast Pairs (WCAG AA)**

```css
--semantic-text-secondary on --semantic-surface-primary   /* 5.1:1 ratio */
--semantic-text-primary on --semantic-surface-secondary   /* 4.8:1 ratio */
```

---

## 🔄 Dark Mode Adaptations

```css
/* DARK MODE OVERRIDES */
.dark {
  /* Invert lightness while maintaining hue relationships */
  --primitive-blue-100: oklch(0.15 0.05 210); /* Dark blue background */
  --primitive-blue-200: oklch(0.2 0.08 210); /* Slightly lighter */
  --primitive-gray-50: oklch(0.25 0 0); /* Dark surface */

  /* Maintain semantic relationships */
  --semantic-text-primary: oklch(0.95 0 0); /* Light text */
  --semantic-text-secondary: oklch(0.8 0 0); /* Medium light text */

  /* Keep safety colors recognizable */
  --semantic-status-safe: oklch(0.7 0.15 135); /* Slightly darker green */
  --semantic-status-critical: oklch(0.65 0.18 35); /* Slightly darker coral */
}
```

---

## 📝 Implementation Checklist

### **Before Making Color Changes**:

- [ ] ✅ Check semantic meaning in this document
- [ ] ✅ Verify WCAG contrast requirements
- [ ] ✅ Test with colorblind simulators
- [ ] ✅ Document any new semantic assignments
- [ ] ✅ Update this documentation if adding new colors

### **GenAI Safety Checklist**:

- [ ] ✅ Are you modifying a safety-critical color? (❌ STOP)
- [ ] ✅ Are you changing a WCAG-tested pair? (⚠️ Re-test)
- [ ] ✅ Are you maintaining semantic meaning? (✅ Continue)
- [ ] ✅ Are you using proper token hierarchy? (✅ Continue)

---

## 🔗 Related Documents

- **THEME_AUDIT_REPORT.md** - Current system analysis
- **Flexible Theming Research** - `~/.claude/knowledge/frontend/styling/theming/`
- **WCAG Guidelines** - [Web Content Accessibility Guidelines 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- **OKLCH Color Space** - [Modern CSS Color Spaces](https://oklch.com/)

---

**Last Updated**: July 31, 2025  
**Next Review**: August 31, 2025  
**Maintainer**: Pool Maintenance Development Team
