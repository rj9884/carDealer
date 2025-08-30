import { useState, useEffect } from 'react'
import axios from 'axios'
import AddCarModal from '../components/AddCarModal'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  TruckIcon, 
  EyeIcon
} from '@heroicons/react/24/outline'


const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('cars')
  const [cars, setCars] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddCar, setShowAddCar] = useState(false)
  const [editingCar, setEditingCar] = useState(null)

  useEffect(() => {
    if (activeTab === 'cars') {
      fetchCars()
    } else {
      fetchUsers()
    }
  }, [activeTab])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/cars?limit=100')
      setCars(response.data.cars)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`/api/cars/${carId}`)
        fetchCars()
      } catch (error) {
        console.error('Error deleting car:', error)
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6"> 
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        {activeTab === 'cars' && (
          <button
            onClick={() => setShowAddCar(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Car</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('cars')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cars'
                ? 'border-blue-500 text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TruckIcon className="w-5 h-5 inline mr-2" />
            Cars
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserIcon className="w-5 h-5 inline mr-2" />
            Users
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'cars' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Cars</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {car.images && car.images.length > 0 && /^https?:\/\//i.test(car.images[0]) ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover rounded"
                                loading="lazy"
                                onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src='https://via.placeholder.com/96?text=Car'; }}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <TruckIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {car.make} {car.model}
                            </div>
                            <div className="text-sm text-gray-500">{car.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{car.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          car.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                          car.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                          car.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {car.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCar(car)}
                            className="text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text hover:from-blue-600 hover:to-indigo-700"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Users</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.profilePicture ? (
                              <img 
                                src={user.profilePicture} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.role === 'admin'}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

  <AddCarModal open={showAddCar} onClose={() => setShowAddCar(false)} onCreated={() => fetchCars()} />
    </div>
  )
}

export default AdminPanel
