import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Badge } from './badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import {
  TestTube,
  Search,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getChemicalTests,
  deleteChemicalTest,
  exportTestsToCSV,
  getTestSummary,
  type ChemicalTest,
} from '@/lib/localStorage'
import { validateChemical, type ChemicalType } from '@/lib/mahc-validation'

interface ChemicalTestHistoryProps {
  onViewTest?: (test: ChemicalTest) => void
  onEditTest?: (test: ChemicalTest) => void
}

export const ChemicalTestHistory = ({ onViewTest, onEditTest }: ChemicalTestHistoryProps) => {
  const [tests, setTests] = useState<ChemicalTest[]>([])
  const [filteredTests, setFilteredTests] = useState<ChemicalTest[]>([])
  const [loading, setLoading] = useState(true)

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [poolFilter, setPoolFilter] = useState<string>('all')
  const [technicianFilter, setTechnicianFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')

  // Load tests from localStorage
  useEffect(() => {
    const loadTests = () => {
      setLoading(true)
      const storedTests = getChemicalTests()
      setTests(
        storedTests.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      )
      setLoading(false)
    }

    loadTests()

    // Refresh data every 30 seconds to catch updates
    const interval = setInterval(loadTests, 30000)
    return () => clearInterval(interval)
  }, [])

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const pools = [...new Set(tests.map((test) => test.poolName))].sort()
    const technicians = [...new Set(tests.map((test) => test.technician))].sort()
    const statuses = [...new Set(tests.map((test) => test.status))].sort()

    return { pools, technicians, statuses }
  }, [tests])

  // Apply filters and search
  useEffect(() => {
    let filtered = tests

    // Search term filter (searches across multiple fields)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (test) =>
          test.poolName.toLowerCase().includes(term) ||
          test.technician.toLowerCase().includes(term) ||
          test.notes.toLowerCase().includes(term) ||
          test.id.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((test) => test.status === statusFilter)
    }

    // Pool filter
    if (poolFilter !== 'all') {
      filtered = filtered.filter((test) => test.poolName === poolFilter)
    }

    // Technician filter
    if (technicianFilter !== 'all') {
      filtered = filtered.filter((test) => test.technician === technicianFilter)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()

      switch (dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((test) => new Date(test.timestamp) >= cutoffDate)
    }

    setFilteredTests(filtered)
  }, [tests, searchTerm, statusFilter, poolFilter, technicianFilter, dateRange])

  // Handle test deletion
  const handleDeleteTest = (testId: string) => {
    if (
      window.confirm('Are you sure you want to delete this test? This action cannot be undone.')
    ) {
      const success = deleteChemicalTest(testId)
      if (success) {
        setTests((prev) => prev.filter((test) => test.id !== testId))
      } else {
        alert('Failed to delete test. Please try again.')
      }
    }
  }

  // Handle CSV export
  const handleExport = () => {
    const csvContent = exportTestsToCSV(filteredTests)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `pool_tests_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPoolFilter('all')
    setTechnicianFilter('all')
    setDateRange('all')
  }

  // Get status badge variant and icon
  const getStatusDisplay = (status: ChemicalTest['status']) => {
    switch (status) {
      case 'emergency':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          label: 'Emergency',
        }
      case 'flagged':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          label: 'Flagged',
        }
      case 'submitted':
        return {
          variant: 'secondary' as const,
          icon: CheckCircle,
          label: 'Submitted',
        }
      case 'approved':
        return {
          variant: 'secondary' as const,
          icon: CheckCircle,
          label: 'Approved',
        }
      case 'draft':
        return {
          variant: 'outline' as const,
          icon: Clock,
          label: 'Draft',
        }
      default:
        return {
          variant: 'outline' as const,
          icon: FileText,
          label: status,
        }
    }
  }

  // Check if any chemical readings are out of range
  const hasOutOfRangeReadings = (test: ChemicalTest) => {
    const readings = test.readings
    const chemicals: Array<{ value: number; type: ChemicalType }> = [
      { value: readings.freeChlorine, type: 'freeChlorine' },
      { value: readings.totalChlorine, type: 'totalChlorine' },
      { value: readings.ph, type: 'ph' },
      { value: readings.alkalinity, type: 'alkalinity' },
      { value: readings.cyanuricAcid, type: 'cyanuricAcid' },
      { value: readings.calcium, type: 'calcium' },
      { value: readings.temperature, type: 'temperature' },
    ]

    return chemicals.some(({ value, type }) => {
      if (value === 0) return false // Skip unset values
      const validation = validateChemical(value, type)
      return validation?.status === 'critical' || validation?.status === 'emergency'
    })
  }

  const summary = getTestSummary()

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Clock className="text-muted-foreground h-8 w-8 animate-spin" />
            <span className="text-muted-foreground ml-2">Loading test history...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Summary Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <TestTube className="text-primary h-5 w-5" />
            Chemical Test History
          </h3>
          <p className="text-muted-foreground text-sm">
            Review and manage {tests.length} saved chemical tests
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <div className="font-medium">{filteredTests.length} tests shown</div>
            <div className="text-muted-foreground">
              {summary.emergencyTests > 0 && (
                <span className="text-red-600">{summary.emergencyTests} emergency</span>
              )}
              {summary.flaggedTests > 0 && (
                <span className="text-destructive">{summary.flaggedTests} flagged</span>
              )}
              {summary.draftCount > 0 && (
                <span className="text-muted-foreground">{summary.draftCount} drafts</span>
              )}
            </div>
          </div>

          <Button onClick={handleExport} disabled={filteredTests.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search and Filter
          </CardTitle>
          <CardDescription>Find specific tests or filter by criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Label>
              <Input
                placeholder="Search tests, pools, technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {filterOptions.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusDisplay(status as ChemicalTest['status']).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pool Filter */}
            <div className="space-y-2">
              <Label>Pool</Label>
              <Select value={poolFilter} onValueChange={setPoolFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pools</SelectItem>
                  {filterOptions.pools.map((pool) => (
                    <SelectItem key={pool} value={pool}>
                      {pool}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Technician Filter */}
            <div className="space-y-2">
              <Label>Technician</Label>
              <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {filterOptions.technicians.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="quarter">Past 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test History Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredTests.length === 0 ? (
            <div className="py-8 text-center">
              <TestTube className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h4 className="text-foreground mb-2 text-lg font-medium">
                {tests.length === 0 ? 'No tests found' : 'No tests match your filters'}
              </h4>
              <p className="text-muted-foreground">
                {tests.length === 0
                  ? 'Start by creating your first chemical test.'
                  : 'Try adjusting your search terms or filters.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>
                Showing {filteredTests.length} of {tests.length} chemical tests
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Pool</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Key Levels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => {
                  const statusDisplay = getStatusDisplay(test.status)
                  const hasWarnings = hasOutOfRangeReadings(test)
                  const StatusIcon = statusDisplay.icon

                  return (
                    <TableRow
                      key={test.id}
                      className={cn(
                        hasWarnings && 'bg-red-50/50',
                        test.status === 'emergency' && 'bg-red-100/50'
                      )}
                    >
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(test.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(test.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{test.poolName}</div>
                        {hasWarnings && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            Out of range
                          </div>
                        )}
                      </TableCell>

                      <TableCell>{test.technician}</TableCell>

                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div>Cl: {test.readings.freeChlorine} ppm</div>
                          <div>pH: {test.readings.ph}</div>
                          <div>Temp: {test.readings.temperature}°F</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={statusDisplay.variant}
                          className="flex w-fit items-center gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusDisplay.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {onViewTest && (
                            <Button variant="ghost" size="sm" onClick={() => onViewTest(test)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEditTest && test.status === 'draft' && (
                            <Button variant="ghost" size="sm" onClick={() => onEditTest(test)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTest(test.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ChemicalTestHistory
