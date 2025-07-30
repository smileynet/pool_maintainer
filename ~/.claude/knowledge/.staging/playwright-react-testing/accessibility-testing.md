# Accessibility Testing Integration

## Axe-Core Setup

```bash
npm install --save-dev @axe-core/playwright
```

## Test Utility Setup

```typescript
// tests/utils/accessibility.ts
import { test as base } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
    await use(makeAxeBuilder)
  },
})
```

## Basic Accessibility Testing

```typescript
import { test, expect } from '../utils/accessibility'

test('Homepage accessibility scan', async ({ page, makeAxeBuilder }) => {
  await page.goto('/')

  const accessibilityScanResults = await makeAxeBuilder().analyze()
  expect(accessibilityScanResults.violations).toEqual([])
})
```

## WCAG Compliance Testing

```typescript
test('WCAG 2.1 AA compliance', async ({ page, makeAxeBuilder }) => {
  await page.goto('/contact')

  const results = await makeAxeBuilder()
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})
```

## Keyboard Navigation Testing

```typescript
test('Keyboard navigation', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  let focusedElement = await page.locator(':focus').getAttribute('data-testid')
  expect(focusedElement).toBe('main-nav-link')

  // Test escape key functionality
  await page.getByRole('button', { name: 'Open Menu' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})
```
