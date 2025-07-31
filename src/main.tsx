import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from './components/ui/theme-provider'

// Add immediate feedback
console.log('main.tsx is loading...')

// Ensure DOM is loaded before mounting React
function mountApp() {
  console.log('mountApp called')
  
  try {
    const root = document.getElementById('root')
    console.log('Root element:', root)
    
    if (!root) {
      throw new Error('Root element not found')
    }

    // Add temporary content to verify DOM manipulation works
    root.innerHTML = '<div style="padding: 20px;">Loading React app...</div>'
    
    console.log('Creating React root...')
    const reactRoot = createRoot(root)
    
    console.log('Rendering app...')
    reactRoot.render(
      <StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StrictMode>
    )
    
    console.log('React app mounted successfully')
  } catch (error) {
    console.error('Error mounting React app:', error)
    // Display error on page
    const root = document.getElementById('root')
    if (root) {
      root.innerHTML = `
        <div style="padding: 20px; font-family: Arial;">
          <h1 style="color: red;">Error Loading Application</h1>
          <pre>${error}</pre>
          <p>Check browser console for details (F12)</p>
          <p>Error stack: ${error instanceof Error ? error.stack : 'No stack trace'}</p>
        </div>
      `
    }
  }
}

// Mount when DOM is ready
console.log('Document readyState:', document.readyState)

if (document.readyState === 'loading') {
  console.log('Adding DOMContentLoaded listener')
  document.addEventListener('DOMContentLoaded', mountApp)
} else {
  // DOM is already loaded
  console.log('DOM already loaded, mounting immediately')
  mountApp()
}