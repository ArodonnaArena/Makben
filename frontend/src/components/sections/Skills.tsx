"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { ParticleSystem, FloatingShapes } from '../ui/ParticleSystem'

const skillCategories = [
  {
    category: "Technical Expertise",
    icon: "⚡",
    color: "from-primary-500 to-primary-700",
    items: [
      { name: "Electrical System Design", level: 95, icon: "🔧" },
      { name: "Aviation Systems Maintenance", level: 90, icon: "✈️" },
      { name: "Power Distribution Systems", level: 88, icon: "🔌" },
      { name: "Circuit Analysis", level: 92, icon: "📊" },
      { name: "PLC Programming", level: 85, icon: "💻" }
    ]
  },
  {
    category: "Software & Tools",
    icon: "🛠️",
    color: "from-electric-500 to-electric-700",
    items: [
      { name: "AutoCAD Electrical", level: 85, icon: "📐" },
      { name: "ETAP", level: 80, icon: "⚙️" },
      { name: "Siemens TIA Portal", level: 82, icon: "🏭" },
      { name: "MATLAB", level: 75, icon: "📈" },
      { name: "Microsoft Office Suite", level: 90, icon: "📋" }
    ]
  },
  {
    category: "Leadership & Management",
    icon: "👥",
    color: "from-accent-500 to-accent-700",
    items: [
      { name: "Project Management", level: 88, icon: "📋" },
      { name: "Team Leadership", level: 85, icon: "👨‍💼" },
      { name: "Quality Assurance", level: 92, icon: "✅" },
      { name: "Safety Protocols", level: 95, icon: "🛡️" },
      { name: "Training & Development", level: 80, icon: "🎓" }
    ]
  }
]

const certifications = [
  { name: "Professional Engineer (PE)", year: "2020", icon: "🏆" },
  { name: "Aviation Electrical Systems", year: "2019", icon: "✈️" },
  { name: "Project Management Professional", year: "2021", icon: "📊" },
  { name: "Safety Management Systems", year: "2022", icon: "🛡️" }
]

export function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <ParticleSystem count={40} className="opacity-30" />
      <FloatingShapes className="opacity-20" />
      
      <motion.div 
        className="absolute top-32 right-32 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div 
        className="absolute bottom-32 left-32 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
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
              Skills & Expertise
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Comprehensive technical proficiency and leadership capabilities in electrical engineering
            </motion.p>
          </div>
          
          {/* Skills Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {skillCategories.map((skillSet, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                className="card-glass group"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: categoryIndex * 0.2, duration: 0.8 }}
                whileHover={{ y: -10 }}
              >
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-8">
                  <motion.div
                    className="text-4xl"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {skillSet.icon}
                  </motion.div>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${skillSet.color} bg-clip-text text-transparent`}>
                    {skillSet.category}
                  </h3>
                </div>
                
                {/* Skills List */}
                <div className="space-y-6">
                  {skillSet.items.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      className="group/skill"
                      initial={{ opacity: 0, x: -30 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ delay: (categoryIndex * 0.2) + (skillIndex * 0.1), duration: 0.6 }}
                      onHoverStart={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                      onHoverEnd={() => setHoveredSkill(null)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg group-hover/skill:scale-110 transition-transform duration-300">
                            {skill.icon}
                          </span>
                          <span className="text-gray-300 font-medium group-hover/skill:text-white transition-colors duration-300">
                            {skill.name}
                          </span>
                        </div>
                        <motion.span 
                          className={`text-sm font-bold bg-gradient-to-r ${skillSet.color} bg-clip-text text-transparent`}
                          animate={hoveredSkill === `${categoryIndex}-${skillIndex}` ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {skill.level}%
                        </motion.span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skillSet.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ 
                            duration: 1.5, 
                            delay: (categoryIndex * 0.2) + (skillIndex * 0.1),
                            ease: "easeOut"
                          }}
                        />
                        
                        {/* Glow Effect */}
                        <motion.div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skillSet.color} rounded-full opacity-50 blur-sm`}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ 
                            duration: 1.5, 
                            delay: (categoryIndex * 0.2) + (skillIndex * 0.1),
                            ease: "easeOut"
                          }}
                        />
                        
                        {/* Animated Shine */}
                        {hoveredSkill === `${categoryIndex}-${skillIndex}` && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Certifications Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold gradient-text-static mb-12">
              Professional Certifications
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  className="glass-dark rounded-xl p-6 text-center group hover:bg-primary-500/10 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <motion.div
                    className="text-3xl mb-3"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {cert.icon}
                  </motion.div>
                  <h4 className="font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
                    {cert.name}
                  </h4>
                  <p className="text-gray-400 text-sm">{cert.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
