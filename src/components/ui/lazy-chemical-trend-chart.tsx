import { lazy, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Loader2 } from 'lucide-react'

// Lazy load the heavy Recharts component
const ChemicalTrendChart = lazy(() => 
  import('./chemical-trend-chart').then(module => ({ 
    default: module.ChemicalTrendChart 
  }))
)

const ChartLoadingFallback = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Chemical Trend Analysis</CardTitle>
      <CardDescription>Loading charts...</CardDescription>
    </CardHeader>
    <CardContent className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading chart components...</span>
      </div>
    </CardContent>
  </Card>
)

export const LazyChemicalTrendChart = () => {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <ChemicalTrendChart />
    </Suspense>
  )
}