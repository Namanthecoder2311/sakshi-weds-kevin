import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/great-vibes/400.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import '@fontsource/lora/500.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/tiro-devanagari-hindi/400.css'
import '@fontsource/cormorant-garamond/600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
