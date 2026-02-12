import express from 'express'
import Contact from '../models/Contact.js'

const router = express.Router()

// POST /api/contact - Create new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, category, subject, message, priority } = req.body

    const contact = new Contact({
      name,
      email,
      phone,
      category,
      subject,
      message,
      priority: priority || 'medium',
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    })

    await contact.save()

    // TODO: Send auto-acknowledgement email
    // TODO: Send notification to admin if high priority

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: {
        id: contact._id,
        name: contact.name,
        category: contact.category,
        priority: contact.priority,
        status: contact.status,
        submittedAt: contact.createdAt
      }
    })

  } catch (error) {
    console.error('Contact creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// GET /api/contact - Get all contact messages (for admin)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category, 
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const skip = (page - 1) * limit
    const filter = {}

    if (status) filter.status = status
    if (category) filter.category = category
    if (priority) filter.priority = priority
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ]
    }

    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'fullName email')

    const total = await Contact.countDocuments(filter)

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    })
  }
})

// GET /api/contact/:id - Get specific contact message
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'fullName email')
      .populate('internalNotes.author', 'fullName email')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    res.json({
      success: true,
      data: contact
    })

  } catch (error) {
    console.error('Get contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    })
  }
})

// PUT /api/contact/:id - Update contact message
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'fullName email')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: contact
    })

  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message'
    })
  }
})

// POST /api/contact/:id/notes - Add internal note
router.post('/:id/notes', async (req, res) => {
  try {
    const { content, author } = req.body

    if (!content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Content and author are required'
      })
    }

    const contact = await Contact.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    await contact.addInternalNote(content, author)

    res.status(201).json({
      success: true,
      message: 'Internal note added successfully'
    })

  } catch (error) {
    console.error('Add note error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add internal note'
    })
  }
})

// POST /api/contact/:id/respond - Respond to contact message
router.post('/:id/respond', async (req, res) => {
  try {
    const { content, respondedBy } = req.body

    if (!content || !respondedBy) {
      return res.status(400).json({
        success: false,
        message: 'Response content and responder are required'
      })
    }

    const contact = await Contact.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    await contact.markAsResolved(content, respondedBy)

    // TODO: Send response email to contact

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: contact.response
    })

  } catch (error) {
    console.error('Respond to contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send response'
    })
  }
})

// PUT /api/contact/:id/assign - Assign contact to staff
router.put('/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo,
        status: 'in-progress'
      },
      { new: true }
    ).populate('assignedTo', 'fullName email')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    res.json({
      success: true,
      message: 'Contact assigned successfully',
      data: contact
    })

  } catch (error) {
    console.error('Assign contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to assign contact'
    })
  }
})

// GET /api/contact/statistics - Get contact statistics
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    const stats = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          resolvedMessages: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          pendingMessages: {
            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
          },
          inProgressMessages: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          highPriorityMessages: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          urgentMessages: {
            $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
          }
        }
      }
    ])

    const categoryBreakdown = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])

    const statusBreakdown = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const result = stats[0] || {
      totalMessages: 0,
      resolvedMessages: 0,
      pendingMessages: 0,
      inProgressMessages: 0,
      highPriorityMessages: 0,
      urgentMessages: 0
    }

    res.json({
      success: true,
      data: {
        ...result,
        categoryBreakdown,
        statusBreakdown,
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
