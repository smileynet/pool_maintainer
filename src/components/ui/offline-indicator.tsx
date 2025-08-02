import { useState, useEffect, useCallback } from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { offlineQueue, type SyncResult } from '@/lib/offlineQueue'

interface OfflineIndicatorProps {
  className?: string
  showDetails?: boolean
}

export const OfflineIndicator = ({ className, showDetails = true }: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null)
  const [queueStats, setQueueStats] = useState({ total: 0, byType: {} })
  const [showSyncDetails, setShowSyncDetails] = useState(false)

  // Handle manual sync
  const handleSync = useCallback(async () => {
    if (syncInProgress || !isOnline) {
      return
    }

    setSyncInProgress(true)
    setShowSyncDetails(true)

    try {
      const result = await offlineQueue.processPendingItems()
      setLastSyncResult(result)

      // Refresh queue stats
      const stats = await offlineQueue.getQueueStats()
      setQueueStats(stats)

      // Auto-hide details after successful sync
      if (result.success && result.failedItems === 0) {
        setTimeout(() => {
          setShowSyncDetails(false)
        }, 3000)
      }
    } catch (error) {
      console.error('[OfflineIndicator] Sync failed:', error)
      setLastSyncResult({
        success: false,
        syncedItems: 0,
        failedItems: 0,
        errors: [{ id: 'sync_error', error: String(error) }],
      })
    } finally {
      setSyncInProgress(false)
    }
  }, [syncInProgress, isOnline])

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Connection restored - start sync process
      handleSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowSyncDetails(false)
      // Connection lost
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleSync])

  // Load queue statistics
  useEffect(() => {
    const loadQueueStats = async () => {
      try {
        const stats = await offlineQueue.getQueueStats()
        setQueueStats(stats)
      } catch (error) {
        console.error('[OfflineIndicator] Failed to load queue stats:', error)
      }
    }

    loadQueueStats()

    // Refresh stats every 10 seconds
    const interval = setInterval(loadQueueStats, 10000)
    return () => clearInterval(interval)
  }, [])

  // Get status display properties
  const getStatusProps = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        label: 'Offline',
        variant: 'destructive' as const,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
      }
    }

    if (syncInProgress) {
      return {
        icon: RefreshCw,
        label: 'Syncing...',
        variant: 'secondary' as const,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
      }
    }

    if (queueStats.total > 0) {
      return {
        icon: Clock,
        label: `${queueStats.total} pending`,
        variant: 'outline' as const,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
      }
    }

    return {
      icon: Wifi,
      label: 'Online',
      variant: 'secondary' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
    }
  }

  const statusProps = getStatusProps()
  const StatusIcon = statusProps.icon

  return (
    <div className={cn('relative', className)}>
      {/* Main Status Badge */}
      <Badge
        variant={statusProps.variant}
        className={cn(
          'flex cursor-pointer items-center gap-1 transition-colors',
          statusProps.bgColor,
          showDetails && 'opacity-75'
        )}
        onClick={() => setShowSyncDetails(!showSyncDetails)}
      >
        <StatusIcon className={cn('h-3 w-3', syncInProgress && 'animate-spin')} />
        {statusProps.label}
      </Badge>

      {/* Sync Details Panel */}
      {showDetails && showSyncDetails && (
        <Card className="absolute top-full right-0 z-50 mt-2 w-80 border-2 shadow-lg">
          <CardContent className="pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium">Sync Status</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowSyncDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Connection Status */}
            <div className="mb-3 flex items-center gap-2">
              <StatusIcon className={cn('h-4 w-4', statusProps.color)} />
              <span className="text-sm">{isOnline ? 'Connected' : 'No internet connection'}</span>
            </div>

            {/* Queue Statistics */}
            {queueStats.total > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-sm font-medium">Pending Items: {queueStats.total}</p>
                <div className="space-y-1">
                  {Object.entries(queueStats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="capitalize">{type.replace('_', ' ')}:</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Sync Result */}
            {lastSyncResult && (
              <div className="mb-3 rounded border p-2">
                <div className="mb-1 flex items-center gap-2">
                  {lastSyncResult.success && lastSyncResult.failedItems === 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">Last Sync Result</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div>Synced: {lastSyncResult.syncedItems} items</div>
                  {lastSyncResult.failedItems > 0 && (
                    <div>Failed: {lastSyncResult.failedItems} items</div>
                  )}
                  {lastSyncResult.errors.length > 0 && (
                    <div className="text-red-600">
                      {lastSyncResult.errors.length} errors occurred
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSync}
                disabled={syncInProgress || !isOnline}
                className="flex-1"
              >
                {syncInProgress ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {syncInProgress ? 'Syncing...' : 'Sync Now'}
              </Button>

              {queueStats.total > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (confirm('Clear all pending items? This cannot be undone.')) {
                      try {
                        await offlineQueue.clearQueue()
                        const stats = await offlineQueue.getQueueStats()
                        setQueueStats(stats)
                      } catch (error) {
                        console.error('Failed to clear queue:', error)
                      }
                    }
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Offline Tips */}
            {!isOnline && (
              <div className="mt-3 rounded bg-gray-50 p-2 text-xs">
                <p className="mb-1 font-medium">Offline Mode:</p>
                <ul className="space-y-0.5 text-gray-600">
                  <li>• Data will be saved locally</li>
                  <li>• Changes sync when connection restored</li>
                  <li>• All features remain available</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default OfflineIndicator
