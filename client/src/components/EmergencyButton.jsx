import { motion } from 'framer-motion'
import { Phone, AlertTriangle } from 'lucide-react'

const EmergencyButton = () => {
  const handleEmergencyCall = () => {
    window.location.href = 'tel:112'
  }

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={handleEmergencyCall}
          className="relative group"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(231, 76, 60, 0.7)",
              "0 0 0 20px rgba(231, 76, 60, 0)",
              "0 0 0 0 rgba(231, 76, 60, 0)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <div className="flex items-center space-x-3 bg-danger text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="h-6 w-6" />
            </motion.div>
            <span className="font-bold text-lg">Emergency</span>
            <Phone className="h-5 w-5" />
          </div>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 bg-danger rounded-full opacity-20 animate-ping"></div>
        </motion.button>
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-text text-white px-4 py-2 rounded-lg whitespace-nowrap"
      >
        <p className="text-sm font-medium">Call 112 for Emergency</p>
        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-text border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </motion.div>
    </div>
  )
}

export default EmergencyButton
