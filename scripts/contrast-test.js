#!/usr/bin/env node

/**
 * WCAG Contrast Testing for Pool Maintenance System
 * 
 * Tests all color combinations in the unified token system for WCAG AA/AAA compliance.
 * Supports both OKLCH and HSL color formats.
 * 
 * Usage:
 *   node scripts/contrast-test.js [--report=json|console] [--standard=AA|AAA]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { oklch, hsl, rgb, formatHex } from 'culori';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Calculate relative luminance according to WCAG 2.1
 * @param {string} color - Hex color string
 * @returns {number} - Relative luminance value (0-1)
 */
function getRelativeLuminance(color) {
  const rgbColor = rgb(color);
  if (!rgbColor) return 0;
  
  const { r, g, b } = rgbColor;
  
  // Convert to linear RGB
  const toLinear = (val) => {
    const normalized = val;
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);
  
  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} - Contrast ratio (1-21)
 */
function calculateContrastRatio(color1, color2) {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Configuration
const CONFIG = {
  standard: process.argv.find(arg => arg.startsWith('--standard='))?.split('=')[1] || 'AA',
  reportType: process.argv.find(arg => arg.startsWith('--report='))?.split('=')[1] || 'console',
  minContrast: {
    'AA': { normal: 4.5, large: 3.0 },
    'AAA': { normal: 7.0, large: 4.5 }
  }
};

/**
 * Parse OKLCH color string to hex
 * @param {string} oklchString - OKLCH color string like "oklch(0.7 0.15 180)"
 * @returns {string|null} - Hex color or null if invalid
 */
function parseOklchToHex(oklchString) {
  try {
    const match = oklchString.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*(?:\/\s*([0-9.]+))?\s*\)/);
    if (!match) {
      console.warn(`No match for OKLCH pattern: ${oklchString}`);
      return null;
    }
    
    const [, l, c, h, alpha] = match;
    const lValue = parseFloat(l);
    const cValue = parseFloat(c);
    const hValue = parseFloat(h);
    
    const color = oklch({
      l: lValue,
      c: cValue,
      h: hValue,
      alpha: alpha ? parseFloat(alpha) : 1
    });
    
    const hex = formatHex(color);
    
    // Validate the result
    if (!hex || hex === '#000000' && lValue > 0.5) {
      console.warn(`Suspicious conversion result: ${oklchString} -> ${hex}`);
      return null;
    }
    
    return hex;
  } catch (error) {
    console.warn(`Failed to parse OKLCH color: ${oklchString}`, error.message);
    return null;
  }
}

/**
 * Parse HSL color string to hex
 * @param {string} hslString - HSL color string like "210 40% 98%" or "hsl(210, 40%, 98%)"
 * @returns {string|null} - Hex color or null if invalid
 */
function parseHslToHex(hslString) {
  try {
    // Handle both "210 40% 98%" and "hsl(210, 40%, 98%)" formats
    let match = hslString.match(/hsl\(\s*([0-9.]+),?\s*([0-9.]+)%,?\s*([0-9.]+)%\s*\)/);
    if (!match) {
      // Try space-separated format
      match = hslString.match(/([0-9.]+)\s+([0-9.]+)%\s+([0-9.]+)%/);
    }
    
    if (!match) return null;
    
    const [, h, s, l] = match;
    const color = hsl({
      h: parseFloat(h),
      s: parseFloat(s) / 100,
      l: parseFloat(l) / 100
    });
    
    return formatHex(color);
  } catch (error) {
    console.warn(`Failed to parse HSL color: ${hslString}`, error.message);
    return null;
  }
}

/**
 * Extract colors from CSS content
 * @param {string} cssContent - CSS file content for light mode testing
 * @returns {Object} - Object with color name -> hex value mappings
 */
