import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables first
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })

// Import routes after environment is loaded
import patientRoutes from './routes/patients.js'
import volunteerRoutes from './routes/volunteers.js'
import contactRoutes from './routes/contact.js'
import chatbotRoutes from './routes/chatbot.js'

// Configuration
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Simple port detection without net module
const DEFAULT_PORT = 3000
const MAX_PORT = 3100

async function findAvailablePort(startPort) {
  for (let port = startPort; port <= MAX_PORT; port++) {
    try {
      // Create a simple test server
      const testServer = express()
      
      await new Promise((resolve, reject) => {
        testServer.listen(port, () => {
          testServer.close(() => {
            resolve(port)
          })
        })
        testServer.on('error', reject)
      })
      
      return port
    } catch (error) {
      if (error.code !== 'EADDRINUSE') {
        throw error
      }
      // Port is in use, continue to next
    }
  }
  throw new Error('No available ports found')
}

const PORT = process.env.PORT || DEFAULT_PORT

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:')
console.log('PORT:', process.env.PORT)
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set')

// Security middleware
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://careconnect-8yxvgturr-tusshar-25s-projects.vercel.app'
  ],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files for uploads
app.use('/uploads', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'uploads')))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB')
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error)
  // Don't exit the process, just log the error and continue
  // This allows other routes to work even if MongoDB fails
})

// Routes
app.use('/api/patients', patientRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/chatbot', chatbotRoutes)

// API index route for debugging
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'CareConnect API is running',
    endpoints: {
      'GET /api/health': 'Health check endpoint',
      'POST /api/patients': 'Patient support requests',
      'POST /api/volunteers': 'Volunteer registration',
      'POST /api/contact': 'Contact form submissions',
      'POST /api/chatbot': 'AI chatbot messages',
      'GET /api/chatbot/test': 'OpenAI integration test'
    },
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CareConnect API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Error:', error)
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      success: false, 
      message: 'File size too large. Maximum size is 10MB.' 
    })
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CareConnect Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
  console.log(`✅ MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`)
  console.log(`✅ OpenAI API: ${process.env.OPENAI_API_KEY ? 'Set' : 'Not set'}`)
})
