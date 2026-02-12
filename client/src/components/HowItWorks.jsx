import { motion } from 'framer-motion'
import { Search, Users, Calendar, CheckCircle, ArrowRight } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Search for Help',
      description: 'Browse our services or describe your specific healthcare needs',
      color: 'text-primary'
    },
    {
      icon: Users,
      title: 'Connect with Volunteers',
      description: 'Get matched with trained healthcare volunteers ready to assist you',
      color: 'text-secondary'
    },
    {
      icon: Calendar,
      title: 'Schedule Support',
      description: 'Book appointments or get immediate assistance based on your needs',
      color: 'text-accent'
    },
    {
      icon: CheckCircle,
      title: 'Receive Care',
      description: 'Get the healthcare support and guidance you need, when you need it',
      color: 'text-primary'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text mb-4">
            How CareConnect Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get healthcare support in four simple steps. Our platform makes it easy to connect with the help you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {index + 1}
              </div>

              {/* Step Card */}
              <div className="glass-card rounded-2xl p-8 h-full hover-lift">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 ${step.color}`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-text mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of patients who have already received healthcare support through CareConnect. 
              Your journey to better health starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium">
                Get Support Now
              </button>
              <button className="px-8 py-3 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-all duration-200 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
