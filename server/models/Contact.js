import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'general-inquiry',
      'technical-support',
      'volunteer-info',
      'partnership',
      'media-inquiry',
      'complaint',
      'feedback',
      'emergency'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    content: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date,
    emailSent: {
      type: Boolean,
      default: false
    }
  },
  internalNotes: [{
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
  tags: [String],
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'social-media', 'referral'],
    default: 'website'
  },
  userAgent: String,
  ipAddress: String,
  resolvedAt: Date
}, {
  timestamps: true
})

// Index for better query performance
contactSchema.index({ status: 1, createdAt: -1 })
contactSchema.index({ category: 1 })
contactSchema.index({ priority: 1 })
contactSchema.index({ email: 1 })

// Virtual for formatted date
contactSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
  if (this.response && this.response.respondedAt) {
    const diff = this.response.respondedAt - this.createdAt
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }
  return null
})

// Pre-save middleware to set priority based on category
contactSchema.pre('save', function(next) {
  if (this.isNew) {
    // Auto-set priority based on category
    if (this.category === 'emergency') {
      this.priority = 'urgent'
    } else if (this.category === 'complaint') {
      this.priority = 'high'
    } else if (this.category === 'general-inquiry') {
      this.priority = 'low'
    }
    
    // Add tags based on content
    const message = this.message.toLowerCase()
    const tags = []
    
    if (message.includes('urgent') || message.includes('emergency')) {
      tags.push('urgent')
    }
    if (message.includes('volunteer')) {
      tags.push('volunteer-related')
    }
    if (message.includes('technical') || message.includes('website') || message.includes('app')) {
      tags.push('technical')
    }
    if (message.includes('partnership') || message.includes('collaborate')) {
      tags.push('business')
    }
    
    this.tags = tags
  }
  next()
})

// Method to mark as resolved
contactSchema.methods.markAsResolved = function(responseContent, respondedBy) {
  this.status = 'resolved'
  this.response = {
    content: responseContent,
    respondedBy: respondedBy,
    respondedAt: new Date(),
    emailSent: false
  }
  this.resolvedAt = new Date()
  return this.save()
}

// Method to add internal note
contactSchema.methods.addInternalNote = function(content, author) {
  this.internalNotes.push({
    author: author,
    content: content,
    timestamp: new Date()
  })
  return this.save()
}

const Contact = mongoose.model('Contact', contactSchema)

export default Contact
