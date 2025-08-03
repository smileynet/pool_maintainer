#!/usr/bin/env node

/**
 * Script to load sample data into the Pool Maintenance System
 * Run this to populate the system with demonstration data
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🏊 Loading sample data into Pool Maintenance System...\n');

  try {
    // Navigate to the app
    await page.goto('http://localhost:5080');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Execute the loadSampleData function in the browser context
    await page.evaluate(() => {
      // Clear existing data
      localStorage.removeItem('pool-maintenance-facilities');
      localStorage.removeItem('pool-maintenance-chemical-tests');
      
      // Sample pool facilities
      const samplePoolFacilities = [
        {
          id: 'pool-main',
          name: 'Main Community Pool',
          type: 'outdoor',
          location: '123 Aquatic Center Dr',
          capacity: 250000,
          status: 'active',
          lastInspection: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Olympic-sized pool with diving area. Heavy usage during summer months.',
          contactEmail: 'mainpool@aquaticcenter.com',
          contactPhone: '555-0100'
        },
        {
          id: 'pool-kids',
          name: 'Children\'s Splash Pool',
          type: 'outdoor',
          location: '123 Aquatic Center Dr',
          capacity: 15000,
          status: 'active',
          lastInspection: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Shallow pool with water features. Max depth 3 feet.',
          contactEmail: 'kidspool@aquaticcenter.com',
          contactPhone: '555-0101'
        },
        {
          id: 'pool-therapy',
          name: 'Therapy Pool',
          type: 'indoor',
          location: '456 Health Center Blvd',
          capacity: 30000,
          status: 'active',
          lastInspection: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Heated to 88°F. Used for physical therapy and senior programs.',
          contactEmail: 'therapy@healthcenter.com',
          contactPhone: '555-0200'
        }
      ];

      // Sample chemical tests
      const sampleChemicalTests = [
        {
          id: 'test-1',
          poolId: 'pool-main',
          poolName: 'Main Community Pool',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          technician: 'John Smith',
          readings: {
            freeChlorine: 2.0,
            totalChlorine: 2.2,
            ph: 7.4,
            alkalinity: 100,
            cyanuricAcid: 45,
            calcium: 300,
            temperature: 82
          },
          status: 'approved',
          notes: 'All levels optimal'
        },
        {
          id: 'test-2',
          poolId: 'pool-kids',
          poolName: 'Children\'s Splash Pool',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          technician: 'Sarah Johnson',
          readings: {
            freeChlorine: 0.8,
            totalChlorine: 1.0,
            ph: 7.5,
            alkalinity: 100,
            cyanuricAcid: 40,
            calcium: 250,
            temperature: 84
          },
          status: 'critical',
          notes: 'LOW CHLORINE - Pool closed for shock treatment'
        },
        {
          id: 'test-3',
          poolId: 'pool-therapy',
          poolName: 'Therapy Pool',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          technician: 'Dr. Emily Watson',
          readings: {
            freeChlorine: 2.2,
            totalChlorine: 2.4,
            ph: 7.4,
            alkalinity: 100,
            cyanuricAcid: 0,
            calcium: 280,
            temperature: 88
          },
          status: 'approved',
          notes: 'Temperature verified at 88°F for therapy sessions'
        }
      ];

      // Save to localStorage
      localStorage.setItem('pool-maintenance-facilities', JSON.stringify(samplePoolFacilities));
      localStorage.setItem('pool-maintenance-chemical-tests', JSON.stringify(sampleChemicalTests));
      
      console.log('Sample data loaded successfully!');
    });

    console.log('✅ Sample data loaded successfully!');
    console.log('\nData summary:');
    console.log('- 3 pool facilities (Main, Children\'s, Therapy)');
    console.log('- 3 recent chemical test readings');
    console.log('- Various status levels (approved, critical)');
    console.log('\n🌐 Visit http://localhost:5080 to see the data');

  } catch (error) {
    console.error('❌ Error loading sample data:', error.message);
  } finally {
    await browser.close();
  }
})();