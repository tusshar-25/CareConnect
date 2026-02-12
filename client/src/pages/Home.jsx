import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Users, Calendar, MessageCircle, FileText, Shield, Clock, CheckCircle, Star } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import ServicesGrid from '../components/ServicesGrid'
import EmergencyButton from '../components/EmergencyButton'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import VolunteerBanner from '../components/VolunteerBanner'

const Home = () => {
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
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Emergency Quick Button */}
      <EmergencyButton />

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">
              Our Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support services designed to meet your healthcare needs 24/7
            </p>
          </motion.div>
          <ServicesGrid />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* AI Chatbot Preview */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-text mb-6">
                AI-Powered Health Assistant
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get instant answers to your health questions with our intelligent chatbot. 
                Available 24/7 to provide guidance and support.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-text">Symptom Assessment</h3>
                    <p className="text-gray-600">Describe your symptoms and get initial guidance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-text">Medication Information</h3>
                    <p className="text-gray-600">Learn about medications and potential interactions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-text">Health Tips</h3>
                    <p className="text-gray-600">Receive personalized health and wellness advice</p>
                  </div>
                </div>
              </div>
              <button
                onClick={openChatbot}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                Try AI Assistant
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageCircle className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold text-text">AI Chat Assistant</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">You:</p>
                    <p className="text-text">I've been having headaches for 3 days. What should I do?</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">AI Assistant:</p>
                    <p className="text-text">I understand you're concerned about your headaches. For headaches lasting 3 days, I recommend: 1) Rest in a quiet, dark room 2) Stay hydrated 3) Try over-the-counter pain relievers if appropriate 4) Keep a headache diary. If symptoms worsen or you experience other symptoms like fever or vision changes, please seek medical attention immediately.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Volunteer Banner */}
      <VolunteerBanner />

      {/* Trust Elements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Clock, label: '24/7 Support', description: 'Always available when you need us' },
              { icon: Shield, label: 'Secure & Private', description: 'Your health data is protected' },
              { icon: Users, label: 'Expert Volunteers', description: 'Trained healthcare professionals' },
              { icon: CheckCircle, label: 'Verified Services', description: 'All services are certified' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-2">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hospitals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-text mb-4">
              Trusted by Leading Healthcare Providers
            </h2>
            <p className="text-gray-600">
              Partnered with top hospitals and healthcare organizations
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['City Medical Center', 'General Hospital', 'Health Plus', 'Care Medical'].map((hospital, index) => (
              <motion.div
                key={hospital}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover-lift"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-text">{hospital}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
