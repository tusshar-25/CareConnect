import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Award, Calendar, Upload, FileText, Send, Briefcase, AlertCircle } from 'lucide-react'
import axios from 'axios'

const VolunteerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: [],
    experience: '',
    availabilityType: '',
    availability: [],
    city: '',
    state: '',
    country: 'India',
    licenseNumber: '',
    professionalBackground: '',
    whyVolunteer: '',
    languages: ['english']
  })
  const [files, setFiles] = useState({
    licenseFile: null,
    idProofFile: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const skills = [
    { id: 'general-practice', label: 'General Practice' },
    { id: 'emergency-care', label: 'Emergency Care' },
    { id: 'mental-health', label: 'Mental Health' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'elder-care', label: 'Elder Care' },
    { id: 'chronic-disease', label: 'Chronic Disease Management' },
    { id: 'nutrition', label: 'Nutrition & Diet' },
    { id: 'physical-therapy', label: 'Physical Therapy' },
    { id: 'counseling', label: 'Counseling' },
    { id: 'first-aid', label: 'First Aid' },
    { id: 'telemedicine', label: 'Telemedicine' },
    { id: 'other', label: 'Other' }
  ]

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'arabic', 'hindi', 'portuguese']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }))
  }

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => {
      const availability = [...prev.availability]
      const existingIndex = availability.findIndex(a => a.day === day)
      
      if (existingIndex >= 0) {
        availability[existingIndex] = {
          ...availability[existingIndex],
          [field]: value
        }
      } else {
        availability.push({
          day,
          [field]: value
        })
      }
      
      return {
        ...prev,
        availability
      }
    })
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
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add files
      if (files.licenseFile) {
        formDataToSend.append('licenseFile', files.licenseFile)
      }
      if (files.idProofFile) {
        formDataToSend.append('idProofFile', files.idProofFile)
      }

      const response = await axios.post('http://localhost:3000/api/volunteers', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setIsSubmitted(true)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        skills: [],
        experience: '',
        availability: [],
        city: '',
        state: '',
        country: 'USA',
        licenseNumber: '',
        professionalBackground: '',
        whyVolunteer: '',
        languages: ['english']
      })
      setFiles({ licenseFile: null, idProofFile: null })
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Error submitting application. Please try again.')
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
            <h1 className="text-3xl font-bold text-text mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in volunteering with CareConnect. We'll review your application 
              and get back to you within 3-5 business days. Your compassion can make a real difference 
              in people's lives.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              Submit Another Application
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
          <h1 className="text-4xl font-bold text-text mb-4">Become a Healthcare Volunteer</h1>
          <p className="text-xl text-gray-600">
            Join our compassionate team and make a difference in patients' lives
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-text mb-2">Volunteer Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Must be a licensed healthcare professional or student</li>
                <li>• Minimum 6 months of clinical experience</li>
                <li>• Ability to commit at least 4 hours per week</li>
                <li>• Complete background verification process</li>
                <li>• Excellent communication and empathy skills</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
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
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Dr. Priya Sharma"
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
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="priya.sharma@hospital.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
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
                      onChange={handleInputChange}
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
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </div>

          {/* Location */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-primary" />
              Location
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-text mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Indore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Madhya Pradesh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
              <Award className="h-6 w-6 mr-3 text-primary" />
              Professional Skills *
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-text mb-4">Select Your Expertise</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.skills.includes(skill.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill.id)}
                      onChange={() => handleSkillToggle(skill.id)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded border-2 mr-3 ${
                        formData.skills.includes(skill.id)
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {formData.skills.includes(skill.id) && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{skill.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
              <Briefcase className="h-6 w-6 mr-3 text-primary" />
              Professional Experience *
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-text mb-4">Experience Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Background *
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white resize-none"
                    placeholder="Describe your professional experience, specializations, and areas of expertise..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Medical license number (if applicable)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability *
                    </label>
                    <select
                      name="availabilityType"
                      value={formData.availabilityType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Select Availability</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-primary" />
              Availability
            </h2>
            
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="font-medium capitalize">{day}</div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">From</label>
                    <input
                      type="time"
                      value={formData.availability.find(a => a.day === day)?.startTime || ''}
                      onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">To</label>
                    <input
                      type="time"
                      value={formData.availability.find(a => a.day === day)?.endTime || ''}
                      onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6">Languages</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((language) => (
                <label
                  key={language}
                  className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.languages.includes(language)
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded border-2 mr-3 ${
                      formData.languages.includes(language)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {formData.languages.includes(language) && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium capitalize">{language}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Why Volunteer */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6">Why Do You Want to Volunteer? *</h2>
            
            <textarea
              name="whyVolunteer"
              value={formData.whyVolunteer}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Share your motivation for volunteering with CareConnect and what you hope to contribute..."
            />
          </div>

          {/* Documents */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-primary" />
              Professional Documents
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-text mb-4">Upload Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload medical license</p>
                    <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'licenseFile')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="license-upload"
                    />
                    <label
                      htmlFor="license-upload"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 cursor-pointer"
                    >
                      Choose File
                    </label>
                    {files.licenseFile && (
                      <p className="mt-4 text-sm text-gray-600">
                        Selected: {files.licenseFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Proof (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload ID proof</p>
                    <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'idProofFile')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="id-upload"
                    />
                    <label
                      htmlFor="id-upload"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 cursor-pointer"
                    >
                      Choose File
                    </label>
                    {files.idProofFile && (
                      <p className="mt-4 text-sm text-gray-600">
                        Selected: {files.idProofFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || formData.skills.length === 0}
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
                  Submit Application
                </span>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default VolunteerRegistration
