import express from 'express'
import ChatLog from '../models/ChatLog.js'
import openaiService from '../services/ai/openaiService.js'

const router = express.Router()

// POST /api/chatbot - Send message to chatbot
router.post('/', async (req, res) => {
  try {
    const { message, sessionId, userInfo } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      })
    }

    let chatLog
    const startTime = Date.now()

    // Find or create chat session
    if (sessionId) {
      chatLog = await ChatLog.findOne({ sessionId })
    }

    if (!chatLog) {
      chatLog = new ChatLog({
        userInfo: userInfo || {},
        sessionInfo: {
          category: 'general-inquiry'
        }
      })
    }

    // Add user message to chat log
    await chatLog.addMessage('user', message, {
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    })

    // Generate AI response
    const aiResponse = await openaiService.generateResponse(message, chatLog.sessionId)
    const responseTime = Date.now() - startTime

    // Add AI response to chat log
    await chatLog.addMessage('assistant', aiResponse.response, {
      responseTime,
      tokensUsed: aiResponse.usage?.total_tokens || 0,
      model: 'gpt-3.5-turbo'
    })

    // Update chat log with AI analysis
    if (aiResponse.analysis) {
      chatLog.aiAnalysis = {
        intent: aiResponse.analysis.intent || 'general-inquiry',
        urgency: {
          level: typeof aiResponse.analysis.urgency === 'string' 
            ? aiResponse.analysis.urgency 
            : aiResponse.analysis.urgency?.level || 'medium',
          confidence: aiResponse.analysis.confidence || 0.5
        },
        sentiment: {
          score: aiResponse.analysis.sentimentScore || 0,
          label: aiResponse.analysis.sentimentLabel || 'neutral'
        },
        keywords: aiResponse.analysis.keywords || [],
        entities: aiResponse.analysis.entities || []
      }

      // Update session category based on intent
      if (aiResponse.analysis.intent) {
        chatLog.sessionInfo.category = aiResponse.analysis.intent
      }

      // Escalate if needed
      if (aiResponse.analysis.escalate || aiResponse.isEmergency) {
        await chatLog.escalate(
          aiResponse.isEmergency ? 'emergency-services' : 'human-volunteer',
          aiResponse.isEmergency ? 'Emergency keywords detected' : 'Complex medical inquiry'
        )
      }
    }

    await chatLog.save()

    res.json({
      success: true,
      data: {
        response: aiResponse.response,
        sessionId: chatLog.sessionId,
        isEmergency: aiResponse.isEmergency,
        escalated: chatLog.sessionInfo.escalated,
        responseTime: responseTime
      }
    })

  } catch (error) {
    console.error('Chatbot error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// POST /api/chatbot/end - End chat session
router.post('/end', async (req, res) => {
  try {
    const { sessionId } = req.body

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      })
    }

    const chatLog = await ChatLog.findOne({ sessionId })
    if (!chatLog) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      })
    }

    await chatLog.endSession()

    res.json({
      success: true,
      data: {
        sessionId: chatLog.sessionId,
        duration: chatLog.sessionInfo.duration,
        messageCount: chatLog.sessionInfo.messageCount
      }
    })

  } catch (error) {
    console.error('End session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to end session'
    })
  }
})

// POST /api/chatbot/rate - Rate chat session
router.post('/rate', async (req, res) => {
  try {
    const { sessionId, rating, feedback } = req.body

    if (!sessionId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and rating are required'
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const chatLog = await ChatLog.findOne({ sessionId })
    if (!chatLog) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      })
    }

    await chatLog.addSatisfaction(rating, feedback)

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    })

  } catch (error) {
    console.error('Rating error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    })
  }
})

// GET /api/chatbot/sessions - Get chat sessions (for admin)
router.get('/sessions', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, urgency } = req.query
    const skip = (page - 1) * limit

    const filter = {}
    if (category) filter['sessionInfo.category'] = category
    if (urgency) filter['aiAnalysis.urgency.level'] = urgency

    const sessions = await ChatLog.find(filter)
      .sort({ 'sessionInfo.startTime': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-messages') // Exclude messages for list view

    const total = await ChatLog.countDocuments(filter)

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get sessions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions'
    })
  }
})

// GET /api/chatbot/sessions/:sessionId - Get specific chat session
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const chatLog = await ChatLog.findOne({ sessionId })
    if (!chatLog) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      })
    }

    res.json({
      success: true,
      data: chatLog
    })

  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session'
    })
  }
})

// GET /api/chatbot/statistics - Get chat statistics
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    const end = endDate ? new Date(endDate) : new Date()

    const stats = await ChatLog.getStatistics(start, end)

    // Additional statistics
    const categoryStats = await ChatLog.aggregate([
      {
        $match: {
          'sessionInfo.startTime': { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$sessionInfo.category',
          count: { $sum: 1 }
        }
      }
    ])

    const urgencyStats = await ChatLog.aggregate([
      {
        $match: {
          'sessionInfo.startTime': { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$aiAnalysis.urgency.level',
          count: { $sum: 1 }
        }
      }
    ])

    res.json({
      success: true,
      data: {
        ...stats,
        categoryBreakdown: categoryStats,
        urgencyBreakdown: urgencyStats,
        period: {
          start,
          end
        }
      }
    })

  } catch (error) {
    console.error('Statistics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    })
  }
})

export default router
