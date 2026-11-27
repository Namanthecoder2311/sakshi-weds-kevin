import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/parisienne/400.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import '@fontsource/lora/500.css'
import '@fontsource/lora/500-italic.css'
import '@fontsource/lora/600.css'
import '@fontsource/lora/700.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import '@fontsource/jost/600.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/tiro-devanagari-hindi/400.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/cormorant-garamond/700.css'
import './index.css'
import App from './App.tsx'
import { LinksAdmin } from './invite/LinksAdmin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {new URLSearchParams(location.search).has('links') ? <LinksAdmin /> : <App />}
  </StrictMode>,
)
