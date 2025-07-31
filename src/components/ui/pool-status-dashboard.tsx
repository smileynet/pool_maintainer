import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  TestTube,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getChemicalTests, getTestSummary, type ChemicalTest } from '@/lib/localStorage'
import { validateChemical, type ChemicalType } from '@/lib/mahc-validation'

interface PoolStatus {
  poolId: string
  poolName: string
  lastTest: ChemicalTest | null
  status: 'safe' | 'caution' | 'critical' | 'emergency' | 'unknown'
  issues: string[]
  testCount: number
  lastTested: string
  daysSinceTest: number
}

interface ChemicalTrend {
  chemical: ChemicalType
  current: number
  previous: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

export const PoolStatusDashboard = ({ onViewPool }: { onViewPool?: (poolId: string) => void }) => {
  const [pools, setPools] = useState<PoolStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Load and process pool data
  const loadPoolStatus = useMemo(() => {
    return () => {
      setLoading(true)

      const tests = getChemicalTests()
      const poolMap = new Map<string, ChemicalTest[]>()

      // Group tests by pool
      tests.forEach((test) => {
        if (!poolMap.has(test.poolId)) {
          poolMap.set(test.poolId, [])
        }
        poolMap.get(test.poolId)!.push(test)
      })

      // Process each pool
      const poolStatuses: PoolStatus[] = []

      for (const [poolId, poolTests] of poolMap.entries()) {
        // Sort tests by timestamp (newest first)
        const sortedTests = poolTests.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        const lastTest = sortedTests[0]
        const lastTested = new Date(lastTest.timestamp)
        const daysSinceTest = Math.floor(
          (Date.now() - lastTested.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Analyze chemical status
        const { status, issues } = analyzePoolStatus(lastTest, daysSinceTest)

        poolStatuses.push({
          poolId,
          poolName: lastTest.poolName,
          lastTest,
          status,
          issues,
          testCount: poolTests.length,
          lastTested: lastTest.timestamp,
          daysSinceTest,
        })
      }

      // Sort pools by priority (critical first, then by last test date)
      poolStatuses.sort((a, b) => {
        const statusPriority = { emergency: 4, critical: 3, caution: 2, safe: 1, unknown: 0 }
        const aPriority = statusPriority[a.status]
        const bPriority = statusPriority[b.status]

        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }

        return new Date(b.lastTested).getTime() - new Date(a.lastTested).getTime()
      })

      setPools(poolStatuses)
      setLastUpdated(new Date())
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPoolStatus()

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadPoolStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [loadPoolStatus])

  // Analyze pool status based on latest test
  const analyzePoolStatus = (
    test: ChemicalTest,
    daysSinceTest: number
  ): { status: PoolStatus['status']; issues: string[] } => {
    const issues: string[] = []
    let worstStatus: PoolStatus['status'] = 'safe'

    // Check test age
    if (daysSinceTest > 7) {
      issues.push(`No tests for ${daysSinceTest} days`)
      worstStatus = 'caution'
    } else if (daysSinceTest > 14) {
      issues.push(`No tests for ${daysSinceTest} days`)
      worstStatus = 'critical'
    }

    // Check chemical levels
    const chemicalChecks: Array<{ value: number; type: ChemicalType; name: string }> = [
      { value: test.readings.freeChlorine, type: 'freeChlorine', name: 'Free Chlorine' },
      { value: test.readings.ph, type: 'ph', name: 'pH' },
      { value: test.readings.alkalinity, type: 'alkalinity', name: 'Alkalinity' },
      { value: test.readings.temperature, type: 'temperature', name: 'Temperature' },
    ]

    chemicalChecks.forEach(({ value, type, name }) => {
      if (value > 0) {
        // Only check if value was recorded
        const validation = validateChemical(value, type)
        if (validation) {
          if (validation.status === 'emergency') {
            issues.push(`${name}: ${validation.message}`)
            worstStatus = 'emergency'
          } else if (validation.status === 'critical') {
            issues.push(`${name}: ${validation.message}`)
            if (worstStatus !== 'emergency') worstStatus = 'critical'
          } else if (validation.status === 'warning') {
            issues.push(`${name}: ${validation.message}`)
            if (!['emergency', 'critical'].includes(worstStatus)) worstStatus = 'caution'
          }
        }
      }
    })

    // Check test status
    if (test.status === 'emergency') {
      worstStatus = 'emergency'
    } else if (test.status === 'flagged') {
      if (worstStatus !== 'emergency') worstStatus = 'critical'
    }

    return { status: worstStatus, issues }
  }

  // Get chemical trends for a pool
  const getChemicalTrends = (poolId: string): ChemicalTrend[] => {
    const tests = getChemicalTests()
      .filter((test) => test.poolId === poolId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (tests.length < 2) return []

    const current = tests[0].readings
    const previous = tests[1].readings

    const trends: ChemicalTrend[] = []
    const chemicals: Array<{ type: ChemicalType; currentVal: number; previousVal: number }> = [
      {
        type: 'freeChlorine',
        currentVal: current.freeChlorine,
        previousVal: previous.freeChlorine,
      },
      { type: 'ph', currentVal: current.ph, previousVal: previous.ph },
      { type: 'alkalinity', currentVal: current.alkalinity, previousVal: previous.alkalinity },
      { type: 'temperature', currentVal: current.temperature, previousVal: previous.temperature },
    ]

    chemicals.forEach(({ type, currentVal, previousVal }) => {
      if (currentVal > 0 && previousVal > 0) {
        const change = currentVal - previousVal
        const changePercent = Math.abs(change / previousVal) * 100

        let trend: 'up' | 'down' | 'stable' = 'stable'
        if (changePercent > 5) {
          // More than 5% change is significant
          trend = change > 0 ? 'up' : 'down'
        }

        trends.push({
          chemical: type,
          current: currentVal,
          previous: previousVal,
          trend,
          change: Math.abs(change),
        })
      }
    })

    return trends
  }

  // Get status display properties
  const getStatusDisplay = (status: PoolStatus['status']) => {
    switch (status) {
      case 'emergency':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          label: 'Emergency',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
        }
      case 'critical':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          label: 'Critical',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
        }
      case 'caution':
        return {
          variant: 'outline' as const,
          icon: AlertTriangle,
          label: 'Caution',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
        }
      case 'safe':
        return {
          variant: 'secondary' as const,
          icon: CheckCircle,
          label: 'Safe',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
        }
      default:
        return {
          variant: 'outline' as const,
          icon: Clock,
          label: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
        }
    }
  }

  const summary = getTestSummary()

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="text-muted-foreground h-8 w-8 animate-spin" />
            <span className="text-muted-foreground ml-2">Loading pool status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="text-primary h-5 w-5" />
            Pool Status Dashboard
          </h3>
          <p className="text-muted-foreground text-sm">
            Current status of {pools.length} pools from recent test data
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <div className="font-medium">Last updated</div>
            <div className="text-muted-foreground">{lastUpdated.toLocaleTimeString()}</div>
          </div>

          <Button variant="outline" size="sm" onClick={loadPoolStatus} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Pools</p>
                <p className="text-2xl font-bold">{pools.length}</p>
              </div>
              <MapPin className="text-primary h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Safe Pools</p>
                <p className="text-2xl font-bold text-green-600">
                  {pools.filter((p) => p.status === 'safe').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    pools.filter((p) => ['caution', 'critical', 'emergency'].includes(p.status))
                      .length
                  }
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Tests</p>
                <p className="text-2xl font-bold">{summary.totalTests}</p>
              </div>
              <TestTube className="text-primary h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pool Status Cards */}
      {pools.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="py-8 text-center">
              <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h4 className="text-foreground mb-2 text-lg font-medium">No Pool Data Found</h4>
              <p className="text-muted-foreground">
                Start by creating chemical tests to see pool status information here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {pools.map((pool) => {
            const statusDisplay = getStatusDisplay(pool.status)
            const StatusIcon = statusDisplay.icon
            const trends = getChemicalTrends(pool.poolId)

            return (
              <Card key={pool.poolId} className={cn('border-2', statusDisplay.bgColor)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {pool.poolName}
                      </CardTitle>
                      <CardDescription>
                        {pool.testCount} tests • Last tested{' '}
                        {pool.daysSinceTest === 0 ? 'today' : `${pool.daysSinceTest} days ago`}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={statusDisplay.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusDisplay.label}
                      </Badge>

                      {onViewPool && (
                        <Button variant="ghost" size="sm" onClick={() => onViewPool(pool.poolId)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Current Chemical Levels */}
                  {pool.lastTest && (
                    <div className="mb-4">
                      <h5 className="mb-2 text-sm font-medium">Current Levels</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Free Chlorine:</span>
                          <span className="font-medium">
                            {pool.lastTest.readings.freeChlorine} ppm
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">pH:</span>
                          <span className="font-medium">{pool.lastTest.readings.ph}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span className="font-medium">
                            {pool.lastTest.readings.temperature}°F
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Alkalinity:</span>
                          <span className="font-medium">
                            {pool.lastTest.readings.alkalinity} ppm
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chemical Trends */}
                  {trends.length > 0 && (
                    <div className="mb-4">
                      <h5 className="mb-2 text-sm font-medium">Recent Trends</h5>
                      <div className="flex flex-wrap gap-2">
                        {trends.slice(0, 3).map((trend) => {
                          const TrendIcon =
                            trend.trend === 'up'
                              ? TrendingUp
                              : trend.trend === 'down'
                                ? TrendingDown
                                : Minus
                          const trendColor =
                            trend.trend === 'up'
                              ? 'text-red-500'
                              : trend.trend === 'down'
                                ? 'text-blue-500'
                                : 'text-gray-500'

                          return (
                            <div key={trend.chemical} className="flex items-center gap-1 text-xs">
                              <TrendIcon className={cn('h-3 w-3', trendColor)} />
                              <span className="capitalize">
                                {trend.chemical.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Issues */}
                  {pool.issues.length > 0 && (
                    <div className="mb-4">
                      <h5 className="mb-2 text-sm font-medium">Issues</h5>
                      <ul className="space-y-1">
                        {pool.issues.slice(0, 3).map((issue, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs">
                            <AlertTriangle
                              className={cn('mt-0.5 h-3 w-3 flex-shrink-0', statusDisplay.color)}
                            />
                            <span>{issue}</span>
                          </li>
                        ))}
                        {pool.issues.length > 3 && (
                          <li className="text-muted-foreground text-xs">
                            ...and {pool.issues.length - 3} more issues
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Last Test Info */}
                  <div className="border-t pt-3">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(pool.lastTested).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(pool.lastTested).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PoolStatusDashboard
