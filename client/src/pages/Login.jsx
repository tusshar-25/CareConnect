import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Heart, Shield, Users } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'patient'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const userTypes = [
    { value: 'patient', label: 'Patient', icon: Heart, color: 'text-primary' },
    { value: 'volunteer', label: 'Volunteer', icon: Users, color: 'text-secondary' },
    { value: 'admin', label: 'Administrator', icon: Shield, color: 'text-danger' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, redirect based on user type
      switch (formData.userType) {
        case 'admin':
          navigate('/admin')
          break
        case 'volunteer':
          navigate('/dashboard')
          break
        default:
          navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="h-12 w-12 text-primary" />
            <span className="text-3xl font-bold text-text">CareConnect</span>
          </div>
          <h2 className="text-3xl font-bold text-text mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your healthcare support portal</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {userTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.userType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <type.icon className={`h-6 w-6 mb-2 ${type.color}`} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Demo Accounts</p>
            <div className="space-y-2">
              <button
                onClick={() => setFormData({ email: 'admin@careconnect.org', password: 'admin123', userType: 'admin' })}
                className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                <span className="font-medium">Admin:</span> admin@careconnect.org / admin123
              </button>
              <button
                onClick={() => setFormData({ email: 'volunteer@careconnect.org', password: 'volunteer123', userType: 'volunteer' })}
                className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                <span className="font-medium">Volunteer:</span> volunteer@careconnect.org / volunteer123
              </button>
              <button
                onClick={() => setFormData({ email: 'patient@careconnect.org', password: 'patient123', userType: 'patient' })}
                className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                <span className="font-medium">Patient:</span> patient@careconnect.org / patient123
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/volunteer" className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium">
              Sign up as Volunteer
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secure login • HIPAA compliant</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
