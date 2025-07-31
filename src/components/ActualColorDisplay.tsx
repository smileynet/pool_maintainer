import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const ActualColorDisplay = () => {
  const [colors, setColors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get computed styles from the root element
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    // List of CSS variables to check
    const cssVars = [
      '--background',
      '--foreground',
      '--card',
      '--card-foreground',
      '--primary',
      '--primary-foreground',
      '--secondary',
      '--secondary-foreground',
      '--destructive',
      '--destructive-foreground',
      '--muted',
      '--muted-foreground',
      '--accent',
      '--accent-foreground',
      '--border',
      '--input',
      '--ring',
      '--success',
      '--warning',
      '--critical',
    ]

    const colorValues: Record<string, string> = {}

    cssVars.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName).trim()
      if (value) {
        colorValues[varName] = value
      }
    })

    setColors(colorValues)
  }, [])

  // Convert HSL to RGB for display
  const hslToHex = (hslStr: string) => {
    try {
      // Parse HSL values
      const matches = hslStr.match(/(\d+(?:\.\d+)?)/g)
      if (!matches || matches.length < 3) return '#000000'

      const h = parseFloat(matches[0])
      const s = parseFloat(matches[1]) / 100
      const l = parseFloat(matches[2]) / 100

      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0')
      }

      return `#${f(0)}${f(8)}${f(4)}`
    } catch {
      return '#000000'
    }
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Actual CSS Variable Values</h1>

      <Card>
        <CardHeader>
          <CardTitle>CSS Variables from :root</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(colors).map(([varName, value]) => (
              <div key={varName} className="flex items-center gap-4">
                <div className="w-48 font-mono text-sm">{varName}</div>
                <div className="w-64 font-mono text-xs">{value}</div>
                <div
                  className="h-8 w-32 rounded border-2 border-gray-300"
                  style={{ backgroundColor: `hsl(${value})` }}
                />
                <div className="text-muted-foreground font-mono text-xs">{hslToHex(value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Direct Background Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="rounded p-4" style={{ backgroundColor: 'hsl(var(--primary))' }}>
              <span className="text-black">Primary: hsl(var(--primary))</span>
            </div>
            <div className="rounded p-4" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
              <span className="text-black">Secondary: hsl(var(--secondary))</span>
            </div>
            <div className="rounded p-4" style={{ backgroundColor: 'hsl(var(--accent))' }}>
              <span className="text-white">Accent: hsl(var(--accent))</span>
            </div>
            <div className="rounded p-4" style={{ backgroundColor: 'hsl(var(--destructive))' }}>
              <span className="text-white">Destructive: hsl(var(--destructive))</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Electric Lagoon Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div
                className="h-24 w-full rounded"
                style={{ backgroundColor: 'hsl(200 20% 94%)' }}
              />
              <p className="mt-2 text-sm">Background: hsl(200 20% 94%)</p>
              <p className="text-muted-foreground text-xs">Light electric blue</p>
            </div>
            <div>
              <div className="h-24 w-full rounded" style={{ backgroundColor: 'hsl(90 85% 68%)' }} />
              <p className="mt-2 text-sm">Primary: hsl(90 85% 68%)</p>
              <p className="text-muted-foreground text-xs">Electric yellow</p>
            </div>
            <div>
              <div
                className="h-24 w-full rounded"
                style={{ backgroundColor: 'hsl(140 65% 55%)' }}
              />
              <p className="mt-2 text-sm">Secondary: hsl(140 65% 55%)</p>
              <p className="text-muted-foreground text-xs">Electric mint</p>
            </div>
            <div>
              <div className="h-24 w-full rounded" style={{ backgroundColor: 'hsl(25 85% 60%)' }} />
              <p className="mt-2 text-sm">Accent: hsl(25 85% 60%)</p>
              <p className="text-muted-foreground text-xs">Electric coral</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
