import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  MagnifyingGlassIcon, 
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedCars()
  }, [])

  const fetchFeaturedCars = async () => {
    try {
      const response = await axios.get('/api/cars/featured')
      // Ensure we always have an array, even if the API returns null/undefined
      setFeaturedCars(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching featured cars:', error)
      setFeaturedCars([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative text-center py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-3xl text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Find Your Perfect Car
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover an extensive collection of premium vehicles with competitive pricing and transparent deals
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/cars" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform">
              Browse Cars
            </Link>
            <Link to="/register" className="border-2 border-white/50 text-white px-10 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105 transform">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Cars Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Cars
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked vehicles that represent the best of our collection
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(featuredCars) && featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <div key={car._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error(`Failed to load image: ${e.target.src}`);
                          e.target.onerror = null;
                          e.target.src = '/car_icon.svg';
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
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🚗</span>
                </div>
                <p className="text-gray-500 text-xl mb-2">No featured cars available</p>
                <p className="text-gray-400">Please check back later or browse all cars</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/cars" className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform">
            <span>View All Cars</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <MagnifyingGlassIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Easy Search</h3>
          <p className="text-gray-600 leading-relaxed">Find your perfect car with our advanced filtering system and intuitive search</p>
        </div>
        
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <StarIcon className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Quality Assured</h3>
          <p className="text-gray-600 leading-relaxed">All our vehicles undergo thorough quality checks and detailed inspections</p>
        </div>
        
        <div className="text-center group">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <CurrencyDollarIcon className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Best Prices</h3>
          <p className="text-gray-600 leading-relaxed">Competitive pricing with transparent deals and no hidden fees</p>
        </div>
      </div>
    </div>
  )
}

export default Home
