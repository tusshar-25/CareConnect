import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Heart, Activity, ChevronDown, Users, Stethoscope, FileText, Home, Info, Mail } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { 
      name: 'Services', 
      path: '/services',
      icon: Stethoscope,
      dropdown: [
        { name: 'Patient Support', path: '/patient-support', icon: Heart },
        { name: 'Volunteer', path: '/volunteer', icon: Users },
        { name: 'Emergency Care', path: '/emergency', icon: Activity },
        { name: 'Resources', path: '/resources', icon: FileText }
      ]
    },
    { name: 'Contact', path: '/contact', icon: Mail },
  ]

  return (
    <nav className="fixed w-full z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[74px]">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Logo Container */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                {/* Pulse Effect */}
                <div className="absolute inset-0 w-12 h-12 bg-primary/20 rounded-xl animate-ping group-hover:animate-pulse"></div>
              </div>
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/60 transition-all duration-300">
                  CareConnect
                </span>
                <span className="text-xs text-gray-500 group-hover:text-primary/70 transition-colors duration-300">
                  Healthcare for India
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                      className="flex items-center space-x-1 text-text hover:text-primary transition-colors duration-200 font-medium py-2"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden"
                          onMouseEnter={() => setIsServicesOpen(true)}
                          onMouseLeave={() => setIsServicesOpen(false)}
                        >
                          <div className="p-2">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.path}
                                className="flex items-center space-x-3 px-4 py-3 text-text hover:bg-primary/10 hover:text-primary rounded-lg transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200">
                                  <dropdownItem.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium">{dropdownItem.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {dropdownItem.name === 'Patient Support' && 'Get medical help'}
                                    {dropdownItem.name === 'Volunteer' && 'Join our team'}
                                    {dropdownItem.name === 'Emergency Care' && 'Urgent assistance'}
                                    {dropdownItem.name === 'Resources' && 'Health information'}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center space-x-1 text-text hover:text-primary transition-colors duration-200 font-medium py-2"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Medium Screen Navigation (1000px) */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <Link
              to="/patient-support"
              className="group relative px-4 py-2 text-sm font-medium text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="relative z-10">Get Support</span>
              <div className="absolute inset-0 bg-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Get Support
              </span>
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/patient-support"
              className="group relative px-5 py-2.5 font-medium text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Get Support</span>
              </span>
              <div className="absolute inset-0 bg-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="h-4 w-4 mr-2" />
                <span>Get Support</span>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-lg rounded-xl mt-2 shadow-lg border border-white/20">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-text font-medium flex items-center space-x-2">
                          {item.icon && <item.icon className="h-4 w-4 text-primary" />}
                          <span>{item.name}</span>
                        </div>
                        <div className="ml-4 space-y-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.path}
                              className="flex items-center space-x-3 px-3 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                              onClick={() => setIsOpen(false)}
                            >
                              <dropdownItem.icon className="h-4 w-4" />
                              <span className="text-sm">{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center space-x-2 px-3 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <Link
                    to="/patient-support"
                    className="group relative block w-full text-center px-4 py-3 font-medium text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>Get Support</span>
                    </span>
                    <div className="absolute inset-0 bg-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart className="h-4 w-4 mr-2" />
                      <span>Get Support</span>
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Emergency Hotline Banner - Outside container for full width */}
      <div className="w-full bg-danger text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center space-x-3">
          <Phone className="h-4 w-4" />
          <span>Emergency Hotline: 112 | 24/7 Support Available</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
