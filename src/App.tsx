import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PoolFacilityManager } from '@/components/ui/pool-facility-manager'
import { 
  Droplet, 
  Users, 
  Clock, 
  TestTube, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import './App.css'

function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'analytics'>('overview')

  // Mock data for the pool maintenance dashboard
  const recentReadings = [
    {
      id: 'pool-001',
      name: 'Main Community Pool',
      chlorine: 2.4,
      ph: 7.3,
      status: 'good',
      lastTested: '2 hours ago'
    },
    {
      id: 'pool-002', 
      name: 'Kiddie Pool',
      chlorine: 1.8,
      ph: 7.5,
      status: 'good',
      lastTested: '45 minutes ago'
    },
    {
      id: 'pool-003',
      name: 'Therapy Pool',
      chlorine: 0.8,
      ph: 7.1,
      status: 'warning',
      lastTested: '3 hours ago'
    }
  ]

  const metrics = [
    {
      title: 'Active Pools',
      value: '3',
      change: '+0',
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Tasks',
      value: '7',
      change: '+2',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Available Technicians',
      value: '4',
      change: '+1',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Critical Alerts',
      value: '1',
      change: '-2',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  // Tab navigation items
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'facilities', label: 'Pool Facilities', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  // Render overview dashboard content
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Pool Maintenance</h2>
        <p className="text-gray-600">Monitor and manage community pool safety and maintenance operations.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pool Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chemical Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Recent Chemical Readings
            </CardTitle>
            <CardDescription>Latest water quality test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReadings.map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{reading.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Cl: {reading.chlorine} ppm</span>
                      <span>pH: {reading.ph}</span>
                      <span>{reading.lastTested}</span>
                    </div>
                  </div>
                  <Badge className={
                    reading.status === 'good' 
                      ? 'bg-green-500 hover:bg-green-500/80' 
                      : 'bg-yellow-500 text-black hover:bg-yellow-500/80'
                  }>
                    {reading.status === 'good' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {reading.status === 'warning' && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {reading.status === 'good' ? 'Safe' : 'Attention'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common pool maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="justify-start h-auto p-4" 
                variant="outline"
                onClick={() => setActiveTab('facilities')}
              >
                <TestTube className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Record Chemical Reading</div>
                  <div className="text-sm text-gray-500">Log chlorine, pH, and other measurements</div>
                </div>
              </Button>
              
              <Button 
                className="justify-start h-auto p-4" 
                variant="outline"
                onClick={() => setActiveTab('facilities')}
              >
                <Users className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Assign Maintenance Task</div>
                  <div className="text-sm text-gray-500">Schedule work for technicians</div>
                </div>
              </Button>
              
              <Button 
                className="justify-start h-auto p-4" 
                variant="outline"
                onClick={() => setActiveTab('facilities')}
              >
                <MapPin className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Pool Status Update</div>
                  <div className="text-sm text-gray-500">Change operational status</div>
                </div>
              </Button>
              
              <Button 
                className="justify-start h-auto p-4" 
                variant="outline"
                onClick={() => setActiveTab('analytics')}
              >
                <Activity className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View Reports</div>
                  <div className="text-sm text-gray-500">Access maintenance history and analytics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component Library Link */}
      <div className="text-center">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Component Documentation</h3>
            <p className="text-gray-600 mb-4">
              Explore our complete UI component library with pool maintenance examples
            </p>
            <Button asChild>
              <a href="http://localhost:6080" target="_blank" rel="noopener noreferrer">
                View Storybook Documentation
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Render analytics placeholder
  const renderAnalytics = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h2>
        <p className="text-gray-600">Advanced analytics and reporting features coming in Phase 2.3</p>
      </div>
      
      <Card className="p-12 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-500 mb-4">
          Advanced reporting, trend analysis, and predictive maintenance features will be available in the next phase.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">Chemical Trends</Badge>
          <Badge variant="outline">Usage Analytics</Badge>
          <Badge variant="outline">Performance Reports</Badge>
          <Badge variant="outline">Compliance Tracking</Badge>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Droplet className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Pool Maintenance System</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                New Reading
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'facilities' && <PoolFacilityManager />}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>
    </div>
  )
}

export default App
