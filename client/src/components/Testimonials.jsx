import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'CareConnect was there for me when I needed medical guidance at 2 AM. The AI assistant helped me understand my symptoms and connected me with a healthcare volunteer immediately.',
      rating: 5,
      avatar: '/assets/images/avatar-1.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Volunteer',
      content: 'As a healthcare professional, volunteering through CareConnect has been incredibly rewarding. I can help patients from anywhere and make a real difference in their lives.',
      rating: 5,
      avatar: '/assets/images/avatar-2.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient Family Member',
      content: 'The platform helped me find the right care for my elderly mother. The volunteers were compassionate and knowledgeable. Thank you for this amazing service!',
      rating: 5,
      avatar: '/assets/images/avatar-3.jpg'
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text mb-4">
            What People Say About CareConnect
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from patients and volunteers who have experienced the CareConnect difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-8 h-full hover-lift">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-6">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10,000+', label: 'Patients Helped' },
                { number: '500+', label: 'Active Volunteers' },
                { number: '24/7', label: 'Support Available' },
                { number: '98%', label: 'Satisfaction Rate' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
