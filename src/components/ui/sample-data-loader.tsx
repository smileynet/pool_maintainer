import React, { useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Database, AlertCircle, CheckCircle } from 'lucide-react'
import { loadSampleData } from '@/lib/sample-data'

export function SampleDataLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLoadData = () => {
    setIsLoading(true)
    
    // Small delay to show loading state
    setTimeout(() => {
      loadSampleData()
      setIsLoading(false)
      setShowSuccess(true)
      
      // Hide success message and reload after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }, 500)
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Load Sample Data
        </CardTitle>
        <CardDescription>
          Load demonstration data to explore the pool maintenance system features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will load sample data including:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>5 different pool facilities (outdoor, indoor, therapy pools)</li>
            <li>Multiple chemical test readings showing various scenarios</li>
            <li>Examples of normal, warning, critical, and emergency conditions</li>
            <li>Historical data trends over the past week</li>
          </ul>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isLoading || showSuccess}
              >
                {isLoading ? (
                  <>Loading Sample Data...</>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sample Data Loaded!
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Load Sample Data
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Sample Data?</DialogTitle>
                <DialogDescription className="space-y-2">
                  <p className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span>This will replace all existing data with sample demonstration data.</span>
                  </p>
                  <p>Your current pool facilities and chemical test records will be permanently deleted.</p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button onClick={handleLoadData}>
                  Yes, Load Sample Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

// Development-only quick loader
export function QuickSampleDataLoader() {
  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="sm"
        variant="outline"
        onClick={loadSampleData}
        className="shadow-lg"
        title="Load sample data (Dev only)"
      >
        <Database className="h-4 w-4" />
      </Button>
    </div>
  )
}