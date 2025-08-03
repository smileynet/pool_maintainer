import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  X,
  Clock,
  MapPin,
  Bell,
  BellOff,
  TestTube,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { getChemicalTests } from '@/lib/localStorage'
import { validateChemical } from '@/lib/mahc-validation'
import type { ChemicalTest } from '@/lib/localStorage'

interface Alert {
  id: string
  poolId: string
  poolName: string
  severity: 'critical' | 'emergency'
  message: string
  timestamp: string
  chemical?: string
  value?: number
  acknowledged: boolean
}

interface AlertNotificationSystemProps {
  onViewPool?: (poolId: string) => void
}

export function AlertNotificationSystem({ onViewPool }: AlertNotificationSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  // Check for critical conditions
  const checkForAlerts = React.useCallback(() => {
    const tests = getChemicalTests()
    const poolMap = new Map<string, ChemicalTest[]>()
    
    // Group by pool
    tests.forEach(test => {
      if (!poolMap.has(test.poolId)) {
        poolMap.set(test.poolId, [])
      }
      poolMap.get(test.poolId)!.push(test)
    })

    const newAlerts: Alert[] = []

    poolMap.forEach((poolTests, poolId) => {
      const sortedTests = poolTests.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      const latestTest = sortedTests[0]
      
      if (!latestTest) return

      // Check chemical levels
      const checkChemical = (chemical: string, value: number) => {
        const validation = validateChemical(value, chemical as any)
        
        if (validation.status === 'emergency' || validation.status === 'critical') {
          const alertId = `${poolId}-${chemical}-${Date.now()}`
          
          newAlerts.push({
            id: alertId,
            poolId,
            poolName: latestTest.poolName,
            severity: validation.status,
            message: validation.message,
            timestamp: latestTest.timestamp,
            chemical,
            value,
            acknowledged: false
          })
        }
      }

      // Check all chemical parameters
      checkChemical('freeChlorine', latestTest.readings.freeChlorine)
      checkChemical('ph', latestTest.readings.ph)
      checkChemical('alkalinity', latestTest.readings.alkalinity)
      checkChemical('temperature', latestTest.readings.temperature)
      
      if (latestTest.readings.totalChlorine) {
        checkChemical('totalChlorine', latestTest.readings.totalChlorine)
      }
      if (latestTest.readings.cyanuricAcid) {
        checkChemical('cyanuricAcid', latestTest.readings.cyanuricAcid)
      }
      if (latestTest.readings.calcium) {
        checkChemical('calcium', latestTest.readings.calcium)
      }

      // Check test age
      const testAge = Date.now() - new Date(latestTest.timestamp).getTime()
      const daysOld = testAge / (1000 * 60 * 60 * 24)
      
      if (daysOld > 14) {
        newAlerts.push({
          id: `${poolId}-age-${Date.now()}`,
          poolId,
          poolName: latestTest.poolName,
          severity: 'critical',
          message: `No tests for ${Math.floor(daysOld)} days - compliance check required`,
          timestamp: latestTest.timestamp,
          acknowledged: false
        })
      }
    })

    // Only add alerts that aren't already dismissed
    const filteredAlerts = newAlerts.filter(alert => !dismissed.has(alert.id))
    
    if (filteredAlerts.length > 0) {
      setAlerts(prev => {
        const existingIds = new Set(prev.map(a => a.id))
        const reallyNewAlerts = filteredAlerts.filter(a => !existingIds.has(a.id))
        
        // Play sound for new emergency alerts
        if (soundEnabled && reallyNewAlerts.some(a => a.severity === 'emergency')) {
          // Simple audio notification
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmobBz2Y3vDEeykKJ4TO8N2QOgkVVLDm6qpUE')
            audio.play().catch(() => {}) // Ignore if audio fails
          } catch (e) {
            // Audio not supported
          }
        }
        
        return [...prev, ...reallyNewAlerts]
      })
    }
    
    setLastCheck(new Date())
  }, [dismissed, soundEnabled])

  useEffect(() => {
    checkForAlerts()
    const interval = setInterval(checkForAlerts, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [checkForAlerts])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const dismissAlert = (alertId: string) => {
    setDismissed(prev => new Set([...prev, alertId]))
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const clearAllAcknowledged = () => {
    const acknowledgedIds = alerts.filter(a => a.acknowledged).map(a => a.id)
    setDismissed(prev => new Set([...prev, ...acknowledgedIds]))
    setAlerts(prev => prev.filter(alert => !alert.acknowledged))
  }

  const activeAlerts = alerts.filter(alert => !alert.acknowledged)
  const emergencyAlerts = activeAlerts.filter(alert => alert.severity === 'emergency')
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical')

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      {activeAlerts.length > 0 && (
        <Card className={cn(
          'border-2 animate-pulse',
          emergencyAlerts.length > 0 ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {emergencyAlerts.length > 0 ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Active Pool Alerts
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Disable sound alerts' : 'Enable sound alerts'}
                >
                  {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
                {alerts.some(a => a.acknowledged) && (
                  <Button variant="outline" size="sm" onClick={clearAllAcknowledged}>
                    Clear Acknowledged
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {emergencyAlerts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {emergencyAlerts.length} Emergency
                    </Badge>
                  </div>
                )}
                {criticalAlerts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-orange-500 text-orange-700">
                      {criticalAlerts.length} Critical
                    </Badge>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Last check: {lastCheck.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={cn(
              'transition-all',
              alert.acknowledged && 'opacity-60',
              alert.severity === 'emergency' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={alert.severity === 'emergency' ? 'destructive' : 'outline'}
                      className={alert.severity === 'critical' ? 'border-orange-500 text-orange-700' : ''}
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {alert.poolName}
                    </div>
                  </div>
                  
                  <p className="font-medium text-sm mb-2">{alert.message}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                    {alert.chemical && (
                      <div className="flex items-center gap-1">
                        <TestTube className="h-3 w-3" />
                        {alert.chemical}: {alert.value}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {onViewPool && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewPool(alert.poolId)}
                    >
                      View Pool
                    </Button>
                  )}
                  {!alert.acknowledged && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}