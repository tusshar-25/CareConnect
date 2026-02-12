import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, MapPin, Phone, Mail, FileText, AlertCircle, Upload, CheckCircle, Send } from 'lucide-react'
import axios from 'axios'

const PatientSupport = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    location: '',
    medicalConcern: '',
    urgencyLevel: 'medium',
    medicalHistory: '',
    prescriptionFile: null,
    medicalReportFile: null
  })
  const [files, setFiles] = useState({
    prescriptionFile: null,
    medicalReportFile: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key])
        }
      })

      if (files.prescriptionFile) {
        formDataToSend.append('prescriptionFile', files.prescriptionFile)
      }
      if (files.medicalReportFile) {
        formDataToSend.append('medicalReportFile', files.medicalReportFile)
      }

      const response = await axios.post('http://localhost:3000/api/patients', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setIsSubmitted(true)
      setFormData({
        fullName: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        location: '',
        medicalConcern: '',
        urgencyLevel: 'medium',
        medicalHistory: '',
        prescriptionFile: null,
        medicalReportFile: null
      })
      setFiles({
        prescriptionFile: null,
        medicalReportFile: null
      })
    } catch (error) {
      console.error('Error submitting form:', error)
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
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-text mb-4">Request Submitted Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for reaching out. Our healthcare team will review your request and contact you shortly. 
              For immediate assistance, please call our 24/7 hotline.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-text mb-4">Patient Support Request</h1>
          <p className="text-xl text-gray-600">
            Get personalized medical support from our healthcare professionals
          </p>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-danger/10 border border-danger/20 rounded-2xl p-6 mb-8 flex items-start space-x-4"
        >
          <AlertCircle className="h-6 w-6 text-danger flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-danger mb-2">Emergency Notice</h3>
            <p className="text-gray-700">
              If you are experiencing a life-threatening emergency, please call 112 immediately. 
              For urgent medical guidance, call our 24/7 support hotline at 1800-123-4567.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
                <User className="h-6 w-6 mr-3 text-primary" />
                Personal Information
              </h2>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-text mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Rajesh Kumar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="rajesh.kumar@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Indore, Madhya Pradesh"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-primary" />
                Medical Information
              </h2>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-text mb-4">Health Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Concern *
                    </label>
                    <textarea
                      name="medicalConcern"
                      value={formData.medicalConcern}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white resize-none"
                      placeholder="Please describe your medical concern or symptoms..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level *
                    </label>
                    <select
                      name="urgencyLevel"
                      value={formData.urgencyLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Select Urgency</option>
                      <option value="low">Low - Non-urgent</option>
                      <option value="medium">Medium - Within 24 hours</option>
                      <option value="high">High - Within 4 hours</option>
                      <option value="critical">Critical - Immediate attention needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Medical History
                    </label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white resize-none"
                      placeholder="Any previous medical conditions, surgeries, or ongoing treatments..."
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-text mb-4">Medical Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prescription/Doctor's Note (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload prescription or doctor's note</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'prescriptionFile')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="prescription-upload"
                      />
                      <label
                        htmlFor="prescription-upload"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {files.prescriptionFile && (
                        <p className="mt-4 text-sm text-gray-600">
                          Selected: {files.prescriptionFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Reports (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload medical reports or test results</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'medicalReportFile')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="report-upload"
                      />
                      <label
                        htmlFor="report-upload"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {files.medicalReportFile && (
                        <p className="mt-4 text-sm text-gray-600">
                          Selected: {files.medicalReportFile.name}
                        </p>
                      )}
                    </div>
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
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      Submit Request
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default PatientSupport
