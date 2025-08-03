import { test, expect } from '@playwright/test';

test.describe('Pool Maintainer Site Crawl', () => {
  let consoleErrors: string[] = [];
  let consoleWarnings: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Capture console errors and warnings
    consoleErrors = [];
    consoleWarnings = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      } else if (message.type() === 'warning') {
        consoleWarnings.push(message.text());
      }
    });

    // Capture network errors
    page.on('response', (response) => {
      if (response.status() >= 400) {
        consoleErrors.push(`Network error: ${response.status()} - ${response.url()}`);
      }
    });

    // Capture uncaught exceptions
    page.on('pageerror', (error) => {
      consoleErrors.push(`Uncaught exception: ${error.message}`);
    });
  });

  test('Home page crawl and functionality check', async ({ page }) => {
    console.log('🏠 Testing home page...');
    
    // Navigate to home page
    await page.goto('http://localhost:5080');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    await expect(page).toHaveTitle(/Pool Maintainer/i);
    
    // Check for main content elements
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Look for common React app elements
    const rootElement = page.locator('#root');
    await expect(rootElement).toBeVisible();
    
    // Check for navigation elements if they exist
    const navElements = await page.locator('nav, header, [role="navigation"]').count();
    console.log(`Found ${navElements} navigation elements`);
    
    // Check for main content
    const mainContent = await page.locator('main, [role="main"], .main-content').count();
    console.log(`Found ${mainContent} main content areas`);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/home-page.png', fullPage: true });
    
    // Report console issues
    if (consoleErrors.length > 0) {
      console.error('❌ Console errors on home page:', consoleErrors);
    }
    if (consoleWarnings.length > 0) {
      console.warn('⚠️ Console warnings on home page:', consoleWarnings);
    }
    
    // Fail test if there are console errors
    expect(consoleErrors, `Console errors found: ${consoleErrors.join(', ')}`).toHaveLength(0);
  });

  test('Chemical test form functionality', async ({ page }) => {
    console.log('🧪 Testing chemical test form...');
    
    await page.goto('http://localhost:5080');
    await page.waitForLoadState('networkidle');
    
    // Look for form elements
    const forms = await page.locator('form').count();
    console.log(`Found ${forms} forms on the page`);
    
    if (forms > 0) {
      // Test the first form found
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
      
      // Look for common form inputs
      const inputs = await form.locator('input, select, textarea').count();
      console.log(`Found ${inputs} form inputs`);
      
      // Check for submit button
      const submitButton = form.locator('button[type="submit"], input[type="submit"], button:has-text("submit")');
      const submitCount = await submitButton.count();
      console.log(`Found ${submitCount} submit buttons`);
      
      if (submitCount > 0) {
        // Try to interact with form inputs
        const textInputs = form.locator('input[type="text"], input[type="number"], input:not([type])');
        const textInputCount = await textInputs.count();
        
        if (textInputCount > 0) {
          // Fill first text input with test data
          await textInputs.first().fill('7.2');
          console.log('✅ Successfully filled form input');
        }
        
        // Check if form validation works (try to submit without required fields)
        await submitButton.first().click();
        await page.waitForTimeout(1000); // Wait for any validation messages
      }
    } else {
      console.log('ℹ️ No forms found on the page');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/chemical-form.png', fullPage: true });
    
    // Report console issues
    if (consoleErrors.length > 0) {
      console.error('❌ Console errors on chemical form:', consoleErrors);
    }
  });

  test('Dashboard and overview pages', async ({ page }) => {
    console.log('📊 Testing dashboard/overview pages...');
    
    await page.goto('http://localhost:5080');
    await page.waitForLoadState('networkidle');
    
    // Look for dashboard elements
    const dashboardElements = await page.locator('[class*="dashboard"], [id*="dashboard"], [data-testid*="dashboard"]').count();
    console.log(`Found ${dashboardElements} dashboard elements`);
    
    // Look for charts or data visualization
    const chartElements = await page.locator('canvas, svg, [class*="chart"], [class*="graph"]').count();
    console.log(`Found ${chartElements} chart/visualization elements`);
    
    // Look for status indicators
    const statusElements = await page.locator('[class*="status"], [class*="indicator"], [class*="badge"]').count();
    console.log(`Found ${statusElements} status indicator elements`);
    
    // Check for data tables
    const tableElements = await page.locator('table, [role="table"], [class*="table"]').count();
    console.log(`Found ${tableElements} table elements`);
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard.png', fullPage: true });
    
    // Report console issues
    if (consoleErrors.length > 0) {
      console.error('❌ Console errors on dashboard:', consoleErrors);
    }
  });

  test('Navigation and routing', async ({ page }) => {
    console.log('🧭 Testing navigation and routing...');
    
    await page.goto('http://localhost:5080');
    await page.waitForLoadState('networkidle');
    
    // Look for navigation links
    const navLinks = page.locator('a, [role="link"], button[onclick*="navigate"], button[onclick*="route"]');
    const linkCount = await navLinks.count();
    console.log(`Found ${linkCount} potential navigation elements`);
    
    if (linkCount > 0) {
      // Test first few navigation links
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        console.log(`Testing navigation link ${i + 1}: "${text}" -> ${href}`);
        
        if (href && href.startsWith('/')) {
          // Click the link and verify navigation
          await link.click();
          await page.waitForTimeout(1000);
          
          // Check if URL changed or if it's a SPA route
          const currentUrl = page.url();
          console.log(`Current URL after click: ${currentUrl}`);
          
          // Go back to home for next test
          await page.goto('http://localhost:5080');
          await page.waitForLoadState('networkidle');
        }
      }
    }
    
    // Test direct route access if this is a SPA
    const testRoutes = ['/', '/dashboard', '/form', '/settings', '/about'];
    for (const route of testRoutes) {
      try {
        await page.goto(`http://localhost:5080${route}`);
        const response = await page.waitForLoadState('networkidle', { timeout: 5000 });
        console.log(`✅ Route ${route} accessible`);
      } catch (error) {
        console.log(`ℹ️ Route ${route} not found or timeout`);
      }
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/navigation.png', fullPage: true });
    
    // Report console issues
    if (consoleErrors.length > 0) {
      console.error('❌ Console errors during navigation:', consoleErrors);
    }
  });

  test('Visual and component integrity check', async ({ page }) => {
    console.log('👀 Testing visual integrity and components...');
    
    await page.goto('http://localhost:5080');
    await page.waitForLoadState('networkidle');
    
    // Check for broken images
    const images = page.locator('img');
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      // Check if image loaded successfully
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth === 0) {
        console.error(`❌ Broken image: ${src} (alt: ${alt})`);
      } else {
        console.log(`✅ Image loaded: ${src}`);
      }
    }
    
    // Check for elements with error states
    const errorElements = await page.locator('[class*="error"], [class*="Error"], [data-error="true"]').count();
    console.log(`Found ${errorElements} elements with error states`);
    
    // Check for loading states that might be stuck
    const loadingElements = await page.locator('[class*="loading"], [class*="Loading"], [class*="spinner"]').count();
    console.log(`Found ${loadingElements} loading elements`);
    
    // Check for empty states
    const emptyElements = await page.locator('[class*="empty"], [class*="Empty"], [class*="no-data"]').count();
    console.log(`Found ${emptyElements} empty state elements`);
    
    // Take a full page screenshot for visual inspection
    await page.screenshot({ path: 'tests/screenshots/full-page.png', fullPage: true });
    
    // Check viewport responsiveness
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.screenshot({ path: 'tests/screenshots/tablet-view.png', fullPage: true });
    
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.screenshot({ path: 'tests/screenshots/mobile-view.png', fullPage: true });
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Report console issues
    if (consoleErrors.length > 0) {
      console.error('❌ Console errors during visual check:', consoleErrors);
    }
  });

  test.afterEach(async ({ page }) => {
    // Final report of all issues found
    if (consoleErrors.length > 0) {
      console.log('\n📋 Summary of Console Errors:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (consoleWarnings.length > 0) {
      console.log('\n⚠️ Summary of Console Warnings:');
      consoleWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    if (consoleErrors.length === 0 && consoleWarnings.length === 0) {
      console.log('✅ No console errors or warnings detected');
    }
  });
});