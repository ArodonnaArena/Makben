"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useExperiences } from '@/hooks/useData'
import { ExperienceCardSkeleton } from '../ui/LoadingSkeleton'

export function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { experiences, isLoading, isError } = useExperiences()

  return (
    <section id="experience" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Professional Experience</h2>
          
          {isLoading && (
            <div className="max-w-4xl mx-auto space-y-8">
              {[...Array(2)].map((_, i) => <ExperienceCardSkeleton key={i} />)}
            </div>
          )}
          
          {isError && (
            <div className="text-center text-red-400 py-12">Failed to load experiences. Please refresh.</div>
          )}
          
          {!isLoading && !isError && (
            <div className="max-w-4xl mx-auto">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="mb-12 bg-gray-900 rounded-lg p-6 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-blue-400">{exp.position}</h3>
                  <p className="text-gray-400 mb-4">
                    {exp.company} | {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}
                    {exp.location && ` | ${exp.location}`}
                  </p>
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-300">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="mb-2">{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">{tech}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
