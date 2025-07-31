import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PoolFacilityManager } from '@/components/ui/pool-facility-manager'
import { ChemicalTestHistory } from '@/components/ui/chemical-test-history'
import { PoolStatusDashboard } from '@/components/ui/pool-status-dashboard'
import { ChemicalTrendChart } from '@/components/ui/chemical-trend-chart'
import { Droplet, TestTube, MapPin, Activity, BarChart3, Settings, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import './App.css'

function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'history' | 'analytics'>(
    'overview'
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-foreground mb-2 text-2xl font-bold">Pool Maintenance Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time pool status and chemical monitoring from your test data.
        </p>
      </div>

      {/* Pool Status Dashboard */}
      <PoolStatusDashboard
        onViewPool={(_poolId) => {
          // Could navigate to detailed pool view in the future
          // For now, no action needed
        }}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common pool maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Button
              className="h-auto justify-start p-4"
              variant="outline"
              onClick={() => setActiveTab('facilities')}
            >
              <TestTube className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Record Chemical Reading</div>
                <div className="text-muted-foreground text-sm">
                  Log chlorine, pH, and other measurements
                </div>
              </div>
            </Button>

            <Button
              className="h-auto justify-start p-4"
              variant="outline"
              onClick={() => setActiveTab('history')}
            >
              <Activity className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">View Test History</div>
                <div className="text-muted-foreground text-sm">
                  Review and manage chemical test records
                </div>
              </div>
            </Button>

            <Button
              className="h-auto justify-start p-4"
              variant="outline"
              onClick={() => setActiveTab('facilities')}
            >
              <MapPin className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Manage Pool Facilities</div>
                <div className="text-muted-foreground text-sm">Configure pools and settings</div>
              </div>
            </Button>

            <Button
              className="h-auto justify-start p-4"
              variant="outline"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Analytics & Reports</div>
                <div className="text-muted-foreground text-sm">
                  Chemical trends and compliance reports
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Component Library Link */}
      <div className="text-center">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-foreground mb-2 text-lg font-semibold">Component Documentation</h3>
            <p className="text-muted-foreground mb-4 opacity-80">
              Explore our complete UI component library with pool maintenance examples
            </p>
            <Button variant="default" asChild>
              <a href="http://localhost:6080" target="_blank" rel="noopener noreferrer">
                View Storybook Documentation
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Render analytics content
  const renderAnalytics = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-foreground mb-2 text-2xl font-bold">Analytics & Reports</h2>
        <p className="text-muted-foreground">
          Chemical trend analysis and performance insights from your test data.
        </p>
      </div>

      {/* Chemical Trend Charts */}
      <ChemicalTrendChart />

      {/* Future Analytics Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
          <CardDescription>Additional reporting features coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 text-center">
              <Badge variant="secondary" className="mb-2">
                Coming Soon
              </Badge>
              <h4 className="font-medium">Usage Analytics</h4>
              <p className="text-muted-foreground text-sm">Pool utilization patterns</p>
            </div>
            <div className="p-4 text-center">
              <Badge variant="secondary" className="mb-2">
                Coming Soon
              </Badge>
              <h4 className="font-medium">Performance Reports</h4>
              <p className="text-muted-foreground text-sm">Maintenance efficiency metrics</p>
            </div>
            <div className="p-4 text-center">
              <Badge variant="secondary" className="mb-2">
                Coming Soon
              </Badge>
              <h4 className="font-medium">Compliance Tracking</h4>
              <p className="text-muted-foreground text-sm">MAHC compliance history</p>
            </div>
            <div className="p-4 text-center">
              <Badge variant="secondary" className="mb-2">
                Coming Soon
              </Badge>
              <h4 className="font-medium">Predictive Insights</h4>
              <p className="text-muted-foreground text-sm">Maintenance predictions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="bg-background min-h-screen">
      {/* Header - 30% Green Theme */}
      <header className="bg-card border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Droplet className="text-primary mr-3 h-8 w-8" />
              <h1 className="text-foreground text-xl font-semibold">Pool Maintenance System</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="default">
                <TestTube className="mr-2 h-4 w-4" />
                New Reading
              </Button>
              <Button variant="secondary">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - 30% Green Structure */}
      <div className="bg-secondary/10 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'text-muted-foreground hover:border-border hover:text-foreground border-transparent'
                  )}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - 60% Blue Theme */}
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'facilities' && <PoolFacilityManager />}
        {activeTab === 'history' && <ChemicalTestHistory />}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>
    </div>
  )
}

export default App
