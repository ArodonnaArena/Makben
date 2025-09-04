"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useState } from 'react'

const stats = [
  { number: "10+", label: "Years Experience", icon: "⚡" },
  { number: "500+", label: "Projects Completed", icon: "🚀" },
  { number: "99.9%", label: "System Uptime", icon: "🎯" },
  { number: "24/7", label: "Aviation Support", icon: "✈️" }
]

const skills = [
  "Electrical Systems Design",
  "Aviation Infrastructure",
  "Power Distribution",
  "Control Systems",
  "Safety Protocols",
  "Project Management"
]

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-purple-900/30"></div>
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              About Me
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Dedicated to excellence in electrical engineering and aviation infrastructure
            </motion.p>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Text Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="glass rounded-2xl p-8 space-y-6">
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  With over a decade of experience in electrical engineering, I specialize in aviation systems 
                  maintenance and infrastructure at the Nigerian Airspace Management Agency (NAMA). My journey 
                  has been defined by a relentless pursuit of excellence and innovation.
                </motion.p>
                
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  My expertise encompasses system design, maintenance protocols, and implementing cutting-edge 
                  solutions for critical aviation infrastructure. I&apos;ve led numerous projects that have 
                  significantly improved operational efficiency and safety standards.
                </motion.p>
                
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  I&apos;m passionate about ensuring the safety and efficiency of Nigeria&apos;s airspace through 
                  innovative engineering solutions, meticulous maintenance practices, and continuous 
                  technological advancement.
                </motion.p>
              </div>
              
              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    className="glass-dark rounded-xl p-4 text-center hover:bg-primary-500/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <span className="text-sm font-medium text-primary-300">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Image Section */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden group">
                {/* Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-electric-500 to-accent-500 p-1 rounded-2xl">
                  <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden">
                    <Image
                      src="/images/working.jpg"
                      alt="Makanjuola at work"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-12 h-12 bg-primary-500 rounded-full shadow-glow flex items-center justify-center text-white font-bold"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-electric-500 rounded-full shadow-electric flex items-center justify-center text-white text-xl"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🔧
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-glass text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredStat(index)}
                onHoverEnd={() => setHoveredStat(null)}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="text-4xl mb-3"
                  animate={hoveredStat === index ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-3xl md:text-4xl font-bold gradient-text-static mb-2"
                  animate={hoveredStat === index ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
