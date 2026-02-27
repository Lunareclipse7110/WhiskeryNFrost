import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WhiskeryAndFrost from './WhiskeryAndFrost.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WhiskeryAndFrost />
  </StrictMode>,
)