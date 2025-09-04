"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'

export function CV() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="cv" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-8">Curriculum Vitae</h2>
          
          <div className="bg-gray-900 p-8 rounded-xl shadow-xl">
            <div className="mb-8">
              <h3 className="text-2xl text-blue-400 mb-4">Download or View My CV</h3>
              <p className="text-gray-300 mb-6">
                Get a detailed overview of my professional experience, skills, and qualifications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/documents/makanjuola_cv.pdf"
                download
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Download CV
              </a>
              
              <a
                href="/documents/makanjuola_cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                View CV
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
