import express from 'express'
import Patient from '../models/Patient.js'
import Volunteer from '../models/Volunteer.js'
import Contact from '../models/Contact.js'
import ChatLog from '../models/ChatLog.js'

const router = express.Router()

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    // Patient statistics
    const patientStats = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalPatients: { $sum: 1 },
          urgentCases: {
            $sum: { $cond: [{ $eq: ['$urgencyLevel', 'high'] }, 1, 0] }
          },
          resolvedCases: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          pendingCases: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressCases: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          }
        }
      }
    ])

    // Volunteer statistics
    const volunteerStats = await Volunteer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Contact statistics
    const contactStats = await Contact.aggregate([
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
          }
        }
      }
    ])

    // Chat statistics
    const chatStats = await ChatLog.getStatistics(start, end)

    // Recent activity
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName urgencyLevel status createdAt')

    const recentVolunteers = await Volunteer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName status createdAt')

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category priority status createdAt')

    const patientResult = patientStats[0] || {
      totalPatients: 0,
      urgentCases: 0,
      resolvedCases: 0,
      pendingCases: 0,
      inProgressCases: 0
    }

    const contactResult = contactStats[0] || {
      totalMessages: 0,
      resolvedMessages: 0,
      pendingMessages: 0
    }

    // Format volunteer stats
    const volunteerBreakdown = {}
    volunteerStats.forEach(stat => {
      volunteerBreakdown[stat._id] = stat.count
    })

    res.json({
      success: true,
      data: {
        patients: {
          ...patientResult,
          breakdown: {
            urgent: patientResult.urgentCases,
            resolved: patientResult.resolvedCases,
            pending: patientResult.pendingCases,
            inProgress: patientResult.inProgressCases
          }
        },
        volunteers: {
          total: volunteerBreakdown.pending + volunteerBreakdown.approved + volunteerBreakdown.active || 0,
          active: volunteerBreakdown.active || 0,
          approved: volunteerBreakdown.approved || 0,
          pending: volunteerBreakdown.pending || 0,
          rejected: volunteerBreakdown.rejected || 0
        },
        contacts: {
          ...contactResult,
          breakdown: {
            resolved: contactResult.resolvedMessages,
            pending: contactResult.pendingMessages
          }
        },
        chat: chatStats,
        recentActivity: {
          patients: recentPatients,
          volunteers: recentVolunteers,
          contacts: recentContacts
        },
        period: {
          start,
          end
        }
      }
    })

  } catch (error) {
    console.error('Dashboard statistics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    })
  }
})

// GET /api/admin/overview - Get system overview
router.get('/overview', async (req, res) => {
  try {
    // System-wide statistics
    const totalPatients = await Patient.countDocuments()
    const activeVolunteers = await Volunteer.countDocuments({ status: 'active' })
    const pendingContacts = await Contact.countDocuments({ status: 'new' })
    const urgentCases = await Patient.countDocuments({ urgencyLevel: 'high', status: { $ne: 'resolved' } })

    // Recent trends (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const recentPatients = await Patient.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })
    
    const recentVolunteers = await Volunteer.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    })

    // Chat sessions in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const activeChats = await ChatLog.countDocuments({
      'sessionInfo.startTime': { $gte: twentyFourHoursAgo },
      'sessionInfo.endTime': { $exists: false }
    })

    res.json({
      success: true,
      data: {
        overview: {
          totalPatients,
          activeVolunteers,
          pendingContacts,
          urgentCases
        },
        recentActivity: {
          patients: recentPatients,
          volunteers: recentVolunteers,
          contacts: recentContacts
        },
        currentActivity: {
          activeChats
        }
      }
    })

  } catch (error) {
    console.error('Overview error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system overview'
    })
  }
})

// GET /api/admin/analytics - Get detailed analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30d', type = 'patients' } = req.query
    
    let startDate
    const endDate = new Date()
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }

    let data = []

    switch (type) {
      case 'patients':
        data = await Patient.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$createdAt'
                }
              },
              count: { $sum: 1 },
              urgent: {
                $sum: { $cond: [{ $eq: ['$urgencyLevel', 'high'] }, 1, 0] }
              }
            }
          },
          { $sort: { '_id': 1 } }
        ])
        break

      case 'volunteers':
        data = await Volunteer.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$createdAt'
                }
              },
              count: { $sum: 1 },
              approved: {
                $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
              }
            }
          },
          { $sort: { '_id': 1 } }
        ])
        break

      case 'contacts':
        data = await Contact.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$createdAt'
                }
              },
              count: { $sum: 1 },
              resolved: {
                $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
              }
            }
          },
          { $sort: { '_id': 1 } }
        ])
        break

      case 'chats':
        data = await ChatLog.aggregate([
          {
            $match: {
              'sessionInfo.startTime': { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$sessionInfo.startTime'
                }
              },
              count: { $sum: 1 },
              escalated: {
                $sum: { $cond: ['$sessionInfo.escalated', 1, 0] }
              }
            }
          },
          { $sort: { '_id': 1 } }
        ])
        break
    }

    res.json({
      success: true,
      data: {
        type,
        period,
        data,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    })
  }
})

// GET /api/admin/alerts - Get system alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = []

    // Urgent patient cases
    const urgentPatients = await Patient.find({
      urgencyLevel: 'high',
      status: { $in: ['pending', 'in-progress'] }
    }).countDocuments()

    if (urgentPatients > 0) {
      alerts.push({
        type: 'urgent',
        title: 'Urgent Patient Cases',
        message: `${urgentPatients} urgent patient case(s) require attention`,
        count: urgentPatients,
        link: '/admin/patients?urgencyLevel=high'
      })
    }

    // Pending volunteer applications
    const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' })
    if (pendingVolunteers > 5) {
      alerts.push({
        type: 'warning',
        title: 'Pending Volunteer Applications',
        message: `${pendingVolunteers} volunteer application(s) awaiting review`,
        count: pendingVolunteers,
        link: '/admin/volunteers?status=pending'
      })
    }

    // Unread contact messages
    const unreadContacts = await Contact.countDocuments({ status: 'new' })
    if (unreadContacts > 0) {
      alerts.push({
        type: 'info',
        title: 'New Contact Messages',
        message: `${unreadContacts} unread contact message(s)`,
        count: unreadContacts,
        link: '/admin/contacts?status=new'
      })
    }

    // System health check
    const totalVolunteers = await Volunteer.countDocuments({ status: 'active' })
    if (totalVolunteers < 10) {
      alerts.push({
        type: 'critical',
        title: 'Low Volunteer Availability',
        message: 'Only a few active volunteers available',
        count: totalVolunteers,
        link: '/admin/volunteers?status=active'
      })
    }

    res.json({
      success: true,
      data: alerts
    })

  } catch (error) {
    console.error('Alerts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts'
    })
  }
})

export default router
