import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Badge } from './badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, TestTube, Calendar, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getChemicalTests } from '@/lib/localStorage'
import { getAcceptableRange, getIdealRange, type ChemicalType } from '@/lib/mahc-validation'

interface ChartDataPoint {
  date: string
  timestamp: number
  formattedDate: string
  freeChlorine: number
  ph: number
  alkalinity: number
  temperature: number
  poolName: string
  technician: string
}

interface TrendSummary {
  chemical: ChemicalType
  name: string
  current: number
  previous: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
  unit: string
  color: string
}

const CHEMICAL_CONFIGS = {
  freeChlorine: {
    name: 'Free Chlorine',
    unit: 'ppm',
    color: '#3b82f6',
    idealMin: 1.0,
    idealMax: 3.0,
    acceptableMin: 0.5,
    acceptableMax: 5.0,
  },
  ph: {
    name: 'pH Level',
    unit: '',
    color: '#10b981',
    idealMin: 7.2,
    idealMax: 7.6,
    acceptableMin: 7.0,
    acceptableMax: 8.0,
  },
  alkalinity: {
    name: 'Alkalinity',
    unit: 'ppm',
    color: '#f59e0b',
    idealMin: 80,
    idealMax: 120,
    acceptableMin: 60,
    acceptableMax: 180,
  },
  temperature: {
    name: 'Temperature',
    unit: '°F',
    color: '#ef4444',
    idealMin: 78,
    idealMax: 82,
    acceptableMin: 70,
    acceptableMax: 90,
  },
} as const

