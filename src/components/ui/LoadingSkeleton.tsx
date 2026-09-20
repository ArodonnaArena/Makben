"use client"
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClass = "animate-pulse bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%]"
  
  const variantClass = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-64 rounded-2xl'
  }[variant]

  return (
    <motion.div
      className={`${baseClass} ${variantClass} ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export function SkillCardSkeleton() {
  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" variant="text" />
        <Skeleton className="h-6 w-16" variant="text" />
      </div>
      <Skeleton className="h-3 w-full" variant="text" />
      <Skeleton className="h-2 w-full" variant="rectangular" />
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <Skeleton className="h-48 w-full" variant="rectangular" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-8 w-20" variant="rectangular" />
          <Skeleton className="h-8 w-20" variant="rectangular" />
          <Skeleton className="h-8 w-20" variant="rectangular" />
        </div>
      </div>
    </div>
  )
}

export function ExperienceCardSkeleton() {
  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16" variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" variant="text" />
          <Skeleton className="h-4 w-32" variant="text" />
          <Skeleton className="h-3 w-24" variant="text" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
      </div>
    </div>
  )
}

export function AchievementCardSkeleton() {
  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4">
      <Skeleton className="h-32 w-full" variant="rectangular" />
      <Skeleton className="h-6 w-3/4" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-2/3" variant="text" />
      <div className="flex items-center gap-2 mt-4">
        <Skeleton className="h-6 w-20" variant="rectangular" />
        <Skeleton className="h-4 w-24" variant="text" />
      </div>
    </div>
  )
}
