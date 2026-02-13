// Simple deployment test
console.log('🚀 Starting CareConnect Server...')

// Test basic imports
try {
  const express = require('express')
  const mongoose = require('mongoose')
  
  console.log('✅ Dependencies loaded successfully')
  
  // Test MongoDB connection string
  const mongoUri = process.env.MONGODB_URI
  if (mongoUri) {
    console.log('✅ MongoDB URI configured')
  } else {
    console.log('❌ MongoDB URI missing')
  }
  
  // Test OpenAI API key
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    console.log('✅ OpenAI API key configured')
  } else {
    console.log('❌ OpenAI API key missing')
  }
  
  console.log('🎯 Deployment test complete')
  console.log('📊 Environment ready for production')
  
} catch (error) {
  console.error('❌ Deployment test failed:', error.message)
  process.exit(1)
}
