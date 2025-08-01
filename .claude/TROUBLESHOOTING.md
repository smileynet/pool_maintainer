# Pool Maintenance System - Troubleshooting Guide

## CI/CD Issues

### Package Manager Issues

#### Current Setup: Hybrid Bun + npm Approach

The project uses a hybrid approach for optimal performance and compatibility:

- **Bun**: Fast dependency installation (`bun install`)
- **npm**: Test execution for DOM testing compatibility (`npm test`)

This provides the best of both worlds: Bun's 10-30x faster installation with npm's stable test environment.

#### Node.js Fallback Option

If Bun continues to have issues or compatibility problems, you can fallback to a pure Node.js setup:

##### 1. Update GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'

# Remove Bun setup steps and use npm for everything
- name: Install dependencies
  run: npm ci

- name: Run unit tests
  run: npm test
```

##### 2. Local Development Fallback

```bash
# If Bun is causing issues locally:
rm -rf node_modules bun.lockb
npm install

# Use npm for all commands
npm test
npm run dev
npm run build
```

##### 3. Package.json Scripts

All scripts are already compatible with npm, so no changes needed.

#### Performance Comparison

- **Bun install**: ~10-30x faster than npm
- **npm install**: More stable, better ecosystem compatibility
- **Test execution**: Similar performance with both package managers

#### When to Use Node.js Fallback

- Bun installation issues in CI
- Dependency compatibility problems
- Team standardization requirements
- Corporate environments with npm-only policies

## Test Issues

### E2E Tests Timing Out

If E2E tests timeout, check:

1. Port configuration in `playwright.config.ts` (should be 5080)
2. Dev server startup in GitHub Actions
3. Network connectivity in CI environment

### Unit Tests Failing with DOM Errors

The hybrid approach should resolve DOM testing issues. If problems persist:

1. Verify `npm test` is used instead of `bun test`
2. Check Vitest configuration includes jsdom environment
3. Ensure proper test setup files are loaded

## Build Issues

### TypeScript Compilation Errors

- Use `npm run type-check` for consistent behavior
- Verify `tsconfig.json` includes all necessary files
- Check for version compatibility between TypeScript and dependencies

## Development Environment

### IDE Integration

- VS Code works best with npm for IntelliSense
- Configure workspace to use npm if Bun causes issues
- Use npm scripts in IDE task configurations

### Debugging

- Use browser DevTools for frontend debugging
- Use `npm run test:ui` for interactive test debugging
- Enable source maps for production debugging if needed

## Performance Optimization

### Current Optimizations

1. **Hybrid package manager**: Fast installation + stable execution
2. **Port optimization**: Correct ports for all services
3. **Caching**: GitHub Actions caches dependencies
4. **Parallel testing**: Multiple browser testing in E2E

### Additional Optimizations Available

1. **Test sharding**: Split tests across multiple jobs
2. **Conditional execution**: Skip tests for unrelated changes
3. **Browser optimization**: Cache Playwright browsers
4. **Resource optimization**: Right-size CI runners

## Support

### Getting Help

- Check this troubleshooting guide first
- Review GitHub Actions logs for specific errors
- Use `--verbose` flags for detailed debugging output
- Consider the Node.js fallback for immediate stability

### Reporting Issues

When reporting CI/CD issues, include:

1. GitHub Actions run URL
2. Specific error messages
3. Steps to reproduce locally
4. Node.js and package manager versions
