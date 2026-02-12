import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import PatientSupport from './pages/PatientSupport'
import VolunteerRegistration from './pages/VolunteerRegistration'
import Resources from './pages/Resources'
import Contact from './pages/Contact'
import EmergencyCare from './pages/EmergencyCare'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ChatbotWidget from './components/ChatbotWidget'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="main-content-with-emergency">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/patient-support" element={<PatientSupport />} />
            <Route path="/volunteer" element={<VolunteerRegistration />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/emergency" element={<EmergencyCare />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    </Router>
  )
}

export default App
