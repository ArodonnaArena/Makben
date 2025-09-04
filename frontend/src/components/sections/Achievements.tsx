"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const achievements = [
  {
    title: "Best Engineer of the Year",
    organization: "NAMA",
    year: "2023",
    description: "Recognized for outstanding contributions to aviation safety systems",
    image: "/images/award1.jpg"
  },
  {
    title: "Technical Innovation Award",
    organization: "Nigerian Society of Engineers",
    year: "2022",
    description: "For implementing cutting-edge solutions in airspace management",
    image: "/images/award2.jpg"
  },
  {
    title: "Safety Excellence Certificate",
    organization: "International Civil Aviation Organization",
    year: "2021",
    description: "For maintaining highest safety standards in aviation infrastructure",
    image: "/images/award3.jpg"
  }
]

export function Achievements() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="achievements" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Achievements & Awards</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="relative h-48">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-blue-400 text-sm mb-2">{achievement.year}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                  <div className="text-blue-300 mb-3">{achievement.organization}</div>
                  <p className="text-gray-400">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
