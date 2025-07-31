import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export const ThemeTest = () => {
  return (
    <div className="bg-background p-8">
      <h1 className="text-foreground mb-8 text-3xl font-bold">Community Pool Theme Test</h1>

      {/* Color Palette Display */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle>Pool Water</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Crystal Waters - Light blue background</CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-secondary text-secondary-foreground">
            <CardTitle>Sunshine</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Sunset orange - Primary actions</CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-[var(--semantic-brand-secondary)] text-white">
            <CardTitle>Pool Green</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Fresh pool environment</CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-[var(--semantic-status-critical)] text-white">
            <CardTitle>Coral Alert</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Critical status accent</CardContent>
        </Card>
      </div>

      {/* Safety Status Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Safety Status Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge className="bg-[var(--semantic-status-safe)] text-white">
              <CheckCircle className="mr-1 h-4 w-4" />
              Safe
            </Badge>
            <Badge className="bg-[var(--semantic-status-caution)] text-[var(--semantic-text-primary)]">
              <Info className="mr-1 h-4 w-4" />
              Caution
            </Badge>
            <Badge className="bg-[var(--semantic-status-critical)] text-white">
              <AlertTriangle className="mr-1 h-4 w-4" />
              Critical
            </Badge>
            <Badge className="bg-[var(--semantic-status-emergency)] text-white">
              <AlertCircle className="mr-1 h-4 w-4" />
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
          <p className="text-muted-foreground text-sm">Small muted text</p>
          <div className="bg-surface rounded p-4">
            <p>Text on surface background (Pool foam tint)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
