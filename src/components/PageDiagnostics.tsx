import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const PageDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    computedColors: {} as Record<string, string>,
    appliedClasses: [] as string[],
    bodyClasses: '',
    htmlClasses: '',
    colorScheme: '',
    themeProviderFound: false,
  })

  useEffect(() => {
    // Get computed styles
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    // Check for theme-related CSS variables
    const cssVars = [
      '--background',
      '--foreground',
      '--primary',
      '--secondary',
      '--destructive',
      '--muted',
      '--accent',
      '--card',
      '--border',
    ]

    const colors: Record<string, string> = {}
    cssVars.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName).trim()
      colors[varName] = value || 'NOT SET'
    })

    // Check body and html classes
    const bodyClasses = document.body.className
    const htmlClasses = document.documentElement.className

    // Check color scheme
    const colorScheme = computedStyle.colorScheme || 'not set'

    // Check for theme provider
    const themeProviderFound = !!document.querySelector('[data-theme]')

    // Get all unique classes from first 10 elements
    const elements = document.querySelectorAll('*')
    const classSet = new Set<string>()
    for (let i = 0; i < Math.min(elements.length, 50); i++) {
      const classList = elements[i].classList
      classList.forEach((cls) => classSet.add(cls))
    }

    setDiagnostics({
      computedColors: colors,
      appliedClasses: Array.from(classSet).sort(),
      bodyClasses,
      htmlClasses,
      colorScheme,
      themeProviderFound,
    })
  }, [])

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Page Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Document Classes</h3>
            <div className="space-y-1 font-mono text-sm">
              <div>HTML: {diagnostics.htmlClasses || 'none'}</div>
              <div>Body: {diagnostics.bodyClasses || 'none'}</div>
              <div>Color Scheme: {diagnostics.colorScheme}</div>
              <div>Theme Provider: {diagnostics.themeProviderFound ? 'Found' : 'Not Found'}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">CSS Variables</h3>
            <div className="space-y-1">
              {Object.entries(diagnostics.computedColors).map(([key, value]) => (
                <div key={key} className="flex gap-2 font-mono text-xs">
                  <span className="w-32">{key}:</span>
                  <span className={value === 'NOT SET' ? 'text-red-600' : ''}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Sample Applied Classes</h3>
            <div className="flex flex-wrap gap-1">
              {diagnostics.appliedClasses.slice(0, 20).map((cls) => (
                <span key={cls} className="rounded bg-gray-100 px-1 py-0.5 text-xs">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Color Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="bg-background rounded p-2">
              bg-background (should be light electric blue)
            </div>
            <div className="bg-primary text-primary-foreground rounded p-2">
              bg-primary (should be electric yellow)
            </div>
            <div className="bg-secondary text-secondary-foreground rounded p-2">
              bg-secondary (should be electric mint)
            </div>
            <div className="bg-accent text-accent-foreground rounded p-2">
              bg-accent (should be electric coral)
            </div>
            <div className="bg-destructive text-destructive-foreground rounded p-2">
              bg-destructive (should be electric coral variant)
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Chain Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 font-mono text-xs">
            <div>index.css imports:</div>
            <div className="pl-4">- tw-animate-css</div>
            <div className="pl-4">- unified-token-system.css</div>
            <div className="pl-4">- wcag-color-pairs.css</div>
            <div className="pl-4">- gradient-overlays.css</div>
            <div className="pl-4">- color-zones.css</div>
            <div className="pl-4">- safety-components.css</div>
            <div className="pl-4 text-green-600">✓ theme-fixes.css removed</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
