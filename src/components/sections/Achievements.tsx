"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useAchievements } from '@/hooks/useData'
import { AchievementCardSkeleton } from '../ui/LoadingSkeleton'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export function Achievements() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { achievements, isLoading, isError } = useAchievements()

  return (
    <section id="achievements" className="py-20 bg-[#07070f]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Achievements & Awards
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Recognition and milestones throughout my career
            </motion.p>
          </div>
          
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <AchievementCardSkeleton key={i} />)}
            </div>
          )}
          
          {isError && (
            <div className="text-center text-red-400 py-12">Failed to load achievements. Please refresh.</div>
          )}
          
          {!isLoading && !isError && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-[#12131f] rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 group"
                >
                  {achievement.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`${API_URL}${achievement.imageUrl}`}
                        alt={achievement.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-[#8b5cf6] text-sm mb-2 font-semibold">
                      {new Date(achievement.date).getFullYear()} | {achievement.category}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8b5cf6] transition-colors">{achievement.title}</h3>
                    {achievement.issuer && (
                      <div className="text-gray-300 mb-3">{achievement.issuer}</div>
                    )}
                    <p className="text-gray-400">{achievement.description}</p>
                    {achievement.documentUrl && (
                      <a href={`${API_URL}${achievement.documentUrl}`} target="_blank" rel="noopener noreferrer"
                         className="text-[#8b5cf6] hover:text-[#22d3ee] text-sm mt-4 inline-block">View Certificate →</a>
                    )}
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
