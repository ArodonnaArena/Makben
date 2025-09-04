"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const experiences = [
  {
    title: "Senior Electrical Engineer",
    company: "NAMA",
    period: "2020 - Present",
    description: "Leading maintenance operations for critical aviation systems...",
    achievements: [
      "Implemented new maintenance protocols resulting in 30% efficiency increase",
      "Led team of 10 engineers in system upgrades",
      "Reduced downtime by 25% through preventive maintenance"
    ]
  },
  // Add more experiences...
]

export function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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
          
          <div className="max-w-4xl mx-auto">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mb-12 bg-gray-900 rounded-lg p-6 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-blue-400">{exp.title}</h3>
                <p className="text-gray-400 mb-4">{exp.company} | {exp.period}</p>
                <p className="text-gray-300 mb-4">{exp.description}</p>
                <ul className="list-disc list-inside text-gray-300">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="mb-2">{achievement}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
