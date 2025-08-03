import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PoolStatusDashboard } from '@/components/ui/pool-status-dashboard'
import { OfflineIndicator } from '@/components/ui/offline-indicator'
import { MobileThemeSelector } from '@/components/ui/mobile-theme-selector'
import { DemoDataBanner } from '@/components/ui/demo-data-banner'
import { AlertNotificationSystem } from '@/components/ui/alert-notification-system'
import { MobileNavigation, ResponsiveGrid, MobileStack } from '@/components/ui/mobile-optimizations'

// Enhanced lazy loading with error boundaries and preloading
import {
  LazyPoolFacilityManager,
  LazyChemicalTestHistory,
  LazyChemicalTrendChart
} from '@/components/lazy'
import { usePreloadComponent } from '@/utils/lazy-loading'

import { Droplet, TestTube, MapPin, Activity, BarChart3, Settings, History } from 'lucide-react'
import './App.css'

function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'history' | 'analytics'>(
    'overview'
  )

  // Preload components based on user behavior
  usePreloadComponent(
    () => import('@/components/ui/pool-facility-manager'), 
    activeTab === 'overview' // Preload facilities when on overview
  )
  
  usePreloadComponent(
    () => import('@/components/ui/chemical-test-history'),
    activeTab === 'facilities' // Preload history when on facilities
  )

  // Tab navigation items
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'facilities', label: 'Pool Facilities', icon: MapPin },
    { id: 'history', label: 'Test History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  // Render overview dashboard content
  const renderOverview = () => (
    <MobileStack spacing="lg" className="stagger-children">
      {/* Welcome Section */}
      <div>
        <h2 className="text-foreground mb-2 text-xl md:text-2xl font-bold">Pool Maintenance Dashboard</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Real-time pool status and chemical monitoring from your test data.
        </p>
      </div>

      {/* Demo Data Banner */}
      <DemoDataBanner />

      {/* Alert Notification System */}
      <AlertNotificationSystem 
        onViewPool={(_poolId) => {
          setActiveTab('facilities')
          // Could scroll to specific pool or filter
        }}
      />

      {/* Pool Status Dashboard */}
      <PoolStatusDashboard
        onViewPool={(_poolId) => {
          // Could navigate to detailed pool view in the future
          // For now, no action needed
        }}
      />

      {/* Quick Actions */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm md:text-base">Common pool maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }}>
            <Button
              className="h-auto justify-start p-3 md:p-4"
              variant="outline"
              onClick={() => setActiveTab('facilities')}
            >
              <TestTube className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium text-sm md:text-base">Record Chemical Reading</div>
                <div className="text-muted-foreground text-xs md:text-sm">
                  Log chlorine, pH, and other measurements
                </div>
              </div>
            </Button>

            <Button
              className="h-auto justify-start p-3 md:p-4"
              variant="outline"
              onClick={() => setActiveTab('history')}
            >
              <Activity className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium text-sm md:text-base">View Test History</div>
                <div className="text-muted-foreground text-xs md:text-sm">
                  Review and manage chemical test records
                </div>
              </div>
            </Button>

            <Button
              className="h-auto justify-start p-3 md:p-4"
              variant="outline"
              onClick={() => setActiveTab('facilities')}
            >
              <MapPin className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium text-sm md:text-base">Manage Pool Facilities</div>
                <div className="text-muted-foreground text-xs md:text-sm">Configure pools and settings</div>
              </div>
            </Button>

            <Button
              className="h-auto justify-start p-3 md:p-4"
              variant="outline"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium text-sm md:text-base">Analytics & Reports</div>
                <div className="text-muted-foreground text-xs md:text-sm">
                  Chemical trends and compliance reports
                </div>
              </div>
            </Button>
          </ResponsiveGrid>
        </CardContent>
      </Card>

    </MobileStack>
  )

  // Render analytics content
  const renderAnalytics = () => (
    <MobileStack spacing="lg" className="content-data">
      <div>
        <h2 className="text-foreground mb-2 text-xl md:text-2xl font-bold">Analytics & Reports</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Chemical trend analysis and performance insights from your test data.
        </p>
      </div>

      {/* Chemical Trend Charts - now using enhanced lazy loading */}
      <LazyChemicalTrendChart />

    </MobileStack>
  )

  return (
    <div className="app-background gradient-subtle">
      {/* Header - Modern Glass Effect */}
      <header className="nav-glass backdrop-blur-md layout-app">
        <div>
          <div className="flex h-14 md:h-16 items-center justify-between">
            <div className="flex items-center min-w-0">
              <Droplet className="text-primary mr-2 md:mr-3 h-6 md:h-8 w-6 md:w-8 flex-shrink-0" />
              <h1 className="text-foreground text-lg md:text-xl font-semibold truncate">
                <span className="hidden sm:inline">Pool Maintenance System</span>
                <span className="sm:hidden">Pool System</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <OfflineIndicator />
              <MobileThemeSelector />
              <Button variant="default" size="sm" className="hidden sm:flex">
                <TestTube className="mr-2 h-4 w-4" />
                New Reading
              </Button>
              <Button variant="default" size="sm" className="sm:hidden">
                <TestTube className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" className="hidden md:flex">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="secondary" size="sm" className="md:hidden">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Mobile Optimized */}
      <div className="bg-secondary/10 border-b layout-app">
        <div>
          <MobileNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
          />
        </div>
      </div>

      {/* Main Content - Enhanced with Stagger Animations */}
      <main className="layout-app min-h-screen py-4 md:py-8 page-enter">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'facilities' && <LazyPoolFacilityManager />}
        {activeTab === 'history' && <LazyChemicalTestHistory />}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>
    </div>
  )
}

export default App
