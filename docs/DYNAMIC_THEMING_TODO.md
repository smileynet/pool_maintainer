# Dynamic Theming Implementation - Granular Todo List

## Phase 1: Foundation Setup (Critical Path)

### 1.1 Color System Architecture
- [ ] Research OKLCH color space and tooling
- [ ] Install color conversion utilities (culori)
- [ ] Create color palette with OKLCH values
  - [ ] Define primary color ramp (50-950)
  - [ ] Define neutral/gray ramp
  - [ ] Define semantic colors (success, warning, error, info)
  - [ ] Calculate contrast ratios for all combinations
- [ ] Document color design decisions

### 1.2 CSS Variable Structure
- [ ] Create `src/styles/theme-tokens.css`
  - [ ] Define Layer 1: Raw OKLCH values (lightness, chroma, hue)
  - [ ] Define Layer 2: Semantic color tokens
  - [ ] Define Layer 3: Component-specific tokens
- [ ] Create `src/styles/theme-light.css`
  - [ ] Map all semantic tokens to light values
  - [ ] Define component tokens for light theme
- [ ] Create `src/styles/theme-dark.css`
  - [ ] Map all semantic tokens to dark values
  - [ ] Ensure proper contrast ratios (WCAG AA minimum)
  - [ ] Define component tokens for dark theme
- [ ] Update `src/index.css` to import theme files

### 1.3 Tailwind Configuration
- [ ] Update `tailwind.config.js` to use CSS variables
  - [ ] Configure colors to reference CSS variables
  - [ ] Add theme-specific utility classes
  - [ ] Configure dark mode to use `class` strategy
- [ ] Test Tailwind IntelliSense with CSS variables
- [ ] Verify build process handles CSS variables correctly

## Phase 2: Theme Infrastructure

### 2.1 React Context Setup
- [ ] Create `src/contexts/theme-context.tsx`
  - [ ] Define ThemeContext interface
  - [ ] Implement ThemeProvider component
  - [ ] Add theme state (light/dark/system)
  - [ ] Add resolved theme state
- [ ] Create `src/hooks/use-theme.ts`
  - [ ] Implement useTheme hook
  - [ ] Add type safety
  - [ ] Include theme setter function
- [ ] Wrap App component with ThemeProvider

### 2.2 System Preference Detection
- [ ] Add matchMedia listener for `prefers-color-scheme`
- [ ] Implement system theme resolution logic
- [ ] Handle matchMedia listener cleanup
- [ ] Test system preference changes
- [ ] Add fallback for browsers without matchMedia

### 2.3 Theme Persistence
- [ ] Implement localStorage read/write for theme
- [ ] Add theme key constant
- [ ] Handle localStorage errors gracefully
- [ ] Sync localStorage across tabs/windows
- [ ] Add migration for old theme values

### 2.4 FOUC Prevention
- [ ] Create inline script for `public/index.html`
  - [ ] Read theme from localStorage
  - [ ] Check system preference
  - [ ] Apply data-theme attribute
- [ ] Test script execution timing
- [ ] Verify no flash on page refresh
- [ ] Test with slow network conditions

## Phase 3: Component Architecture

### 3.1 Install Dependencies
- [ ] Install class-variance-authority (CVA)
- [ ] Install @radix-ui/react-icons for theme toggle
- [ ] Update package.json scripts if needed
- [ ] Verify no version conflicts

### 3.2 Create Base Variants
- [ ] Create `src/lib/variants.ts`
  - [ ] Define shared variant configurations
  - [ ] Create type definitions
  - [ ] Export variant helpers
- [ ] Document variant naming conventions

### 3.3 Convert Button Component
- [ ] Backup existing Button component
- [ ] Create buttonVariants with CVA
  - [ ] Define size variants (sm, md, lg)
  - [ ] Define style variants (default, outline, ghost, destructive)
  - [ ] Add theme-aware color mappings
- [ ] Update Button component to use variants
- [ ] Test all button combinations
- [ ] Update Button stories in Storybook

### 3.4 Convert Card Components
- [ ] Create cardVariants configuration
- [ ] Update Card, CardHeader, CardContent, CardFooter
- [ ] Add elevation/shadow variants
- [ ] Test nested card scenarios
- [ ] Update Card stories

### 3.5 Convert Badge Component
- [ ] Create badgeVariants with status colors
- [ ] Ensure proper contrast in all themes
- [ ] Add size variants
- [ ] Test with different content lengths
- [ ] Update Badge stories

