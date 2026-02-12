import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Truck, Clock, MapPin, AlertTriangle, Heart, Shield, Users } from 'lucide-react'

const EmergencyCare = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null)

  const emergencyTypes = [
    {
      id: 'cardiac',
      title: 'Cardiac Emergency',
      icon: Heart,
      color: 'red',
      description: 'Chest pain, heart attack, cardiac arrest',
      action: 'Call 112 immediately',
      symptoms: ['Chest pain or pressure', 'Shortness of breath', 'Pain in arm/jaw/back', 'Nausea or dizziness']
    },
    {
      id: 'stroke',
      title: 'Stroke Emergency',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Sudden numbness, confusion, vision problems',
      action: 'Call 112 immediately',
      symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Time to call 112']
    },
    {
      id: 'trauma',
      title: 'Trauma Injury',
      icon: Shield,
      color: 'blue',
      description: 'Accidents, falls, severe injuries',
      action: 'Call 112 or go to nearest ER',
      symptoms: ['Bleeding', 'Broken bones', 'Head injury', 'Severe pain']
    },
    {
      id: 'respiratory',
      title: 'Breathing Difficulty',
      icon: Users,
      color: 'purple',
      description: 'Asthma attack, choking, respiratory distress',
      action: 'Call 112 or use emergency inhaler',
      symptoms: ['Shortness of breath', 'Wheezing', 'Chest tightness', 'Blue lips']
    }
  ]

  const emergencyContacts = [
    { name: 'National Emergency', number: '112', description: 'All emergencies' },
    { name: 'Ambulance Service', number: '108', description: 'Medical emergencies' },
    { name: 'Women Helpline', number: '1091', description: 'Women safety' },
    { name: 'Child Helpline', number: '1098', description: 'Child protection' },
    { name: 'Mental Health', number: '1800-599-0019', description: 'Crisis support' },
    { name: 'Poison Control', number: '1800-11-0044', description: 'Poison emergencies' }
  ]

  const firstAidSteps = [
    {
      title: 'Stay Calm',
      description: 'Take a deep breath and stay focused',
      icon: Shield
    },
    {
      title: 'Assess Situation',
      description: 'Check for dangers and assess the person',
      icon: AlertTriangle
    },
    {
      title: 'Call for Help',
      description: 'Dial 112 or ask someone to call',
      icon: Phone
    },
    {
      title: 'Provide Care',
      description: 'Follow emergency instructions until help arrives',
      icon: Heart
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <Truck className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Emergency Care Services</h1>
            <p className="text-xl text-red-100">24/7 Emergency Medical Assistance</p>
            <div className="mt-6 flex justify-center space-x-4">
              <a href="tel:112" className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition-colors">
                🚨 Call 112 - Emergency
              </a>
              <a href="tel:108" className="bg-red-800 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-900 transition-colors">
                🚑 Call 108 - Ambulance
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Emergency Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Types of Medical Emergencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyTypes.map((emergency, index) => (
              <motion.div
                key={emergency.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 border-${emergency.color}-100 cursor-pointer hover:shadow-xl transition-all duration-300`}
                onClick={() => setSelectedEmergency(emergency)}
              >
                <div className={`w-12 h-12 bg-${emergency.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <emergency.icon className={`h-6 w-6 text-${emergency.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{emergency.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{emergency.description}</p>
                <div className={`text-${emergency.color}-600 font-semibold text-sm`}>
                  {emergency.action}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Details Modal */}
        {selectedEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmergency(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-${selectedEmergency.color}-100 rounded-lg flex items-center justify-center`}>
                    <selectedEmergency.icon className={`h-6 w-6 text-${selectedEmergency.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedEmergency.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedEmergency(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Common Symptoms:</h4>
                <ul className="space-y-2">
                  {selectedEmergency.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">{selectedEmergency.action}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Emergency Contact Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <a href={`tel:${contact.number}`} className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
                  {contact.number}
                </a>
                <p className="text-gray-600 text-sm mt-2">{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* First Aid Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Basic First Aid Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {firstAidSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700">
                This information is for emergency guidance only. Always call 112 for serious medical emergencies. 
                In case of life-threatening situations, go to the nearest emergency room immediately. 
                Do not attempt to drive yourself if you are experiencing severe symptoms.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EmergencyCare
