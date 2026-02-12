import mongoose from 'mongoose'

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  skills: {
    type: [String],
    required: [true, 'Skills are required'],
    enum: [
      'general-practice',
      'emergency-care',
      'mental-health',
      'pediatrics',
      'elder-care',
      'chronic-disease',
      'nutrition',
      'physical-therapy',
      'counseling',
      'first-aid',
      'telemedicine',
      'other'
    ]
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true,
    maxlength: [1000, 'Experience cannot exceed 1000 characters']
  },
  availability: {
    type: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String
    }],
    default: []
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [100, 'State cannot exceed 100 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    default: 'USA'
  },
  licenseNumber: {
    type: String,
    trim: true,
    maxlength: [100, 'License number cannot exceed 100 characters']
  },
  licenseFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  idProofFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  professionalBackground: {
    type: String,
    trim: true,
    maxlength: [1000, 'Professional background cannot exceed 1000 characters']
  },
  whyVolunteer: {
    type: String,
    required: [true, 'Reason for volunteering is required'],
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },
  languages: {
    type: [String],
    default: ['english']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  totalHours: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    maxPatients: {
      type: Number,
      default: 10
    },
    preferredAgeGroups: [{
      type: String,
      enum: ['children', 'adults', 'seniors']
    }],
    preferredConcerns: [{
      type: String,
      enum: [
        'general-health',
        'mental-health',
        'chronic-conditions',
        'emergency',
        'preventive-care',
        'lifestyle-advice'
      ]
    }]
  }
}, {
  timestamps: true
})

// Index for better query performance
volunteerSchema.index({ status: 1, createdAt: -1 })
volunteerSchema.index({ city: 1, state: 1 })
volunteerSchema.index({ skills: 1 })
volunteerSchema.index({ email: 1 })

// Virtual for formatted date
volunteerSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Virtual for full location
volunteerSchema.virtual('fullLocation').get(function() {
  return `${this.city}, ${this.state}, ${this.country}`
})

// Pre-save middleware to validate availability
volunteerSchema.pre('save', function(next) {
  if (this.availability && this.availability.length > 0) {
    // Validate time format (HH:MM)
    for (const slot of this.availability) {
      if (slot.startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.startTime)) {
        return next(new Error('Invalid start time format. Use HH:MM format.'))
      }
      if (slot.endTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot.endTime)) {
        return next(new Error('Invalid end time format. Use HH:MM format.'))
      }
    }
  }
  next()
})

// Method to update rating
volunteerSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0
    this.rating.count = 0
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0)
    this.rating.average = sum / this.reviews.length
    this.rating.count = this.reviews.length
  }
  return this.save()
}

// Method to check if volunteer is available
volunteerSchema.methods.isAvailable = function(day, time) {
  const daySlot = this.availability.find(slot => slot.day === day.toLowerCase())
  if (!daySlot) return false
  
  const currentTime = time.split(':')
  const startTime = daySlot.startTime.split(':')
  const endTime = daySlot.endTime.split(':')
  
  const currentMinutes = parseInt(currentTime[0]) * 60 + parseInt(currentTime[1])
  const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1])
  const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1])
  
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes
}

const Volunteer = mongoose.model('Volunteer', volunteerSchema)

export default Volunteer
