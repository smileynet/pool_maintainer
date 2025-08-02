import puppeteer from 'puppeteer';

(async () => {
  console.log('🔍 Testing Docker deployment at http://localhost:8080...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // Test 1: Basic page load
    console.log('✅ Test 1: Basic page load');
    const response = await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle2' 
    });
    console.log(`   Status: ${response.status()}`);
    console.log(`   OK: ${response.ok()}`);
    
    // Test 2: Check title
    console.log('\n✅ Test 2: Page title');
    const title = await page.title();
    console.log(`   Title: ${title}`);
    
    // Test 3: Check main content
    console.log('\n✅ Test 3: Main content');
    const mainHeading = await page.$eval('h1', el => el.textContent);
    console.log(`   Main heading: ${mainHeading}`);
    
    // Test 4: Navigation tabs
    console.log('\n✅ Test 4: Navigation tabs');
    const navButtons = await page.$$eval('nav button', buttons => 
      buttons.map(btn => btn.textContent.trim())
    );
    console.log(`   Tabs found: ${navButtons.join(', ')}`);
    
    // Test 5: Click navigation
    console.log('\n✅ Test 5: Navigation functionality');
    await page.click('nav button:has-text("Pool Facilities")');
    await page.waitForTimeout(1000);
    const facilityHeading = await page.$eval('h2', el => el.textContent).catch(() => 'Not found');
    console.log(`   Pool Facilities heading: ${facilityHeading}`);
    
    // Test 6: Console errors
    console.log('\n✅ Test 6: Console errors');
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    if (errors.length > 0) {
      console.log(`   ❌ Found ${errors.length} console errors:`);
      errors.forEach(err => console.log(`      - ${err.text}`));
    } else {
      console.log('   ✅ No console errors');
    }
    
    // Test 7: Asset loading
    console.log('\n✅ Test 7: Asset loading');
    const jsFiles = await page.$$eval('script[src]', scripts => 
      scripts.map(s => s.src)
    );
    console.log(`   JS files loaded: ${jsFiles.length}`);
    
    const cssFiles = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(l => l.href)
    );
    console.log(`   CSS files loaded: ${cssFiles.length}`);
    
    // Test 8: Performance metrics
    console.log('\n✅ Test 8: Performance metrics');
    const metrics = await page.metrics();
    console.log(`   JS Heap Used: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Nodes: ${metrics.Nodes}`);
    
    // Test 9: Response headers
    console.log('\n✅ Test 9: Security headers');
    const headers = response.headers();
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'content-security-policy'
    ];
    
    securityHeaders.forEach(header => {
      if (headers[header]) {
        console.log(`   ✅ ${header}: ${headers[header].substring(0, 50)}...`);
      } else {
        console.log(`   ❌ ${header}: Missing`);
      }
    });
    
    console.log('\n🎉 Docker deployment test complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();