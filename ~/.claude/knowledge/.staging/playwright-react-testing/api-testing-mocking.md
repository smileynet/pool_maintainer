# API Testing and Mocking with Playwright

## Basic API Mocking

```typescript
test('Mock user API responses', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    const json = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]
    await route.fulfill({ json })
  })

  await page.goto('/users')
  await expect(page.getByText('John Doe')).toBeVisible()
})
```

## Dynamic Response Mocking

```typescript
test('Mock API with conditional responses', async ({ page }) => {
  let callCount = 0

  await page.route('**/api/data', async (route) => {
    callCount++

    if (callCount === 1) {
      await route.fulfill({
        status: 202,
        json: { status: 'processing' },
      })
    } else {
      await route.fulfill({
        json: { status: 'complete', data: [1, 2, 3] },
      })
    }
  })
})
```

## HAR File Mocking

```typescript
test('Use HAR file for API responses', async ({ page }) => {
  await page.routeFromHAR('./tests/fixtures/api-responses.har', {
    url: '**/api/**',
    update: false,
  })

  await page.goto('/')
  // All API calls use recorded responses
})
```

## Direct API Testing

```typescript
test('Direct API endpoint testing', async ({ request }) => {
  const response = await request.get('/api/users')

  expect(response.status()).toBe(200)

  const users = await response.json()
  expect(users).toHaveLength.greaterThan(0)
  expect(users[0]).toHaveProperty('id')
})
```

## Centralized Mock Management

```typescript
// tests/mocks/api-mocks.ts
export class MockApiService {
  static async setupUserMocks(page: Page) {
    await page.route('**/api/users', (route) => {
      route.fulfill({ json: mockUsers })
    })
  }
}
```
