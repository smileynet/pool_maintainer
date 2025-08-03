# Sample Data Guide

This guide explains the sample data available in the Pool Maintenance System and how it demonstrates various features.

## Loading Sample Data

### Method 1: Using the UI (Development Mode)
When running in development mode with no existing data, you'll see a blue banner offering to load sample data.

### Method 2: Using the Script
```bash
node scripts/load-sample-data.js
```

### Method 3: Browser Console (Development Mode)
```javascript
loadSampleData()
```

## Sample Data Overview

### Pool Facilities (5 pools)

1. **Main Community Pool**
   - Type: Outdoor, Olympic-sized
   - Capacity: 250,000 gallons
   - Status: Active
   - Features: Diving area, heavy summer usage

2. **Children's Splash Pool**
   - Type: Outdoor, shallow
   - Capacity: 15,000 gallons
   - Status: Active
   - Features: Water features, max depth 3 feet

3. **Therapy Pool**
   - Type: Indoor, heated
   - Capacity: 30,000 gallons
   - Status: Active
   - Features: Maintained at 88°F for therapy

4. **Lap Pool - East Wing**
   - Type: Indoor, 8-lane
   - Capacity: 75,000 gallons
   - Status: Active
   - Features: Competition pool at 78°F

5. **Resort Infinity Pool**
   - Type: Outdoor, luxury
   - Capacity: 120,000 gallons
   - Status: Under Maintenance
   - Features: Currently closed for tile repair

### Chemical Test Scenarios

#### Normal Operations (Green Status)
- Main Community Pool recent readings
- Therapy Pool consistent readings
- All parameters within ideal MAHC ranges

#### Warning Conditions (Yellow Status)
- pH drift scenarios (7.8+)
- Alkalinity outside ideal range (75 ppm)
- Minor adjustments needed

#### Critical Conditions (Red Status)
- Children's Pool low chlorine (0.8 ppm)
- Requires immediate attention
- Pool closure for treatment

#### Emergency Conditions (Red Alert)
- Resort Pool multiple failures
- Very low chlorine (0.3 ppm)
- Very high pH (8.2)
- Immediate closure required

### Historical Data Patterns

The sample data includes:
- Hourly readings for the current day
- Daily readings for the past week
- Various technician entries
- Progressive improvement scenarios
- Typical daily chlorine consumption patterns

### Demonstration Features

1. **Dashboard Overview**
   - Pool status cards with color coding
   - Recent test summaries
   - Alert prioritization

2. **Chemical Test Form**
   - Pre-validation with MAHC standards
   - Real-time feedback on readings
   - Recommended actions

3. **Test History**
   - Sortable/filterable data
   - Export capabilities
   - Trend identification

4. **Analytics**
   - Chemical trend charts
   - Compliance reporting
   - Pattern recognition

## Test Scenarios

### Scenario 1: Morning Routine
- Check overnight chemical levels
- Note chlorine consumption
- Add chemicals as needed

### Scenario 2: Emergency Response
- Critical low chlorine alert
- Pool closure procedure
- Shock treatment documentation

### Scenario 3: Maintenance Planning
- Review weekly trends
- Identify problem pools
- Schedule preventive maintenance

### Scenario 4: Compliance Audit
- Generate compliance reports
- Review historical data
- Document corrective actions

## Data Reset

To clear all data and start fresh:
```javascript
localStorage.clear()
location.reload()
```

## Customizing Sample Data

Edit `/src/lib/sample-data.ts` to:
- Add more pools
- Create different scenarios
- Adjust chemical ranges
- Add historical patterns

The sample data is designed to showcase all system features while providing realistic pool maintenance scenarios.