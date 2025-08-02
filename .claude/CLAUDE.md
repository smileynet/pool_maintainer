# Pool Maintenance System - Claude Code Configuration

Project-specific Claude Code instructions for the pool maintenance data management system - a spreadsheet replacement that makes data entry, review, and management easier than traditional methods.

**Project Type**: Frontend Web Application (React 19 + TypeScript + Vite)  
**Last Updated**: 2025-07-31  
**Maintenance**: Quarterly review cycle

## 🚀 Quick Reference

### Immediate Actions

- **New feature?** → Check PROJECT.md for priority order
- **Build failing?** → Run `bun run quality:fix` then check TypeScript errors
- **Performance issue?** → Bundle must stay under 500KB gzipped
- **Data loss risk?** → All changes must go through localStorage.ts

### Essential Commands

```bash
# Most Used
bun run dev          # Start dev server (http://localhost:5080)
bun run quality:fix  # Auto-fix all code issues before commit
bun run build        # Check production bundle size

# Testing
bun run test         # Unit tests with Vitest
bun run test:e2e     # End-to-end tests with Playwright (critical for runtime errors)

# Full Validation
bun run validate     # Run everything (quality + tests + build)
```

### Dev Server Ports

- **Development**: http://localhost:5080
- **Storybook**: http://localhost:6080

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

## 🎯 Core Development Principles

### 1. Performance First

- **Bundle size limit**: 500KB gzipped maximum ✅ (currently 68.52 kB - optimized)
- **Load time target**: Under 2 seconds on 3G connection ✅ (3x faster than before)
- **Lazy loading**: Implemented for all heavy components (charts, facilities, history)
- **Measure impact**: Check bundle size with every feature addition

### 2. Data Integrity Above All

- **Never lose user data**: Auto-save drafts, confirm deletions
- **Validate on input**: MAHC compliance checking in real-time
- **Clear error messages**: Tell users exactly what's wrong and how to fix it
- **Offline-first**: All features must work without internet connection

### 3. Spreadsheet Replacement Standards

- **Faster entry**: Every form must be quicker than spreadsheet input
- **Better review**: Search/filter must beat manual spreadsheet scrolling
- **CSV compatibility**: Import/export must handle common spreadsheet formats
- **Mobile-ready**: Field technicians use phones/tablets in wet conditions

## 🔧 Technical Standards

### Code Quality Gates

```bash
# Pre-commit requirements (enforced by Husky)
bun run quality:fix  # Must pass with 0 errors
bun run type-check   # No TypeScript errors allowed
bun run test         # All tests must pass
```

### Implementation Rules

- **TypeScript strict mode**: Zero `any` types, explicit return types
- **Component size limit**: 250 lines max (refactor larger components)
- **localStorage only**: All data operations through `src/lib/localStorage.ts`
- **MAHC validation**: Use `src/lib/mahc-validation.ts` for all chemical ranges
- **Error boundaries**: Wrap all data operations to prevent crashes

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

## 📊 Definition of Done

A feature is complete when:

- ✅ **Faster than spreadsheets** - Measured and verified
- ✅ **Works offline** - Service worker caches all assets
- ✅ **Mobile tested** - Verified on actual phone/tablet
- ✅ **No data loss** - Draft saving and recovery tested
- ✅ **Bundle size checked** - Under 500KB gzipped target
- ✅ **TypeScript strict** - Zero errors, no `any` types
- ✅ **Tests pass** - Unit, E2E, and visual regression
- ✅ **Accessible** - WCAG AA compliance verified

## 🚧 When Blocked

If you encounter blockers:

1. **Document clearly** in PROJECT.md with:
   - What you tried
   - Why current solutions compromise quality
   - What's needed to unblock
2. **Find alternative work** - Check PROJECT.md for unblocked tasks
3. **Never compromise quality** - Better to stop than ship broken code

---

**Remember**: This system replaces spreadsheets. Every feature must be easier, faster, and more reliable than manual spreadsheet management. Focus on user workflow efficiency and data integrity above all else.
