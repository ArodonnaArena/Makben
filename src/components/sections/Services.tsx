"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, Wrench, Settings, Radio, Lightbulb, Shield } from 'lucide-react'
import { useServices } from '@/hooks/useData'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Wrench,
  Settings,
  Radio,
  Lightbulb,
  Shield,
}

// Fallback services for electrical engineering
const defaultServices = [
  {
    icon: 'Zap',
    title: "Electrical Systems Design",
    description: "Comprehensive electrical system design and planning for aviation infrastructure"
  },
  {
    icon: 'Settings',
    title: "Systems Maintenance",
    description: "Expert maintenance and troubleshooting of aviation electrical systems"
  },
  {
    icon: 'Radio',
    title: "Navigation Systems",
    description: "Installation and maintenance of aviation navigation and communication systems"
  },
  {
    icon: 'Wrench',
    title: "Infrastructure Management",
    description: "Management of electrical infrastructure for airports and aviation facilities"
  },
  {
    icon: 'Shield',
    title: "Safety Compliance",
    description: "Ensuring electrical systems meet aviation safety standards and regulations"
  },
  {
    icon: 'Lightbulb',
    title: "Technical Consultation",
    description: "Expert consultation on electrical engineering projects and solutions"
  }
]

export function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const { services, isLoading, isError } = useServices()
  
  // Use API data if available, otherwise fallback to default services
  const displayServices = services.length > 0 ? services : defaultServices

  return (
    <section id="services" className="py-20 bg-[#12131f] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              My Services
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Delivering excellence in electrical engineering and aviation infrastructure maintenance
            </motion.p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1c2e] rounded-2xl p-8 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-[#262a45] mx-auto mb-6"></div>
                  <div className="h-6 bg-[#262a45] rounded mb-3"></div>
                  <div className="h-4 bg-[#262a45] rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="text-center py-12">
              <p className="text-red-400">Failed to load services. Showing default services.</p>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((service, index) => {
                const iconName = typeof service.icon === 'string' ? service.icon : 'Zap'
                const Icon = iconMap[iconName] || Zap
                return (
                  <motion.div
                    key={service.title || service._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    className="group"
                  >
                    <div className="bg-[#1a1c2e] rounded-2xl p-8 text-center hover:bg-[#262a45] transition-all duration-300 h-full flex flex-col items-center justify-center">
                      {/* Icon */}
                      <motion.div
                        className="w-16 h-16 rounded-full bg-[#8b5cf6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
