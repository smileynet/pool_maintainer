import { useState } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import {
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Thermometer,
  Droplet,
  FlaskConical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  validateChemical,
  generateComplianceReport,
  shouldClosePool,
  getAcceptableRange,
  getIdealRange,
  type ChemicalType,
} from '@/lib/mahc-validation'

// Chemical test data types
interface ChemicalReading {
  freeChlorine: number
  totalChlorine: number
  ph: number
  alkalinity: number
  cyanuricAcid: number
  calcium: number
  temperature: number
}

interface ChemicalTest {
  id: string
  poolId: string
  poolName: string
  readings: ChemicalReading
  technician: string
  timestamp: string
  notes: string
  status: 'draft' | 'submitted' | 'approved' | 'flagged' | 'emergency'
  corrections?: {
    chemical: string
    amount: string
    action: string
  }[]
  complianceReport?: ReturnType<typeof generateComplianceReport>
}

// Chemical input field component
const ChemicalInput = ({
  label,
  value,
  onChange,
  chemical,
  icon: Icon,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  chemical: ChemicalType
  icon: React.ElementType
  placeholder?: string
}) => {
  const numValue = parseFloat(value) || 0
  const validation = value ? validateChemical(numValue, chemical) : null

  return (
    <div className="space-y-2">
      <Label htmlFor={chemical} className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      <div className="space-y-1">
        <Input
          id={chemical}
          type="number"
          step={chemical === 'ph' ? '0.1' : chemical.includes('Chlorine') ? '0.1' : '1'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'transition-colors',
            validation?.status === 'emergency' &&
              'border-red-700 bg-red-50 focus-visible:ring-red-700',
            validation?.status === 'critical' && 'border-red-500 focus-visible:ring-red-500',
            validation?.status === 'warning' && 'border-orange-500 focus-visible:ring-orange-500',
            validation?.status === 'good' && 'border-green-500 focus-visible:ring-green-500'
          )}
        />
        {validation && (
          <div
            className={cn(
              'rounded-md border p-2 text-xs',
              validation.bgColor,
              validation.borderColor
            )}
          >
            <div className={cn('font-medium', validation.color)}>{validation.message}</div>
            <div className="mt-1 text-gray-600">
              Acceptable: {getAcceptableRange(chemical)} | Ideal: {getIdealRange(chemical)}
            </div>
            {validation.recommendation && (
              <div className="mt-2 text-xs text-gray-700">
                <strong>Action:</strong> {validation.recommendation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Mock pool data for selection
const mockPools = [
  { id: 'POOL-001', name: 'Main Community Pool' },
  { id: 'POOL-002', name: 'Kiddie Pool' },
  { id: 'POOL-003', name: 'Therapy Pool' },
  { id: 'POOL-004', name: 'Lap Pool' },
]

// Mock technician data
const mockTechnicians = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'Alex Chen']

// Main Chemical Test Form Component
export const ChemicalTestForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Partial<ChemicalTest>
  onSubmit: (test: ChemicalTest) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<Partial<ChemicalTest>>({
    poolId: '',
    poolName: '',
    technician: '',
    notes: '',
    readings: {
      freeChlorine: 0,
      totalChlorine: 0,
      ph: 0,
      alkalinity: 0,
      cyanuricAcid: 0,
      calcium: 0,
      temperature: 0,
    },
    ...initialData,
  })

  const [readingValues, setReadingValues] = useState({
    freeChlorine: initialData?.readings?.freeChlorine?.toString() || '',
    totalChlorine: initialData?.readings?.totalChlorine?.toString() || '',
    ph: initialData?.readings?.ph?.toString() || '',
    alkalinity: initialData?.readings?.alkalinity?.toString() || '',
    cyanuricAcid: initialData?.readings?.cyanuricAcid?.toString() || '',
    calcium: initialData?.readings?.calcium?.toString() || '',
    temperature: initialData?.readings?.temperature?.toString() || '',
  })

  const updateReading = (chemical: keyof ChemicalReading, value: string) => {
    setReadingValues((prev) => ({ ...prev, [chemical]: value }))

    const numValue = parseFloat(value) || 0
    setFormData((prev) => ({
      ...prev,
      readings: {
        ...prev.readings!,
        [chemical]: numValue,
      },
    }))
  }

  // Enhanced validation using MAHC compliance
  const hasRequiredFields = formData.poolId && formData.technician
  const hasReadings = Object.values(readingValues).some((v) => v !== '')

  // Generate compliance report for current readings
  const numericReadings = Object.entries(readingValues).reduce(
    (acc, [chemical, value]) => {
      if (value) {
        acc[chemical as ChemicalType] = parseFloat(value)
      }
      return acc
    },
    {} as Partial<Record<ChemicalType, number>>
  )

  const complianceReport = hasReadings ? generateComplianceReport(numericReadings) : null
  const poolClosure = hasReadings
    ? shouldClosePool(numericReadings)
    : { shouldClose: false, reasons: [] }

  const handleSubmit = () => {
    if (!hasRequiredFields || !hasReadings || !complianceReport) return

    // Determine status based on compliance report
    let status: ChemicalTest['status'] = 'submitted'
    if (complianceReport.overall === 'emergency') {
      status = 'emergency'
    } else if (complianceReport.overall === 'non-compliant') {
      status = 'flagged'
    }

    const test: ChemicalTest = {
      id: initialData?.id || `TEST-${Date.now()}`,
      poolId: formData.poolId!,
      poolName: mockPools.find((p) => p.id === formData.poolId)?.name || '',
      readings: formData.readings!,
      technician: formData.technician!,
      timestamp: new Date().toISOString(),
      notes: formData.notes || '',
      status,
      complianceReport,
    }

    onSubmit(test)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <TestTube className="h-5 w-5 text-blue-500" />
            Chemical Test Entry
          </h3>
          <p className="text-sm text-gray-600">
            Record chemical readings with MAHC compliance validation
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleString()}
        </div>
      </div>

      {/* Pool and Technician Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Droplet className="h-4 w-4" />
            Pool Selection
          </Label>
          <Select
            value={formData.poolId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, poolId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pool facility" />
            </SelectTrigger>
            <SelectContent>
              {mockPools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  {pool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4" />
            Technician
          </Label>
          <Select
            value={formData.technician}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, technician: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {mockTechnicians.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chemical Readings */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 font-medium">
          <FlaskConical className="h-4 w-4" />
          Chemical Readings
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChemicalInput
            label="Free Chlorine"
            value={readingValues.freeChlorine}
            onChange={(value) => updateReading('freeChlorine', value)}
            chemical="freeChlorine"
            icon={TestTube}
            placeholder="1.5"
          />

          <ChemicalInput
            label="Total Chlorine"
            value={readingValues.totalChlorine}
            onChange={(value) => updateReading('totalChlorine', value)}
            chemical="totalChlorine"
            icon={TestTube}
            placeholder="2.0"
          />

          <ChemicalInput
            label="pH Level"
            value={readingValues.ph}
            onChange={(value) => updateReading('ph', value)}
            chemical="ph"
            icon={FlaskConical}
            placeholder="7.4"
          />

          <ChemicalInput
            label="Total Alkalinity"
            value={readingValues.alkalinity}
            onChange={(value) => updateReading('alkalinity', value)}
            chemical="alkalinity"
            icon={TestTube}
            placeholder="100"
          />

          <ChemicalInput
            label="Cyanuric Acid"
            value={readingValues.cyanuricAcid}
            onChange={(value) => updateReading('cyanuricAcid', value)}
            chemical="cyanuricAcid"
            icon={FlaskConical}
            placeholder="40"
          />

          <ChemicalInput
            label="Calcium Hardness"
            value={readingValues.calcium}
            onChange={(value) => updateReading('calcium', value)}
            chemical="calcium"
            icon={TestTube}
            placeholder="300"
          />
        </div>

        {/* Temperature - Full Width */}
        <div className="mt-4">
          <ChemicalInput
            label="Water Temperature"
            value={readingValues.temperature}
            onChange={(value) => updateReading('temperature', value)}
            chemical="temperature"
            icon={Thermometer}
            placeholder="81"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </Label>
        <textarea
          id="notes"
          className="resize-vertical min-h-[80px] w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Additional observations, equipment issues, or special conditions..."
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      {/* Enhanced Compliance Alerts */}
      {complianceReport && complianceReport.overall !== 'compliant' && hasReadings && (
        <Card
          className={cn(
            'border-2',
            complianceReport.overall === 'emergency' && 'border-red-600 bg-red-50',
            complianceReport.overall === 'non-compliant' && 'border-red-400 bg-red-50',
            complianceReport.overall === 'warning' && 'border-orange-400 bg-orange-50'
          )}
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={cn(
                  'mt-0.5 h-5 w-5',
                  complianceReport.overall === 'emergency' && 'text-red-700',
                  complianceReport.overall === 'non-compliant' && 'text-red-600',
                  complianceReport.overall === 'warning' && 'text-orange-600'
                )}
              />
              <div className="flex-1">
                <h4
                  className={cn(
                    'font-medium',
                    complianceReport.overall === 'emergency' && 'text-red-900',
                    complianceReport.overall === 'non-compliant' && 'text-red-900',
                    complianceReport.overall === 'warning' && 'text-orange-900'
                  )}
                >
                  {complianceReport.overall === 'emergency' &&
                    'EMERGENCY: Immediate Pool Closure Required'}
                  {complianceReport.overall === 'non-compliant' &&
                    'Critical Chemical Levels Detected'}
                  {complianceReport.overall === 'warning' && 'Chemical Levels Outside Ideal Range'}
                </h4>

                <div
                  className={cn(
                    'mt-2 text-sm',
                    complianceReport.overall === 'emergency' && 'text-red-800',
                    complianceReport.overall === 'non-compliant' && 'text-red-700',
                    complianceReport.overall === 'warning' && 'text-orange-700'
                  )}
                >
                  <div className="mb-2">
                    Tests: {complianceReport.passedTests} passed, {complianceReport.warningTests}{' '}
                    warnings, {complianceReport.criticalTests} critical
                    {complianceReport.emergencyTests > 0 &&
                      `, ${complianceReport.emergencyTests} emergency`}
                  </div>

                  {complianceReport.requiredActions.length > 0 && (
                    <div>
                      <strong>Required Actions:</strong>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {complianceReport.requiredActions.map((action, index) => (
                          <li key={index} className="text-xs">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {complianceReport.recommendations.length > 0 && (
                    <div className="mt-2">
                      <strong>Recommendations:</strong>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {complianceReport.recommendations.map((rec, index) => (
                          <li key={index} className="text-xs">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {poolClosure.shouldClose && (
              <div className="mt-3 rounded-md border border-red-300 bg-red-100 p-3">
                <div className="text-sm font-medium text-red-900">🚫 Pool Closure Required</div>
                <div className="mt-1 text-xs text-red-800">{poolClosure.reasons.join('; ')}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!hasRequiredFields || !hasReadings}
          className={cn(
            'flex-1',
            complianceReport?.overall === 'emergency' && 'bg-red-600 hover:bg-red-700',
            complianceReport?.overall === 'non-compliant' && 'bg-red-500 hover:bg-red-600'
          )}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {complianceReport?.overall === 'emergency' && 'Submit Emergency Test'}
          {complianceReport?.overall === 'non-compliant' && 'Submit (Critical)'}
          {complianceReport?.overall === 'warning' && 'Submit (Warning)'}
          {(!complianceReport || complianceReport.overall === 'compliant') && 'Submit Test'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ChemicalTestForm
