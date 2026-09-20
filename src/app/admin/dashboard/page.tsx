"use client"
import { useProfile, useExperiences, useProjects, useSkills, useAchievements } from '@/hooks/useData'
import { User, Briefcase, FolderKanban, Award, Code, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { profile } = useProfile()
  const { experiences } = useExperiences()
  const { projects } = useProjects()
  const { skills } = useSkills()
  const { achievements } = useAchievements()

  const stats = [
    {
      icon: User,
      label: 'Profile',
      value: profile ? '1' : '0',
      href: '/admin/dashboard/profile',
      color: 'bg-blue-500'
    },
    {
      icon: Briefcase,
      label: 'Experiences',
      value: experiences?.length || 0,
      href: '/admin/dashboard/experience',
      color: 'bg-green-500'
    },
    {
      icon: FolderKanban,
      label: 'Projects',
      value: projects?.length || 0,
      href: '/admin/dashboard/projects',
      color: 'bg-purple-500'
    },
    {
      icon: Code,
      label: 'Skills',
      value: skills?.length || 0,
      href: '/admin/dashboard/skills',
      color: 'bg-yellow-500'
    },
    {
      icon: Award,
      label: 'Achievements',
      value: achievements?.length || 0,
      href: '/admin/dashboard/achievements',
      color: 'bg-red-500'
    }
  ]

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your portfolio content</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>View Portfolio</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/profile"
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
          >
            <h3 className="font-semibold text-white mb-1">Update Profile</h3>
            <p className="text-gray-400 text-sm">Edit your personal information</p>
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
          >
            <h3 className="font-semibold text-white mb-1">Add Project</h3>
            <p className="text-gray-400 text-sm">Showcase your latest work</p>
          </Link>
          <Link
            href="/admin/dashboard/skills"
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
          >
            <h3 className="font-semibold text-white mb-1">Manage Skills</h3>
            <p className="text-gray-400 text-sm">Update your skill set</p>
          </Link>
        </div>
      </div>

      {/* Profile Preview */}
      {profile && (
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Profile Preview</h2>
          <div className="flex items-start space-x-4">
            {profile.profileImage && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${profile.profileImage}`}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{profile.name}</h3>
              <p className="text-blue-400">{profile.title}</p>
              {profile.company && <p className="text-gray-400 text-sm">{profile.company}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
