# Pre-commit Hooks Guide

This guide explains the comprehensive pre-commit hook system that ensures code quality and maintainability in the Pool Maintenance application.

## Overview

Our pre-commit hooks provide multiple layers of quality checks before code reaches the repository:

1. **Code Formatting & Linting** - Automatic fixes and consistency
2. **Type Checking** - TypeScript safety validation  
3. **Unit Testing** - Catch regressions early
4. **Pool Safety Checks** - Domain-specific validation
5. **Maintainability Patterns** - Enforce architectural decisions
6. **Performance Validation** - Bundle size and optimization checks
7. **Documentation Consistency** - Keep docs in sync

## Architecture

### Husky Integration

```bash
# Managed by Husky v9
/.husky/
  ├── _/                    # Husky internals
  └── pre-commit           # Main pre-commit script
```

### Lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write", 
      "bash -c 'bunx tsc --noEmit --skipLibCheck'"
    ],
    "*.{json,css,md,yml,yaml}": ["prettier --write"],
    "*.stories.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "**/CLAUDE.md": ["prettier --write --parser markdown"]
  }
}
```

## Quality Check Stages

### 1. Code Formatting & Linting

**What it does:**
- Auto-fixes code style issues with Prettier
- Runs ESLint with auto-fix for maintainability patterns
- Enforces zero warnings policy
- Type checks all TypeScript files

**Example output:**
```bash
🔍 Running lint-staged (formatting & linting)...
✓ Fixed 3 style issues
✓ Auto-fixed 2 ESLint warnings
✓ All files formatted consistently
```

**How to handle failures:**
```bash
# Fix most issues automatically
npm run lint:fix
npm run format

# For stubborn issues
npm run quality:fix
```

### 2. Type Checking

**What it does:**
- Validates TypeScript compilation without emitting files
- Catches type errors before commit
- Uses `--skipLibCheck` for performance

**Example output:**
```bash
🔧 Type checking TypeScript files...
✓ No TypeScript errors found
```

**How to handle failures:**
```bash
# Run type check manually to see detailed errors
npm run type-check

# Common fixes
# - Add missing type annotations
# - Fix import paths
# - Update interface definitions
```

### 3. Unit Testing

**What it does:**
- Runs Vitest test suite in silent mode
- 60-second timeout to prevent hanging
- Ensures new changes don't break existing functionality

**Example output:**
```bash
🧪 Running unit tests...
✓ 47 tests passed (2.3s)
```

**How to handle failures:**
```bash
# Run tests with verbose output
npm test

# Run specific test file
npm test src/components/ui/button.test.tsx

# Update snapshots if needed
npm test -- --update-snapshots
```

### 4. Pool Safety Checks

**What it does:**
- Validates chemical reading components for safety compliance
- Scans for potential sensitive data in commits
- Ensures pool-related components follow safety patterns

**Example output:**
```bash
🏊 Pool maintenance safety checks...
📋 Validating chemical reading components for safety compliance...
✓ No safety issues detected
```

**Sensitive data detection:**
- Blocks commits containing: `password`, `secret`, `api_key`, `token`, `chemical_formula`
- Excludes test, mock, and story files from scanning

### 5. Maintainability Pattern Validation

**What it does:**
- Checks for proper use of common props interfaces
- Suggests custom hooks for data fetching patterns
- Validates lazy loading implementation
- Ensures component complexity guidelines

**Example output:**
```bash
🔧 Maintainability pattern validation...
🏗️  Checking component complexity and patterns...
💡 Consider extending common props interfaces in src/components/NewComponent.tsx
💡 Consider using custom hooks (useFetchData) for data fetching patterns
```

**Common suggestions:**
```typescript
// Instead of manual state management
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)

// Use custom hooks
const { data, loading, error } = useFetchData(fetchFn)

// Instead of basic lazy loading  
const MyComponent = lazy(() => import('./MyComponent'))

// Use enhanced lazy loading
const LazyMyComponent = createLazyRoute(() => import('./MyComponent'))
```

### 6. Performance Validation

**What it does:**
- Monitors changes to main application files
- Tracks source directory size
- Suggests bundle size considerations

**Example output:**
```bash
📊 Performance validation...
🎯 Main application files changed - consider impact on bundle size
📏 Current source size: 2.1M
```

**Performance considerations:**
- App.tsx changes affect initial bundle
- main.tsx changes affect startup performance
- Large components should be lazy-loaded

### 7. Documentation Consistency

**What it does:**
- Validates markdown files for consistency
- Checks for potential broken links
- Ensures component exports are documented

**Example output:**
```bash
📚 Documentation validation...
📖 Markdown files changed - checking for broken links...
🔗 Component files changed - validating exports...
💡 Consider adding proper exports in NewComponent.tsx
```

## Configuration Examples

### Customizing Checks

#### Modify Timeout Values
```bash
# In .husky/pre-commit
timeout 120s bunx vitest run --silent  # Increase test timeout
```

#### Add Custom Validations
```bash
# Pool-specific validation example
if git diff --cached --name-only | grep -E "chemical.*\.tsx$"; then
    echo "🧪 Validating chemical component safety..."
    # Custom validation logic
fi
```

#### Skip Specific Checks
```bash
# Skip tests for documentation-only commits
if git diff --cached --name-only | grep -v "\.md$" | grep -q "."; then
    echo "🧪 Running unit tests..."
    timeout 60s bunx vitest run --silent
