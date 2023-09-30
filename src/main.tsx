import '@total-typescript/ts-reset'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './components/App/App'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
