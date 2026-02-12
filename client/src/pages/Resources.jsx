import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Download, 
  Heart, 
  Shield, 
  Users, 
  Clock, 
  ChevronRight, 
  Search,
  Filter,
  BookOpen,
  Video,
  Phone,
  AlertTriangle
} from 'lucide-react'

const Resources = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-text mb-4">Healthcare Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive medical information, guides, and resources to support your health journey. 
            All content is reviewed by healthcare professionals.
          </p>
        </motion.div>

        {/* Simple Resource Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              title: 'Health Guides',
              description: 'Comprehensive guides on common health conditions',
              icon: FileText,
              color: 'bg-primary/10 text-primary'
            },
            {
              title: 'Emergency Information',
              description: 'Critical information for medical emergencies',
              icon: AlertTriangle,
              color: 'bg-danger/10 text-danger'
            },
            {
              title: 'Preventive Care',
              description: 'Tips for maintaining good health and preventing illness',
              icon: Shield,
              color: 'bg-accent/10 text-accent'
            },
            {
              title: 'Mental Health',
              description: 'Resources for mental wellness and emotional support',
              icon: Heart,
              color: 'bg-secondary/10 text-secondary'
            },
            {
              title: 'Medication Safety',
              description: 'Important information about medication usage',
              icon: Users,
              color: 'bg-primary/10 text-primary'
            },
            {
              title: 'Nutrition Guide',
              description: 'Comprehensive nutrition information',
              icon: BookOpen,
              color: 'bg-accent/10 text-accent'
            }
          ].map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 hover-lift cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <resource.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <Link
                    to="/contact"
                    className="text-primary font-medium text-sm hover:text-primary/80 transition-colors duration-200"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-danger/10 to-warning/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-text mb-6 text-center">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Emergency Services', number: '112', desc: 'Life-threatening emergencies' },
              { name: 'National Poison Control', number: '1800-11-2232', desc: 'Poison emergencies' },
              { name: 'Mental Health Helpline', number: '9152972922', desc: 'Mental health crisis support' },
              { name: 'CareConnect Support', number: '1800-123-4567', desc: '24/7 healthcare support' }
            ].map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-danger" />
                </div>
                <div>
                  <h4 className="font-semibold text-text">{contact.name}</h4>
                  <p className="text-lg font-bold text-danger">{contact.number}</p>
                  <p className="text-sm text-gray-600">{contact.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/patient-support"
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
          >
            Get Personalized Health Support
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default Resources
