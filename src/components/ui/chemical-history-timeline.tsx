import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from './card'
import { Button } from './button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  TestTube,
  BarChart3,
  Eye,
  EyeOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateChemical, MAHC_STANDARDS, type ChemicalType } from '@/lib/mahc-validation'

// Chemical reading data types
interface ChemicalReading {
  id: string
  poolId: string
  poolName: string
  timestamp: string
  technician: string
  values: {
    freeChlorine: number
    totalChlorine: number
    ph: number
    alkalinity: number
    cyanuricAcid: number
    calcium: number
    temperature: number
  }
  status: 'compliant' | 'warning' | 'critical' | 'emergency'
}

// Mock historical data - would come from API in real implementation
const mockChemicalHistory: ChemicalReading[] = [
  {
    id: 'READ-001',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    timestamp: '2025-07-30T08:00:00Z',
    technician: 'John Smith',
    values: {
      freeChlorine: 2.1,
      totalChlorine: 2.3,
      ph: 7.4,
      alkalinity: 95,
      cyanuricAcid: 45,
      calcium: 280,
      temperature: 82,
    },
    status: 'compliant',
  },
  {
    id: 'READ-002',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    timestamp: '2025-07-30T14:00:00Z',
    technician: 'Sarah Johnson',
    values: {
      freeChlorine: 1.8,
      totalChlorine: 2.1,
      ph: 7.6,
      alkalinity: 88,
      cyanuricAcid: 47,
      calcium: 285,
      temperature: 84,
    },
    status: 'compliant',
  },
  {
    id: 'READ-003',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    timestamp: '2025-07-30T20:00:00Z',
    technician: 'Mike Davis',
    values: {
      freeChlorine: 1.2,
      totalChlorine: 1.9,
      ph: 7.8,
      alkalinity: 82,
      cyanuricAcid: 50,
      calcium: 290,
      temperature: 81,
    },
    status: 'warning',
  },
  {
    id: 'READ-004',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    timestamp: '2025-07-29T08:00:00Z',
    technician: 'Emily Wilson',
    values: {
      freeChlorine: 0.8,
      totalChlorine: 1.5,
      ph: 8.1,
      alkalinity: 75,
      cyanuricAcid: 55,
      calcium: 295,
      temperature: 83,
    },
    status: 'critical',
  },
  {
    id: 'READ-005',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    timestamp: '2025-07-29T14:00:00Z',
    technician: 'Alex Chen',
    values: {
      freeChlorine: 2.3,
      totalChlorine: 2.5,
      ph: 7.3,
      alkalinity: 92,
      cyanuricAcid: 48,
      calcium: 285,
      temperature: 85,
    },
    status: 'compliant',
  },
  {
    id: 'READ-006',
    poolId: 'POOL-001',
    poolName: 'Main Community Pool',
    timestamp: '2025-07-28T08:00:00Z',
    technician: 'John Smith',
    values: {
      freeChlorine: 0.3,
      totalChlorine: 1.1,
      ph: 8.3,
      alkalinity: 70,
      cyanuricAcid: 60,
      calcium: 320,
      temperature: 86,
    },
    status: 'emergency',
  },
]

// Chemical type options for filtering
const chemicalOptions = [
  { value: 'freeChlorine', label: 'Free Chlorine', unit: 'ppm' },
  { value: 'totalChlorine', label: 'Total Chlorine', unit: 'ppm' },
  { value: 'ph', label: 'pH Level', unit: '' },
  { value: 'alkalinity', label: 'Total Alkalinity', unit: 'ppm' },
  { value: 'cyanuricAcid', label: 'Cyanuric Acid', unit: 'ppm' },
  { value: 'calcium', label: 'Calcium Hardness', unit: 'ppm' },
  { value: 'temperature', label: 'Temperature', unit: '°F' },
] as const

type ChemicalKey = (typeof chemicalOptions)[number]['value']

// Time range options
const timeRangeOptions = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
]

// Pool selection options
const poolOptions = [
  { value: 'POOL-001', label: 'Main Community Pool' },
  { value: 'POOL-002', label: 'Kiddie Pool' },
  { value: 'POOL-003', label: 'Therapy Pool' },
  { value: 'POOL-004', label: 'Lap Pool' },
]

interface ChemicalHistoryTimelineProps {
  initialPoolId?: string
  initialChemical?: ChemicalKey
  onExport?: (data: ChemicalReading[]) => void
}

