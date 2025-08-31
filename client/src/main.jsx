import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import axios from 'axios'
import './index.css'

// API base must be provided via environment (VITE_API_BASE_URL)
const API_BASE = import.meta.env.VITE_API_BASE_URL
if(!API_BASE){
  console.error('VITE_API_BASE_URL not set');
}
axios.defaults.baseURL = API_BASE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
