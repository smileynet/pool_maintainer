import { useState, useEffect } from 'react'
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
  Save,
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
import {
  saveChemicalTest,
  saveDraft,
  addTechnicianName,
  getTechnicianNames,
  getPoolsByTests,
  type ChemicalTest,
} from '@/lib/localStorage'

// Chemical test data types (ChemicalTest imported from localStorage)
interface ChemicalReading {
  freeChlorine: number
  totalChlorine: number
  ph: number
  alkalinity: number
  cyanuricAcid: number
  calcium: number
  temperature: number
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
          data-testid={`${chemical}-input`}
          type="number"
          step={chemical === 'ph' ? '0.1' : chemical.includes('Chlorine') ? '0.1' : '1'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-describedby={validation ? `${chemical}-validation` : undefined}
          aria-invalid={validation && (validation.status === 'emergency' || validation.status === 'critical')}
          className={cn(
            'transition-colors',
            validation?.status === 'emergency' &&
              'bg-card border-destructive focus-visible:ring-destructive',
            validation?.status === 'critical' &&
              'border-destructive focus-visible:ring-destructive',
            validation?.status === 'warning' && 'border-warning focus-visible:ring-warning',
            validation?.status === 'good' && 'border-success focus-visible:ring-success'
          )}
        />
        {validation && (
          <div
            id={`${chemical}-validation`}
            data-testid={`${chemical}-validation`}
            className={cn(
              'rounded-md border p-2 text-xs',
              validation.bgColor,
              validation.borderColor
            )}
          >
            <div className={cn('font-medium', validation.color)}>{validation.message}</div>
            <div className="text-muted-foreground mt-1">
              Acceptable: {getAcceptableRange(chemical)} | Ideal: {getIdealRange(chemical)}
            </div>
            {validation.recommendation && (
              <div className="text-foreground mt-2 text-xs">
                <strong>Action:</strong> {validation.recommendation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Default pool data for selection
const defaultPools = [
  { id: 'POOL-001', name: 'Main Community Pool' },
  { id: 'POOL-002', name: 'Kiddie Pool' },
  { id: 'POOL-003', name: 'Therapy Pool' },
  { id: 'POOL-004', name: 'Lap Pool' },
]

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
  // Form data state
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

  // Dynamic data from localStorage
  const [availablePools, setAvailablePools] = useState(defaultPools)
  const [availableTechnicians, setAvailableTechnicians] = useState<string[]>([])

  // Save status state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')

  // Load dynamic data on component mount
  useEffect(() => {
    const poolsFromTests = getPoolsByTests()
    if (poolsFromTests.length > 0) {
      setAvailablePools(poolsFromTests)
    }

    const technicianNames = getTechnicianNames()
    setAvailableTechnicians(technicianNames)
  }, [])

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

  // Save draft functionality
  const handleSaveDraft = async () => {
    if (!formData.poolId || !formData.technician) {
      setSaveStatus('error')
      setSaveMessage('Pool and technician required to save draft')
      setTimeout(() => setSaveStatus('idle'), 3000)
      return
    }

    setSaveStatus('saving')
    const draftId = initialData?.id || `DRAFT-${Date.now()}`

    const success = saveDraft({
      ...formData,
      id: draftId,
      readings: formData.readings!,
    })

    if (success) {
      setSaveStatus('saved')
      setSaveMessage('Draft saved successfully')

      // Add new technician name to list
      if (formData.technician && !availableTechnicians.includes(formData.technician)) {
        addTechnicianName(formData.technician)
        setAvailableTechnicians((prev) => [...prev, formData.technician!])
      }
    } else {
      setSaveStatus('error')
      setSaveMessage('Failed to save draft')
    }

    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  const handleSubmit = async () => {
    if (!hasRequiredFields || !hasReadings || !complianceReport) return

    setSaveStatus('saving')

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
      poolName: availablePools.find((p) => p.id === formData.poolId)?.name || '',
      readings: formData.readings!,
      technician: formData.technician!,
      timestamp: new Date().toISOString(),
      notes: formData.notes || '',
      status,
    }

    // Save to localStorage first
    const saveSuccess = saveChemicalTest(test)

    if (saveSuccess) {
      setSaveStatus('saved')
      setSaveMessage('Test saved successfully')

      // Add new technician name to list if not already present
      if (formData.technician && !availableTechnicians.includes(formData.technician)) {
        addTechnicianName(formData.technician)
        setAvailableTechnicians((prev) => [...prev, formData.technician!])
      }

      // Call the original onSubmit callback
      onSubmit(test)
    } else {
      setSaveStatus('error')
      setSaveMessage('Failed to save test')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <div className="space-y-6" data-testid="chemical-test-form">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <TestTube className="text-primary h-5 w-5" />
            Chemical Test Entry
          </h3>
          <p className="text-muted-foreground text-sm">
            Record chemical readings with MAHC compliance validation
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleString()}
        </div>
      </div>

      {/* Pool and Technician Selection */}
      <section aria-labelledby="pool-technician-section" className="grid grid-cols-1 gap-4 md:grid-cols-2 desktop:gap-6">
        <h2 id="pool-technician-section" className="sr-only">Pool and Technician Selection</h2>
        <div className="form-group">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Droplet className="h-4 w-4" />
            Pool Selection
          </Label>
          <Select
            value={formData.poolId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, poolId: value }))}
          >
            <SelectTrigger data-testid="pool-selector">
              <SelectValue placeholder="Select pool facility" />
            </SelectTrigger>
            <SelectContent>
              {availablePools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  {pool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-group">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4" />
            Technician
          </Label>
          {availableTechnicians.length > 0 ? (
            <Select
              value={formData.technician}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, technician: value }))}
            >
              <SelectTrigger data-testid="technician-selector">
                <SelectValue placeholder="Select or enter technician name" />
              </SelectTrigger>
              <SelectContent>
                {availableTechnicians.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Input
            type="text"
            data-testid="technician-input"
            placeholder="Enter technician name"
            value={formData.technician || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, technician: e.target.value }))}
            className="mt-2"
          />
        </div>
      </section>

      {/* Chemical Readings */}
      <section aria-labelledby="chemical-readings-section">
        <h4 id="chemical-readings-section" className="mb-4 flex items-center gap-2 font-medium">
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
      </section>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </Label>
        <textarea
          id="notes"
          data-testid="notes-input"
          className="resize-vertical border-input focus:ring-ring bg-background text-foreground min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
          placeholder="Additional observations, equipment issues, or special conditions..."
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      {/* Enhanced Compliance Alerts */}
      {complianceReport && complianceReport.overall !== 'compliant' && hasReadings && (
        <Card
          data-testid="compliance-alert"
          role="alert"
          aria-live={complianceReport.overall === 'emergency' ? 'assertive' : 'polite'}
          className={cn(
            'border-2',
            complianceReport.overall === 'emergency' && 'bg-card border-destructive',
            complianceReport.overall === 'non-compliant' && 'border-destructive bg-card',
            complianceReport.overall === 'warning' && 'bg-card border-warning'
          )}
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={cn(
                  'mt-0.5 h-5 w-5',
                  complianceReport.overall === 'emergency' && 'text-destructive',
                  complianceReport.overall === 'non-compliant' && 'text-destructive',
                  complianceReport.overall === 'warning' && 'text-warning'
                )}
              />
              <div className="flex-1">
                <h4
                  className={cn(
                    'font-medium',
                    complianceReport.overall === 'emergency' && 'text-foreground',
                    complianceReport.overall === 'non-compliant' && 'text-foreground',
                    complianceReport.overall === 'warning' && 'text-foreground'
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
                    complianceReport.overall === 'emergency' && 'text-muted-foreground',
                    complianceReport.overall === 'non-compliant' && 'text-muted-foreground',
                    complianceReport.overall === 'warning' && 'text-muted-foreground'
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
              <div className="bg-card mt-3 rounded-md border border-destructive p-3">
                <div className="text-foreground text-sm font-medium">🚫 Pool Closure Required</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {poolClosure.reasons.join('; ')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Status Feedback */}
      {saveStatus !== 'idle' && (
        <Card
          data-testid="save-status"
          className={cn(
            'border-2',
            saveStatus === 'saved' && 'border-success bg-success/10',
            saveStatus === 'error' && 'border-destructive bg-destructive/10',
            saveStatus === 'saving' && 'border-primary bg-primary/10'
          )}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && <Clock className="h-4 w-4 animate-spin text-primary" />}
              {saveStatus === 'saved' && <CheckCircle className="h-4 w-4 text-success" />}
              {saveStatus === 'error' && <AlertTriangle className="h-4 w-4 text-destructive" />}
              <span
                className={cn(
                  'text-sm font-medium',
                  saveStatus === 'saved' && 'text-success',
                  saveStatus === 'error' && 'text-destructive',
                  saveStatus === 'saving' && 'text-primary'
                )}
              >
                {saveStatus === 'saving' && 'Saving...'}
                {saveMessage}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!hasRequiredFields || !hasReadings || saveStatus === 'saving'}
          data-testid="submit-test"
          aria-label={saveStatus === 'saving' ? 'Submitting...' : 'Submit test'}
          className={cn(
            'flex-1',
            complianceReport?.overall === 'emergency' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            complianceReport?.overall === 'non-compliant' &&
              'bg-destructive hover:bg-destructive/90 text-white'
          )}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {saveStatus === 'saving' && 'Submitting...'}
          {saveStatus !== 'saving' && complianceReport?.overall === 'emergency' && 'Submit Emergency Test'}
          {saveStatus !== 'saving' && complianceReport?.overall === 'non-compliant' && 'Submit (Critical)'}
          {saveStatus !== 'saving' && complianceReport?.overall === 'warning' && 'Submit (Warning)'}
          {saveStatus !== 'saving' && (!complianceReport || complianceReport.overall === 'compliant') && 'Submit Test'}
        </Button>

        <Button
          variant="secondary"
          onClick={handleSaveDraft}
          disabled={!formData.poolId || !formData.technician || saveStatus === 'saving'}
          data-testid="save-draft"
          aria-label="Save draft"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>

        <Button variant="outline" onClick={onCancel} data-testid="cancel" aria-label="Cancel">
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ChemicalTestForm