### 3.6 Convert Input Components
- [ ] Create inputVariants for form controls
- [ ] Update Input, Textarea, Select components
- [ ] Handle focus states across themes
- [ ] Test form validation states
- [ ] Update form component stories

## Phase 4: Theme Toggle Implementation

### 4.1 Create Theme Toggle Component
- [ ] Design toggle UI (dropdown vs button group)
- [ ] Create `src/components/ui/theme-toggle.tsx`
  - [ ] Add icons for light/dark/system
  - [ ] Implement toggle logic
  - [ ] Add keyboard navigation
  - [ ] Include ARIA labels
- [ ] Style active state indicators
- [ ] Add transition animations

### 4.2 Integrate Theme Toggle
- [ ] Add ThemeToggle to app header
- [ ] Position appropriately on mobile/desktop
- [ ] Test toggle functionality
- [ ] Verify theme persistence
- [ ] Add tooltips for clarity

## Phase 5: Advanced Theme Features

### 5.1 Theme Transition Handling
- [ ] Create `src/hooks/use-theme-transition.ts`
- [ ] Disable transitions during theme switch
- [ ] Re-enable after theme applied
- [ ] Test with complex animations
- [ ] Handle interrupted transitions

### 5.2 Component-Level Optimizations
- [ ] Audit all components for re-render issues
- [ ] Add React.memo where appropriate
- [ ] Memoize theme-dependent calculations
- [ ] Use useMemo for className generation
- [ ] Profile performance improvements

### 5.3 Pool-Specific Theming
- [ ] Create pool status color variants
  - [ ] Safe (green) theme colors
  - [ ] Warning (yellow) theme colors
  - [ ] Critical (red) theme colors
- [ ] Ensure accessibility in both themes
- [ ] Test with color blindness simulators

## Phase 6: Testing & Validation

### 6.1 Accessibility Testing
- [ ] Install axe-core for testing
- [ ] Create contrast ratio test suite
- [ ] Test all color combinations
  - [ ] Text on backgrounds
  - [ ] Interactive elements
  - [ ] Disabled states
- [ ] Generate accessibility report
- [ ] Fix any failing contrasts

### 6.2 Visual Regression Testing
- [ ] Set up Percy or similar tool
- [ ] Capture baseline screenshots
- [ ] Test all components in both themes
- [ ] Test theme transition states
- [ ] Document visual test process

### 6.3 Cross-Browser Testing
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test CSS variable support
- [ ] Test system preference detection
- [ ] Document any browser-specific issues

### 6.4 Performance Testing
- [ ] Measure theme switch time
- [ ] Profile React DevTools
- [ ] Check bundle size impact
- [ ] Test with React Profiler
- [ ] Optimize if >16ms switch time

## Phase 7: Documentation & Polish

### 7.1 Developer Documentation
- [ ] Create `docs/THEMING.md`
  - [ ] Explain architecture
  - [ ] Document color system
  - [ ] Provide component examples
  - [ ] Include troubleshooting
- [ ] Add inline code comments
- [ ] Update component prop documentation

### 7.2 Storybook Integration
- [ ] Add theme switcher to Storybook
- [ ] Create theme documentation stories
- [ ] Show all variants in both themes
- [ ] Add accessibility annotations
- [ ] Include usage examples

### 7.3 Migration Guide
- [ ] Document breaking changes
- [ ] Provide migration scripts
- [ ] List deprecated patterns
- [ ] Include before/after examples

## Phase 8: Edge Cases & Polish

### 8.1 Handle Edge Cases
- [ ] Test with JavaScript disabled
- [ ] Handle missing localStorage
- [ ] Test in private browsing
- [ ] Handle theme conflicts
- [ ] Test with browser extensions

### 8.2 Advanced Features
- [ ] Add theme preview on hover
- [ ] Implement custom theme creator
- [ ] Add high contrast theme option
- [ ] Create theme export/import
- [ ] Add theme scheduling (auto dark at night)

### 8.3 Final Polish
- [ ] Optimize CSS output size
- [ ] Remove unused variables
- [ ] Minify theme switching code
- [ ] Add error boundaries
- [ ] Final accessibility audit

## Success Metrics

- [ ] Theme switch completes in <16ms
- [ ] Zero FOUC on page load/refresh
- [ ] 100% WCAG AA contrast compliance
- [ ] <5KB additional bundle size
- [ ] Works in 95%+ browsers
- [ ] Zero accessibility violations
- [ ] Smooth transitions without jank

## Notes

- Start with Phase 1-2 for MVP
- Phase 3-4 can be done incrementally
- Phase 5-8 are enhancements
- Test each phase thoroughly before moving on
- Keep bundle size in mind throughout