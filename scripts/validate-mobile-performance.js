#!/usr/bin/env node

/**
 * Mobile Performance Validation Script
 * Validates that the mobile-first implementation meets performance criteria
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance thresholds
const THRESHOLDS = {
  cssSize: 100 * 1024, // 100KB uncompressed
  cssGzipSize: 20 * 1024, // 20KB gzipped
  touchTargetSize: 44, // 44px minimum
  transitionDuration: 300, // 300ms max for mobile
  viewportBreakpoints: {
    mobile: 640,
    tablet: 1024,
  },
};

// Validation results
const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// Check CSS bundle size
function checkCSSBundleSize() {
  const distPath = path.join(__dirname, '../dist/assets');
  
  if (!fs.existsSync(distPath)) {
    results.warnings.push('No dist directory found. Run `npm run build` first.');
    return;
  }
  
  const cssFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = stats.size / 1024;
    
    if (stats.size <= THRESHOLDS.cssSize) {
      results.passed.push(`✅ CSS bundle size: ${sizeKB.toFixed(2)} KB (under ${THRESHOLDS.cssSize / 1024} KB)`);
    } else {
      results.failed.push(`❌ CSS bundle too large: ${sizeKB.toFixed(2)} KB (limit: ${THRESHOLDS.cssSize / 1024} KB)`);
    }
  });
}

// Check for mobile-first media queries
function checkMobileFirstApproach() {
  const cssPath = path.join(__dirname, '../src/styles');
  
  if (!fs.existsSync(cssPath)) {
    results.warnings.push('No styles directory found.');
    return;
  }
  
  const cssFiles = fs.readdirSync(cssPath).filter(f => f.endsWith('.css'));
  let mobileFirstCount = 0;
  let desktopFirstCount = 0;
  
  cssFiles.forEach(file => {
    const content = fs.readFileSync(path.join(cssPath, file), 'utf8');
    
    // Check for min-width (mobile-first)
    const minWidthMatches = content.match(/@media.*min-width/g) || [];
    mobileFirstCount += minWidthMatches.length;
    
    // Check for max-width (desktop-first - should be minimal)
    const maxWidthMatches = content.match(/@media.*max-width/g) || [];
    desktopFirstCount += maxWidthMatches.length;
  });
  
  if (mobileFirstCount > desktopFirstCount) {
    results.passed.push(`✅ Mobile-first approach confirmed (${mobileFirstCount} min-width vs ${desktopFirstCount} max-width queries)`);
  } else {
    results.warnings.push(`⚠️  Consider more mobile-first queries (${mobileFirstCount} min-width vs ${desktopFirstCount} max-width)`);
  }
}

// Check for touch-friendly sizing
function checkTouchTargets() {
  const componentsPath = path.join(__dirname, '../src/components/ui');
  
  if (!fs.existsSync(componentsPath)) {
    results.warnings.push('No components directory found.');
    return;
  }
  
  const componentFiles = fs.readdirSync(componentsPath).filter(f => f.endsWith('.tsx'));
  let touchOptimized = 0;
  
  componentFiles.forEach(file => {
    const content = fs.readFileSync(path.join(componentsPath, file), 'utf8');
    
    // Check for min-height: 44px or min-h-[44px]
    if (content.includes('min-h-[44px]') || content.includes('min-height: 44px')) {
      touchOptimized++;
    }
  });
  
  if (touchOptimized > 0) {
    results.passed.push(`✅ Found ${touchOptimized} components with touch-friendly sizing`);
  } else {
    results.warnings.push('⚠️  Consider adding min-height: 44px to interactive elements');
  }
}

// Check for performance optimizations
function checkPerformanceOptimizations() {
  const checks = [
    {
      name: 'CSS containment',
      pattern: /contain:|will-change:/,
      file: 'src/styles/glassmorphism.css',
    },
    {
      name: 'Reduced motion support',
      pattern: /prefers-reduced-motion/,
      file: 'src/styles/micro-interactions.css',
    },
    {
      name: 'Touch device detection',
      pattern: /pointer:\s*coarse/,
      file: 'src/styles/micro-interactions.css',
    },
    {
      name: 'Fluid typography',
      pattern: /clamp\(/,
      file: 'src/styles/modern-typography.css',
    },
  ];
  
  checks.forEach(check => {
    const filePath = path.join(__dirname, '..', check.file);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (check.pattern.test(content)) {
        results.passed.push(`✅ ${check.name} implemented in ${check.file}`);
      } else {
        results.warnings.push(`⚠️  Consider implementing ${check.name} in ${check.file}`);
      }
    }
  });
}

// Check theme system
function checkThemeSystem() {
  const themeProvider = path.join(__dirname, '../src/components/ui/theme-provider.tsx');
  
  if (fs.existsSync(themeProvider)) {
    const content = fs.readFileSync(themeProvider, 'utf8');
    
    if (content.includes('isMobile')) {
      results.passed.push('✅ Mobile detection implemented in theme provider');
    }
    
    if (content.includes('localStorage')) {
      results.passed.push('✅ Theme persistence implemented');
    }
    
    if (content.includes('prefers-color-scheme')) {
      results.passed.push('✅ System theme preference support');
    }
  }
}

// Run all checks
console.log('🔍 Mobile Performance Validation\n');

checkCSSBundleSize();
checkMobileFirstApproach();
checkTouchTargets();
checkPerformanceOptimizations();
checkThemeSystem();

// Display results
console.log('\n📊 Results Summary:\n');

if (results.passed.length > 0) {
  console.log('✅ Passed Checks:');
  results.passed.forEach(msg => console.log(`   ${msg}`));
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  results.warnings.forEach(msg => console.log(`   ${msg}`));
}

if (results.failed.length > 0) {
  console.log('\n❌ Failed Checks:');
  results.failed.forEach(msg => console.log(`   ${msg}`));
}

// Summary
const totalChecks = results.passed.length + results.failed.length + results.warnings.length;
const score = (results.passed.length / totalChecks * 100).toFixed(0);

console.log(`\n🎯 Overall Score: ${score}% (${results.passed.length}/${totalChecks} checks passed)`);

// Exit with appropriate code
process.exit(results.failed.length > 0 ? 1 : 0);