function extractColorsFromCSS(cssContent) {
  const colors = {};
  
  // Extract only from :root sections (light mode) - ignore .dark sections for testing
  const rootSections = cssContent.match(/:root\s*\{[^}]*\}/gs) || [];
  const rootContent = rootSections.join('\n');
  
  // Extract OKLCH colors from :root only
  const oklchMatches = rootContent.matchAll(/--([a-zA-Z0-9-_]+):\s*oklch\([^)]+\)([^;]*);/g);
  for (const [fullMatch, name] of oklchMatches) {
    const oklchValue = fullMatch.match(/oklch\([^)]+\)/)?.[0];
    if (oklchValue) {
      const hex = parseOklchToHex(oklchValue);
      if (hex) {
        colors[name.trim()] = { hex, original: oklchValue, format: 'oklch' };
      }
    }
  }
  
  // Extract CSS variable references to OKLCH colors from :root sections
  const varMatches = rootContent.matchAll(/--([a-zA-Z0-9-_]+):\s*var\(--(primitive-[a-zA-Z0-9-_]+)\)/g);
  for (const [, name, primitive] of varMatches) {
    // Look for the primitive color definition in :root content
    const primitiveRegex = new RegExp(`--${primitive}:\\s*oklch\\([^)]+\\)`);
    const primitiveMatch = rootContent.match(primitiveRegex);
    if (primitiveMatch) {
      const hex = parseOklchToHex(primitiveMatch[0].split(': ')[1]);
      if (hex) {
        colors[name.trim()] = { hex, original: `var(--${primitive})`, format: 'oklch-ref' };
      }
    }
  }
  
  // Extract HSL colors from all content (these are mainly from index.css shadcn mappings)
  const hslMatches = cssContent.matchAll(/--([a-zA-Z0-9-_]+):\s*([0-9.]+\s+[0-9.]+%\s+[0-9.]+%|hsl\([^)]+\))/g);
  for (const [, name, value] of hslMatches) {
    const hex = parseHslToHex(value);
    if (hex) {
      colors[name.trim()] = { hex, original: value, format: 'hsl' };
    }
  }
  
  // Extract hex colors
  const hexMatches = cssContent.matchAll(/--([a-zA-Z0-9-_]+):\s*(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3})/g);
  for (const [, name, value] of hexMatches) {
    colors[name.trim()] = { hex: value, original: value, format: 'hex' };
  }
  
  return colors;
}

/**
 * Define color combinations to test based on our documentation
 * @param {Object} colors - Extracted colors object
 * @returns {Array} - Array of test combinations
 */
function defineColorCombinations(colors) {
  const combinations = [];
  
  // Define semantic color pairs from our documentation
  const colorPairs = [
    // Primary text/background combinations (WCAG AAA required)
    { bg: 'semantic-surface-elevated', text: 'semantic-text-primary', category: 'primary-text', standard: 'AAA' },
    { bg: 'semantic-surface-primary', text: 'semantic-text-primary', category: 'primary-text', standard: 'AAA' },
    { bg: 'semantic-surface-secondary', text: 'semantic-text-primary', category: 'primary-text', standard: 'AAA' },
    
    // Secondary text combinations (WCAG AA minimum)
    { bg: 'semantic-surface-elevated', text: 'semantic-text-secondary', category: 'secondary-text', standard: 'AA' },
    { bg: 'semantic-surface-primary', text: 'semantic-text-secondary', category: 'secondary-text', standard: 'AA' },
    
    // Button combinations (WCAG AA required) - using primitive tokens for actual testing
    { bg: 'primitive-yellow-500', text: 'primitive-gray-900', category: 'buttons', standard: 'AA' },
    { bg: 'primitive-green-500', text: 'primitive-gray-50', category: 'buttons', standard: 'AA' },
    { bg: 'primitive-coral-500', text: 'primitive-gray-50', category: 'buttons', standard: 'AA' },
    
    // Status indicators (WCAG AA required - safety critical) - using primitive tokens
    { bg: 'primitive-green-500', text: 'primitive-gray-50', category: 'status', standard: 'AA' },
    { bg: 'primitive-yellow-600', text: 'primitive-gray-900', category: 'status', standard: 'AA' },
    { bg: 'primitive-coral-500', text: 'primitive-gray-50', category: 'status', standard: 'AA' },
    { bg: 'primitive-coral-600', text: 'primitive-gray-50', category: 'status', standard: 'AA' },
    
    // Component-level combinations
    { bg: 'component-button-primary-bg', text: 'component-button-primary-text', category: 'components', standard: 'AA' },
    { bg: 'component-button-secondary-bg', text: 'component-button-secondary-text', category: 'components', standard: 'AA' },
    { bg: 'component-button-destructive-bg', text: 'component-button-destructive-text', category: 'components', standard: 'AA' },
    { bg: 'component-card-background', text: 'component-card-text', category: 'components', standard: 'AA' },
    { bg: 'component-nav-background', text: 'component-nav-text', category: 'components', standard: 'AA' },
    { bg: 'component-nav-active-bg', text: 'component-nav-active-text', category: 'components', standard: 'AA' },
    
    // Shadcn/ui combinations for compatibility
    { bg: 'background', text: 'foreground', category: 'shadcn', standard: 'AA' },
    { bg: 'card', text: 'card-foreground', category: 'shadcn', standard: 'AA' },
    { bg: 'primary', text: 'primary-foreground', category: 'shadcn', standard: 'AA' },
    { bg: 'secondary', text: 'secondary-foreground', category: 'shadcn', standard: 'AA' },
    { bg: 'accent', text: 'accent-foreground', category: 'shadcn', standard: 'AA' },
    { bg: 'destructive', text: 'destructive-foreground', category: 'shadcn', standard: 'AA' },
  ];
  
  // Convert to test combinations with actual color values
  for (const pair of colorPairs) {
    const bgColor = colors[pair.bg];
    const textColor = colors[pair.text];
    
    if (bgColor && textColor) {
      combinations.push({
        background: {
          name: pair.bg,
          hex: bgColor.hex,
          original: bgColor.original,
          format: bgColor.format
        },
        text: {
          name: pair.text,
          hex: textColor.hex,
          original: textColor.original,
          format: textColor.format
        },
        category: pair.category,
        requiredStandard: pair.standard
      });
    } else {
      console.warn(`⚠️  Missing colors for combination: ${pair.bg} + ${pair.text}`);
    }
  }
  
  return combinations;
}

