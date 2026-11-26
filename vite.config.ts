import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The share-preview tags need the site's full address. On Vercel it comes from the project's
// production domain, so the WhatsApp card keeps working whichever account or domain hosts it.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:5173'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl) },
  ],
})
