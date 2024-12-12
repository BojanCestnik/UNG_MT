import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Variable } from "./components/Variable";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Variable>
      <App />
    </Variable>
  </StrictMode>,
)
