import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  RefreshCw,
  TrendingUp,
  TestTube,
  Wrench,
  Eye,
  Activity,
  AlertCircle,
  Siren,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Pool facility data types
interface PoolFacility {
  id: string
  name: string
  location: string
  type: 'main' | 'kiddie' | 'therapy' | 'lap' | 'spa'
  status: 'operational' | 'maintenance' | 'closed' | 'emergency'
  capacity: number
  currentOccupancy: number
  lastInspection: string
  nextMaintenance: string
  assignedTechnician: string
  chemicalLevels: {
    freeChlorine: number
    ph: number
    alkalinity: number
    temperature: number
    lastTested: string
  }
  equipment: {
    pump: 'working' | 'maintenance' | 'failure'
    filter: 'clean' | 'needs_cleaning' | 'replacement'
    heater: 'working' | 'maintenance' | 'off'
  }
  alerts: Array<{
    id: string
    type: 'chemical' | 'equipment' | 'safety' | 'maintenance'
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    timestamp: string
  }>
  maintenanceHistory: Array<{
    id: string
    date: string
    type: string
    technician: string
    description: string
    status: 'completed' | 'pending' | 'overdue'
  }>
}

// Mock pool data with realistic values
const mockPoolData: PoolFacility[] = [
  {
    id: 'POOL-001',
    name: 'Main Community Pool',
    location: 'Building A - Central',
    type: 'main',
    status: 'operational',
    capacity: 150,
    currentOccupancy: 67,
    lastInspection: '2025-07-29',
    nextMaintenance: '2025-07-31',
    assignedTechnician: 'John Smith',
    chemicalLevels: {
      freeChlorine: 2.1,
      ph: 7.3,
      alkalinity: 98,
      temperature: 78.5,
      lastTested: '2025-07-30 08:30',
    },
    equipment: {
      pump: 'working',
      filter: 'needs_cleaning',
      heater: 'working',
    },
    alerts: [
      {
        id: 'ALT-001',
        type: 'maintenance',
        severity: 'medium',
        message: 'Filter cleaning scheduled for tomorrow',
        timestamp: '2025-07-30 09:00',
      },
    ],
    maintenanceHistory: [
      {
        id: 'MAINT-001',
        date: '2025-07-28',
        type: 'Chemical Testing',
        technician: 'John Smith',
        description: 'Weekly chemical balance check and adjustment',
        status: 'completed',
      },
      {
        id: 'MAINT-002',
        date: '2025-07-31',
        type: 'Filter Maintenance',
        technician: 'John Smith',
        description: 'Clean and inspect filtration system',
        status: 'pending',
      },
    ],
  },
  {
    id: 'POOL-002',
    name: 'Kiddie Pool',
    location: 'Building A - East Wing',
    type: 'kiddie',
    status: 'operational',
    capacity: 30,
    currentOccupancy: 12,
    lastInspection: '2025-07-29',
    nextMaintenance: '2025-08-02',
    assignedTechnician: 'Sarah Johnson',
    chemicalLevels: {
      freeChlorine: 1.8,
      ph: 7.5,
      alkalinity: 105,
      temperature: 82.0,
      lastTested: '2025-07-30 07:45',
    },
    equipment: {
      pump: 'working',
      filter: 'clean',
      heater: 'working',
    },
    alerts: [],
    maintenanceHistory: [
      {
        id: 'MAINT-003',
        date: '2025-07-29',
        type: 'Safety Inspection',
        technician: 'Sarah Johnson',
        description: 'Daily safety equipment check',
        status: 'completed',
      },
    ],
  },
  {
    id: 'POOL-003',
    name: 'Therapy Pool',
    location: 'Building B - Wellness Center',
    type: 'therapy',
    status: 'maintenance',
    capacity: 20,
    currentOccupancy: 0,
    lastInspection: '2025-07-28',
    nextMaintenance: '2025-07-30',
    assignedTechnician: 'Mike Davis',
    chemicalLevels: {
      freeChlorine: 0.8,
      ph: 7.1,
      alkalinity: 85,
      temperature: 84.0,
      lastTested: '2025-07-29 16:20',
    },
    equipment: {
      pump: 'maintenance',
      filter: 'replacement',
      heater: 'working',
    },
    alerts: [
      {
        id: 'ALT-002',
        type: 'chemical',
        severity: 'high',
        message: 'Chlorine level below recommended range',
        timestamp: '2025-07-29 16:25',
      },
      {
        id: 'ALT-003',
        type: 'equipment',
        severity: 'critical',
        message: 'Filter requires immediate replacement',
        timestamp: '2025-07-29 14:00',
      },
    ],
    maintenanceHistory: [
      {
        id: 'MAINT-004',
        date: '2025-07-30',
        type: 'Equipment Repair',
        technician: 'Mike Davis',
        description: 'Pump maintenance and filter replacement',
        status: 'pending',
      },
    ],
  },
  {
    id: 'POOL-004',
    name: 'Lap Pool',
    location: 'Building C - Fitness Center',
    type: 'lap',
    status: 'emergency',
    capacity: 80,
    currentOccupancy: 0,
    lastInspection: '2025-07-27',
    nextMaintenance: '2025-07-30',
    assignedTechnician: 'Emily Wilson',
    chemicalLevels: {
      freeChlorine: 0.3,
      ph: 6.5,
      alkalinity: 70,
      temperature: 76.5,
      lastTested: '2025-07-29 18:00',
    },
    equipment: {
      pump: 'failure',
      filter: 'replacement',
      heater: 'off',
    },
    alerts: [
      {
        id: 'ALT-004',
        type: 'safety',
        severity: 'critical',
        message: 'Pool closed - Critical chemical imbalance',
        timestamp: '2025-07-29 18:15',
      },
      {
        id: 'ALT-005',
        type: 'equipment',
        severity: 'critical',
        message: 'Pump failure - Immediate attention required',
        timestamp: '2025-07-29 17:30',
      },
    ],
    maintenanceHistory: [
      {
        id: 'MAINT-005',
        date: '2025-07-30',
        type: 'Emergency Repair',
        technician: 'Emily Wilson',
        description: 'Critical pump repair and chemical rebalancing',
        status: 'pending',
      },
    ],
  },
]