export const ChemicalTrendChart = () => {
  const [selectedPool, setSelectedPool] = useState<string>('all')
  const [selectedChemical, setSelectedChemical] = useState<ChemicalType>('freeChlorine')
  const [timeRange, setTimeRange] = useState<string>('30days')
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [availablePools, setAvailablePools] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)

  // Load and process chart data
  const loadChartData = useMemo(() => {
    return () => {
      setLoading(true)

      const tests = getChemicalTests()

      // Get unique pools
      const poolMap = new Map<string, string>()
      tests.forEach((test) => {
        poolMap.set(test.poolId, test.poolName)
      })

      const pools = Array.from(poolMap.entries()).map(([id, name]) => ({ id, name }))
      setAvailablePools(pools)

      // Filter tests based on selections
      let filteredTests = tests

      if (selectedPool !== 'all') {
        filteredTests = filteredTests.filter((test) => test.poolId === selectedPool)
      }

      // Filter by time range
      const now = new Date()
      const cutoffDate = new Date()

      switch (timeRange) {
        case '7days':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case '30days':
          cutoffDate.setDate(now.getDate() - 30)
          break
        case '90days':
          cutoffDate.setDate(now.getDate() - 90)
          break
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
        default:
          cutoffDate.setDate(now.getDate() - 30)
      }

      filteredTests = filteredTests.filter((test) => new Date(test.timestamp) >= cutoffDate)

      // Sort by timestamp and convert to chart data
      const sortedTests = filteredTests.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )

      const processedData: ChartDataPoint[] = sortedTests
        .map((test) => ({
          date: new Date(test.timestamp).toISOString().split('T')[0],
          timestamp: new Date(test.timestamp).getTime(),
          formattedDate: new Date(test.timestamp).toLocaleDateString(),
          freeChlorine: test.readings.freeChlorine || 0,
          ph: test.readings.ph || 0,
          alkalinity: test.readings.alkalinity || 0,
          temperature: test.readings.temperature || 0,
          poolName: test.poolName,
          technician: test.technician,
        }))
        .filter((point) => point[selectedChemical] > 0) // Only show points with actual readings

      setChartData(processedData)
      setLoading(false)
    }
  }, [selectedPool, selectedChemical, timeRange])

  useEffect(() => {
    loadChartData()
  }, [loadChartData])

  // Calculate trend summary
  const trendSummary = useMemo((): TrendSummary | null => {
    if (chartData.length < 2) return null

    const config = CHEMICAL_CONFIGS[selectedChemical]
    const current = chartData[chartData.length - 1][selectedChemical]
    const previous = chartData[chartData.length - 2][selectedChemical]

    const change = current - previous
    const changePercent = Math.abs(change / previous) * 100

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (changePercent > 2) {
      // More than 2% change is significant
      trend = change > 0 ? 'up' : 'down'
    }

    return {
      chemical: selectedChemical,
      name: config.name,
      current,
      previous,
      change,
      changePercent,
      trend,
      unit: config.unit,
      color: config.color,
    }
  }, [chartData, selectedChemical])

  // Custom tooltip for the chart
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: ChartDataPoint; value: number }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const config = CHEMICAL_CONFIGS[selectedChemical]

      return (
        <div className="bg-background rounded-lg border p-3 shadow-lg">
          <p className="font-medium">{data.formattedDate}</p>
          <p className="text-muted-foreground mb-2 text-sm">{data.poolName}</p>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }} />
            <span className="text-sm">
              {config.name}: {payload[0].value}
              {config.unit}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">Technician: {data.technician}</p>
        </div>
      )
    }
    return null
  }

  const config = CHEMICAL_CONFIGS[selectedChemical]
  const idealRange = getIdealRange(selectedChemical)
  const acceptableRange = getAcceptableRange(selectedChemical)

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="text-muted-foreground h-8 w-8 animate-spin" />
            <span className="text-muted-foreground ml-2">Loading trend data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="content-data space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Activity className="text-primary h-5 w-5" />
            Chemical Trend Analysis
          </h3>
          <p className="text-muted-foreground text-sm">
            Visual trends for chemical levels over time
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadChartData} disabled={loading}>
          <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chart Settings</CardTitle>
          <CardDescription>Configure what data to display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Pool Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pool</label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pools</SelectItem>
                  {availablePools.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      {pool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chemical Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chemical</label>
              <Select
                value={selectedChemical}
                onValueChange={(value) => setSelectedChemical(value as ChemicalType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freeChlorine">Free Chlorine</SelectItem>
                  <SelectItem value="ph">pH Level</SelectItem>
                  <SelectItem value="alkalinity">Alkalinity</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Summary */}
      {trendSummary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Current</p>
                  <p className="text-2xl font-bold">
                    {trendSummary.current.toFixed(1)}
                    {trendSummary.unit}
                  </p>
                </div>
                <TestTube className="text-primary h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Previous</p>
                  <p className="text-2xl font-bold">
                    {trendSummary.previous.toFixed(1)}
                    {trendSummary.unit}
                  </p>
                </div>
                <Calendar className="text-muted-foreground h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Change</p>
                  <p
                    className={cn(
                      'text-2xl font-bold',
                      trendSummary.trend === 'up' && 'text-destructive',
                      trendSummary.trend === 'down' && 'text-primary',
                      trendSummary.trend === 'stable' && 'text-muted-foreground'
                    )}
                  >
                    {trendSummary.change > 0 ? '+' : ''}
                    {trendSummary.change.toFixed(1)}
                    {trendSummary.unit}
                  </p>
                </div>
                {trendSummary.trend === 'up' && <TrendingUp className="h-8 w-8 text-destructive" />}
                {trendSummary.trend === 'down' && (
                  <TrendingDown className="h-8 w-8 text-primary" />
                )}
                {trendSummary.trend === 'stable' && <Activity className="h-8 w-8 text-muted-foreground" />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Trend</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        trendSummary.trend === 'up'
                          ? 'destructive'
                          : trendSummary.trend === 'down'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {trendSummary.trend === 'up' && 'Increasing'}
                      {trendSummary.trend === 'down' && 'Decreasing'}
                      {trendSummary.trend === 'stable' && 'Stable'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {trendSummary.changePercent.toFixed(1)}% change
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: config.color }} />
            {config.name} Trends
          </CardTitle>
          <CardDescription>
            {chartData.length} data points over {timeRange.replace(/\d+/, (match) => `${match} `)}
            {selectedPool === 'all'
              ? 'for all pools'
              : `for ${availablePools.find((p) => p.id === selectedPool)?.name || 'selected pool'}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="py-8 text-center">
              <TestTube className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h4 className="text-foreground mb-2 text-lg font-medium">No Data Available</h4>
              <p className="text-muted-foreground">
                No {config.name.toLowerCase()} readings found for the selected time period. Try
                adjusting your filters or check that tests have been recorded.
              </p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: `${config.name} (${config.unit})`,
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Ideal range reference lines */}
                  <ReferenceLine
                    y={config.idealMin}
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    opacity={0.7}
                    label={{ value: 'Ideal Min', position: 'topRight', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={config.idealMax}
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    opacity={0.7}
                    label={{ value: 'Ideal Max', position: 'topRight', fontSize: 10 }}
                  />

                  {/* Acceptable range reference lines */}
                  <ReferenceLine
                    y={config.acceptableMin}
                    stroke="#f59e0b"
                    strokeDasharray="2 2"
                    opacity={0.5}
                    label={{ value: 'Min Safe', position: 'topRight', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={config.acceptableMax}
                    stroke="#f59e0b"
                    strokeDasharray="2 2"
                    opacity={0.5}
                    label={{ value: 'Max Safe', position: 'topRight', fontSize: 10 }}
                  />

                  <Line
                    type="monotone"
                    dataKey={selectedChemical}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                    name={`${config.name} (${config.unit})`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Range Reference */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h5 className="mb-2 text-sm font-medium">Ideal Range</h5>
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 rounded bg-success"></div>
                <span className="text-sm">{idealRange}</span>
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium">Acceptable Range</h5>
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 rounded bg-warning"></div>
                <span className="text-sm">{acceptableRange}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChemicalTrendChart
