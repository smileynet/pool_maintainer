import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  XCircle,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react'

interface PoolStatusSummary {
  total: number
  safe: number
  caution: number
  critical: number
  emergency: number
  unknown: number
  lastUpdated: Date
}

interface PoolStatusSummaryProps {
  summary: PoolStatusSummary
  onRefresh?: () => void
}

export function PoolStatusSummaryWidget({ summary, onRefresh }: PoolStatusSummaryProps) {
  const statusItems = [
    {
      status: 'safe',
      label: 'Safe',
      count: summary.safe,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'All parameters within ideal ranges'
    },
    {
      status: 'caution',
      label: 'Caution',
      count: summary.caution,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Minor adjustments needed'
    },
    {
      status: 'critical',
      label: 'Critical',
      count: summary.critical,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Immediate attention required'
    },
    {
      status: 'emergency',
      label: 'Emergency',
      count: summary.emergency,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Pool closure may be required'
    }
  ]

  const primaryStatus = summary.emergency > 0 ? 'emergency' 
    : summary.critical > 0 ? 'critical'
    : summary.caution > 0 ? 'caution' 
    : 'safe'

  const statusColors = {
    safe: 'border-green-500 bg-green-50',
    caution: 'border-yellow-500 bg-yellow-50',
    critical: 'border-orange-500 bg-orange-50',
    emergency: 'border-red-500 bg-red-50'
  }

  return (
    <div className="space-y-4">
      {/* Overall Status Card */}
      <Card className={cn('transition-colors', statusColors[primaryStatus])}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pool System Status</CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant={primaryStatus === 'safe' ? 'default' : 'destructive'}
                className="capitalize"
              >
                {primaryStatus}
              </Badge>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-1 rounded-md hover:bg-black/5 transition-colors"
                  title="Refresh status"
                >
                  <Activity className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Pools</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last updated: {summary.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statusItems.map(({ status, label, count, icon: Icon, color, bgColor, borderColor, description }) => (
          <Card 
            key={status}
            className={cn(
              'transition-all hover:shadow-md cursor-pointer',
              count > 0 ? `${bgColor} ${borderColor}` : 'opacity-60'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-full', bgColor)}>
                  <Icon className={cn('h-4 w-4', color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {label}
                  </div>
                </div>
              </div>
              {count > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {description}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              System Health
            </div>
            <div className="flex items-center gap-4">
              <span>
                {summary.safe + summary.caution > 0 ? Math.round((summary.safe / summary.total) * 100) : 0}% Operational
              </span>
              <span className={cn(
                'font-medium',
                summary.emergency > 0 || summary.critical > 0 ? 'text-red-600' : 'text-green-600'
              )}>
                {summary.emergency === 0 && summary.critical === 0 ? 'All Clear' : 'Action Required'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook to calculate summary from pool statuses
export function usePoolStatusSummary(pools: Array<{ status: string }>, lastUpdated: Date): PoolStatusSummary {
  return React.useMemo(() => {
    const summary = {
      total: pools.length,
      safe: 0,
      caution: 0,
      critical: 0,
      emergency: 0,
      unknown: 0,
      lastUpdated
    }

    pools.forEach(pool => {
      switch (pool.status) {
        case 'safe':
          summary.safe++
          break
        case 'caution':
          summary.caution++
          break
        case 'critical':
          summary.critical++
          break
        case 'emergency':
          summary.emergency++
          break
        default:
          summary.unknown++
      }
    })

    return summary
  }, [pools, lastUpdated])
}