import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Volunteer from '../models/Volunteer.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'licenseFile') {
      cb(null, path.join(__dirname, '../uploads/licenses'))
    } else if (file.fieldname === 'idProofFile') {
      cb(null, path.join(__dirname, '../uploads/id-proofs'))
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fieldName = file.fieldname === 'licenseFile' ? 'license' : 'id-proof'
    cb(null, `${fieldName}-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per file
  },
  fileFilter: fileFilter
})

// POST /api/volunteers - Create new volunteer application
router.post('/', upload.fields([
  { name: 'licenseFile', maxCount: 1 },
  { name: 'idProofFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const volunteerData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      skills: Array.isArray(req.body.skills) ? req.body.skills : [req.body.skills],
      experience: req.body.experience,
      availability: req.body.availability ? JSON.parse(req.body.availability) : [],
      city: req.body.city,
      state: req.body.state,
      country: req.body.country || 'USA',
      licenseNumber: req.body.licenseNumber,
      professionalBackground: req.body.professionalBackground,
      whyVolunteer: req.body.whyVolunteer,
      languages: req.body.languages ? JSON.parse(req.body.languages) : ['english']
    }

    // Add file information if uploaded
    if (req.files.licenseFile && req.files.licenseFile[0]) {
      volunteerData.licenseFile = {
        filename: req.files.licenseFile[0].filename,
        originalName: req.files.licenseFile[0].originalname,
        path: req.files.licenseFile[0].path,
        size: req.files.licenseFile[0].size,
        mimetype: req.files.licenseFile[0].mimetype
      }
    }

    if (req.files.idProofFile && req.files.idProofFile[0]) {
      volunteerData.idProofFile = {
        filename: req.files.idProofFile[0].filename,
        originalName: req.files.idProofFile[0].originalname,
        path: req.files.idProofFile[0].path,
        size: req.files.idProofFile[0].size,
        mimetype: req.files.idProofFile[0].mimetype
      }
    }

    const volunteer = new Volunteer(volunteerData)
    await volunteer.save()

    // TODO: Send confirmation email
    // TODO: Send notification to admin

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: {
        id: volunteer._id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        status: volunteer.status,
        submittedAt: volunteer.createdAt
      }
    })

  } catch (error) {
    console.error('Volunteer creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit volunteer application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// GET /api/volunteers - Get all volunteers (for admin)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      city, 
      skills,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const skip = (page - 1) * limit
    const filter = {}

    if (status) filter.status = status
    if (city) filter.city = { $regex: city, $options: 'i' }
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills]
      filter.skills = { $in: skillArray }
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ]
    }

    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    const volunteers = await Volunteer.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-licenseFile -idProofFile') // Exclude sensitive files from list view

    const total = await Volunteer.countDocuments(filter)

    res.json({
      success: true,
      data: {
        volunteers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get volunteers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteers'
    })
  }
})

// GET /api/volunteers/available - Get available volunteers for assignment
router.get('/available', async (req, res) => {
  try {
    const { city, state, skills, day, time } = req.query

    const filter = {
      status: 'active'
    }

    if (city) filter.city = { $regex: city, $options: 'i' }
    if (state) filter.state = { $regex: state, $options: 'i' }
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills]
      filter.skills = { $in: skillArray }
    }

    let volunteers = await Volunteer.find(filter)
      .select('fullName email phone skills availability city state rating')
      .lean()

    // Filter by availability if day and time are provided
    if (day && time) {
      volunteers = volunteers.filter(volunteer => {
        return volunteer.isAvailable(day, time)
      })
    }

    // Sort by rating and availability
    volunteers.sort((a, b) => {
      // First by rating
      if (b.rating.average !== a.rating.average) {
        return b.rating.average - a.rating.average
      }
      // Then by number of assigned patients (fewer first)
      return (a.assignedPatients?.length || 0) - (b.assignedPatients?.length || 0)
    })

    res.json({
      success: true,
      data: volunteers
    })

  } catch (error) {
    console.error('Get available volunteers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available volunteers'
    })
  }
})

// GET /api/volunteers/:id - Get specific volunteer
router.get('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('assignedPatients', 'fullName status urgencyLevel createdAt')
      .populate('reviews.patient', 'fullName')

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    res.json({
      success: true,
      data: volunteer
    })

  } catch (error) {
    console.error('Get volunteer error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer'
    })
  }
})

// PUT /api/volunteers/:id/approve - Approve volunteer application
router.put('/:id/approve', async (req, res) => {
  try {
    const { approvedBy } = req.body

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approvedAt: new Date(),
        approvedBy
      },
      { new: true }
    )

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    // TODO: Send approval email to volunteer

    res.json({
      success: true,
      message: 'Volunteer approved successfully',
      data: volunteer
    })

  } catch (error) {
    console.error('Approve volunteer error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to approve volunteer'
    })
  }
})

// PUT /api/volunteers/:id/reject - Reject volunteer application
router.put('/:id/reject', async (req, res) => {
  try {
    const { rejectionReason, rejectedBy } = req.body

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      })
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason,
        approvedBy: rejectedBy
      },
      { new: true }
    )

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    // TODO: Send rejection email to volunteer

    res.json({
      success: true,
      message: 'Volunteer application rejected',
      data: volunteer
    })

  } catch (error) {
    console.error('Reject volunteer error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject volunteer'
    })
  }
})

// PUT /api/volunteers/:id/status - Update volunteer status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive'
      })
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    res.json({
      success: true,
      message: `Volunteer status updated to ${status}`,
      data: volunteer
    })

  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer status'
    })
  }
})

// POST /api/volunteers/:id/reviews - Add review for volunteer
router.post('/:id/reviews', async (req, res) => {
  try {
    const { patientId, rating, comment } = req.body

    if (!patientId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and rating are required'
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const volunteer = await Volunteer.findById(req.params.id)
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    volunteer.reviews.push({
      patient: patientId,
      rating,
      comment,
      timestamp: new Date()
    })

    await volunteer.updateRating()

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        rating: volunteer.rating.average,
        count: volunteer.rating.count
      }
    })

  } catch (error) {
    console.error('Add review error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    })
  }
})

// GET /api/volunteers/statistics - Get volunteer statistics
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    const stats = await Volunteer.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalVolunteers: { $sum: 1 },
          approvedVolunteers: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          activeVolunteers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          pendingVolunteers: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ])

    const statusBreakdown = await Volunteer.aggregate([
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

    const skillsBreakdown = await Volunteer.aggregate([
      {
        $match: {
          status: { $in: ['approved', 'active'] }
        }
      },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      }
    ])

    const result = stats[0] || {
      totalVolunteers: 0,
      approvedVolunteers: 0,
      activeVolunteers: 0,
      pendingVolunteers: 0
    }

    res.json({
      success: true,
      data: {
        ...result,
        statusBreakdown,
        skillsBreakdown,
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
