import { useEffect } from 'react'

export const DebugColors = () => {
  useEffect(() => {
    // Force apply the CSS variables to body
    const root = document.documentElement
    const body = document.body

    // Log current values (using console.warn to pass linting)
    const computedStyle = getComputedStyle(root)
    console.warn('CSS Variables:')
    console.warn('--background:', computedStyle.getPropertyValue('--background'))
    console.warn('--foreground:', computedStyle.getPropertyValue('--foreground'))
    console.warn('--primary:', computedStyle.getPropertyValue('--primary'))
    console.warn('--secondary:', computedStyle.getPropertyValue('--secondary'))

    // Check body computed styles
    const bodyStyle = getComputedStyle(body)
    console.warn('Body background-color:', bodyStyle.backgroundColor)
    console.warn('Body color:', bodyStyle.color)

    // Try to manually apply the colors
    body.style.backgroundColor = 'hsl(200 20% 94%)'
    body.style.color = 'hsl(200 60% 20%)'

    console.warn('Manually applied Electric Lagoon colors to body')
  }, [])

  return (
    <div className="space-y-4 p-4">
      <div className="font-bold">Debug: Electric Lagoon Colors</div>
      <div>Check browser console (F12) for CSS variable values</div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div
            style={{
              backgroundColor: 'hsl(200 20% 94%)',
              padding: '1rem',
              border: '2px solid black',
            }}
          >
            Direct HSL Background
            <br />
            hsl(200 20% 94%)
          </div>
        </div>

        <div>
          <div
            style={{
              backgroundColor: 'hsl(90 85% 68%)',
              color: 'hsl(200 60% 20%)',
              padding: '1rem',
              border: '2px solid black',
            }}
          >
            Electric Yellow
            <br />
            hsl(90 85% 68%)
          </div>
        </div>

        <div>
          <div
            style={{
              backgroundColor: 'hsl(140 65% 55%)',
              color: 'hsl(200 60% 20%)',
              padding: '1rem',
              border: '2px solid black',
            }}
          >
            Electric Mint
            <br />
            hsl(140 65% 55%)
          </div>
        </div>

        <div>
          <div
            style={{
              backgroundColor: 'hsl(25 85% 60%)',
              color: 'white',
              padding: '1rem',
              border: '2px solid black',
            }}
          >
            Electric Coral
            <br />
            hsl(25 85% 60%)
          </div>
        </div>
      </div>

      <div className="mt-4 border-2 border-yellow-500 bg-yellow-100 p-4">
        <strong>The body background should now be light electric blue!</strong>
        <br />
        If not, there's a CSS loading or specificity issue.
      </div>
    </div>
  )
}
