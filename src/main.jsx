import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FrostAndFlour from './FrostAndFlour.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FrostAndFlour />
  </StrictMode>,
)