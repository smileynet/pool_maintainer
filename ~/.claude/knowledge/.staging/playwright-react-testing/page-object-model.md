# Page Object Model Implementation

## Modern TypeScript POM Pattern

### Base Page Class

```typescript
// tests/pages/base-page.ts
import { Page, Locator } from '@playwright/test'

export abstract class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigate(path: string = '') {
    await this.page.goto(path)
  }

  // Common actions
  async clickButton(name: string) {
    await this.page.getByRole('button', { name }).click()
  }

  async fillInput(label: string, value: string) {
    await this.page.getByLabel(label).fill(value)
  }
}
```

### Specific Page Implementation

```typescript
// tests/pages/login-page.ts
export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = this.page.getByLabel('Email address')
    this.passwordInput = this.page.getByLabel('Password')
    this.loginButton = this.page.getByRole('button', { name: 'Sign In' })
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
```

## Best Practices 2024

1. **User-Centric Selectors**: Prefer `getByRole()`, `getByLabel()` over CSS selectors
2. **Component-Based**: Mirror your React component structure
3. **Async/Await**: All Playwright actions are asynchronous
4. **TypeScript**: Leverage strong typing for better maintainability
