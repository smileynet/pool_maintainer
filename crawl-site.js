#!/usr/bin/env node

/**
 * Simple site crawler to check for errors and functionality
 * This script will crawl the development site and report issues
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SiteCrawler {
  constructor() {
    this.baseUrl = 'http://localhost:5080';
    this.errors = [];
    this.warnings = [];
    this.issues = [];
    this.screenshotDir = 'tests/screenshots';
  }

  async init() {
    // Ensure screenshot directory exists
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    this.browser = await puppeteer.launch({ 
      headless: true, // Set to true for CI environments
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    this.page = await this.browser.newPage();

    // Set up error handling
    this.page.on('console', (message) => {
      const type = message.type();
      const text = message.text();
      
      if (type === 'error') {
        this.errors.push(`Console Error: ${text}`);
        console.error('❌ Console Error:', text);
      } else if (type === 'warning') {
        this.warnings.push(`Console Warning: ${text}`);
        console.warn('⚠️ Console Warning:', text);
      }
    });

    this.page.on('response', (response) => {
      if (response.status() >= 400) {
        const error = `HTTP ${response.status()}: ${response.url()}`;
        this.errors.push(error);
        console.error('❌ HTTP Error:', error);
      }
    });

    this.page.on('pageerror', (error) => {
      const errorMsg = `Page Error: ${error.message}`;
      this.errors.push(errorMsg);
      console.error('❌ Page Error:', errorMsg);
    });
  }

  async crawlHomePage() {
    console.log('🏠 Crawling home page...');
    
    try {
      const response = await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
      if (!response.ok()) {
        this.errors.push(`Failed to load home page: ${response.status()}`);
        return;
      }

      // Check page title
      const title = await this.page.title();
      console.log(`📄 Page title: ${title}`);

      // Check for main content
      const bodyContent = await this.page.$eval('body', el => el.innerText.length);
      if (bodyContent < 100) {
        this.issues.push('Page body content seems too short (< 100 characters)');
      }

      // Check for React root
      const reactRoot = await this.page.$('#root');
      if (!reactRoot) {
        this.issues.push('React root element (#root) not found');
      }

      // Take screenshot
      await this.page.screenshot({ path: path.join(this.screenshotDir, 'home-page.png'), fullPage: true });
      console.log('✅ Home page screenshot taken');

    } catch (error) {
      this.errors.push(`Home page crawl failed: ${error.message}`);
    }
  }

  async testChemicalForm() {
    console.log('🧪 Testing chemical form...');
    
    try {
      // Look for forms on the page
      const forms = await this.page.$$('form');
      console.log(`📋 Found ${forms.length} forms`);

      if (forms.length > 0) {
        // Test the first form
        const form = forms[0];
        
        // Look for input fields
        const inputs = await form.$$('input, select, textarea');
        console.log(`📝 Found ${inputs.length} form inputs`);

        // Try to fill inputs with test data
        for (let i = 0; i < Math.min(3, inputs.length); i++) {
          const input = inputs[i];
          const type = await input.evaluate(el => el.type);
          const name = await input.evaluate(el => el.name || el.id);
          
          console.log(`Testing input: ${name} (type: ${type})`);
          
          if (type === 'text' || type === 'number' || !type) {
            await input.type('7.2');
          } else if (type === 'email') {
            await input.type('test@example.com');
          }
        }

        // Look for submit button
        const submitButton = await form.$('button[type="submit"], input[type="submit"], button:contains("submit")');
        if (submitButton) {
          console.log('🔘 Found submit button, testing form submission...');
          await submitButton.click();
          await this.page.waitForTimeout(2000); // Wait for any validation messages
        }
      } else {
        this.issues.push('No forms found on the page');
      }

      await this.page.screenshot({ path: path.join(this.screenshotDir, 'chemical-form.png'), fullPage: true });

    } catch (error) {
      this.errors.push(`Chemical form test failed: ${error.message}`);
    }
  }

  async testNavigation() {
    console.log('🧭 Testing navigation...');
    
    try {
      // Look for navigation elements
      const navElements = await this.page.$$('nav a, [role="navigation"] a, button[onclick*="navigate"], [data-testid*="nav"]');
      console.log(`🔗 Found ${navElements.length} navigation elements`);

      // Also look for buttons that might be tabs or navigation
      const tabButtons = await this.page.$$('button[role="tab"], [role="tablist"] button, button:contains("Overview"), button:contains("Pool"), button:contains("History")');
      console.log(`📑 Found ${tabButtons.length} potential tab buttons`);

      // Test clicking on tab buttons if they exist
      if (tabButtons.length > 0) {
        for (let i = 0; i < Math.min(3, tabButtons.length); i++) {
          const button = tabButtons[i];
          const text = await button.evaluate(el => el.textContent?.trim());
          console.log(`Testing tab: ${text}`);
          
          await button.click();
          await this.page.waitForTimeout(1000);
          
          // Take screenshot after clicking
          await this.page.screenshot({ 
            path: path.join(this.screenshotDir, `tab-${i}-${text?.replace(/[^a-zA-Z0-9]/g, '-')}.png`),
            fullPage: true 
          });
        }
      }

      await this.page.screenshot({ path: path.join(this.screenshotDir, 'navigation.png'), fullPage: true });

    } catch (error) {
      this.errors.push(`Navigation test failed: ${error.message}`);
    }
  }

  async testResponsiveness() {
    console.log('📱 Testing responsiveness...');
    
    try {
      // Test tablet view
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(1000);
      await this.page.screenshot({ path: path.join(this.screenshotDir, 'tablet-view.png'), fullPage: true });

      // Test mobile view
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.waitForTimeout(1000);
      await this.page.screenshot({ path: path.join(this.screenshotDir, 'mobile-view.png'), fullPage: true });

      // Reset to desktop
      await this.page.setViewport({ width: 1280, height: 720 });
      await this.page.waitForTimeout(1000);

    } catch (error) {
      this.errors.push(`Responsiveness test failed: ${error.message}`);
    }
  }

  async checkImages() {
    console.log('🖼️ Checking images...');
    
    try {
      const images = await this.page.$$('img');
      console.log(`🖼️ Found ${images.length} images`);

      for (const img of images) {
        const src = await img.evaluate(el => el.src);
        const alt = await img.evaluate(el => el.alt);
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        
        if (naturalWidth === 0) {
          this.issues.push(`Broken image: ${src} (alt: ${alt})`);
        } else {
          console.log(`✅ Image loaded: ${src}`);
        }
      }

    } catch (error) {
      this.errors.push(`Image check failed: ${error.message}`);
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.baseUrl,
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        issues: this.issues.length
      },
      errors: this.errors,
      warnings: this.warnings,
      issues: this.issues
    };

    // Save report as JSON
    await fs.writeFile('crawl-report.json', JSON.stringify(report, null, 2));

    // Generate human-readable report
    let textReport = `
🔍 Site Crawl Report
====================
🕐 Timestamp: ${report.timestamp}
🌐 URL: ${report.url}

📊 Summary:
- ❌ Errors: ${report.summary.errors}
- ⚠️ Warnings: ${report.summary.warnings}
- ℹ️ Issues: ${report.summary.issues}

`;

    if (this.errors.length > 0) {
      textReport += `\n❌ ERRORS:\n`;
      this.errors.forEach((error, index) => {
        textReport += `${index + 1}. ${error}\n`;
      });
    }

    if (this.warnings.length > 0) {
      textReport += `\n⚠️ WARNINGS:\n`;
      this.warnings.forEach((warning, index) => {
        textReport += `${index + 1}. ${warning}\n`;
      });
    }

    if (this.issues.length > 0) {
      textReport += `\nℹ️ ISSUES:\n`;
      this.issues.forEach((issue, index) => {
        textReport += `${index + 1}. ${issue}\n`;
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0 && this.issues.length === 0) {
      textReport += `\n✅ No significant issues found!\n`;
    }

    textReport += `\n📸 Screenshots saved in: ${this.screenshotDir}/\n`;

    await fs.writeFile('crawl-report.txt', textReport);
    console.log(textReport);

    return report;
  }

  async crawl() {
    try {
      await this.init();
      
      console.log('🚀 Starting site crawl...');
      
      await this.crawlHomePage();
      await this.testChemicalForm();
      await this.testNavigation();
      await this.testResponsiveness();
      await this.checkImages();
      
      const report = await this.generateReport();
      
      return report;
      
    } catch (error) {
      console.error('💥 Crawl failed:', error);
      this.errors.push(`Crawl system error: ${error.message}`);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the crawler
async function main() {
  const crawler = new SiteCrawler();
  await crawler.crawl();
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default SiteCrawler;