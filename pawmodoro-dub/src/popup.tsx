import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Timer from './components/timer'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <div>
        <Timer />
      </div>
    </StrictMode>
  )
}
