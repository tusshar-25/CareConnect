import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Users, ArrowRight, Award } from 'lucide-react'

const VolunteerBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="h-8 w-8" />
              <span className="text-xl font-semibold">Make a Difference</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Become a Healthcare Volunteer
            </h2>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Join our community of compassionate healthcare volunteers. Share your skills and expertise to help those in need, 
              all from the comfort of your home.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-white">Flexible scheduling - volunteer when you can</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-white">Join 500+ healthcare professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-white">Impact lives across the country</span>
              </div>
            </div>

            <Link
              to="/volunteer"
              className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover-lift"
            >
              Start Volunteering Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          {/* Right Content - Volunteer Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { number: '500+', label: 'Active Volunteers', icon: Users },
              { number: '10,000+', label: 'Lives Impacted', icon: Heart },
              { number: '50+', label: 'Cities Covered', icon: Award },
              { number: '24/7', label: 'Support Available', icon: Heart },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
                <div className="text-2xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <p className="text-white text-lg mb-4">
              Every minute you volunteer can save a life. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/volunteer"
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 font-medium"
              >
                Apply Now
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default VolunteerBanner
