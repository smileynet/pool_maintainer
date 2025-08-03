import React from 'react'
import { Button } from './button'
import { Card } from './card'
import { Database, AlertCircle } from 'lucide-react'
import { loadSampleData } from '@/lib/sample-data'

export function DemoDataBanner() {
  const hasData = localStorage.getItem('pool-maintenance-chemical-tests') || 
                  localStorage.getItem('pool-maintenance-facilities')
  
  // Only show in development when no data exists
  if (!import.meta.env.DEV || hasData) return null

  return (
    <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Welcome to Pool Maintenance System
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              No data found. Load sample data to explore the system features including multiple pools, 
              chemical readings, and various alert scenarios.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  if (confirm('This will load sample demonstration data. Continue?')) {
                    loadSampleData()
                  }
                }}
              >
                <Database className="mr-2 h-4 w-4" />
                Load Sample Data
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                onClick={() => {
                  // Just hide the banner by adding a dummy entry
                  localStorage.setItem('pool-maintenance-banner-hidden', 'true')
                  window.location.reload()
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}