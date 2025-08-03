import { test, expect } from '@playwright/test';

test.describe('Site Crawl Debug Analysis', () => {
  let consoleErrors: string[] = [];
  let networkErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`Console Error: ${msg.text()}`);
      }
    });

    // Capture network errors
    page.on('response', (response) => {
      if (!response.ok()) {
        networkErrors.push(`Network Error: ${response.status()} ${response.statusText()} - ${response.url()}`);
      }
    });

    // Capture page errors
    page.on('pageerror', (exception) => {
      consoleErrors.push(`Page Error: ${exception.message}`);
    });
  });

  test('should load main page without errors', async ({ page }) => {
    console.log('=== STARTING SITE CRAWL DEBUG ===');
    
    // Navigate to main page
    console.log('Navigating to http://localhost:5080...');
    await page.goto('http://localhost:5080');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Check if page loaded
    console.log('Page title:', await page.title());
    
    // Check for basic elements
    const bodyExists = await page.locator('body').isVisible();
    console.log('Body element visible:', bodyExists);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'main-page-debug.png', fullPage: true });
    
    // Log any errors found so far
    if (consoleErrors.length > 0) {
      console.log('=== CONSOLE ERRORS FOUND ===');
      consoleErrors.forEach(error => console.log(error));
    }
    
    if (networkErrors.length > 0) {
      console.log('=== NETWORK ERRORS FOUND ===');
      networkErrors.forEach(error => console.log(error));
    }
    
    // Check for React/Vite specific elements
    const reactRoot = await page.locator('#root').isVisible();
    console.log('React root element visible:', reactRoot);
    
    if (reactRoot) {
      const rootContent = await page.locator('#root').innerHTML();
      console.log('Root content length:', rootContent.length);
      if (rootContent.length < 100) {
        console.log('Root content (might be empty):', rootContent);
      }
    }
  });

  test('should test navigation tabs', async ({ page }) => {
    console.log('=== TESTING NAVIGATION ===');
    
    await page.goto('http://localhost:5080');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Look for navigation elements
    const navElements = await page.locator('nav, [role="navigation"], [data-testid*="nav"], .nav').count();
    console.log('Navigation elements found:', navElements);
    
    // Look for tab-like elements
    const tabElements = await page.locator('[role="tab"], .tab, [data-testid*="tab"]').count();
    console.log('Tab elements found:', tabElements);
    
    // Look for buttons or links that might be navigation
    const buttons = await page.locator('button, a').count();
    console.log('Buttons/links found:', buttons);
    
    // Try to find specific tab names
    const tabNames = ['Overview', 'Pool Facilities', 'Test History', 'Analytics'];
    for (const tabName of tabNames) {
      const tabExists = await page.getByText(tabName).count() > 0;
      console.log(`Tab "${tabName}" found:`, tabExists);
      
      if (tabExists) {
        try {
          await page.getByText(tabName).first().click({ timeout: 1000 });
          await page.waitForTimeout(500);
          console.log(`Successfully clicked "${tabName}" tab`);
        } catch (error) {
          console.log(`Failed to click "${tabName}" tab:`, error.message);
        }
      }
    }
    
    // Log any new errors
    if (consoleErrors.length > 0) {
      console.log('=== NAVIGATION ERRORS ===');
      consoleErrors.forEach(error => console.log(error));
    }
  });

  test('should check mobile responsiveness', async ({ page }) => {
    console.log('=== TESTING MOBILE RESPONSIVENESS ===');
    
    await page.goto('http://localhost:5080');
    await page.waitForLoadState('domcontentloaded');
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      console.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({ 
        path: `responsiveness-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: true 
      });
      
      // Check if content is visible
      const bodyVisible = await page.locator('body').isVisible();
      console.log(`Body visible on ${viewport.name}:`, bodyVisible);
    }
  });

  test.afterEach(async () => {
    // Final error summary
    if (consoleErrors.length > 0 || networkErrors.length > 0) {
      console.log('\n=== FINAL ERROR SUMMARY ===');
      console.log('Total console errors:', consoleErrors.length);
      console.log('Total network errors:', networkErrors.length);
      
      console.log('\nAll errors:');
      [...consoleErrors, ...networkErrors].forEach(error => console.log('- ' + error));
    } else {
      console.log('\n=== NO ERRORS DETECTED ===');
    }
  });
});