/**
 * Test contrast ratio for a color combination
 * @param {Object} combination - Color combination to test
 * @returns {Object} - Test result
 */
function testContrastRatio(combination) {
  try {
    const bgHex = combination.background.hex;
    const textHex = combination.text.hex;
    
    // Validate hex colors
    if (!bgHex || !textHex || !bgHex.startsWith('#') || !textHex.startsWith('#')) {
      throw new Error(`Invalid hex colors: bg=${bgHex}, text=${textHex}`);
    }
    
    // Calculate contrast ratio using our WCAG implementation
    const ratio = calculateContrastRatio(bgHex, textHex);
    
    const standard = combination.requiredStandard || CONFIG.standard;
    const minRatio = CONFIG.minContrast[standard];
    
    // Test WCAG compliance manually since culori doesn't have level functions
    const wcagAA = {
      normal: ratio >= 4.5, // WCAG AA normal text
      large: ratio >= 3.0,  // WCAG AA large text
      pass: ratio >= 4.5
    };
    
    const wcagAAA = {
      normal: ratio >= 7.0, // WCAG AAA normal text
      large: ratio >= 4.5,  // WCAG AAA large text  
      pass: ratio >= 7.0
    };
    
    const result = {
      combination,
      ratio: Math.round(ratio * 100) / 100,
      wcagAA,
      wcagAAA,
      required: {
        standard,
        minimumRatio: minRatio.normal,
        passes: standard === 'AAA' ? wcagAAA.pass : wcagAA.pass
      }
    };
    
    return result;
  } catch (error) {
    return {
      combination,
      error: error.message,
      ratio: 0,
      wcagAA: { pass: false },
      wcagAAA: { pass: false },
      required: { passes: false }
    };
  }
}

/**
 * Generate console report
 * @param {Array} results - Test results
 */
