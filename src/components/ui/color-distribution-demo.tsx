import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { CheckCircle, Users, Activity, Settings, Plus, RefreshCw } from 'lucide-react'

export const ColorDistributionDemo = () => {
  return (
    <div className="min-h-screen bg-[var(--color-dominant-lighter)] p-4">
      {/* Header - 30% Green Theme */}
      <header className="mb-6 rounded-lg bg-[var(--nav-background)] p-4 shadow-sm">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-[var(--nav-text)]">Pool Manager</h1>
            <div className="flex space-x-4">
              <button className="rounded bg-[var(--nav-active-bg)] px-3 py-2 text-sm text-[var(--nav-active-text)]">
                Dashboard
              </button>
              <button className="rounded px-3 py-2 text-sm text-[var(--nav-text)] transition-colors hover:bg-[var(--nav-hover-bg)]">
                Chemicals
              </button>
              <button className="rounded px-3 py-2 text-sm text-[var(--nav-text)] transition-colors hover:bg-[var(--nav-hover-bg)]">
                Schedule
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-[var(--nav-accent)] text-[var(--color-text-on-accent-primary)]">
              3 Alerts
            </Badge>
            <Settings className="h-5 w-5 text-[var(--nav-text)]" />
          </div>
        </nav>
      </header>

      {/* Main Content Area - 60% Blue Theme */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Primary Content - 60% Blue Backgrounds */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pool Status Card */}
          <Card className="border-[var(--card-border)] bg-[var(--card-background)]">
            <CardHeader className="bg-[var(--card-header-bg)]">
              <CardTitle className="flex items-center text-[var(--color-text-on-dominant-light)]">
                <Activity className="mr-2 h-5 w-5" />
                Pool Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-[var(--color-content-background)] p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-text-on-dominant)]">2.1</div>
                  <div className="text-sm text-[var(--color-text-on-dominant-light)]">
                    Free Chlorine
                  </div>
                  <Badge className="mt-1 border-[var(--status-success-accent)] bg-[var(--status-success-bg)] text-[var(--status-success-text)]">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Safe
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-text-on-dominant)]">7.4</div>
                  <div className="text-sm text-[var(--color-text-on-dominant-light)]">pH Level</div>
                  <Badge className="mt-1 border-[var(--status-success-accent)] bg-[var(--status-success-bg)] text-[var(--status-success-text)]">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Optimal
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-text-on-dominant)]">
                    84°F
                  </div>
                  <div className="text-sm text-[var(--color-text-on-dominant-light)]">
                    Temperature
                  </div>
                  <Badge className="mt-1 border-[var(--status-success-accent)] bg-[var(--status-success-bg)] text-[var(--status-success-text)]">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Perfect
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-text-on-dominant)]">95</div>
                  <div className="text-sm text-[var(--color-text-on-dominant-light)]">
                    Alkalinity
                  </div>
                  <Badge className="mt-1 border-[var(--status-success-accent)] bg-[var(--status-success-bg)] text-[var(--status-success-text)]">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Good
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="border-[var(--card-border)] bg-[var(--card-background)]">
            <CardHeader className="bg-[var(--card-header-bg)]">
              <CardTitle className="text-[var(--color-text-on-dominant-light)]">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-[var(--color-content-background)] p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded bg-[var(--color-surface-secondary)] p-3">
                  <div>
                    <div className="font-medium text-[var(--color-text-on-dominant)]">
                      Chemical Test Completed
                    </div>
                    <div className="text-sm text-[var(--color-text-on-dominant-light)]">
                      All levels within MAHC guidelines
                    </div>
                  </div>
                  <Badge className="bg-[var(--status-success-accent)] text-white">Complete</Badge>
                </div>
                <div className="flex items-center justify-between rounded bg-[var(--color-surface-secondary)] p-3">
                  <div>
                    <div className="font-medium text-[var(--color-text-on-dominant)]">
                      Filter Maintenance
                    </div>
                    <div className="text-sm text-[var(--color-text-on-dominant-light)]">
                      Scheduled for tomorrow 9:00 AM
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]"
                  >
                    Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Mixed 30% Green Structure + 10% Yellow/Coral Actions */}
        <div className="space-y-6">
          {/* Quick Actions - 10% Yellow/Coral Accents */}
          <Card className="border-[var(--card-border)] bg-[var(--card-background)]">
            <CardHeader className="bg-[var(--color-secondary-lighter)]">
              <CardTitle className="text-[var(--color-text-on-secondary-light)]">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {/* Primary CTA - 10% Yellow */}
              <Button className="btn-60-30-10-primary flex w-full items-center justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Chemical Test
              </Button>

              {/* Secondary Action - 30% Green */}
              <Button className="btn-60-30-10-secondary flex w-full items-center justify-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Equipment
              </Button>

              {/* Tertiary Action - 10% Coral */}
              <Button
                variant="outline"
                className="w-full border-[var(--color-accent-secondary)] text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)] hover:text-white"
              >
                Emergency Protocol
              </Button>
            </CardContent>
          </Card>

          {/* Staff Status - 30% Green Structure */}
          <Card className="border-[var(--card-border)] bg-[var(--card-background)]">
            <CardHeader className="bg-[var(--color-secondary-lighter)]">
              <CardTitle className="flex items-center text-[var(--color-text-on-secondary-light)]">
                <Users className="mr-2 h-5 w-5" />
                Staff on Duty
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-[var(--color-content-background)] p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[var(--color-text-on-dominant)]">Sarah Johnson</div>
                  <Badge className="bg-[var(--status-success-accent)] text-white">On Duty</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[var(--color-text-on-dominant)]">Mike Chen</div>
                  <Badge className="bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent-primary)]">
                    Break
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[var(--color-text-on-dominant)]">Alex Rodriguez</div>
                  <Badge
                    variant="outline"
                    className="border-[var(--color-accent-secondary)] text-[var(--color-accent-secondary)]"
                  >
                    Off Duty
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Distribution Legend */}
          <Card className="border-[var(--card-border)] bg-[var(--card-background)]">
            <CardHeader>
              <CardTitle className="text-[var(--color-text-on-dominant)]">
                60-30-10 Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 rounded border bg-[var(--color-dominant-light)]"></div>
                <span className="text-sm text-[var(--color-text-on-dominant)]">
                  60% Robin Egg Blue - Backgrounds
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 rounded bg-[var(--color-secondary-primary)]"></div>
                <span className="text-sm text-[var(--color-text-on-dominant)]">
                  30% Grass Green - Structure
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 rounded bg-[var(--color-accent-primary)]"></div>
                <span className="text-sm text-[var(--color-text-on-dominant)]">
                  7% Sunshine Yellow - Primary CTAs
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 rounded bg-[var(--color-accent-secondary)]"></div>
                <span className="text-sm text-[var(--color-text-on-dominant)]">
                  3% Coral - Secondary CTAs
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
