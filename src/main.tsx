/* eslint-disable no-console */
// Console logging is temporarily enabled for debugging service worker registration
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
    
    // Register service worker for offline capability
    registerServiceWorker()
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

// Service Worker Registration
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      console.log('Registering service worker...')
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      
      console.log('Service worker registered successfully:', registration.scope)
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          console.log('New service worker installing...')
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker installed, update available')
              
              // Notify user about update (could show a toast/banner)
              if (window.confirm('A new version is available. Reload to update?')) {
                window.location.reload()
              }
            }
          })
        }
      })
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from service worker:', event.data)
        
        const { type, data } = event.data
        
        switch (type) {
          case 'SYNC_COMPLETE':
            console.log(`Synced ${data.syncedItems} offline items`)
            // Could show success notification
            break
            
          case 'CACHE_UPDATED':
            console.log('Cache updated with fresh content')
            break
            
          default:
            console.log('Unknown message from service worker:', type)
        }
      })
      
      // Check if we're running from cache (offline)
      if (!navigator.onLine) {
        console.log('App loaded from cache (offline mode)')
      }
      
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  } else {
    console.log('Service workers are not supported in this browser')
  }
}