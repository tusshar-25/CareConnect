import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  medicalConcern: {
    type: String,
    required: [true, 'Medical concern is required'],
    trim: true,
    maxlength: [2000, 'Medical concern cannot exceed 2000 characters']
  },
  urgencyLevel: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  prescriptionFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  aiSummary: {
    symptoms: [String],
    duration: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    suggestedPriority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent']
    },
    recommendations: [String]
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: Date
}, {
  timestamps: true
})

// Index for better query performance
patientSchema.index({ status: 1, createdAt: -1 })
patientSchema.index({ urgencyLevel: 1 })
patientSchema.index({ email: 1 })

// Virtual for formatted date
patientSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Pre-save middleware to generate AI summary
patientSchema.pre('save', async function(next) {
  if (this.isNew && this.medicalConcern) {
    try {
      // This would normally call the AI service
      // For now, we'll create a basic summary
      const concern = this.medicalConcern.toLowerCase()
      
      // Simple keyword-based analysis (in production, use OpenAI)
      const symptoms = []
      const recommendations = []
      
      if (concern.includes('headache')) symptoms.push('headache')
      if (concern.includes('fever')) symptoms.push('fever')
      if (concern.includes('pain')) symptoms.push('pain')
      if (concern.includes('cough')) symptoms.push('cough')
      if (concern.includes('fatigue')) symptoms.push('fatigue')
      
      // Determine risk level based on urgency
      let riskLevel = 'low'
      let suggestedPriority = 'low'
      
      if (this.urgencyLevel === 'high') {
        riskLevel = 'high'
        suggestedPriority = 'urgent'
      } else if (this.urgencyLevel === 'medium') {
        riskLevel = 'medium'
        suggestedPriority = 'medium'
      }
      
      recommendations.push('Consult with healthcare professional')
      if (symptoms.length > 0) {
        recommendations.push('Monitor symptoms closely')
      }
      if (this.urgencyLevel === 'high') {
        recommendations.push('Seek immediate medical attention if symptoms worsen')
      }
      
      this.aiSummary = {
        symptoms,
        duration: 'recent onset', // Would be extracted from message
        riskLevel,
        suggestedPriority,
        recommendations
      }
    } catch (error) {
      console.error('Error generating AI summary:', error)
    }
  }
  next()
})

const Patient = mongoose.model('Patient', patientSchema)

export default Patient
