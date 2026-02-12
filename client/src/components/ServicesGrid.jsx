import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, AlertTriangle, Users, Calendar, MessageCircle, FileText, ArrowRight } from 'lucide-react'

const ServicesGrid = () => {
  const openChatbot = () => {
    // Trigger the chatbot widget to open
    const chatbotWidget = document.querySelector('[data-chatbot-trigger]')
    if (chatbotWidget) {
      chatbotWidget.click()
    } else {
      // Fallback: scroll to bottom and try to find chatbot
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      setTimeout(() => {
        const chatbotButton = document.querySelector('button[data-chatbot-trigger]')
        if (chatbotButton) {
          chatbotButton.click()
        }
      }, 500)
    }
  }
  const services = [
    {
      icon: Heart,
      title: 'Patient Support',
      description: 'Get personalized medical assistance and guidance from healthcare professionals',
      image: '/assets/images/patient-hospital-care.jpg',
      link: '/patient-support',
      color: 'text-primary'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Assistance',
      description: '24/7 emergency support with immediate response and critical care guidance',
      image: '/assets/images/surgery-operation-room.jpg',
      link: '/contact',
      color: 'text-danger'
    },
    {
      icon: Users,
      title: 'Volunteer Help',
      description: 'Connect with trained healthcare volunteers for personalized support',
      image: '/assets/images/volunteer-aid-delivery.jpg',
      link: '/volunteer',
      color: 'text-secondary'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Schedule appointments with healthcare providers and specialists',
      image: '/assets/images/doctor-portrait-careconnect.jpg',
      link: '/services',
      color: 'text-accent'
    },
    {
      icon: MessageCircle,
      title: 'AI Health Chatbot',
      description: 'Get instant answers to health questions from our AI assistant',
      image: '/assets/images/telemedicine-consultation.jpg',
      link: null,
      action: openChatbot,
      color: 'text-primary'
    },
    {
      icon: FileText,
      title: 'Medical Resources',
      description: 'Access comprehensive medical information and health resources',
      image: '/assets/images/ultrasound-diagnostics.jpg',
      link: '/resources',
      color: 'text-secondary'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={service.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          {service.link ? (
            <Link to={service.link} className="block">
              <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center">
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:text-primary/80 transition-colors duration-200">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div onClick={service.action} className="block cursor-pointer">
              <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-lg rounded-full flex items-center justify-center">
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:text-primary/80 transition-colors duration-200">
                    <span>Try Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default ServicesGrid
