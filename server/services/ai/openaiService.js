import OpenAI from 'openai'

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

class OpenAIService {
  constructor() {
    this.systemPrompt = `You are a healthcare support assistant for CareConnect. Your role is to provide helpful, accurate medical information and guidance while maintaining professional boundaries.

Key Guidelines:
1. Always provide a disclaimer that you're not a substitute for professional medical care
2. For emergencies, always advise calling 911 or visiting emergency services
3. Be empathetic, clear, and professional in your responses
4. Focus on general health information, symptom guidance, and care coordination
5. Never provide specific diagnoses or prescribe medications
6. Encourage users to seek professional medical care for serious conditions
7. Help users navigate the CareConnect platform (volunteer connection, appointments, etc.)
8. Provide preventive care tips and general wellness advice

Response Format:
- Start with empathy for their concern
- Provide helpful, general information
- Include appropriate disclaimers
- Suggest next steps (when to see a doctor, etc.)
- Offer to connect them with healthcare volunteers through CareConnect

Remember: You are supporting, not diagnosing. Safety first.`

    this.emergencyKeywords = [
      'emergency', 'die', 'dying', 'suicide', 'kill myself', 'heart attack', 
      'stroke', 'cannot breathe', 'chest pain', 'severe bleeding', 'unconscious',
      'overdose', 'poison', 'severe burn', 'broken bone', 'head injury'
    ]
  }

