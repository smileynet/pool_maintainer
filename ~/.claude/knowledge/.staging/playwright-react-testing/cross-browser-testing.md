# Cross-Browser Testing Strategies

## Browser Configuration Matrix

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
})
```

## Browser-Specific Handling

```typescript
test('File upload across browsers', async ({ page, browserName }) => {
  await page.goto('/upload')

  const fileInput = page.getByLabel('Select file')

  if (browserName === 'webkit') {
    // Safari-specific handling
    await fileInput.setInputFiles('./test-file.pdf')
  } else {
    // Chrome/Firefox handling
    await fileInput.setInputFiles('./test-file.pdf')
  }

  await expect(page.getByText('File uploaded')).toBeVisible()
})
```

## Mobile Testing

```typescript
test('Mobile navigation menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  // Mobile menu collapsed initially
  await expect(page.getByTestId('mobile-menu')).not.toBeVisible()

  // Click hamburger menu
  await page.getByRole('button', { name: 'Menu' }).tap()
  await expect(page.getByTestId('mobile-menu')).toBeVisible()
})
```

## Touch Gestures

```typescript
test('Touch interactions', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/gallery')

  // Swipe gesture simulation
  const startX = 300,
    endX = 100,
    y = 400

  await page.touchscreen.tap(startX, y)
  await page.mouse.move(startX, y)
  await page.mouse.down()
  await page.mouse.move(endX, y)
  await page.mouse.up()

  await expect(page.getByTestId('next-image')).toBeVisible()
})
```

## Feature Detection

```typescript
test('Browser feature compatibility', async ({ page, browserName }) => {
  await page.goto('/features')

  const supportsGrid = await page.evaluate(() => {
    return CSS.supports('display', 'grid')
  })

  expect(supportsGrid).toBe(true)

  // Browser-specific performance thresholds
  const performanceThresholds = {
    chromium: 2000,
    firefox: 2500,
    webkit: 3000,
  }

  const threshold = performanceThresholds[browserName] || 3000
  // Use threshold in performance assertions...
})
```
