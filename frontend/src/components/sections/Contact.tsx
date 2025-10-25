"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useMemo } from 'react'
import { useProfile } from '@/hooks/useData'

export function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const { profile } = useProfile()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add your form submission logic here using formData
    console.log(formData)
  }

  return (
    <section id="contact" className="py-20 bg-[#2b2d3a] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Let's Work Together
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Have a project in mind? Let's discuss how we can work together
            </motion.p>
          </div>

          {/* Contact Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full bg-transparent border-2 border-[#ff4757] rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6b81] transition-colors"
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-transparent border-2 border-[#ff4757] rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6b81] transition-colors"
                  required
                />
              </div>
            </div>
            
            {/* Subject */}
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full bg-transparent border-2 border-[#ff4757] rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6b81] transition-colors"
                required
              />
            </div>
            
            {/* Message */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full bg-transparent border-2 border-[#ff4757] rounded-lg px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff6b81] transition-colors h-40 resize-none"
                required
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                type="submit"
                className="px-12 py-4 bg-[#ff4757] hover:bg-[#ff6b81] text-white rounded-full font-semibold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </div>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            className="mt-16 text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {profile?.email && (
              <p className="text-gray-400">
                <span className="text-white font-semibold">Email:</span> {profile.email}
              </p>
            )}
            {profile?.location && (
              <p className="text-gray-400">
                <span className="text-white font-semibold">Location:</span> {[
                  profile.location.city,
                  profile.location.state,
                  profile.location.country
                ].filter(Boolean).join(', ') || 'Abuja, Nigeria'}
              </p>
            )}
            {profile?.phone && (
              <p className="text-gray-400">
                <span className="text-white font-semibold">Phone:</span> {profile.phone}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}