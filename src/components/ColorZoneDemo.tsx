import React from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Settings,
  Droplets,
  ThermometerSun,
  Waves,
} from 'lucide-react'

/**
 * Demonstration component showing the color zone system in action
 * Each zone has distinct visual treatment following the 60-30-10 distribution
 */
export function ColorZoneDemo() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Layout with Sidebar */}
      <div className="layout-with-sidebar">
        {/* Navigation Zone - 30% Green Distribution */}
        <nav className="zone-navigation">
          <div className="zone-header">
            <h2 className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Pool Control
            </h2>
          </div>
          <div className="zone-content">
            <ul className="space-y-2">
              <li className="zone-card zone-interactive">
                <a href="#dashboard" className="flex items-center gap-3">
                  <Activity className="h-4 w-4" />
                  Dashboard
                </a>
              </li>
              <li className="zone-card zone-interactive">
                <a href="#chemicals" className="flex items-center gap-3">
                  <Droplets className="h-4 w-4" />
                  Chemical Monitoring
                </a>
              </li>
              <li className="zone-card zone-interactive">
                <a href="#equipment" className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  Equipment Status
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="zone-dashboard">
          <div className="zone-content">
            {/* Alert Zone - Critical Information */}
            <div className="zone-alerts zone-prominent mb-6">
              <div className="flex items-center gap-3 p-4">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">System Alert</h3>
                  <p>Chlorine levels require immediate attention in the main pool.</p>
                </div>
              </div>
            </div>

            {/* Chemical Monitoring Zone */}
            <section className="zone-chemical-monitoring zone-card mb-6">
              <div className="zone-header">
                <h3 className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Chemical Status - Main Pool
                </h3>
              </div>
              <div className="zone-content">
                <div className="grid grid-cols-3 gap-4">
                  <div className="zone-card">
                    <h4 className="mb-2 text-sm font-medium">pH Level</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">7.4</span>
                      <span className="zone-status is-safe">
                        <CheckCircle className="h-4 w-4" />
                        Optimal
                      </span>
                    </div>
                  </div>
                  <div className="zone-card">
                    <h4 className="mb-2 text-sm font-medium">Chlorine</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">0.8</span>
                      <span className="zone-status is-caution">
                        <AlertCircle className="h-4 w-4" />
                        Low
                      </span>
                    </div>
                  </div>
                  <div className="zone-card">
                    <h4 className="mb-2 text-sm font-medium">Temperature</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">82°F</span>
                      <span className="zone-status is-safe">
                        <ThermometerSun className="h-4 w-4" />
                        Good
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Split Monitoring Layout */}
            <div className="layout-split-monitoring">
              {/* Equipment Status Zone */}
              <section className="zone-equipment zone-card">
                <div className="zone-header">
                  <h3 className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Equipment Status
                  </h3>
                </div>
                <div className="zone-content">
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span>Main Pump</span>
                      <Badge className="bg-green-500 text-white">Running</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Filter System</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Heater</span>
                      <Badge className="bg-yellow-500 text-black">Maintenance</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Chemical Feeder</span>
                      <Badge className="bg-gray-500 text-white">Offline</Badge>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Pool Area Status */}
              <section className="zone-reporting zone-card">
                <div className="zone-header">
                  <h3>Pool Area Status</h3>
                </div>
                <div className="zone-content space-y-3">
                  <div className="zone-main-pool zone-card">
                    <h4 className="font-medium">Main Pool</h4>
                    <p className="text-muted-foreground text-sm">Capacity: 85%</p>
                  </div>
                  <div className="zone-kiddie-pool zone-card">
                    <h4 className="font-medium">Kiddie Pool</h4>
                    <p className="text-muted-foreground text-sm">Capacity: 60%</p>
                  </div>
                  <div className="zone-therapy-pool zone-card">
                    <h4 className="font-medium">Therapy Pool</h4>
                    <p className="text-muted-foreground text-sm">Capacity: 40%</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Action Zone - CTAs */}
            <div className="zone-actions mt-6">
              <div className="flex gap-4">
                <Button className="bg-[var(--semantic-action-primary)] hover:bg-[var(--primitive-yellow-600)]">
                  Record Test Results
                </Button>
                <Button
                  variant="outline"
                  className="border-[var(--semantic-action-secondary)] text-[var(--semantic-action-secondary)]"
                >
                  Schedule Maintenance
                </Button>
                <Button variant="ghost" className="text-[var(--semantic-action-tertiary)]">
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
