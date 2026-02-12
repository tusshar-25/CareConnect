import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, AlertTriangle, Users, Calendar, MessageCircle, FileText, Clock, Shield, ArrowRight } from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: Heart,
      title: 'Patient Support',
      description: 'Comprehensive medical guidance and support from trained healthcare professionals.',
      features: ['Symptom assessment', 'Treatment guidance', 'Follow-up care', 'Medication information'],
      link: '/patient-support',
      color: 'from-primary to-primary/80'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Assistance',
      description: '24/7 emergency support with immediate response and critical care guidance.',
      features: ['Emergency triage', 'Critical care guidance', 'Hospital connection', 'Emergency protocols'],
      link: '/contact',
      color: 'from-danger to-danger/80'
    },
    {
      icon: Users,
      title: 'Volunteer Network',
      description: 'Connect with trained healthcare volunteers for personalized support and care.',
      features: ['Verified professionals', 'Specialized expertise', 'Flexible scheduling', 'Multi-language support'],
      link: '/volunteer',
      color: 'from-secondary to-secondary/80'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Schedule appointments with healthcare providers and specialists seamlessly.',
      features: ['Online scheduling', 'Specialist matching', 'Reminder system', 'Telehealth options'],
      link: '#',
      color: 'from-accent to-accent/80'
    },
    {
      icon: MessageCircle,
      title: 'AI Health Assistant',
      description: 'Get instant answers to health questions from our intelligent AI assistant.',
      features: ['24/7 availability', 'Symptom checker', 'Health information', 'First aid guidance'],
      link: '#',
      color: 'from-primary to-primary/80'
    },
    {
      icon: FileText,
      title: 'Medical Resources',
      description: 'Access comprehensive medical information and health resources.',
      features: ['Health library', 'Educational content', 'Preventive care tips', 'Wellness guides'],
      link: '/resources',
      color: 'from-secondary to-secondary/80'
    }
  ]

  const benefits = [
    { icon: Clock, title: '24/7 Availability', description: 'Healthcare support whenever you need it' },
    { icon: Shield, title: 'Secure & Private', description: 'Your health information is always protected' },
    { icon: Users, title: 'Expert Care', description: 'Licensed healthcare professionals' },
    { icon: Heart, title: 'Compassionate Service', description: 'Care delivered with empathy and understanding' }
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-text mb-6">
            Our Healthcare Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive healthcare support designed to meet your needs. 
            From emergency assistance to preventive care, we're here for you 24/7.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-card rounded-2xl overflow-hidden hover-lift h-full">
                {/* Header */}
                <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-white/90">{service.description}</p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={service.link}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">Why Choose CareConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="glass-card rounded-2xl p-8 hover-lift h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/assets/videos/doctor-video-consultation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
          </div>
          
          <div className="relative z-10 p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">How Our Services Work</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Getting healthcare support is simple and straightforward
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Choose Service', desc: 'Select the healthcare service you need' },
                { step: '2', title: 'Provide Details', desc: 'Share your health information securely' },
                { step: '3', title: 'Get Matched', desc: 'Connect with appropriate healthcare support' },
                { step: '4', title: 'Receive Care', desc: 'Get the help you need, when you need it' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-text mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards better health. Our healthcare services are just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/patient-support"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
            >
              Get Support Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-all duration-200 font-medium"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Services
