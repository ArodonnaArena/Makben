"use client"
import { useState } from 'react'
import { useExperiences } from '@/hooks/useData'
import api from '@/lib/api'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { mutate } from 'swr'

interface ExperienceForm {
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export default function ExperiencePage() {
  const { experiences, isLoading } = useExperiences()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ExperienceForm>({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    technologies: []
  })
  const [achievementInput, setAchievementInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('adminToken')
      const dataToSend = { ...formData }
      if (formData.current) {
        delete (dataToSend as any).endDate
      }

      if (editingId) {
        await api.put(`/experiences/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage({ type: 'success', text: 'Experience updated successfully!' })
      } else {
        await api.post('/experiences', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage({ type: 'success', text: 'Experience created successfully!' })
      }

      mutate('/experiences')
      resetForm()
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to save experience' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (exp: any) => {
    setFormData({
      position: exp.position,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate?.split('T')[0] || '',
      endDate: exp.endDate?.split('T')[0] || '',
      current: exp.current,
      description: exp.description,
      achievements: exp.achievements || [],
      technologies: exp.technologies || []
    })
    setEditingId(exp._id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mutate('/experiences')
      setMessage({ type: 'success', text: 'Experience deleted successfully!' })
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to delete experience' 
      })
    }
  }

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      technologies: []
    })
    setEditingId(null)
    setIsFormOpen(false)
    setAchievementInput('')
    setTechInput('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }))
      setAchievementInput('')
    }
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const addTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Experience Management</h1>
          <p className="text-gray-400">Manage your work experience and career history</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
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
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Position *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    End Date {formData.current && '(Current Position)'}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    disabled={formData.current}
                    required={!formData.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-300">I currently work here</label>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Key Achievements</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Add achievement..."
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                      <span className="text-gray-300">{achievement}</span>
                      <button type="button" onClick={() => removeAchievement(index)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Technologies Used</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Add technology..."
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full flex items-center space-x-2">
                      <span>{tech}</span>
                      <button type="button" onClick={() => removeTech(index)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Experience'}</span>
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

      {/* Experiences List */}
      <div className="space-y-4">
        {experiences.map((exp: any) => (
          <div key={exp._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                <p className="text-blue-400">{exp.company}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                  {exp.location && ` | ${exp.location}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{exp.description}</p>
            
            {exp.achievements && exp.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {exp.achievements.map((achievement: string, idx: number) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech: string, idx: number) => (
                  <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
