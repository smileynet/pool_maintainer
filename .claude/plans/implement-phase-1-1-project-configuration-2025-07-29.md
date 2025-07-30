# Simplified Plan: Phase 1.1 Project Configuration

**Goal**: Set up React 19 + Vite + TypeScript + shadcn/ui development environment
**Core Deliverable**: Functional development environment with zero TypeScript errors
**Removed**: Business objectives, verbose context explanations, risk analysis prose

### Essential Tasks

**Required File Structure**:

```
pool_maintainer/
├── src/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── assets/
│   └── App.tsx
├── public/
├── .vscode/
├── config files (eslint, prettier, etc.)
└── package.json
```

**Success Criteria**:

- [ ] React 19 application renders without errors
- [ ] TypeScript strict mode enabled with zero errors
- [ ] shadcn/ui components can be imported and used
- [ ] Tailwind CSS classes apply correctly
- [ ] Absolute imports work (@components, @lib, @types)
- [ ] ESLint reports no violations
- [ ] Prettier formats code consistently
- [ ] Git hooks prevent commits with errors
- [ ] Development server starts in <5 seconds
- [ ] Hot reload responds in <200ms
- [ ] Build process completes without warnings

### Implementation Tasks

1. **Initialize project**
   - `npm create vite@latest . -- --template react-ts`
   - Initialize git repository

2. **Configure TypeScript**
   - Enable strict mode in tsconfig.json
   - Configure path aliases (@components, @lib, @types)
   - Set module resolution to "bundler"

3. **Install shadcn/ui**
   - `npx shadcn-ui@latest init`
   - Configure theme system with CSS variables

4. **Configure Tailwind CSS v4**
   - Update tailwind.config.js
   - Integrate CSS variables with shadcn/ui

5. **Create directory structure**
   - Create src/components, src/lib, src/types directories
   - Verify absolute import paths work

6. **Test shadcn/ui integration**
   - Install Button component
   - Render in App.tsx
   - Verify styling applies

7. **Configure development tools**
   - Install ESLint with TypeScript/React plugins
   - Configure .eslintrc.js
   - Install Prettier with .prettierrc
   - Configure VSCode settings

8. **Set up git hooks**
   - Install Husky and lint-staged
   - Configure pre-commit hooks
   - Test with sample commit

9. **Validate environment**
   - Test development server performance
   - Test build process
   - Verify zero TypeScript errors

### Dependencies

- Node.js 18+ and npm available
- Empty project directory
- After task 2 → task 3 (TypeScript config before shadcn/ui)
- After task 6 → task 7 (shadcn/ui working before dev tools)
- After task 8 → task 9 (git hooks before validation)
