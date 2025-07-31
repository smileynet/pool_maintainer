# Pool Maintenance System - Claude Code Configuration

Project-specific Claude Code instructions for the pool maintenance data management system - a spreadsheet replacement that makes data entry, review, and management easier than traditional methods.

**Project Type**: Frontend Web Application (React 19 + TypeScript + Vite)  
**Last Updated**: 2025-07-31  
**Maintenance**: Quarterly review cycle

## 🚀 Quick Reference

### Development Commands

```bash
# Development
bun run dev          # Start dev server (http://localhost:5080, network accessible)
bun run storybook    # Start Storybook (http://localhost:6080, network accessible)

# Code Quality
bun run quality      # Run all quality checks (lint + format + typecheck)
bun run quality:fix  # Auto-fix issues and format code
bun run lint         # ESLint check
bun run lint:fix     # ESLint auto-fix
bun run format       # Prettier format
bun run type-check   # TypeScript check

# Testing
bun run test         # Unit tests with Vitest
bun run test:e2e     # End-to-end tests with Playwright
bun run test:visual  # Visual regression tests
bun run test:all     # All test suites

# Build & Deploy
bun run build        # Production build
bun run validate     # Full validation (quality + tests + build)
```

### Project Structure

```
src/
├── components/ui/           # shadcn/ui components with pool customizations
│   ├── *.stories.tsx       # Storybook documentation
│   └── *.tsx              # Component implementations
├── test/fixtures/          # Pool maintenance test data
├── utils/                  # Storybook decorators and utilities
├── stories/               # MDX documentation and guides
└── __tests__/             # Unit tests
```

## 🏊 Domain Context

### Pool Maintenance System Overview

Spreadsheet replacement system that digitizes pool maintenance workflows with better UX, validation, and data management:

- **Chemical Test Entry**: Fast, validated data entry with MAHC compliance checking
- **Data Persistence**: localStorage-based storage with CSV import/export for spreadsheet compatibility
- **Status Monitoring**: Real-time pool status dashboard derived from test data
- **Trend Analysis**: Visual charts showing chemical levels over time
- **Mobile-Friendly**: Responsive design for field technicians using tablets/phones

### Core Requirements

**CRITICAL**: This system replaces spreadsheets. Always ensure:

- **Faster Data Entry**: Chemical test form must be quicker than spreadsheet input
- **Better Data Review**: History browsing clearer than spreadsheet rows
- **Superior Visualization**: Status overview more informative than manual tracking
- **Data Validation**: Prevent errors that commonly occur in spreadsheets
- **Spreadsheet Compatibility**: Export functionality maintains CSV format compatibility

### Chemical Safety Ranges (MAHC Compliance)

- **Free Chlorine**: 1.0-3.0 ppm (ideal), 0.5-5.0 ppm (acceptable)
- **pH Level**: 7.2-7.6 (ideal), 7.0-8.0 (acceptable)
- **Total Alkalinity**: 80-120 ppm (ideal), 60-180 ppm (acceptable)
- **Temperature**: 78-82°F (ideal), 70-90°F (acceptable)

## 🛠️ Technology Stack

### Core Technologies

- **React 19**: Latest React with concurrent rendering
- **TypeScript**: Strict mode configuration
- **Vite 7.0.4**: Build tool with HMR
- **Tailwind CSS 4.1**: Utility-first styling
- **shadcn/ui**: Accessible component primitives
- **Bun**: JavaScript runtime and package manager

### Component Library

- **Storybook 8.6**: Component documentation with CSF3
- **React Hook Form + Zod**: Type-safe form validation
- **Recharts**: Data visualization for chemical trends
- **React Big Calendar**: Maintenance scheduling
- **Lucide React**: Icon system

### Quality Assurance

- **ESLint v9**: Flat configuration with React 19 rules
- **Prettier**: Code formatting with Tailwind sorting
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for pre-commit quality checks
- **Vitest**: Unit testing framework
- **Playwright**: E2E and visual regression testing

## 🎯 Development Standards

### Code Quality Requirements

