"use client"
import { useEffect, useState } from 'react'
import { authAPI } from '@/lib/api'
import { Plus, Save, X, Trash2, Shield, UserPlus } from 'lucide-react'

interface UserRow {
  id: string
  email: string
  name: string
  role: 'superadmin' | 'admin' | 'viewer'
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<{ id: string; role: string } | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState<{ name: string; email: string; password: string; role: 'admin' | 'viewer' }>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  })

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const meRes = await authAPI.getMe()
      setMe({ id: meRes.user.id, role: meRes.user.role })
      const res = await authAPI.listUsers()
      setUsers(res.users as any)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)
    try {
      await authAPI.createUser(formData)
      setMessage({ type: 'success', text: 'User created' })
      setFormData({ name: '', email: '', password: '', role: 'admin' })
      setIsFormOpen(false)
      load()
    } catch (e: any) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to create user' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRoleChange = async (id: string, role: 'admin' | 'viewer') => {
    try {
      await authAPI.updateUserRole(id, role)
      setMessage({ type: 'success', text: 'Role updated' })
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, role } : u)))
    } catch (e: any) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to update role' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try {
      await authAPI.deleteUser(id)
      setMessage({ type: 'success', text: 'User deleted' })
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e: any) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to delete user' })
    }
  }

  if (loading) return <div className="text-white">Loading...</div>
  if (error) return <div className="text-red-400">{error}</div>

  const isSuper = me?.role === 'superadmin'

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-6 h-6 text-yellow-400" /> User Management
          </h1>
          <p className="text-gray-400">Create admins/viewers and manage roles</p>
        </div>
        {isSuper && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>New User</span>
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-red-500/20 border border-red-500 text-red-300'}`}>
          {message.text}
        </div>
      )}

      {/* Create User Modal */}
      {isSuper && isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-xl w-full border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create User</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'viewer' }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Creating...' : 'Create'}</span>
                </button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-700/50">
                  <td className="py-3 px-2 text-white">{u.name}</td>
                  <td className="py-3 px-2 text-gray-300">{u.email}</td>
                  <td className="py-3 px-2">
                    {u.role === 'superadmin' ? (
                      <span className="text-yellow-400 font-semibold">superadmin</span>
                    ) : (
                      <select
                        value={u.role}
                        disabled={!isSuper || me?.id === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as 'admin' | 'viewer')}
                        className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                      >
                        <option value="admin">admin</option>
                        <option value="viewer">viewer</option>
                      </select>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      className={`px-3 py-1 rounded ${(!isSuper || me?.id === u.id || u.role === 'superadmin') ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                      disabled={!isSuper || me?.id === u.id || u.role === 'superadmin'}
                      onClick={() => handleDelete(u.id)}
                    >
                      <span className="inline-flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