export const ChemicalHistoryTimeline = ({
  initialPoolId = 'POOL-001',
  initialChemical = 'freeChlorine',
  onExport,
}: ChemicalHistoryTimelineProps) => {
  // State management
  const [selectedPool, setSelectedPool] = useState(initialPoolId)
  const [selectedChemical, setSelectedChemical] = useState<ChemicalKey>(initialChemical)
  const [timeRange, setTimeRange] = useState('7d')
  const [visibleReadings, setVisibleReadings] = useState<Set<string>>(new Set())
  const [showCompliance, setShowCompliance] = useState(true)

  // Filter data based on selections
  const filteredData = useMemo(() => {
    const now = new Date()
    const cutoffTime = new Date()

    switch (timeRange) {
      case '24h':
        cutoffTime.setHours(now.getHours() - 24)
        break
      case '7d':
        cutoffTime.setDate(now.getDate() - 7)
        break
      case '30d':
        cutoffTime.setDate(now.getDate() - 30)
        break
      case '90d':
        cutoffTime.setDate(now.getDate() - 90)
        break
    }

    return mockChemicalHistory
      .filter(
        (reading) => reading.poolId === selectedPool && new Date(reading.timestamp) >= cutoffTime
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [selectedPool, timeRange])

  // Get chemical standard for selected chemical
  const chemicalStandard = MAHC_STANDARDS[selectedChemical as ChemicalType]
  const selectedChemicalInfo = chemicalOptions.find((opt) => opt.value === selectedChemical)

  // Calculate trend for selected chemical
  const calculateTrend = (readings: ChemicalReading[]) => {
    if (readings.length < 2) return { direction: 'stable', change: 0 }

    const latest = readings[0].values[selectedChemical]
    const previous = readings[1].values[selectedChemical]
    const change = latest - previous

    if (Math.abs(change) < 0.1) return { direction: 'stable', change: 0 }
    return {
      direction: change > 0 ? 'up' : 'down',
      change: Math.abs(change),
    }
  }

  const trend = calculateTrend(filteredData)

  // Toggle reading details visibility
  const toggleReadingVisibility = (readingId: string) => {
    setVisibleReadings((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(readingId)) {
        newSet.delete(readingId)
      } else {
        newSet.add(readingId)
      }
      return newSet
    })
  }

  // Export functionality
  const handleExport = () => {
    if (onExport) {
      onExport(filteredData)
    } else {
      // Default export behavior - generate CSV
      const csvContent = [
        // Header
        [
          'Timestamp',
          'Pool',
          'Technician',
          'Free Chlorine',
          'Total Chlorine',
          'pH',
          'Alkalinity',
          'Cyanuric Acid',
          'Calcium',
          'Temperature',
          'Status',
        ].join(','),
        // Data rows
        ...filteredData.map((reading) =>
          [
            new Date(reading.timestamp).toLocaleString(),
            reading.poolName,
            reading.technician,
            reading.values.freeChlorine,
            reading.values.totalChlorine,
            reading.values.ph,
            reading.values.alkalinity,
            reading.values.cyanuricAcid,
            reading.values.calcium,
            reading.values.temperature,
            reading.status,
          ].join(',')
        ),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chemical-history-${selectedPool}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-[var(--semantic-brand-primary)]" />
            Chemical History Timeline
          </h3>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Track chemical trends over time with MAHC compliance monitoring
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Pool Selection */}
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {poolOptions.map((pool) => (
                <SelectItem key={pool.value} value={pool.value}>
                  {pool.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Chemical Selection */}
          <Select
            value={selectedChemical}
            onValueChange={(value) => setSelectedChemical(value as ChemicalKey)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {chemicalOptions.map((chemical) => (
                <SelectItem key={chemical.value} value={chemical.value}>
                  {chemical.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompliance(!showCompliance)}
            className="whitespace-nowrap"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showCompliance ? 'Hide' : 'Show'} Compliance
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={filteredData.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Status & Trend */}
      {filteredData.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm text-[var(--semantic-text-secondary)]">
                  Current {selectedChemicalInfo?.label}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {filteredData[0].values[selectedChemical]}
                  </span>
                  <span className="text-sm text-[var(--semantic-text-secondary)]">
                    {selectedChemicalInfo?.unit}
                  </span>
                  <div className="flex items-center gap-1">
                    {trend.direction === 'up' && (
                      <TrendingUp className="h-4 w-4 text-[var(--semantic-status-safe)]" />
                    )}
                    {trend.direction === 'down' && (
                      <TrendingDown className="h-4 w-4 text-[var(--semantic-status-critical)]" />
                    )}
                    {trend.direction === 'stable' && (
                      <Minus className="h-4 w-4 text-[var(--semantic-text-secondary)]" />
                    )}
                    <span className="text-xs text-[var(--semantic-text-secondary)]">
                      {trend.change > 0 ? `±${trend.change}` : 'stable'}
                    </span>
                  </div>
                </div>
              </div>

              {showCompliance && chemicalStandard && (
                <div className="text-right">
                  <div className="text-sm text-[var(--semantic-text-secondary)]">MAHC Range</div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {chemicalStandard.min} - {chemicalStandard.max} {chemicalStandard.unit}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--semantic-text-secondary)]">
                    Ideal: {chemicalStandard.ideal.min} - {chemicalStandard.ideal.max}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-[var(--semantic-text-secondary)]" />
              <h4 className="mt-4 text-lg font-medium text-[var(--semantic-text-primary)]">
                No readings found
              </h4>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
                No chemical readings available for the selected time range.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((reading, index) => {
            const isVisible = visibleReadings.has(reading.id)
            const currentValue = reading.values[selectedChemical]
            const validation = chemicalStandard
              ? validateChemical(currentValue, selectedChemical as ChemicalType)
              : null
            const previousReading = filteredData[index + 1]
            const valueChange = previousReading
              ? currentValue - previousReading.values[selectedChemical]
              : 0

            return (
              <Card
                key={reading.id}
                className={cn(
                  'transition-all duration-200',
                  reading.status === 'emergency' &&
                    'border-[var(--semantic-status-emergency)] bg-[var(--primitive-coral-100)]',
                  reading.status === 'critical' &&
                    'border-[var(--semantic-status-critical)] bg-[var(--primitive-coral-100)]',
                  reading.status === 'warning' &&
                    'border-[var(--semantic-status-caution)] bg-[var(--primitive-yellow-100)]',
                  reading.status === 'compliant' &&
                    'border-[var(--semantic-status-safe)] bg-[var(--primitive-green-100)]'
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full',
                          reading.status === 'emergency' &&
                            'bg-[var(--semantic-status-emergency)] text-white',
                          reading.status === 'critical' &&
                            'bg-[var(--semantic-status-critical)] text-white',
                          reading.status === 'warning' &&
                            'bg-[var(--semantic-status-caution)] text-white',
                          reading.status === 'compliant' &&
                            'bg-[var(--semantic-status-safe)] text-white'
                        )}
                      >
                        <TestTube className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {new Date(reading.timestamp).toLocaleDateString()} at{' '}
                          {new Date(reading.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-sm text-[var(--semantic-text-secondary)]">
                          by {reading.technician}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-lg font-bold',
                              validation?.status === 'emergency' &&
                                'text-[var(--semantic-status-emergency)]',
                              validation?.status === 'critical' &&
                                'text-[var(--semantic-status-critical)]',
                              validation?.status === 'warning' &&
                                'text-[var(--semantic-status-caution)]',
                              validation?.status === 'good' && 'text-[var(--semantic-status-safe)]'
                            )}
                          >
                            {currentValue} {selectedChemicalInfo?.unit}
                          </span>
                          {Math.abs(valueChange) > 0.05 && (
                            <div className="flex items-center gap-1">
                              {valueChange > 0 ? (
                                <TrendingUp className="h-3 w-3 text-[var(--semantic-status-safe)]" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-[var(--semantic-status-critical)]" />
                              )}
                              <span className="text-xs text-[var(--semantic-text-secondary)]">
                                {valueChange > 0 ? '+' : ''}
                                {valueChange.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {reading.status !== 'compliant' && (
                          <div className="flex items-center gap-1 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="capitalize">{reading.status}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadingVisibility(reading.id)}
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isVisible && (
                  <CardContent className="pt-0">
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {chemicalOptions.map((chemical) => {
                          const value = reading.values[chemical.value]
                          const isSelected = chemical.value === selectedChemical

                          return (
                            <div
                              key={chemical.value}
                              className={cn(
                                'rounded-lg border p-2',
                                isSelected &&
                                  'border-[var(--semantic-brand-primary)] bg-[var(--primitive-blue-100)]'
                              )}
                            >
                              <div className="text-xs text-[var(--semantic-text-secondary)]">
                                {chemical.label}
                              </div>
                              <div className="font-medium">
                                {value} {chemical.unit}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {validation && showCompliance && selectedChemical && (
                        <div className="mt-3 rounded-md border border-[var(--semantic-border-default)] p-3">
                          <div className="text-sm">
                            <div className={cn('font-medium', validation.color)}>
                              {validation.message}
                            </div>
                            {validation.recommendation && (
                              <div className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
                                <strong>Recommendation:</strong> {validation.recommendation}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChemicalHistoryTimeline
