import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import Patient from '../models/Patient.js'
import openaiService from '../services/ai/openaiService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/prescriptions'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname))
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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
})

// POST /api/patients - Create new patient request
router.post('/', upload.single('prescriptionFile'), async (req, res) => {
  try {
    const patientData = {
      fullName: req.body.fullName,
      age: req.body.age,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      location: req.body.location,
      medicalConcern: req.body.medicalConcern,
      urgencyLevel: req.body.urgencyLevel
    }

    // Add file information if uploaded
    if (req.file) {
      patientData.prescriptionFile = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    }

    // Generate AI summary
    const aiSummary = await openaiService.generateSummary(
      patientData.medicalConcern,
      patientData.urgencyLevel,
      {
        age: patientData.age,
        gender: patientData.gender
      }
    )

    patientData.aiSummary = aiSummary

    const patient = new Patient(patientData)
    await patient.save()

    // TODO: Send confirmation email
    // TODO: Send notification to volunteers if high urgency

    res.status(201).json({
      success: true,
      message: 'Patient request submitted successfully',
      data: {
        id: patient._id,
        fullName: patient.fullName,
        status: patient.status,
        urgencyLevel: patient.urgencyLevel,
        submittedAt: patient.createdAt,
        aiSummary: patient.aiSummary
      }
    })

  } catch (error) {
    console.error('Patient creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit patient request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// GET /api/patients - Get all patients (for admin)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      urgencyLevel, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const skip = (page - 1) * limit
    const filter = {}

    if (status) filter.status = status
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }

    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    const patients = await Patient.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedVolunteer', 'fullName email')

    const total = await Patient.countDocuments(filter)

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get patients error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    })
  }
})

// GET /api/patients/:id - Get specific patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedVolunteer', 'fullName email phone skills')
      .populate('notes.author', 'fullName email')

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    res.json({
      success: true,
      data: patient
    })

  } catch (error) {
    console.error('Get patient error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient'
    })
  }
})

// PUT /api/patients/:id - Update patient
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('assignedVolunteer', 'fullName email')

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    })

  } catch (error) {
    console.error('Update patient error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update patient'
    })
  }
})

// POST /api/patients/:id/notes - Add note to patient
router.post('/:id/notes', async (req, res) => {
  try {
    const { content, author } = req.body

    if (!content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Content and author are required'
      })
    }

    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    patient.notes.push({
      author,
      content,
      timestamp: new Date()
    })

    await patient.save()

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: patient.notes[patient.notes.length - 1]
    })

  } catch (error) {
    console.error('Add note error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    })
  }
})

// PUT /api/patients/:id/assign - Assign volunteer to patient
router.put('/:id/assign', async (req, res) => {
  try {
    const { volunteerId } = req.body

    if (!volunteerId) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer ID is required'
      })
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { 
        assignedVolunteer: volunteerId,
        status: 'in-progress'
      },
      { new: true }
    ).populate('assignedVolunteer', 'fullName email')

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    // TODO: Send notification to assigned volunteer

    res.json({
      success: true,
      message: 'Volunteer assigned successfully',
      data: patient
    })

  } catch (error) {
    console.error('Assign volunteer error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to assign volunteer'
    })
  }
})

// PUT /api/patients/:id/resolve - Mark patient as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'resolved',
        resolvedAt: new Date()
      },
      { new: true }
    )

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    res.json({
      success: true,
      message: 'Patient marked as resolved',
      data: patient
    })

  } catch (error) {
    console.error('Resolve patient error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to resolve patient'
    })
  }
})

// GET /api/patients/statistics - Get patient statistics
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    const stats = await Patient.aggregate([
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

    const urgencyBreakdown = await Patient.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$urgencyLevel',
          count: { $sum: 1 }
        }
      }
    ])

    const statusBreakdown = await Patient.aggregate([
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
      totalPatients: 0,
      urgentCases: 0,
      resolvedCases: 0,
      pendingCases: 0,
      inProgressCases: 0
    }

    res.json({
      success: true,
      data: {
        ...result,
        urgencyBreakdown,
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