fi
```

### Environment-Specific Settings

#### Development
```bash
# Faster checks for development
export NODE_ENV=development
timeout 30s bunx vitest run --silent --reporter=dot
```

#### CI/CD Integration
```bash
# More thorough checks in CI
if [ "$CI" = "true" ]; then
    bunx vitest run --coverage
    bunx build # Test production build
fi
```

## Bypassing Hooks

### When to Skip

**Legitimate cases:**
- Emergency hotfixes
- Work-in-progress commits (WIP)
- Experimental branches
- Large refactoring that temporarily breaks tests

### How to Skip

```bash
# Skip all pre-commit hooks
git commit --no-verify -m "Emergency fix: prevent pool overflow"

# Skip specific hooks (not recommended)
SKIP=lint-staged git commit -m "WIP: refactoring in progress"
```

### Best Practices for Skipping

1. **Document why** in commit message
2. **Fix issues** in follow-up commits
3. **Don't skip** for normal development
4. **Review carefully** before pushing

## Troubleshooting

### Common Issues

#### Hook Script Permissions
```bash
# Fix permission issues
chmod +x .husky/pre-commit
```

#### Path Issues
```bash
# Ensure tools are in PATH
which bunx || npm install -g bun
which git || echo "Git not found"
```

#### Memory Issues
```bash
# Increase Node.js memory for large projects
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### Timeout Issues
```bash
# Increase timeouts for slow systems
timeout 120s bunx vitest run --silent
timeout 60s bunx build-storybook --quiet
```

### Debugging Hooks

#### Verbose Output
```bash
# Add debugging to .husky/pre-commit
set -x  # Enable debug mode
echo "DEBUG: Processing file: $file"
```

#### Test Individual Steps
```bash
# Test lint-staged
bunx lint-staged

# Test type checking
bunx tsc --noEmit --skipLibCheck

# Test unit tests
bunx vitest run --silent
```

#### Check Staged Files
```bash
# See what files would be processed
git diff --cached --name-only
git diff --cached --stat
```

## Performance Optimization

### Parallel Processing

```bash
# Run independent checks in parallel
{
    echo "Type checking..." && bunx tsc --noEmit --skipLibCheck &
    echo "Testing..." && bunx vitest run --silent &
    wait
} || handle_error "Parallel checks failed"
```

### Incremental Checks

```bash
# Only check changed files
CHANGED_TS_FILES=$(git diff --cached --name-only | grep -E "\.(ts|tsx)$")
if [ ! -z "$CHANGED_TS_FILES" ]; then
    bunx eslint $CHANGED_TS_FILES
fi
```

### Caching

```bash
# Cache test results
export VITEST_CACHE=true
bunx vitest run --silent --cache-dir=.cache/vitest
```

## Metrics and Monitoring

### Hook Performance

```bash
# Add timing to hooks
START_TIME=$(date +%s)
# ... hook logic ...
END_TIME=$(date +%s)
echo "Hook completed in $((END_TIME - START_TIME)) seconds"
```

### Quality Metrics

Track over time:
- Average hook execution time
- Failure rate by check type
- Most common failure reasons
- Code quality improvements

### Reporting

```json
{
  "hook_execution": {
    "timestamp": "2024-01-15T10:30:00Z",
    "duration_seconds": 45,
    "checks_passed": 7,
    "checks_failed": 0,
    "files_processed": 12,
    "suggestions_made": 2
  }
}
```

## Team Workflow

### Onboarding

1. **Install dependencies**: `npm install`
2. **Prepare hooks**: `npm run prepare`
3. **Test commit**: Make small change and commit
4. **Verify setup**: Hooks should run automatically

### Code Review Process

1. **Pre-commit checks** ensure basic quality
2. **CI/CD pipeline** runs extended tests
3. **Manual review** focuses on logic and design
4. **Merge requirements** include passing all checks

### Maintenance

#### Weekly Tasks
- Review hook performance metrics
- Update timeout values if needed
- Add new pattern checks as team learns

#### Monthly Tasks  
- Review and update quality rules
- Optimize hook performance
- Update documentation

## Integration with IDE

### VS Code Settings

```json
{
  "git.enableCommitSigning": true,
  "git.alwaysSignOff": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### Pre-commit Extensions

Useful VS Code extensions:
- ESLint
- Prettier
- TypeScript Importer
- GitLens
- Error Lens

## Advanced Configuration

### Custom Validators

```bash
# Domain-specific validation function
validate_chemical_safety() {
    local file=$1
    if grep -q "dangerous\|toxic\|hazard" "$file"; then
        echo "⚠️  Review chemical safety in $file"
    fi
}
```

### Integration Testing

```bash
# Test component integration
if git diff --cached --name-only | grep -E "components.*\.tsx$"; then
    echo "🔗 Testing component integration..."
    bunx vitest run --testNamePattern="integration"
fi
```

### Security Scanning

```bash
# Additional security checks
if command -v audit-ci >/dev/null 2>&1; then
    echo "🔒 Running security audit..."
    bunx audit-ci --moderate
fi
```

## Future Enhancements

1. **AI-powered code review** integration
2. **Performance regression detection**
3. **Automated dependency updates**
4. **Advanced security scanning**
5. **Custom rule suggestions** based on codebase patterns

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Pool Maintenance Safety Standards](docs/safety-standards.md)