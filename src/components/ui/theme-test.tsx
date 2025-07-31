import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export const ThemeTest = () => {
  return (
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Community Pool Theme Test</h1>
      
      {/* Color Palette Display */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle>Pool Water</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            Robin egg blue - Clear pool water
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-secondary text-secondary-foreground">
            <CardTitle>Sunshine</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            Warm yellow - Summer sun
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-[var(--color-grass)] text-white">
            <CardTitle>Grass</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            Fresh green - Community lawn
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-[var(--color-coral)] text-white">
            <CardTitle>Coral</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            Summer fun accent
          </CardContent>
        </Card>
      </div>
      
      {/* Safety Status Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Safety Status Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge className="bg-[var(--color-safe)] text-white">
              <CheckCircle className="w-4 h-4 mr-1" />
              Safe
            </Badge>
            <Badge className="bg-[var(--color-caution)] text-[var(--color-text)]">
              <Info className="w-4 h-4 mr-1" />
              Caution
            </Badge>
            <Badge className="bg-[var(--color-critical)] text-white">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Critical
            </Badge>
            <Badge className="bg-[var(--color-emergency)] text-white">
              <AlertCircle className="w-4 h-4 mr-1" />
              Emergency
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Button Variations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Button Styles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
            <Button variant="ghost">Ghost Action</Button>
            <Button variant="destructive">Destructive Action</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Text Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Text Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-foreground">Primary text (Deep indigo for outdoor contrast)</p>
          <p className="text-muted-foreground">Muted text (Lighter indigo)</p>
          <p className="text-sm text-muted-foreground">Small muted text</p>
          <div className="p-4 bg-surface rounded">
            <p>Text on surface background (Pool foam tint)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}