```bash
# Quality checks (run before any commit)
bun run quality      # Run all checks
bun run quality:fix  # Auto-fix issues
bun run type-check   # TypeScript validation
```

### Implementation Principles

1. **Performance First**: Data entry must be faster than spreadsheets
2. **Validation Always**: Prevent common spreadsheet errors with MAHC validation
3. **Mobile Responsive**: All interfaces work on phones/tablets for field use
4. **Export Compatible**: Maintain CSV format for spreadsheet compatibility
5. **Offline Capable**: localStorage ensures functionality without internet

### Data Management Patterns

- Use `src/lib/localStorage.ts` for all data persistence operations
- Validate against `src/lib/mahc-validation.ts` for chemical safety
- Status indicators: Green (safe), Yellow (caution), Red (critical/emergency)
- Always provide clear error messages for validation failures
- Auto-save drafts to prevent data loss during field entry

## 📋 Project Status

- **Completed Work**: See `.claude/COMPLETED.md` for delivered features
- **Active Tasks**: See `.claude/PROJECT.md` for current sprint work
- **Future Plans**: See `.claude/ROADMAP.md` for long-term vision

The core spreadsheet replacement functionality is complete and operational.

## 🔧 Tool Configuration

### Allowed Tools

- **Package Manager**: bun (preferred), npm as fallback
- **Testing**: vitest, playwright, @testing-library
- **Build**: vite, tsc
- **Quality**: eslint, prettier, husky

### File Patterns

- **Components**: `src/components/ui/*.tsx`
- **Stories**: `src/components/ui/*.stories.tsx`
- **Tests**: `src/__tests__/**/*.test.tsx`
- **Types**: `src/types/*.ts`
- **Fixtures**: `src/test/fixtures/*.ts`

## 📝 Documentation Standards

### Storybook Requirements

- Use CSF3 format for all stories
- Include realistic pool maintenance scenarios
- Provide interactive controls for key props
- Document accessibility features
- Include usage examples with safety considerations

### Code Documentation

- TSDoc comments for complex functions
- README updates for new features
- Component prop documentation
- Safety-critical code must have detailed comments

## 🚨 Data Integrity & Validation

### Critical Rules

1. **Always Validate Input**: Use MAHC ranges to prevent dangerous chemical levels
2. **Never Lose Data**: Auto-save drafts, confirm before deletion
3. **Clear Visual Feedback**: Color-coded status for immediate understanding
4. **CSV Compatibility**: Maintain format compatibility for data portability
5. **Responsive Design**: Ensure all features work on mobile devices

### Error Handling

- Show clear validation messages during data entry
- Highlight out-of-range values with appropriate colors
- Provide CSV import error details with row numbers
- Never silently fail - always inform the user

## 🎨 UI/UX Guidelines

### Design System

- **Theme**: Electric Lagoon - vibrant, professional pool maintenance theme
- **Primary**: Blue tones for water/pool association
- **Success**: Green (#10b981) - safe chemical levels
- **Warning**: Yellow (#f59e0b) - caution required
- **Danger**: Red (#ef4444) - critical/emergency status

### Key UI Patterns

- Form fields with instant validation feedback
- Status cards showing at-a-glance pool health
- Filterable tables for efficient data browsing
- Interactive charts with reference lines for compliance
- Mobile-first responsive design for field use

## 🤖 Implementation Notes

### Key Files

- `src/lib/localStorage.ts` - Data persistence layer
- `src/lib/mahc-validation.ts` - Chemical safety validation
- `src/components/ui/chemical-test-form.tsx` - Primary data entry
- `src/components/ui/pool-status-dashboard.tsx` - Real-time monitoring
- `src/components/ui/chemical-trend-chart.tsx` - Trend visualization

### Testing Approach

```bash
bun run test         # Unit tests
bun run test:e2e     # End-to-end tests
bun run test:visual  # Visual regression
```

---

**Remember**: This system replaces spreadsheets. Every feature must be easier, faster, and more reliable than manual spreadsheet management. Focus on user workflow efficiency and data integrity above all else.
