# CareConnect - Healthcare Support Web Application

A comprehensive full-stack healthcare support platform that connects patients with volunteers and provides AI-powered medical assistance 24/7.

## 🌟 Features

### For Users
- **Patient Support Forms** - Submit medical concerns with file uploads
- **Emergency Assistance** - Quick access to emergency services
- **AI Health Chatbot** - Get instant medical guidance
- **Volunteer Connection** - Connect with healthcare professionals
- **Resource Library** - Access comprehensive health information

### For Volunteers
- **Registration System** - Apply to become a healthcare volunteer
- **Availability Management** - Set your schedule and preferences
- **Patient Assignment** - Get matched with patients needing help
- **Rating System** - Build your reputation through reviews

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Vite** - Fast development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **OpenAI API** - AI chatbot integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CareConnect
```

2. **Install dependencies**

For frontend:
```bash
cd client
npm install
```

For backend:
```bash
cd server
npm install
```

3. **Environment Setup**

Create a `.env` file in the `server` directory:
```env
PORT=3002
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
OPENAI_API_KEY=your-openai-api-key-here
CLIENT_URL=http://localhost:5173
```

Note: Copy `.env.example` and update with your actual credentials.

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

5. **Run the application**

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## 📁 Project Structure

```
CareConnect/
├── client/                     # React frontend
│   ├── public/
│   │   └── assets/            # Images and videos
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # Layout components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── chatbot/          # Chatbot components
│   │   ├── services/         # API services
│   │   └── styles/           # Custom styles
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js backend
│   ├── controllers/          # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   │   └── ai/              # AI integration
│   ├── middleware/          # Custom middleware
│   ├── uploads/             # File uploads
│   ├── config/              # Configuration files
│   ├── package.json
│   └── server.js            # Main server file
└── README.md
```

## 🎨 Design System

### Colors
- **Primary Blue**: #2A7FFF
- **Secondary Teal**: #1ABC9C
- **Accent Green**: #27AE60
- **Emergency Red**: #E74C3C
- **Background**: #F5F7FA
- **Card White**: #FFFFFF
- **Text Dark**: #2C3E50

### Typography
- **Headings**: Poppins
- **Body**: Inter

### UI Components
- Glassmorphism cards
- Soft shadows
- Rounded corners (20px)
- Gradient buttons
- Hover lift animations

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768–1024px
- **Desktop**: > 1024px

## 🔐 Security Features

- HIPAA compliant data handling
- Input validation and sanitization
- File upload restrictions
- Rate limiting
- CORS protection
- Helmet.js security headers

## 🤖 AI Integration

The application uses OpenAI's API for:
- **Symptom Analysis** - Analyze patient symptoms and provide guidance
- **Medical Q&A** - Answer health-related questions
- **Emergency Detection** - Identify emergency situations
- **Case Summaries** - Generate structured patient summaries

## 📊 API Endpoints

### Patients
- `POST /api/patients` - Create patient request
- `GET /api/patients/:id` - Get specific patient
- `PUT /api/patients/:id` - Update patient
- `POST /api/patients/:id/notes` - Add patient notes

### Volunteers
- `POST /api/volunteers` - Submit volunteer application
- `GET /api/volunteers/available` - Get available volunteers

### Chatbot
- `POST /api/chatbot` - Send message to AI
- `POST /api/chatbot/end` - End chat session
- `POST /api/chatbot/rate` - Rate chat session
- `GET /api/chatbot/statistics` - Get chat statistics

### Contact
- `POST /api/contact` - Submit contact form

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests (if implemented)
cd server
npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Render/Railway)
```bash
cd server
# Deploy to Render or Railway with environment variables
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
OPENAI_API_KEY=your-production-openai-key
CLIENT_URL=your-frontend-url
```

## 👥 Demo Accounts

### Patient Access
- **Email**: patient@careconnect.org
- **Password**: patient123

### Volunteer Portal
- **Email**: volunteer@careconnect.org
- **Password**: volunteer123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@careconnect.org
- 🌐 Website: https://careconnect.org
- 📞 Emergency: 911

## 🙏 Acknowledgments

- OpenAI for the powerful AI capabilities
- MongoDB for reliable data storage
- The healthcare community for inspiration
- All volunteers and contributors

---

**CareConnect** - Connecting Hearts, Saving Lives ❤️
