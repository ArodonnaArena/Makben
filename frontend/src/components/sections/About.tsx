"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useMemo, useCallback } from 'react'
import { useProfile } from '@/hooks/useData'
import { Calendar, MapPin, Book, GraduationCap, Mail, Phone } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { profile } = useProfile()

  // Format location
  const formatLocation = useCallback(() => {
    if (!profile?.location) return "Abuja, Nigeria"
    const parts = [
      profile.location.city,
      profile.location.state,
      profile.location.country
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "Abuja, Nigeria"
  }, [profile])
  
  const personalInfo = useMemo(() => {
    const info = []
    
    // Location
    info.push({ icon: MapPin, label: "Location", value: formatLocation() })
    
    // Interests
    const interests = profile?.interests && profile.interests.length > 0 
      ? profile.interests.join(", ")
      : "Electrical Engineering, Aviation Systems, Technology"
    info.push({ icon: Book, label: "Interests", value: interests })
    
    // Education - Study
    const institution = profile?.education && profile.education.length > 0 && profile.education[0].institution
      ? profile.education[0].institution
      : "University of Lagos"
    info.push({ 
      icon: GraduationCap, 
      label: "Study", 
      value: institution
    })
    
    // Education - Degree
    let degreeInfo = "Bachelor's Degree in Electrical Engineering"
    if (profile?.education && profile.education.length > 0) {
      degreeInfo = profile.education[0].field 
        ? `${profile.education[0].degree} in ${profile.education[0].field}`
        : profile.education[0].degree
    }
    info.push({ 
      icon: GraduationCap, 
      label: "Degree", 
      value: degreeInfo
    })
    
    // Email
    const email = profile?.email || "makanjuola.ebenezer@nama.gov.ng"
    info.push({ icon: Mail, label: "Mail", value: email })
    
    // Phone
    const phone = profile?.phone || "+234 XXX XXX XXXX"
    info.push({ icon: Phone, label: "Phone", value: phone })
    
    return info
  }, [profile, formatLocation])

  return (
    <section id="about" className="py-20 bg-[#1e1e2e] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              About Me
            </motion.h2>
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Dedicated to excellence in electrical engineering and aviation infrastructure
            </motion.p>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Profile Photo */}
            <motion.div 
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden">
                <Image
                  src={profile?.profileImage ? `${API_URL}${profile.profileImage}` : "/images/profile.jpg"}
                  alt={profile ? `${profile.firstName} ${profile.lastName}` : "Profile"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
            
            {/* Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* Hi There */}
              <div>
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  Hi There
                </motion.h3>
                <motion.p 
                  className="text-base md:text-lg text-gray-300 leading-relaxed mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  {profile?.bio || "I'm an experienced Electrical Engineer specializing in aviation systems maintenance and infrastructure at the Nigerian Airspace Management Agency (NAMA). My journey has been defined by a relentless pursuit of excellence and innovation in delivering world-class solutions for Nigeria's aviation sector."}
                </motion.p>
              </div>
              
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <motion.div
                      key={info.label}
                      className="bg-[#2b2d3a] rounded-xl p-4 flex items-start space-x-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#ff4757] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                        <p className="text-white font-medium text-sm truncate">{info.value}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
