import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { 
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon, 
  BeakerIcon,  
  CogIcon,
  StarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const CarDetail = () => {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchCarDetails()
  }, [id])

  const fetchCarDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/cars/${id}`)
      setCar(response.data)
    } catch (error) {
      setError('Failed to load car details')
      console.error('Error fetching car details:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === car.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? car.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error || 'Car not found'}</p>
        <Link to="/cars" className="btn-primary">
          Back to Cars
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <div>
        <Link 
          to="/cars" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:bg-clip-text transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Cars</span>
        </Link>
      </div>

      {/* Car Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {car.make} {car.model}
        </h1>
        <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
           ₹{car.price.toLocaleString()}
         </p>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
          {car.images && car.images.length > 0 ? (
            <img 
              src={car.images[currentImageIndex]}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                console.error(`Failed to load image: ${e.target.src}`);
                e.target.onerror = null;
                e.target.src = '/car_icon.svg';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-lg">No Image Available</p>
            </div>
          )}
        </div>
        
        {/* Image Navigation */}
        {car.images && car.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-700 rotate-180" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Car Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Specifications */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <CalendarIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold">{car.year}</p>
              </div>
              <div className="text-center">
                <ChartBarIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="font-semibold">{car.mileage.toLocaleString()} miles</p>
              </div>
              <div className="text-center">
                <BeakerIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Fuel Type</p>
                <p className="font-semibold">{car.fuelType}</p>
              </div>
              <div className="text-center">
                <CogIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{car.description}</p>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <StarIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{car.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-gray-400"></div>
                <span className="text-gray-700">{car.color}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-400 rounded"></div>
                <span className="text-gray-700">{car.bodyType}</span>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Condition</h3>
            <span className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${
              car.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
              car.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
              car.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {car.condition}
            </span>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Interested?</h3>
            <p className="text-gray-600 mb-4">
              Contact us for more information about this vehicle.
            </p>
            <button className="w-full btn-primary">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
