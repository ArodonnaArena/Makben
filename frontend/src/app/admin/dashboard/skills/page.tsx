"use client"
import { useState } from 'react'
import { useSkills } from '@/hooks/useData'
import api from '@/lib/api'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { mutate } from 'swr'

interface SkillForm {
  name: string
  category: string
  proficiency: number
  icon?: string
  yearsOfExperience?: number
}

export default function SkillsPage() {
  const { skills, isLoading } = useSkills()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<SkillForm>({
    name: '',
    category: 'Technical Expertise',
    proficiency: 50,
    icon: '',
    yearsOfExperience: 0
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const categories = [
    'Technical Expertise',
    'Software & Tools',
    'Leadership & Management',
    'Programming',
    'Design',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('adminToken')

      if (editingId) {
        await api.put(`/skills/${editingId}`, formData)
        setMessage({ type: 'success', text: 'Skill updated successfully!' })
      } else {
        await api.post('/skills', formData)
        setMessage({ type: 'success', text: 'Skill created successfully!' })
      }

      mutate('/skills')
      resetForm()
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to save skill' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (skill: any) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      yearsOfExperience: skill.yearsOfExperience || 0
    })
    setEditingId(skill._id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mutate('/skills')
      setMessage({ type: 'success', text: 'Skill deleted successfully!' })
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to delete skill' 
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Technical Expertise',
      proficiency: 50,
      icon: '',
      yearsOfExperience: 0
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' || name === 'yearsOfExperience' ? Number(value) : value
    }))
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills Management</h1>
          <p className="text-gray-400">Manage your skills and proficiency levels</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-red-500/20 border border-red-500 text-red-300'}`}>
          {message.text}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Skill Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Proficiency: {formData.proficiency}%</label>
                <input
                  type="range"
                  name="proficiency"
                  value={formData.proficiency}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="⚡"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  min="0"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Skill'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        {categories.map(category => {
          const categorySkills = skills.filter((s: any) => s.category === category)
          if (categorySkills.length === 0) return null

          return (
            <div key={category} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">{category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill: any) => (
                  <div key={skill._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {skill.icon && <span className="text-2xl">{skill.icon}</span>}
                        <h4 className="font-semibold text-white">{skill.name}</h4>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Proficiency</span>
                        <span className="text-blue-400 font-semibold">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                    {skill.yearsOfExperience > 0 && (
                      <p className="text-gray-400 text-sm">{skill.yearsOfExperience} years experience</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
