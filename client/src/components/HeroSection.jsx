import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Heart, Shield, Clock, Users } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/videos/hospital-corridor-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-text/90 via-text/70 to-text/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6">
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-white text-sm font-medium">HIPAA Compliant • Secure Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          24/7 Healthcare Support
          <br />
          <span className="text-secondary">at Your Fingertips</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Connect with healthcare volunteers, get AI-powered medical guidance, 
          and access emergency support anytime, anywhere. Your health companion 
          for life's unexpected moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            to="/patient-support"
            className="group inline-flex items-center px-8 py-4 bg-secondary text-white text-lg font-semibold rounded-xl hover:bg-secondary/90 transition-all duration-300 hover-lift"
          >
            Get Support Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            to="/volunteer"
            className="group inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-lg text-white text-lg font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            <Heart className="mr-2 h-5 w-5" />
            Become Volunteer
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-8 text-white"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="font-semibold">24/7 Available</p>
              <p className="text-sm text-gray-300">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="font-semibold">500+ Volunteers</p>
              <p className="text-sm text-gray-300">Healthcare professionals</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Heart className="h-6 w-6 text-accent" />
            <div className="text-left">
              <p className="font-semibold">10,000+ Helped</p>
              <p className="text-sm text-gray-300">Lives impacted</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm text-gray-300">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
