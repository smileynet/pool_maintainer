# Pool Maintenance System - Claude Code Configuration

Project-specific Claude Code instructions for the community pool maintenance and scheduling management system.

**Project Type**: Frontend Web Application (React 19 + TypeScript + Storybook)  
**Last Updated**: 2025-07-30  
**Maintenance**: Update with each phase completion

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

Community pool maintenance and scheduling management platform focusing on:

- **Chemical Management**: Water quality monitoring and MAHC compliance
- **Maintenance Scheduling**: Task assignment and completion tracking
- **Staff Management**: Technician scheduling and certification tracking
- **Safety Compliance**: Real-time monitoring and emergency response
- **Reporting**: Analytics and compliance audit trails

### Safety-Critical Features

**IMPORTANT**: This system manages public safety. Always prioritize:

- Chemical level validation (MAHC compliance ranges)
- Emergency response workflows
- Staff certification requirements
- Audit trail completeness
- Real-time alert systems

### Chemical Safety Ranges (MAHC Compliance)

- **Free Chlorine**: 1.0-3.0 ppm (critical below 0.5 ppm)
- **pH Level**: 7.2-7.6 (optimal for chlorine effectiveness)
- **Total Alkalinity**: 80-120 ppm (pH stability)
- **Temperature**: Monitor for comfort and chemical effectiveness

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
# Pre-commit checks (automated via Husky)
bun run lint:fix         # Must pass with 0 errors
bun run format           # Auto-format all files
bun run type-check       # Must pass strict TypeScript
```

### Component Development

1. **shadcn/ui First**: Use existing components, customize for pool maintenance
2. **Story-Driven Development**: Create Storybook stories with realistic pool data
3. **Accessibility**: WCAG 2.1 AA compliance required
4. **Type Safety**: Full TypeScript coverage with strict mode
5. **Testing**: Unit tests for logic, visual tests for UI

### Pool Maintenance Patterns

- Use `src/test/fixtures/pool-maintenance-data.ts` for realistic test data
- Follow MAHC guidelines for chemical validation
- Include safety status indicators in all pool-related components
- Use consistent color coding: Green (safe), Yellow (caution), Red (critical)
- Implement proper error boundaries for safety-critical operations

## 📋 Project Phases

### ✅ Phase 1.1: Foundation (COMPLETED)

- [x] Vite + React 19 + TypeScript setup
- [x] shadcn/ui integration
- [x] Tailwind CSS configuration
- [x] Basic project structure

### ✅ Phase 1.2: Quality Infrastructure (COMPLETED)

- [x] ESLint v9 with flat configuration
- [x] Prettier with Tailwind CSS plugin
- [x] Husky git hooks setup
- [x] TypeScript strict mode
- [x] Testing framework setup (Vitest + Playwright)

### ✅ Phase 1.3: Storybook Documentation (COMPLETED)

- [x] Storybook 8.6 configuration
- [x] CSF3 story format setup
- [x] Component documentation infrastructure
- [x] Pool maintenance test data fixtures
- [x] Comprehensive component library:
  - [x] Button, Input, Select, Badge components
  - [x] Card, Form patterns, Dialog components
  - [x] Navigation, Table, Chart components
  - [x] Calendar scheduling components
- [x] MDX documentation guides
- [x] Network accessibility (dev:5080, storybook:6080)

### 🚧 Phase 2.1: Core Pool Management (NEXT)

- [ ] Pool facility management components
- [ ] Real-time chemical monitoring interface
- [ ] Safety alert system
- [ ] Basic dashboard layout

### 📋 Phase 2.2: Task Management

- [ ] Maintenance task scheduling
- [ ] Technician assignment interface
- [ ] Task completion tracking
- [ ] Priority-based task queuing

### 📋 Phase 2.3: Advanced Features

- [ ] Chemical trend analysis
- [ ] Compliance reporting
- [ ] Emergency response workflows
- [ ] Mobile-responsive technician interface

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

## 🚨 Safety & Compliance

### Critical Validation Rules

1. **Chemical Levels**: Always validate against MAHC ranges
2. **Emergency Alerts**: Immediate UI feedback for critical values
3. **Audit Trails**: Log all chemical readings and maintenance actions
4. **Staff Certification**: Verify technician qualifications for tasks
5. **Equipment Safety**: Include safety checks in maintenance workflows

### Error Handling

- Fail safely for chemical monitoring systems
- Provide clear error messages for safety violations
- Implement proper fallbacks for critical operations
- Log all safety-related errors for audit purposes

## 🎨 UI/UX Guidelines

### Pool Maintenance Design System

- **Primary Color**: Sky blue (#0ea5e9) - water/cleanliness
- **Success**: Emerald (#10b981) - safe conditions
- **Warning**: Amber (#f59e0b) - caution states
- **Danger**: Red (#ef4444) - critical alerts

### Component Patterns

- Status badges with color coding
- Chemical reading displays with range indicators
- Emergency action buttons (prominent, accessible)
- Technician assignment interfaces
- Time-sensitive task indicators

## 🤖 Claude Code Integration

### Hooks Configuration

```json
{
  "pre-commit": "bun run quality:fix && bun run test:run",
  "pre-push": "bun run validate:full"
}
```

### Custom Commands

- Monitor pool safety compliance in code changes
- Validate chemical range calculations
- Check accessibility compliance
- Verify test coverage for safety-critical components

---

**Remember**: This system manages public pool safety. Always prioritize safety compliance, proper validation, and emergency response capabilities in all development decisions.
