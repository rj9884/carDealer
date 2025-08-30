import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import axios from 'axios'
import './index.css'

// Configure axios base URL from environment (fallback to localhost)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
axios.defaults.baseURL = API_BASE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
