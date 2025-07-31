import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const ColorPaletteDisplay = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Current Color Palette</h1>

      {/* Background Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Background & Surface Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="bg-background border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Background</p>
              <p className="text-muted-foreground text-xs">Main page bg</p>
            </div>
            <div>
              <div className="bg-card border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Card</p>
              <p className="text-muted-foreground text-xs">Elevated surfaces</p>
            </div>
            <div>
              <div className="bg-muted border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Muted</p>
              <p className="text-muted-foreground text-xs">Subtle backgrounds</p>
            </div>
            <div>
              <div className="bg-accent border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Accent</p>
              <p className="text-muted-foreground text-xs">Hover states</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Action Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="bg-primary border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Primary</p>
              <p className="text-muted-foreground text-xs">Main CTAs (7%)</p>
            </div>
            <div>
              <div className="bg-secondary border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Secondary</p>
              <p className="text-muted-foreground text-xs">Structural (30%)</p>
            </div>
            <div>
              <div className="bg-destructive border-foreground/20 h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Destructive</p>
              <p className="text-muted-foreground text-xs">Alerts (3%)</p>
            </div>
            <div>
              <div className="border-border h-24 w-full rounded-md border-2" />
              <p className="mt-2 text-sm font-medium">Border</p>
              <p className="text-muted-foreground text-xs">Default borders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Text Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-foreground">Foreground Text - Main content text</p>
            <p className="text-muted-foreground">Muted Foreground - Secondary text</p>
            <p className="text-card-foreground">Card Foreground - Text on cards</p>
            <p className="text-primary-foreground bg-primary inline-block rounded px-2 py-1">
              Primary Foreground - Text on primary bg
            </p>
            <p className="text-secondary-foreground bg-secondary inline-block rounded px-2 py-1">
              Secondary Foreground - Text on secondary bg
            </p>
            <p className="text-destructive-foreground bg-destructive inline-block rounded px-2 py-1">
              Destructive Foreground - Text on destructive bg
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Component Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Component Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="critical">Critical</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="critical">Critical</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Status Colors (Custom Variants)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <div className="border-foreground/20 h-24 w-full rounded-md border-2 bg-green-600" />
              <p className="mt-2 text-sm font-medium">Success/Safe</p>
              <p className="text-muted-foreground text-xs">bg-green-600</p>
            </div>
            <div>
              <div className="border-foreground/20 h-24 w-full rounded-md border-2 bg-yellow-500" />
              <p className="mt-2 text-sm font-medium">Warning/Caution</p>
              <p className="text-muted-foreground text-xs">bg-yellow-500</p>
            </div>
            <div>
              <div className="border-foreground/20 h-24 w-full rounded-md border-2 bg-red-600" />
              <p className="mt-2 text-sm font-medium">Critical/Emergency</p>
              <p className="text-muted-foreground text-xs">bg-red-600</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