// Status colors and icons
const getStatusConfig = (status: PoolFacility['status']) => {
  switch (status) {
    case 'operational':
      return {
        color: 'bg-green-600 hover:bg-green-700 text-white',
        icon: CheckCircle,
        text: 'Operational',
      }
    case 'maintenance':
      return {
        color: 'bg-yellow-500 hover:bg-yellow-600 text-black',
        icon: Wrench,
        text: 'Maintenance',
      }
    case 'closed':
      return {
        color: 'bg-muted hover:bg-muted/80 text-muted-foreground',
        icon: Clock,
        text: 'Closed',
      }
    case 'emergency':
      return {
        color: 'bg-destructive hover:bg-destructive/80 text-white',
        icon: AlertTriangle,
        text: 'Emergency',
      }
    default:
      return {
        color: 'bg-muted hover:bg-muted/80 text-muted-foreground',
        icon: Clock,
        text: 'Unknown',
      }
  }
}

// Chemical level safety check with visual indicators
const getChemicalStatus = (level: number, type: 'chlorine' | 'ph' | 'alkalinity') => {
  switch (type) {
    case 'chlorine':
      if (level < 1.0)
        return {
          status: 'critical',
          color: 'text-destructive',
          bg: 'bg-destructive/20',
          icon: 'alert',
        }
      if (level < 1.5 || level > 3.0)
        return {
          status: 'warning',
          color: 'text-yellow-600',
          bg: 'bg-yellow-500/20',
          icon: 'warning',
        }
      return { status: 'safe', color: 'text-green-600', bg: 'bg-green-500/20', icon: 'check' }
    case 'ph':
      if (level < 7.0 || level > 8.0)
        return {
          status: 'critical',
          color: 'text-destructive',
          bg: 'bg-destructive/20',
          icon: 'alert',
        }
      if (level < 7.2 || level > 7.6)
        return {
          status: 'warning',
          color: 'text-yellow-600',
          bg: 'bg-yellow-500/20',
          icon: 'warning',
        }
      return { status: 'safe', color: 'text-green-600', bg: 'bg-green-500/20', icon: 'check' }
    case 'alkalinity':
      if (level < 60 || level > 180)
        return {
          status: 'critical',
          color: 'text-destructive',
          bg: 'bg-destructive/20',
          icon: 'alert',
        }
      if (level < 80 || level > 120)
        return {
          status: 'warning',
          color: 'text-yellow-600',
          bg: 'bg-yellow-500/20',
          icon: 'warning',
        }
      return { status: 'safe', color: 'text-green-600', bg: 'bg-green-500/20', icon: 'check' }
  }
}

