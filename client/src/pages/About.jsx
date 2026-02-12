import { motion } from 'framer-motion'
import { Heart, Users, Shield, Award, Target, Globe } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassion First',
      description: 'We lead with empathy and understanding in every interaction.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your health data is protected with enterprise-grade security.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by healthcare professionals, for the community.'
    },
    {
      icon: Target,
      title: 'Impact Focused',
      description: 'Every action we take is measured by lives improved.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Patients Helped' },
    { number: '500+', label: 'Healthcare Volunteers' },
    { number: '50+', label: 'Cities Served' },
    { number: '24/7', label: 'Support Available' }
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-text mb-6">
            About CareConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make quality healthcare accessible to everyone, 
            everywhere, 24/7. Through technology and human compassion, we're 
            revolutionizing how people connect with medical support.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To bridge the gap between patients and healthcare providers by creating 
              a seamless, accessible platform that delivers immediate medical support, 
              volunteer assistance, and AI-powered health guidance to anyone in need, 
              regardless of location or time.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="glass-card rounded-2xl p-8 hover-lift h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
        >
          <div>
            <h2 className="text-3xl font-bold text-text mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                CareConnect was born from a simple observation: healthcare support shouldn't be limited by geography or time. During the global health crisis, we saw countless people struggling to get timely medical advice and support.
              </p>
              <p>
                What started as a small group of healthcare professionals volunteering their time has grown into a comprehensive platform connecting thousands of patients with qualified volunteers and AI-powered medical guidance.
              </p>
              <p>
                Today, we're proud to be a trusted bridge between those in need and those who can help, making quality healthcare support accessible to everyone, 24/7.
              </p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-8">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-xl"
            >
              <source src="/assets/videos/medical-team-working-background.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're seeking support or want to volunteer your skills, 
              you're part of something bigger than yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium">
                Get Support
              </button>
              <button className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-medium">
                Become Volunteer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
