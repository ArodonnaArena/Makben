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
    <section id="cv" className="py-20 bg-[#12131f]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Curriculum Vitae
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Get a detailed overview of my professional experience, skills, and qualifications
            </motion.p>
          </div>
          
          <motion.div 
            className="bg-[#1a1c2e] p-8 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="/documents/makanjuola_cv.pdf"
                download
                className="inline-flex items-center justify-center px-8 py-4 bg-[#8b5cf6] hover:bg-[#22d3ee] text-white rounded-full font-semibold transition-colors text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Download CV
              </motion.a>
              
              <motion.a
                href="/documents/makanjuola_cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#8b5cf6] text-white rounded-full font-semibold hover:bg-[#8b5cf6] transition-all text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                View CV
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
