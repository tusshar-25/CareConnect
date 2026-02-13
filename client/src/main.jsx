import { StrictMode } from 'react'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001/api'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