function generateConsoleReport(results) {
  console.warn('\n🎨 WCAG Contrast Testing Report');
  console.warn('═'.repeat(80));
  console.warn(`Standard: WCAG ${CONFIG.standard} | Date: ${new Date().toISOString()}`);
  console.warn('');
  
  // Summary statistics
  const totalTests = results.length;
  const passedTests = results.filter(r => r.required.passes).length;
  const failedTests = totalTests - passedTests;
  const passRate = Math.round((passedTests / totalTests) * 100);
  
  console.warn(`📊 Summary: ${passedTests}/${totalTests} tests passed (${passRate}%)`);
  console.warn('');
  
  // Group results by category
  const categories = {};
  for (const result of results) {
    const category = result.combination.category;
    if (!categories[category]) categories[category] = [];
    categories[category].push(result);
  }
  
  // Report by category
  for (const [category, categoryResults] of Object.entries(categories)) {
    const categoryPassed = categoryResults.filter(r => r.required.passes).length;
    const categoryTotal = categoryResults.length;
    const categoryIcon = categoryPassed === categoryTotal ? '✅' : '⚠️';
    
    console.warn(`${categoryIcon} ${category.toUpperCase()} (${categoryPassed}/${categoryTotal})`);
    console.warn('─'.repeat(40));
    
    for (const result of categoryResults) {
      const status = result.required.passes ? '✅' : '❌';
      const ratio = result.ratio || 0;
      const bg = result.combination.background;
      const text = result.combination.text;
      
      console.warn(`${status} ${ratio.toFixed(2)}:1 | ${bg.name} → ${text.name}`);
      
      if (!result.required.passes) {
        console.warn(`   Required: ${result.required.minimumRatio}:1 (WCAG ${result.required.standard})`);
        console.warn(`   Colors: ${bg.hex} (${bg.format}) + ${text.hex} (${text.format})`);
      }
      
      if (result.error) {
        console.warn(`   Error: ${result.error}`);
      }
    }
    console.warn('');
  }
  
  // Failed tests detail
  const failedResults = results.filter(r => !r.required.passes);
  if (failedResults.length > 0) {
    console.warn('❌ FAILED TESTS - REQUIRES ATTENTION');
    console.warn('═'.repeat(80));
    
    for (const result of failedResults) {
      const bg = result.combination.background;
      const text = result.combination.text;
      
      console.warn(`🚨 ${bg.name} + ${text.name}`);
      console.warn(`   Ratio: ${result.ratio}:1 (needs ${result.required.minimumRatio}:1)`);
      console.warn(`   Background: ${bg.hex} (${bg.original})`);
      console.warn(`   Text: ${text.hex} (${text.original})`);
      console.warn(`   Category: ${result.combination.category}`);
      console.warn('');
    }
  }
  
  // Summary
  if (failedTests === 0) {
    console.warn('🎉 All contrast tests passed! Your color system is WCAG compliant.');
  } else {
    console.warn(`⚠️  ${failedTests} contrast violations found. Please fix before deployment.`);
    process.exit(1);
  }
}

/**
 * Generate JSON report
 * @param {Array} results - Test results
 * @returns {Object} - JSON report data
 */
function generateJSONReport(results) {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.required.passes).length;
  
  return {
    timestamp: new Date().toISOString(),
    standard: CONFIG.standard,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests,
      passRate: Math.round((passedTests / totalTests) * 100)
    },
    results: results.map(result => ({
      background: {
        name: result.combination.background.name,
        hex: result.combination.background.hex,
        original: result.combination.background.original,
        format: result.combination.background.format
      },
      text: {
        name: result.combination.text.name,
        hex: result.combination.text.hex,
        original: result.combination.text.original,
        format: result.combination.text.format
      },
      category: result.combination.category,
      contrastRatio: result.ratio,
      wcagAA: result.wcagAA,
      wcagAAA: result.wcagAAA,
      required: result.required,
      error: result.error
    })),
    failedTests: results.filter(r => !r.required.passes).map(result => ({
      combination: `${result.combination.background.name} + ${result.combination.text.name}`,
      ratio: result.ratio,
      required: result.required.minimumRatio,
      category: result.combination.category
    }))
  };
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.warn('🔍 Starting WCAG contrast testing...');
    
    // Read unified token system CSS
    const cssPath = path.join(__dirname, '../src/styles/unified-token-system.css');
    const cssContent = await fs.readFile(cssPath, 'utf-8');
    
    // Read shadcn integration CSS for compatibility testing
    const indexCssPath = path.join(__dirname, '../src/index.css');
    const indexContent = await fs.readFile(indexCssPath, 'utf-8');
    
    // Extract colors from both files
    const tokenColors = extractColorsFromCSS(cssContent);
    const shadcnColors = extractColorsFromCSS(indexContent);
    const allColors = { ...tokenColors, ...shadcnColors };
    
    console.warn(`📄 Extracted ${Object.keys(allColors).length} colors from CSS files`);
    
    // Define test combinations
    const combinations = defineColorCombinations(allColors);
    console.warn(`🧪 Testing ${combinations.length} color combinations`);
    
    // Run contrast tests
    const results = [];
    for (const combination of combinations) {
      const result = testContrastRatio(combination);
      results.push(result);
    }
    
    // Generate report
    if (CONFIG.reportType === 'json') {
      const jsonReport = generateJSONReport(results);
      const reportPath = path.join(__dirname, '../contrast-report.json');
      await fs.writeFile(reportPath, JSON.stringify(jsonReport, null, 2));
      console.warn(`📊 JSON report saved to: ${reportPath}`);
    } else {
      generateConsoleReport(results);
    }
    
  } catch (error) {
    console.error('❌ Contrast testing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, testContrastRatio, extractColorsFromCSS };