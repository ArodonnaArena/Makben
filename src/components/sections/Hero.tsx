"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useProfile } from '@/hooks/useData'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export function Hero() {
  const { profile } = useProfile()

  return (
    <section className="min-h-screen bg-[#1e1e2e] relative overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              {profile?.socialLinks?.github && (
                <motion.a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border-2 border-[#ff4757] flex items-center justify-center text-white hover:bg-[#ff4757] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {profile?.socialLinks?.linkedin && (
                <motion.a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border-2 border-[#ff4757] flex items-center justify-center text-white hover:bg-[#ff4757] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
              <motion.a
                href="mailto:makanjuola.ebenezer@nama.gov.ng"
                className="w-14 h-14 rounded-full border-2 border-[#ff4757] flex items-center justify-center text-white hover:bg-[#ff4757] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
              {profile?.socialLinks?.website && (
                <motion.a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border-2 border-[#ff4757] flex items-center justify-center text-white hover:bg-[#ff4757] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.a>
              )}
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                I am {profile?.firstName || "Makanjuola"} {profile?.lastName || "Ebenezer"}
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {profile?.tagline || "I'm an experienced Electrical Engineer specializing in aviation systems maintenance and infrastructure at the Nigerian Airspace Management Agency (NAMA)"}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4 sm:gap-6 items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.a
                href="#projects"
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#ff4757] text-white rounded-full font-semibold hover:bg-[#ff4757] transition-all text-base sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                My Portfolio
              </motion.a>
              
              <motion.a
                href="#videos"
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-full flex items-center justify-center hover:shadow-xl hover:shadow-[#ff4757]/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              <Image
                src={profile?.profileImage ? `${API_URL}${profile.profileImage}` : "/images/profile.jpg"}
                alt={profile ? `${profile.firstName} ${profile.lastName}` : "Profile"}
                fill
                className="object-contain object-bottom"
                priority
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#252734] via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Text - Hidden on mobile */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-5 overflow-hidden whitespace-nowrap hidden lg:block">
        <h2 className="text-[200px] font-bold text-white">
          ELECTRICAL ENGINEER
        </h2>
      </div>
    </section>
  )
}
