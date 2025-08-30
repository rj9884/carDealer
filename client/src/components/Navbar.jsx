import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon, 
  ArrowRightStartOnRectangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">CarDealer</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 group">
              <HomeIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/cars" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 group">
              <MagnifyingGlassIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Browse Cars</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-105 group">
                    <CogIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 group">
                  <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-all duration-300 hover:scale-105 group"
                >
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 transform">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
