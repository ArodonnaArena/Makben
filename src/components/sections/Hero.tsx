"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useProfile } from '@/hooks/useData'
import { Github, Linkedin, Mail, ExternalLink, ArrowDown, Zap } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

const socialButtonClass =
  "w-12 h-12 rounded-full glass flex items-center justify-center text-ink-100 hover:text-white hover:border-primary-400/60 hover:shadow-glow transition-all"

export function Hero() {
  const { profile } = useProfile()

  return (
    <section className="min-h-screen bg-[#07070f] relative overflow-hidden flex items-center">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[36rem] h-[36rem] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-electric-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 w-[24rem] h-[24rem] rounded-full bg-accent-500/10 blur-[110px] pointer-events-none" />

      {/* Main Content */}
      <div className="container relative mx-auto px-4 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-28">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-electric-300 mx-auto lg:mx-0"
            >
              <Zap className="w-3.5 h-3.5 text-ember-400" />
              <span className="tracking-wide">
                {profile?.title || 'Senior Electrical Engineer'} · {profile?.company || 'NAMA'}
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-6">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Engineering power<br />
                <span className="gradient-text">that keeps the sky running.</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg lg:text-xl text-ink-200 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                I&apos;m {profile?.firstName || 'Makanjuola'} {profile?.lastName || 'Ebenezer'} — {profile?.tagline || 'an Electrical Engineer specializing in aviation systems maintenance and power infrastructure at the Nigerian Airspace Management Agency (NAMA).'}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.a
                href="#projects"
                className="btn-primary text-base sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>

              <motion.a
                href="#contact"
                className="btn-secondary text-base sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let&apos;s Connect
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex gap-3 justify-center lg:justify-start pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {profile?.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              <a href={`mailto:${profile?.email || 'makanjuola.ebenezer@nama.gov.ng'}`} className={socialButtonClass}>
                <Mail className="w-4 h-4" />
              </a>
              {profile?.socialLinks?.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Rotating gradient ring */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary-600/30 via-electric-500/20 to-accent-500/20 blur-2xl" />
              <div className="absolute inset-6 rounded-[2rem] border border-white/10 backdrop-blur-sm" />
              <Image
                src={profile?.profileImage ? `${API_URL}${profile.profileImage}` : "/images/profile.jpg"}
                alt={profile ? `${profile.firstName} ${profile.lastName}` : "Profile"}
                fill
                className="object-contain object-bottom relative"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 left-0 card-glass !p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-electric-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold leading-none">{profile?.stats?.yearsOfExperience || 5}+ Years</p>
                <p className="text-xs text-ink-200 mt-1">Field Experience</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Text - Hidden on mobile */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-[0.04] overflow-hidden whitespace-nowrap hidden lg:block">
        <h2 className="text-[200px] font-bold text-white font-display">
          ELECTRICAL ENGINEER
        </h2>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-300 hover:text-white transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </motion.a>
    </section>
  )
}
