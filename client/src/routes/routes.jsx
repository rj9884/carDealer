import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CarListing from '../pages/CarListing'
import CarDetail from '../pages/CarDetail'
import Profile from '../pages/Profile'
import AdminPanel from '../pages/AdminPanel'
import ProtectedRoute from '../components/ProtectedRoute'
import ErrorBoundary from '../components/ErrorBoundary'
import { AuthProvider } from '../context/AuthContext'
import VerifyEmail from '../pages/VerifyEmail'
import ResetPassword from '../pages/ResetPassword'

/**
 * Application routes configuration
 */
const routes = createRoutesFromElements(
  <Route
    path="/"
    element={
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    }
  >
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="verify-email" element={<VerifyEmail />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="cars">
      <Route index element={<CarListing />} />
      <Route path=":id" element={<CarDetail />} />
    </Route>
    <Route
      path="profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="admin"
      element={
        <ProtectedRoute adminOnly>
          <AdminPanel />
        </ProtectedRoute>
      }
    />
  </Route>
)

/**
 * Router configuration with future flags
 */
export const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true
  }
})
