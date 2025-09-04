"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Particle component
const Particle = ({ delay }: { delay: number }) => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
  }, [])

  return (
    <motion.div
      className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-60"
      initial={{ 
        x: Math.random() * dimensions.width,
        y: dimensions.height + 10,
        scale: 0
      }}
      animate={{
        y: -10,
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0]
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

// Floating orb component
const FloatingOrb = ({ size, color, duration, delay }: { 
  size: string, 
  color: string, 
  duration: number, 
  delay: number 
}) => {
  return (
    <motion.div
      className={`absolute ${size} ${color} rounded-full blur-xl opacity-20`}
      animate={{
        x: [0, 100, 0],
        y: [0, -100, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsClient(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 aurora-bg opacity-30"></div>
      
      {/* Floating Orbs */}
      <FloatingOrb size="w-64 h-64" color="bg-primary-500" duration={8} delay={0} />
      <FloatingOrb size="w-48 h-48" color="bg-electric-500" duration={6} delay={2} />
      <FloatingOrb size="w-32 h-32" color="bg-accent-500" duration={10} delay={4} />
      
      {/* Particles */}
      {isClient && (
        <div className="particles">
          {Array.from({ length: 50 }).map((_, i) => (
            <Particle key={i} delay={i * 0.1} />
          ))}
        </div>
      )}
      
      {/* Mouse follower effect */}
      {isClient && (
        <motion.div
          className="fixed w-96 h-96 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-4 pt-32 pb-16 relative z-20"
        style={{ y, opacity }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* Profile Image with Enhanced Effects */}
          <motion.div 
            className="mb-12 relative w-64 h-64 mx-auto"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.2,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-electric-500 to-accent-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 p-2">
                <Image
                  src="/images/profile.jpg"
                  alt="Makanjuola Ebenezer"
                  fill
                  className="rounded-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
            
            {/* Floating elements around profile */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 rounded-full shadow-glow"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-electric-500 rounded-full shadow-electric"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 -left-8 w-4 h-4 bg-accent-500 rounded-full"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Name with Spectacular Typography */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-shadow"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="gradient-text">Makanjuola</span>
            <br />
            <span className="gradient-text">Ebenezer</span>
          </motion.h1>
          
          {/* Title with Glowing Effect */}
          <motion.h2 
            className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-8 text-electric-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <span className="relative">
              Electrical Engineer at 
              <span className="text-primary-400 ml-2 relative">
                NAMA
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-electric-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </span>
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Pioneering aviation infrastructure excellence through innovative electrical engineering solutions
            and cutting-edge technology implementations.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.a 
              href="#contact" 
              className="btn-primary group relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Get in Touch</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.a>
            
            <motion.a 
              href="#projects" 
              className="btn-secondary group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-primary-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="text-sm text-gray-400 mt-2">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </section>
  )
}
