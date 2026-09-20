"use client"
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// 3D Floating Cubes
const FloatingCube = ({ index }: { index: number }) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomSize = Math.random() * 60 + 30
  const randomDuration = Math.random() * 20 + 10

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: randomSize,
        height: randomSize,
      }}
      initial={{ opacity: 0, scale: 0, rotateX: 0, rotateY: 0 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
        rotateX: [0, 360],
        rotateY: [0, 360],
        z: [0, 100, 0],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
    >
      <div 
        className="w-full h-full rounded-lg"
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(217, 70, 239, 0.2))`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      />
    </motion.div>
  )
}

// DNA Helix Animation
export function DNAHelix({ className = '' }: { className?: string }) {
  const particles = Array.from({ length: 20 })

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: `linear-gradient(135deg, 
                ${i % 2 === 0 ? '#3b82f6' : '#d946ef'}, 
                ${i % 2 === 0 ? '#06b6d4' : '#f97316'})`,
              boxShadow: `0 0 20px ${i % 2 === 0 ? '#3b82f6' : '#d946ef'}`,
            }}
            animate={{
              x: [
                Math.cos((i / particles.length) * Math.PI * 2) * 200,
                Math.cos(((i / particles.length) * Math.PI * 2) + Math.PI) * 200,
              ],
              y: [
                (i / particles.length) * window.innerHeight - 200,
                ((i / particles.length) * window.innerHeight - 200) + 400,
              ],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: (i / particles.length) * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Ripple Effect
export function RippleEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-500/20"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{
            width: ['0px', '1000px', '2000px'],
            height: ['0px', '1000px', '2000px'],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.6,
          }}
        />
      ))}
    </div>
  )
}

// Matrix Rain Effect
export function MatrixRain({ className = '' }: { className?: string }) {
  const [columns, setColumns] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setColumns(Math.floor(window.innerWidth / 20))
    }
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-px"
          style={{
            left: `${(i / columns) * 100}%`,
            height: '100%',
            background: 'linear-gradient(transparent, #3b82f6, transparent)',
          }}
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// Floating 3D Shapes
export function Floating3DShapes({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(8)].map((_, i) => (
        <FloatingCube key={i} index={i} />
      ))}
    </div>
  )
}

// Star Field
export function StarField({ className = '' }: { className?: string }) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; duration: number }>>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
      }))
      setStars(newStars)
    }
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Mesh Gradient Orbs
export function MeshGradientOrbs({ className = '' }: { className?: string }) {
  const orbs = [
    { color: 'from-blue-500 to-cyan-500', size: 'w-96 h-96', position: 'top-10 left-10' },
    { color: 'from-purple-500 to-pink-500', size: 'w-80 h-80', position: 'top-1/3 right-10' },
    { color: 'from-cyan-500 to-blue-500', size: 'w-72 h-72', position: 'bottom-20 left-20' },
    { color: 'from-pink-500 to-orange-500', size: 'w-64 h-64', position: 'bottom-10 right-1/4' },
  ]

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} ${orb.position} rounded-full bg-gradient-to-br ${orb.color} opacity-20 blur-3xl`}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}

// Particle Explosion
export function ParticleExplosion({ trigger = false, className = '' }: { trigger?: boolean; className?: string }) {
  const particles = Array.from({ length: 30 })

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const velocity = 200 + Math.random() * 100

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, #3b82f6, #d946ef)`,
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={
              trigger
                ? {
                    x: Math.cos(angle) * velocity,
                    y: Math.sin(angle) * velocity,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }
                : {}
            }
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}

// Combined Animated Background
export default function AnimatedBackground({ variant = 'default', className = '' }: { variant?: 'default' | 'stars' | 'matrix' | 'dna' | 'ripple' | 'mesh' | '3d'; className?: string }) {
  switch (variant) {
    case 'stars':
      return <StarField className={className} />
    case 'matrix':
      return <MatrixRain className={className} />
    case 'dna':
      return <DNAHelix className={className} />
    case 'ripple':
      return <RippleEffect className={className} />
    case 'mesh':
      return <MeshGradientOrbs className={className} />
    case '3d':
      return <Floating3DShapes className={className} />
    default:
      return (
        <>
          <MeshGradientOrbs className={className} />
          <StarField className={className} />
        </>
      )
  }
}
