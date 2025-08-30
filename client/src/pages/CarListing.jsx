import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
} from '@heroicons/react/24/outline'

const CarListing = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    color: '',
    minPrice: '',
    maxPrice: '',
    make: '',
    fuelType: '',
    bodyType: '',
    condition: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCars: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCars()
  }, [filters, pagination.currentPage])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 6,
        ...filters
      })
      
      const response = await axios.get(`/api/cars?${params}`)
      setCars(response.data.cars)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      setLoading(true)
      const response = await axios.get(`/api/cars/search?q=${searchQuery}`)
      setCars(response.data)
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCars: response.data.length,
        hasNextPage: false,
        hasPrevPage: false
      })
    } catch (error) {
      console.error('Error searching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      color: '',
      minPrice: '',
      maxPrice: '',
      make: '',
      fuelType: '',
      bodyType: '',
      condition: ''
    })
    setSearchQuery('')
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Browse Cars</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our extensive collection of quality vehicles
        </p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-6 flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform mx-auto"
        >
          <FunnelIcon className="w-5 h-5" />
          <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search cars by make, model, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm hover:shadow-md transition-all duration-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </div>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              fetchCars()
            }}
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Color</label>
              <input
                type="text"
                name="color"
                value={filters.color}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="e.g., Red, Blue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="100000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Make</label>
              <input
                type="text"
                name="make"
                value={filters.make}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="e.g., Toyota, BMW"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Fuel Type</label>
              <select
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">All</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="LPG">LPG</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Body Type</label>
              <select
                name="bodyType"
                value={filters.bodyType}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">All</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Wagon">Wagon</option>
                <option value="Pickup">Pickup</option>
                <option value="Van">Van</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Condition</label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">All</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
        <p className="text-gray-600 font-medium">
          Showing {cars.length} of {pagination.totalCars} cars
        </p>
        {pagination.totalPages > 1 && (
          <p className="text-gray-600 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-gray-500 text-xl mb-2">No cars found</p>
          <p className="text-gray-400">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <img 
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.error(`Failed to load image: ${e.target.src}`);
                      // Remove onError to prevent infinite loops
                      e.target.onerror = null;
                      // Use a simpler fallback without SVG
                      e.target.src = '/car_icon.svg';
                      // Add a class to indicate error state
                      e.target.classList.add('image-load-error');
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>No Image</p>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
                    ₹{car.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {car.year}
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {car.mileage.toLocaleString()} miles
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {car.location}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {car.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    car.condition === 'Excellent' ? 'bg-green-100 text-green-800 border border-green-200' :
                    car.condition === 'Good' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    car.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {car.condition}
                  </span>
                  <Link 
                    to={`/cars/${car._id}`}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 transform"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <button
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Previous
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform ${
                page === pagination.currentPage
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default CarListing