  async generateResponse(message, sessionId = null) {
    try {
      console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY)
      
      // Check for emergency keywords
      const isEmergency = this.checkForEmergency(message)
      if (isEmergency) {
        return this.getEmergencyResponse()
      }

      // For now, return a simple response without calling OpenAI to test the flow
      const simpleResponses = {
        'volunteer': 'Thank you for your interest in volunteering with CareConnect! You can register as a healthcare volunteer on our platform. We\'ll review your application and connect you with patients who need your expertise. Our volunteers include doctors, nurses, and other healthcare professionals who want to make a difference.',
        'support': 'I can help you get the support you need! You can submit a patient support request through our platform, and we\'ll connect you with appropriate healthcare volunteers. For urgent medical concerns, please call 112 immediately.',
        'emergency': '🚨 This sounds like an emergency! Please call 112 immediately for emergency medical services. If this is not an emergency but you need urgent medical guidance, please visit the nearest hospital or call our support hotline at 1800-123-4567.',
        'symptom': 'I understand you\'re experiencing symptoms. While I can provide general guidance, I recommend: 1) For severe symptoms, call 112 immediately 2) For non-emergency symptoms, you can submit a patient support request 3) Keep track of your symptoms including duration and severity 4) Stay hydrated and rest. Please consult a healthcare professional for proper diagnosis.',
        'appointment': 'For appointments, you can submit a patient support request and we\'ll help connect you with appropriate healthcare providers. You can also browse our services to find the right type of care for your needs.',
        'medicine': 'For medication information, I recommend consulting with a healthcare professional. Our platform can connect you with qualified healthcare volunteers who can provide guidance on medications and their proper usage. Never share personal medical information in chat.',
        'default': 'I\'m here to help you with healthcare support! I can assist with: • Finding the right healthcare services • Connecting you with healthcare volunteers • General health information • Emergency guidance. For emergencies, please call 112. How can I help you today?'
      }

      const lowerMessage = message.toLowerCase()
      let response = simpleResponses.default
      
      // Check for specific keywords in order of priority
      if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
        response = simpleResponses.emergency
      } else if (lowerMessage.includes('volunteer')) {
        response = simpleResponses.volunteer
      } else if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('fever') || lowerMessage.includes('headache')) {
        response = simpleResponses.symptom
      } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
        response = simpleResponses.appointment
      } else if (lowerMessage.includes('medicine') || lowerMessage.includes('drug') || lowerMessage.includes('medication')) {
        response = simpleResponses.medicine
      } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
        response = simpleResponses.support
      }

      return {
        response,
        analysis: {
          intent: 'general-inquiry',
          urgency: 'medium',
          sentimentScore: 0,
          sentimentLabel: 'neutral'
        },
        isEmergency: false
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return this.getFallbackResponse()
    }
  }

  checkForEmergency(message) {
    const lowerMessage = message.toLowerCase()
    return this.emergencyKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  getEmergencyResponse() {
    return {
      response: "🚨 **EMERGENCY DETECTED** 🚨\n\nBased on your message, you may be experiencing a medical emergency. Please:\n\n1. **Call 112 immediately** - Don't wait\n2. Go to the nearest emergency room\n3. If possible, have someone stay with you\n4. Don't attempt to drive yourself\n\nThis is not a substitute for emergency medical care. Your health and safety are the top priority.\n\nIf you need guidance while waiting for emergency services, I'm here to help, but please call 112 first.",
      analysis: {
        intent: 'emergency',
        urgency: 'critical',
        escalated: true,
        recommendedActions: ['call-112', 'emergency-room']
      },
      isEmergency: true
    }
  }

  async analyzeMessage(message) {
    try {
      const analysisPrompt = `Analyze this healthcare message for intent, urgency, and key information:

Message: "${message}"

Provide analysis in JSON format:
{
  "intent": "symptom-check | medication-info | appointment-booking | volunteer-info | general-inquiry | other",
  "urgency": "low | medium | high | critical",
  "keywords": ["keyword1", "keyword2"],
  "entities": [{"type": "symptom|medication|condition", "value": "extracted value"}],
  "sentiment": "positive|neutral|negative",
  "escalate": true/false
}`

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a medical message analyzer. Respond only with valid JSON." },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 200,
        temperature: 0.1
      })

      const analysisText = response.choices[0].message.content.trim()
      return JSON.parse(analysisText)
    } catch (error) {
      console.error('Analysis error:', error)
      return {
        intent: 'general-inquiry',
        urgency: 'medium',
        keywords: [],
        entities: [],
        sentiment: 'neutral',
        escalate: false
      }
    }
  }

  async createResponse(message, analysis) {
    try {
      const contextualPrompt = `${this.systemPrompt}

User Message Analysis:
- Intent: ${analysis.intent}
- Urgency: ${analysis.urgency}
- Keywords: ${analysis.keywords.join(', ')}

User Message: "${message}"

Provide a helpful, empathetic response following the guidelines. Include:
1. Empathy and acknowledgment
2. Helpful general information
3. Clear next steps
4. Appropriate disclaimers
5. Offer to connect with CareConnect services

Keep the response concise but comprehensive (under 300 words).`

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: contextualPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 400,
        temperature: 0.7
      })

      return response.choices[0].message.content.trim()
    } catch (error) {
      console.error('Response generation error:', error)
      return this.getFallbackResponse().response
    }
  }

  getFallbackResponse() {
    return {
      response: "I'm here to help you with healthcare support. You can ask me about symptoms, volunteer opportunities, or how to get medical assistance. For emergencies, please call 112.",
      analysis: {
        intent: 'general-inquiry',
        urgency: 'medium',
        escalate: false
      },
      isEmergency: false
    }
  }

  async generateSummary(medicalConcern, urgencyLevel, patientInfo = {}) {
    try {
      const summaryPrompt = `Generate a structured medical summary for healthcare professionals:

Patient Information:
- Age: ${patientInfo.age || 'Not specified'}
- Gender: ${patientInfo.gender || 'Not specified'}
- Urgency Level: ${urgencyLevel}

Medical Concern: "${medicalConcern}"

Provide a structured summary in JSON format:
{
  "symptoms": ["symptom1", "symptom2"],
  "duration": "estimated duration",
  "riskLevel": "low|medium|high",
  "suggestedPriority": "low|medium|high|urgent",
  "recommendations": ["recommendation1", "recommendation2"],
  "redFlags": ["flag1", "flag2"],
  "nextSteps": ["step1", "step2"]
}`

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a medical professional creating patient summaries. Respond only with valid JSON." },
          { role: "user", content: summaryPrompt }
        ],
        max_tokens: 300,
        temperature: 0.2
      })

      const summaryText = response.choices[0].message.content.trim()
      return JSON.parse(summaryText)
    } catch (error) {
      console.error('Summary generation error:', error)
      return {
        symptoms: [],
        duration: "unknown",
        riskLevel: urgencyLevel === 'high' ? 'high' : 'medium',
        suggestedPriority: urgencyLevel,
        recommendations: ["Professional medical evaluation recommended"],
        redFlags: [],
        nextSteps: ["Schedule medical consultation"]
      }
    }
  }

  async categorizeMessage(message) {
    const categories = [
      'general-inquiry',
      'symptom-check',
      'medication-info',
      'emergency-guidance',
      'appointment-booking',
      'volunteer-info',
      'technical-support',
      'other'
    ]

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `Categorize this healthcare message into one of these categories: ${categories.join(', ')}. Respond only with the category name.` 
          },
          { role: "user", content: message }
        ],
        max_tokens: 50,
        temperature: 0.1
      })

      const category = response.choices[0].message.content.trim().toLowerCase()
      return categories.includes(category) ? category : 'other'
    } catch (error) {
      console.error('Categorization error:', error)
      return 'other'
    }
  }
}

export default new OpenAIService()
