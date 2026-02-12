import mongoose from 'mongoose'

const chatLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    default: () => new Date().getTime().toString(36) + Math.random().toString(36).substr(2)
  },
  messages: [{
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant', 'system']
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      responseTime: Number, // in milliseconds
      tokensUsed: Number,
      model: String
    }
  }],
  userInfo: {
    email: String,
    name: String,
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient'
    },
    isRegistered: {
      type: Boolean,
      default: false
    }
  },
  sessionInfo: {
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: Date,
    duration: Number, // in seconds
    messageCount: {
      type: Number,
      default: 0
    },
    satisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String,
      timestamp: Date
    },
    category: {
      type: String,
      enum: [
        'general-inquiry',
        'symptom-check',
        'medication-info',
        'emergency-guidance',
        'appointment-booking',
        'volunteer-info',
        'technical-support',
        'emergency',
        'other'
      ],
      default: 'general-inquiry'
    },
    tags: [String],
    escalated: {
      type: Boolean,
      default: false
    },
    escalatedTo: {
      type: String,
      enum: ['human-volunteer', 'emergency-services', 'medical-professional']
    },
    escalatedAt: Date,
    escalationReason: String
  },
  aiAnalysis: {
    intent: String,
    entities: [{
      type: String,
      value: String,
      confidence: Number
    }],
    sentiment: {
      score: { type: Number, default: 0 }, // -1 to 1
      label: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: 'neutral'
      }
    },
    urgency: {
      level: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      confidence: { type: Number, default: 0.5 }
    },
    keywords: [String],
    summary: String,
    recommendedActions: [String],
    followUpRequired: {
      type: Boolean,
      default: false
    }
  },
  performance: {
    totalTokens: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Index for better query performance
chatLogSchema.index({ sessionId: 1 })
chatLogSchema.index({ 'sessionInfo.startTime': -1 })
chatLogSchema.index({ 'sessionInfo.category': 1 })
chatLogSchema.index({ 'aiAnalysis.urgency.level': 1 })
chatLogSchema.index({ 'userInfo.email': 1 })

// Virtual for formatted duration
chatLogSchema.virtual('formattedDuration').get(function() {
  if (this.sessionInfo.duration) {
    const minutes = Math.floor(this.sessionInfo.duration / 60)
    const seconds = Math.floor(this.sessionInfo.duration % 60)
    return `${minutes}m ${seconds}s`
  }
  return null
})

// Pre-save middleware to update session info
chatLogSchema.pre('save', function(next) {
  // Update message count
  this.sessionInfo.messageCount = this.messages.length
  
  // Calculate duration if session has ended
  if (this.sessionInfo.endTime && this.sessionInfo.startTime) {
    this.sessionInfo.duration = Math.floor(
      (this.sessionInfo.endTime - this.sessionInfo.startTime) / 1000
    )
  }
  
  // Calculate average response time
  if (this.messages.length > 1) {
    const assistantMessages = this.messages.filter(msg => msg.role === 'assistant' && msg.metadata.responseTime)
    if (assistantMessages.length > 0) {
      const totalTime = assistantMessages.reduce((sum, msg) => sum + msg.metadata.responseTime, 0)
      this.performance.averageResponseTime = Math.floor(totalTime / assistantMessages.length)
    }
  }
  
  next()
})

// Method to add message
chatLogSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
    metadata
  })
  return this.save()
}

// Method to end session
chatLogSchema.methods.endSession = function() {
  this.sessionInfo.endTime = new Date()
  if (this.sessionInfo.startTime) {
    this.sessionInfo.duration = Math.floor(
      (this.sessionInfo.endTime - this.sessionInfo.startTime) / 1000
    )
  }
  return this.save()
}

// Method to escalate session
chatLogSchema.methods.escalate = function(to, reason) {
  this.sessionInfo.escalated = true
  this.sessionInfo.escalatedTo = to
  this.sessionInfo.escalatedAt = new Date()
  this.sessionInfo.escalationReason = reason
  return this.save()
}

// Method to add satisfaction rating
chatLogSchema.methods.addSatisfaction = function(rating, feedback) {
  this.sessionInfo.satisfaction = {
    rating,
    feedback,
    timestamp: new Date()
  }
  return this.save()
}

// Static method to get chat statistics
chatLogSchema.statics.getStatistics = async function(startDate, endDate) {
  const match = {}
  if (startDate && endDate) {
    match['sessionInfo.startTime'] = {
      $gte: startDate,
      $lte: endDate
    }
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        averageMessages: { $avg: '$sessionInfo.messageCount' },
        averageDuration: { $avg: '$sessionInfo.duration' },
        escalatedSessions: {
          $sum: { $cond: ['$sessionInfo.escalated', 1, 0] }
        },
        satisfactionRating: {
          $avg: '$sessionInfo.satisfaction.rating'
        }
      }
    }
  ])

  return stats[0] || {
    totalSessions: 0,
    averageMessages: 0,
    averageDuration: 0,
    escalatedSessions: 0,
    satisfactionRating: 0
  }
}

const ChatLog = mongoose.model('ChatLog', chatLogSchema)

export default ChatLog
