import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get email from location state or query params
  const email = location?.state?.email || new URLSearchParams(location.search).get('email');
  
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);
  
  if (!email) {
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/users/verify-email', {
        email,
        otp
      });
      
      setSuccess('Email verified successfully!');
      
      if (response.data.token) {
        login(response.data);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('/api/users/resend-verification', { email });
      setSuccess('Verification code resent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="bg-indigo-600 py-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Verify Your Email
            </h2>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            )}
            
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-indigo-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600">
                We've sent a verification code to
              </p>
              <p className="font-bold text-indigo-700 text-lg">
                {email}
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-center text-lg font-medium tracking-wider transition duration-200 ease-in-out"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex w-full justify-center items-center rounded-md px-4 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 ease-in-out ${loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify Email'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive a code?
              </p>
              <button
                onClick={handleResend}
                disabled={loading}
                className={`mt-2 text-sm font-medium ${loading 
                  ? 'text-indigo-400 cursor-not-allowed' 
                  : 'text-indigo-600 hover:text-indigo-800 hover:underline'}`}
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