// Pool Facility Card Component
const PoolFacilityCard = ({
  pool,
  onStatusChange,
  onQuickTest,
}: {
  pool: PoolFacility
  onStatusChange: (id: string, newStatus: PoolFacility['status']) => void
  onQuickTest: (id: string) => void
}) => {
  const statusConfig = getStatusConfig(pool.status)
  const StatusIcon = statusConfig.icon
  const occupancyPercentage = Math.round((pool.currentOccupancy / pool.capacity) * 100)

  const criticalAlerts = pool.alerts.filter((alert) => alert.severity === 'critical').length
  const highAlerts = pool.alerts.filter((alert) => alert.severity === 'high').length

  const chlorineStatus = getChemicalStatus(pool.chemicalLevels.freeChlorine, 'chlorine')
  const phStatus = getChemicalStatus(pool.chemicalLevels.ph, 'ph')

  // Simplified critical condition check
  const hasCriticalIssue = pool.status === 'emergency' || criticalAlerts > 0

  return (
    <Card
      className={cn(
        '@container card-interactive relative overflow-hidden',
        pool.status === 'emergency' && 'ring-destructive ring-2',
        pool.status === 'maintenance' && 'ring-1 ring-yellow-500'
      )}
    >
      {/* Simplified Critical Alert Banner */}
      {hasCriticalIssue && <div className="bg-destructive absolute inset-x-0 top-0 h-1" />}
      <CardHeader className="pb-3 @lg:pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {hasCriticalIssue ? (
                <Siren className="text-destructive h-4 w-4" />
              ) : (
                <MapPin className="text-primary h-4 w-4" />
              )}
              {pool.name}
            </CardTitle>
            <CardDescription>{pool.location}</CardDescription>
          </div>
          <Badge
            variant={
              pool.status === 'operational'
                ? 'secondary'
                : pool.status === 'maintenance'
                  ? 'outline'
                  : pool.status === 'emergency'
                    ? 'destructive'
                    : 'outline'
            }
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusConfig.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 @lg:space-y-6">
        {/* Mobile-First: Essential Information Only */}
        <div className="@lg:hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Occupancy</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-sm font-medium',
                occupancyPercentage > 90 ? 'text-destructive' : 
                occupancyPercentage > 75 ? 'text-yellow-600' : 'text-green-600'
              )}>
                {pool.currentOccupancy}/{pool.capacity}
              </span>
              <Badge variant={occupancyPercentage > 90 ? 'destructive' : 'secondary'} className="text-xs">
                {occupancyPercentage}%
              </Badge>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Chlorine:</span>
            <span className={getChemicalStatus(pool.chemicalLevels.freeChlorine, 'chlorine').color}>
              {pool.chemicalLevels.freeChlorine.toFixed(1)} ppm
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">pH:</span>
            <span className={getChemicalStatus(pool.chemicalLevels.ph, 'ph').color}>
              {pool.chemicalLevels.ph.toFixed(1)}
            </span>
          </div>
          {pool.alerts.length > 0 && (
            <div className="flex gap-1">
              {criticalAlerts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalAlerts} Critical
                </Badge>
              )}
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Technician:</span>
            <span className="font-medium">{pool.assignedTechnician}</span>
          </div>
        </div>

        {/* Desktop: Enhanced Information */}
        <div className="hidden @lg:block space-y-4">
        {/* Enhanced Occupancy and Capacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span>Occupancy</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-medium',
                  occupancyPercentage > 90
                    ? 'text-destructive'
                    : occupancyPercentage > 75
                      ? 'text-yellow-600'
                      : 'text-green-600'
                )}
              >
                {pool.currentOccupancy}/{pool.capacity}
              </span>
              <Badge
                variant={
                  occupancyPercentage > 90
                    ? 'destructive'
                    : occupancyPercentage > 75
                      ? 'outline'
                      : 'secondary'
                }
                className={cn(
                  'text-xs',
                  occupancyPercentage > 75 &&
                    occupancyPercentage <= 90 &&
                    'border-yellow-500 text-yellow-700'
                )}
              >
                {occupancyPercentage}%
              </Badge>
            </div>
          </div>
          <div className="relative">
            <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
              <div
                className={cn(
                  'relative h-3 overflow-hidden rounded-full transition-all duration-300',
                  occupancyPercentage > 90
                    ? 'bg-destructive'
                    : occupancyPercentage > 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                )}
                style={{ width: `${occupancyPercentage}%` }}
              >
                {/* Simple high capacity indicator */}
                {occupancyPercentage > 90 && <div className="absolute inset-0 bg-white/10" />}
              </div>
            </div>
            {/* Capacity threshold markers */}
            <div className="absolute top-0 h-3 w-px bg-yellow-600" style={{ left: '75%' }} />
            <div className="bg-destructive absolute top-0 h-3 w-px" style={{ left: '90%' }} />
          </div>
          {/* Capacity alerts */}
          {occupancyPercentage > 90 && (
            <div className="text-destructive flex items-center gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
              Pool at maximum capacity
            </div>
          )}
          {occupancyPercentage > 75 && occupancyPercentage <= 90 && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <AlertCircle className="h-3 w-3" />
              Approaching capacity limit
            </div>
          )}
        </div>

        {/* Chemical Levels Quick View */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="relative">
            <span className="text-muted-foreground">Free Cl:</span>
            <span className={cn('ml-1 font-medium', chlorineStatus.color)}>
              {pool.chemicalLevels.freeChlorine.toFixed(1)} ppm
              {chlorineStatus.status === 'critical' && (
                <AlertCircle className="ml-1 inline h-3 w-3 animate-pulse" />
              )}
            </span>
          </div>
          <div className="relative">
            <span className="text-muted-foreground">pH:</span>
            <span className={cn('ml-1 font-medium', phStatus.color)}>
              {pool.chemicalLevels.ph.toFixed(1)}
              {phStatus.status === 'critical' && (
                <AlertCircle className="ml-1 inline h-3 w-3 animate-pulse" />
              )}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Temp:</span>
            <span className="text-foreground ml-1 font-medium">
              {pool.chemicalLevels.temperature}°F
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Test:</span>
            <span className="text-muted-foreground ml-1 text-xs">
              {new Date(pool.chemicalLevels.lastTested).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Alerts Summary - Enhanced */}
        {pool.alerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {criticalAlerts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {criticalAlerts} Critical
                </Badge>
              )}
              {highAlerts > 0 && (
                <Badge variant="outline" className="border-yellow-500 text-xs text-yellow-700">
                  {highAlerts} High
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Assignment and Schedule */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Technician:</span>
            <span className="text-foreground font-medium">{pool.assignedTechnician}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Maintenance:</span>
            <span
              className={cn(
                'text-xs',
                new Date(pool.nextMaintenance) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {new Date(pool.nextMaintenance).toLocaleDateString()}
            </span>
          </div>
        </div>

        </div>
        
        {/* Quick Actions - Mobile Optimized */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onQuickTest(pool.id)}
            className="flex-1 @lg:flex-none"
          >
            <TestTube className="mr-1 h-3 w-3" />
            <span className="@lg:inline hidden">Quick </span>Test
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1 @lg:flex-none">
                <Eye className="mr-1 h-3 w-3" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl @4xl:max-w-4xl">
              <DialogHeader>
                <DialogTitle>{pool.name} - Facility Details</DialogTitle>
                <DialogDescription>
                  Comprehensive pool status and maintenance information
                </DialogDescription>
              </DialogHeader>
              <PoolDetailView pool={pool} onStatusChange={onStatusChange} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

// Pool Detail View Component
const PoolDetailView = ({
  pool,
  onStatusChange,
}: {
  pool: PoolFacility
  onStatusChange: (id: string, newStatus: PoolFacility['status']) => void
}) => {
  return (
    <div className="space-y-6">
      {/* Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className={getStatusConfig(pool.status).color}>
            {getStatusConfig(pool.status).text}
          </Badge>
          <span className="text-muted-foreground text-sm">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
        <Select
          value={pool.status}
          onValueChange={(value) => onStatusChange(pool.id, value as PoolFacility['status'])}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Simplified Chemical Levels */}
      <div>
        <h4 className="mb-3 font-medium">Chemical Levels</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Free Chlorine:</span>
              <span
                className={getChemicalStatus(pool.chemicalLevels.freeChlorine, 'chlorine').color}
              >
                {pool.chemicalLevels.freeChlorine.toFixed(1)} ppm
              </span>
            </div>
            <div className="flex justify-between">
              <span>pH Level:</span>
              <span className={getChemicalStatus(pool.chemicalLevels.ph, 'ph').color}>
                {pool.chemicalLevels.ph.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Alkalinity:</span>
              <span
                className={getChemicalStatus(pool.chemicalLevels.alkalinity, 'alkalinity').color}
              >
                {pool.chemicalLevels.alkalinity} ppm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span>{pool.chemicalLevels.temperature}°F</span>
            </div>
          </div>
        </div>
        <div className="text-muted-foreground mt-2 text-xs">
          Last tested: {new Date(pool.chemicalLevels.lastTested).toLocaleString()}
        </div>
      </div>

      {/* Enhanced Equipment Status */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-medium">
          <Settings className="h-4 w-4" />
          Equipment Status
        </h4>
        <div className="space-y-3">
          {/* Pump Status */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  pool.equipment.pump === 'working'
                    ? 'bg-green-100 text-green-600'
                    : pool.equipment.pump === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                )}
              >
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Water Pump</div>
                <div className="text-muted-foreground text-xs">
                  {pool.equipment.pump === 'working'
                    ? 'Operating normally'
                    : pool.equipment.pump === 'maintenance'
                      ? 'Scheduled maintenance'
                      : 'Requires immediate attention'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  pool.equipment.pump === 'working'
                    ? 'secondary'
                    : pool.equipment.pump === 'maintenance'
                      ? 'outline'
                      : 'destructive'
                }
                className={cn(
                  pool.equipment.pump === 'maintenance' && 'border-yellow-500 text-yellow-700'
                )}
              >
                {pool.equipment.pump === 'working'
                  ? 'Operational'
                  : pool.equipment.pump === 'maintenance'
                    ? 'Maintenance'
                    : 'Failure'}
              </Badge>
              {pool.equipment.pump === 'failure' && (
                <AlertTriangle className="text-destructive h-4 w-4" />
              )}
            </div>
          </div>

          {/* Filter Status */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  pool.equipment.filter === 'clean'
                    ? 'bg-green-100 text-green-600'
                    : pool.equipment.filter === 'needs_cleaning'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                )}
              >
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Filtration System</div>
                <div className="text-muted-foreground text-xs">
                  {pool.equipment.filter === 'clean'
                    ? 'Filter clean and functioning'
                    : pool.equipment.filter === 'needs_cleaning'
                      ? 'Cleaning scheduled'
                      : 'Filter replacement required'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  pool.equipment.filter === 'clean'
                    ? 'secondary'
                    : pool.equipment.filter === 'needs_cleaning'
                      ? 'outline'
                      : 'destructive'
                }
                className={cn(
                  pool.equipment.filter === 'needs_cleaning' && 'border-yellow-500 text-yellow-700'
                )}
              >
                {pool.equipment.filter === 'clean'
                  ? 'Clean'
                  : pool.equipment.filter === 'needs_cleaning'
                    ? 'Needs Cleaning'
                    : 'Replace'}
              </Badge>
              {pool.equipment.filter === 'replacement' && (
                <AlertTriangle className="text-destructive h-4 w-4" />
              )}
            </div>
          </div>

          {/* Heater Status */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  pool.equipment.heater === 'working'
                    ? 'bg-green-100 text-green-600'
                    : pool.equipment.heater === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600'
                )}
              >
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Pool Heater</div>
                <div className="text-muted-foreground text-xs">
                  {pool.equipment.heater === 'working'
                    ? 'Maintaining temperature'
                    : pool.equipment.heater === 'maintenance'
                      ? 'Under maintenance'
                      : 'Currently offline'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  pool.equipment.heater === 'working'
                    ? 'secondary'
                    : pool.equipment.heater === 'maintenance'
                      ? 'outline'
                      : 'outline'
                }
                className={cn(
                  pool.equipment.heater === 'maintenance' && 'border-yellow-500 text-yellow-700',
                  pool.equipment.heater === 'off' && 'text-muted-foreground'
                )}
              >
                {pool.equipment.heater === 'working'
                  ? 'Active'
                  : pool.equipment.heater === 'maintenance'
                    ? 'Maintenance'
                    : 'Off'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {pool.alerts.length > 0 && (
        <div>
          <h4 className="mb-3 font-medium">Active Alerts</h4>
          <div className="space-y-2">
            {pool.alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'rounded-lg border-l-4 p-3',
                  alert.severity === 'critical'
                    ? 'border-destructive bg-card'
                    : alert.severity === 'high'
                      ? 'border-destructive bg-card'
                      : alert.severity === 'medium'
                        ? 'bg-card border-yellow-500'
                        : 'border-primary bg-card'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{alert.message}</div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge
                    className={
                      alert.severity === 'critical'
                        ? 'bg-destructive text-white'
                        : alert.severity === 'high'
                          ? 'bg-destructive text-white'
                          : alert.severity === 'medium'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-primary text-white'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Maintenance */}
      <div>
        <h4 className="mb-3 font-medium">Recent Maintenance</h4>
        <div className="space-y-2">
          {pool.maintenanceHistory.slice(0, 3).map((maintenance) => (
            <div
              key={maintenance.id}
              className="bg-card flex items-center justify-between rounded p-2"
            >
              <div>
                <div className="text-sm font-medium">{maintenance.type}</div>
                <div className="text-muted-foreground text-xs">
                  {maintenance.technician} - {maintenance.date}
                </div>
              </div>
              <Badge
                className={
                  maintenance.status === 'completed'
                    ? 'bg-green-600 text-white'
                    : maintenance.status === 'pending'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-destructive text-white'
                }
              >
                {maintenance.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Pool Facility Manager Component
export const PoolFacilityManager = () => {
  const [pools, setPools] = useState<PoolFacility[]>(mockPoolData)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'occupancy' | 'alerts'>('name')
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date())

  // Handle status changes
  const handleStatusChange = (id: string, newStatus: PoolFacility['status']) => {
    setPools((prevPools) =>
      prevPools.map((pool) => (pool.id === id ? { ...pool, status: newStatus } : pool))
    )
  }

  // Handle quick chemical test
  const handleQuickTest = (id: string) => {
    // In a real app, this would trigger a chemical test workflow
    // For now, we'll just update the state to simulate a test
    const pool = pools.find((p) => p.id === id)
    if (pool) {
      // Simulate test initiated - in production this would call an API
    }
  }

  // Simulate real-time data updates
  const simulateDataUpdate = useCallback(() => {
    setPools((prevPools) =>
      prevPools.map((pool) => {
        // Simulate random chemical level changes
        const chlorineVariation = (Math.random() - 0.5) * 0.2
        const phVariation = (Math.random() - 0.5) * 0.1
        const occupancyChange = Math.floor((Math.random() - 0.5) * 5)

        return {
          ...pool,
          currentOccupancy: Math.max(
            0,
            Math.min(pool.capacity, pool.currentOccupancy + occupancyChange)
          ),
          chemicalLevels: {
            ...pool.chemicalLevels,
            freeChlorine: Math.max(0, pool.chemicalLevels.freeChlorine + chlorineVariation),
            ph: Math.max(6.0, Math.min(8.5, pool.chemicalLevels.ph + phVariation)),
            lastTested: new Date().toISOString(),
          },
        }
      })
    )
    setLastRefreshTime(new Date())
  }, [])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    simulateDataUpdate()
    setRefreshing(false)
  }

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      simulateDataUpdate()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, simulateDataUpdate])

  // Filter and sort pools
  const filteredAndSortedPools = pools
    .filter((pool) => filterStatus === 'all' || pool.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'occupancy':
          return b.currentOccupancy / b.capacity - a.currentOccupancy / a.capacity
        case 'alerts':
          return b.alerts.length - a.alerts.length
        default:
          return 0
      }
    })

  // Calculate summary statistics
  const totalPools = pools.length
  const operationalPools = pools.filter((p) => p.status === 'operational').length
  const maintenancePools = pools.filter((p) => p.status === 'maintenance').length
  const emergencyPools = pools.filter((p) => p.status === 'emergency').length
  const totalAlerts = pools.reduce((sum, pool) => sum + pool.alerts.length, 0)
  const criticalAlerts = pools.reduce(
    (sum, pool) => sum + pool.alerts.filter((alert) => alert.severity === 'critical').length,
    0
  )

  return (
    <div className="@container mx-auto max-w-7xl space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col items-start justify-between gap-4 @lg:flex-row @lg:items-center">
        <div>
          <h2 className="text-2xl font-bold @lg:text-3xl">Pool Facility Management</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and management of all pool facilities
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="">
              <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant={autoRefresh ? 'secondary' : 'outline'}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              <Activity className="mr-1 h-3 w-3" />
              {autoRefresh ? 'Auto' : 'Manual'}
            </Button>
            <span className="text-muted-foreground text-xs">
              Last update: {lastRefreshTime.toLocaleTimeString()}
            </span>
          </div>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Pool
          </Button>
        </div>
      </div>

      {/* Simplified Status Indicators */}
      {(criticalAlerts > 0 || emergencyPools > 0) && (
        <div className="border-destructive bg-destructive/10 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-destructive h-5 w-5" />
              <div>
                <h3 className="text-destructive font-semibold">Critical Alerts Active</h3>
                <p className="text-muted-foreground text-sm">
                  {criticalAlerts} critical alert{criticalAlerts !== 1 ? 's' : ''} across{' '}
                  {emergencyPools} pool{emergencyPools !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setFilterStatus('emergency')}>
              View Emergency Pools
            </Button>
          </div>
        </div>
      )}

      {/* Summary Statistics - Responsive Grid */}
      <div className="grid grid-cols-2 gap-4 @lg:grid-cols-4 @4xl:grid-cols-6">
        <Card className="card-interactive p-4">
          <div className="text-center">
            <div className="text-primary text-2xl font-bold">{totalPools}</div>
            <div className="text-muted-foreground text-sm">Total Pools</div>
          </div>
        </Card>
        <Card className="card-interactive p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{operationalPools}</span>
            </div>
            <div className="text-muted-foreground text-sm">Operational</div>
          </div>
        </Card>
        <Card className="card-interactive p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Wrench className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{maintenancePools}</span>
            </div>
            <div className="text-muted-foreground text-sm">Maintenance</div>
          </div>
        </Card>
        <Card
          className={cn('card-interactive p-4', emergencyPools > 0 && 'ring-destructive ring-2')}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {emergencyPools > 0 && <AlertTriangle className="text-destructive h-5 w-5" />}
              <span className="text-destructive text-2xl font-bold">{emergencyPools}</span>
            </div>
            <div className="text-muted-foreground text-sm">Emergency</div>
          </div>
        </Card>
        <Card className="card-interactive p-4">
          <div className="text-center">
            <div className="text-primary text-2xl font-bold">{totalAlerts}</div>
            <div className="text-muted-foreground text-sm">Total Alerts</div>
          </div>
        </Card>
        <Card className="card-interactive p-4">
          <div className="text-center">
            <div className="text-destructive text-2xl font-bold">{criticalAlerts}</div>
            <div className="text-muted-foreground text-sm">Critical</div>
          </div>
        </Card>
      </div>

      {/* Filters and Sorting - Responsive Layout */}
      <div className="flex flex-col gap-4 @lg:flex-row @lg:items-center @lg:justify-between">
        <div className="flex flex-wrap gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="occupancy">Occupancy</SelectItem>
            <SelectItem value="alerts">Alerts</SelectItem>
          </SelectContent>
        </Select>

        </div>
        <div className="text-sm text-muted-foreground @lg:text-right">
          Showing {filteredAndSortedPools.length} of {totalPools} pools
        </div>
      </div>

      {/* Pool Cards Grid - Container-based Responsive */}
      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4 @lg:gap-6">
        {filteredAndSortedPools.map((pool) => (
          <PoolFacilityCard
            key={pool.id}
            pool={pool}
            onStatusChange={handleStatusChange}
            onQuickTest={handleQuickTest}
          />
        ))}
      </div>

      {filteredAndSortedPools.length === 0 && (
        <div className="py-12 text-center">
          <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-medium">No pools found</h3>
          <p className="text-muted-foreground">No pools match the current filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default PoolFacilityManager
