"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useState } from 'react'
import { useProjects } from '@/hooks/useData'
import { ProjectCardSkeleton } from '../ui/LoadingSkeleton'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

const categories = ['All', 'UI/UX', 'Branding', 'Apps', 'Web']

export function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { projects, isLoading, isError } = useProjects()

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => 
        project.categories?.includes(selectedCategory) || 
        project.technologies?.some((tech: string) => tech.toLowerCase().includes(selectedCategory.toLowerCase()))
      )

  return (
    <section id="projects" className="py-20 bg-[#1e1e2e] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Portfolio Showcase
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Explore my recent work and projects
            </motion.p>
          </div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#ff4757] text-white'
                    : 'bg-[#2b2d3a] text-gray-400 hover:bg-[#353748] hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          )}
          
          {/* Error State */}
          {isError && (
            <div className="text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl p-12 max-w-md mx-auto"
              >
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Failed to Load Projects</h3>
                <p className="text-gray-400">Please try refreshing the page.</p>
              </motion.div>
            </div>
          )}
          
          {/* Projects Grid */}
          {!isLoading && !isError && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-[#2b2d3a] rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300"
                  whileHover={{ y: -8 }}
                >
                  {project.imageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={`${API_URL}${project.imageUrl}`}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2b2d3a] via-transparent to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff4757] transition-colors">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.shortDescription || project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="bg-[#353748] text-gray-300 px-3 py-1 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="bg-[#353748] text-gray-300 px-3 py-1 rounded-full text-xs">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
