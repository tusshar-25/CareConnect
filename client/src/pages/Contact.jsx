import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Shield, Users } from 'lucide-react'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general-inquiry',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emergencyContacts = [
    { name: 'Emergency Services', number: '112', description: 'Life-threatening emergencies' },
    { name: 'National Poison Control', number: '1800-11-2232', description: 'Poison emergencies' },
    { name: 'Mental Health Helpline', number: '9152972922', description: 'Mental health crisis support' },
    { name: 'CareConnect Support', number: '1800-123-4567', description: '24/7 healthcare support' }
  ]

  const categories = [
    { value: 'general-inquiry', label: 'General Inquiry' },
    { value: 'technical-support', label: 'Technical Support' },
    { value: 'volunteer-info', label: 'Volunteer Information' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'media-inquiry', label: 'Media Inquiry' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'emergency', label: 'Emergency' }
  ]

  const contactInfo = [
    {
      icon: Phone,
      title: 'Emergency Hotline',
      details: ['112 - Emergency Services', '1800-123-4567 - Support Hotline'],
      color: 'text-danger'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@careconnect.org', 'volunteers@careconnect.org'],
      color: 'text-primary'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: ['123 Healthcare Ave, Vijay Nagar', 'Indore, Madhya Pradesh 452010'],
      color: 'text-secondary'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: ['24/7 Emergency Support', 'Mon-Fri: 9AM-6PM General Support'],
      color: 'text-accent'
    }
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
    setIsSubmitting(true)

    try {
      await axios.post('http://localhost:3000/api/contact', formData)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'general-inquiry',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-text mb-4">Message Sent Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for contacting CareConnect. We've received your message and will get back to you 
              within 24 hours. For urgent matters, please call our 24/7 support hotline.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              Send Another Message
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-text mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help. Reach out to us with any questions, concerns, or feedback. 
            Our team is committed to providing you with the support you need.
          </p>
        </motion.div>

        {/* Emergency Notice */}
        {formData.category === 'emergency' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-danger/10 border border-danger/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-danger flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-danger mb-2">Emergency Contact</h3>
                <p className="text-gray-700">
                  If this is a medical emergency, please call 112 immediately. 
                  For urgent medical guidance, call our 24/7 support hotline at 1800-123-4567.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-primary" />
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-text mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="Amit Patel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="amit.patel@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-text mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-text mb-4">Message Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white resize-none"
                        placeholder="Please provide detailed information about your inquiry..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <info.icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-semibold text-text mb-4">Why Choose CareConnect</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-gray-600">HIPAA compliant secure platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-gray-600">500+ verified healthcare volunteers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-gray-600">24/7 support availability</span>
                </div>
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-text mb-3">Response Times</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency:</span>
                  <span className="font-medium text-danger">Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgent:</span>
                  <span className="font-medium text-warning">Within 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">General:</span>
                  <span className="font-medium text-accent">Within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
