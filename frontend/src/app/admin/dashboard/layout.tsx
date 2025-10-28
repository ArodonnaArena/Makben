"use client"
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { Home, User, Briefcase, FolderKanban, Award, Code, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: User, label: 'Profile', href: '/admin/dashboard/profile' },
  { icon: Briefcase, label: 'Experience', href: '/admin/dashboard/experience' },
  { icon: FolderKanban, label: 'Projects', href: '/admin/dashboard/projects' },
  { icon: Code, label: 'Skills', href: '/admin/dashboard/skills' },
  { icon: Award, label: 'Achievements', href: '/admin/dashboard/achievements' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 flex pt-24">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
          <div className="p-6 border-b border-gray-700">
            <h1 className={`font-bold text-white transition-all ${isSidebarOpen ? 'text-xl' : 'text-sm'}`}>
              {isSidebarOpen ? 'Admin Portal' : 'AP'}
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all group"
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
            
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full mt-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 text-sm"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
