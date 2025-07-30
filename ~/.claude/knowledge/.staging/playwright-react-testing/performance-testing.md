# Performance Testing Approaches

## Lighthouse Integration

```bash
npm install --save-dev playwright-lighthouse lighthouse
```

```typescript
import { playAudit } from 'playwright-lighthouse'

test('Homepage performance audit', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Lighthouse only supports Chromium')

  await page.goto('/')

  await playAudit({
    page,
    thresholds: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
    reports: {
      formats: { html: true, json: true },
      name: 'homepage-audit',
      directory: './lighthouse-reports',
    },
  })
})
```

## Core Web Vitals Monitoring

```typescript
test('Core Web Vitals measurement', async ({ page }) => {
  await page.goto('/')

  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      let metrics = {}

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.lcp = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      setTimeout(() => resolve(metrics), 3000)
    })
  })

  expect(webVitals.lcp).toBeLessThan(2500) // 2.5s threshold
})
```

## Network Throttling

```typescript
test('Performance with slow network', async ({ page }) => {
  const client = await page.context().newCDPSession(page)
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (500 * 1024) / 8, // 500 Kbps
    uploadThroughput: (500 * 1024) / 8,
    latency: 400, // 400ms
  })

  const startTime = Date.now()
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const loadTime = Date.now() - startTime

  expect(loadTime).toBeLessThan(5000)
})
```

## Memory Usage Monitoring

```typescript
test('Memory usage tracking', async ({ page }) => {
  const initialMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0
  })

  // Perform memory-intensive operations
  await page.getByRole('button', { name: 'Load Data' }).click()

  const finalMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0
  })

  const memoryIncrease = finalMemory - initialMemory
  expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // 50MB limit
})
```
