"use client"
import { useState } from 'react'
import { useAchievements } from '@/hooks/useData'
import api from '@/lib/api'
import { Plus, Edit2, Trash2, Save, X, Upload, Star, Award } from 'lucide-react'
import { mutate } from 'swr'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

interface AchievementForm {
  title: string
  description: string
  date: string
  category: string
  issuer: string
  featured: boolean
}

export default function AchievementsPage() {
  const { achievements, isLoading } = useAchievements()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AchievementForm>({
    title: '',
    description: '',
    date: '',
    category: 'certification',
    issuer: '',
    featured: false
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const categories = ['certification', 'award', 'recognition', 'publication', 'other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('adminToken')
      
      // Upload image if new one is selected
      let imagePath = editingId ? achievements?.find((a: any) => a._id === editingId)?.imageUrl : undefined
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', imageFile)
        
        const imageRes = await api.post('/achievements/upload-image', imageFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        imagePath = imageRes.data.imageUrl
      }

      const achievementData = { ...formData, imageUrl: imagePath }

      if (editingId) {
        await api.put(`/achievements/${editingId}`, achievementData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage({ type: 'success', text: 'Achievement updated successfully!' })
      } else {
        await api.post('/achievements', achievementData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage({ type: 'success', text: 'Achievement created successfully!' })
      }

      mutate('/achievements')
      resetForm()
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to save achievement' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (achievement: any) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date?.split('T')[0] || '',
      category: achievement.category,
      issuer: achievement.issuer || '',
      featured: achievement.featured || false
    })
    if (achievement.imageUrl) {
      // Only add API URL if it's not an external URL
      const imageUrl = achievement.imageUrl.startsWith('http') 
        ? achievement.imageUrl 
        : `${API_URL}${achievement.imageUrl}`
      setImagePreview(imageUrl)
    }
    setEditingId(achievement._id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/achievements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mutate('/achievements')
      setMessage({ type: 'success', text: 'Achievement deleted successfully!' })
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to delete achievement' 
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: 'certification',
      issuer: '',
      featured: false
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading achievements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Achievements</h1>
          <p className="text-gray-400 mt-1">Manage your certifications, awards, and recognitions</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Achievement' : 'Add Achievement'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Professional Engineer License"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Licensed Professional Engineer in Electrical Engineering"
                />
              </div>

              {/* Date and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Issuer */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issuer *
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Council for the Regulation of Engineering in Nigeria (COREN)"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-gray-300">Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm text-gray-300 flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  Featured Achievement
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievements List */}
      <div className="grid gap-4">
        {achievements && achievements.length > 0 ? (
          achievements.map((achievement: any) => (
            <div key={achievement._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex gap-4">
                {achievement.imageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={`${API_URL}${achievement.imageUrl}`}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                        {achievement.featured && (
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{achievement.issuer}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                          {achievement.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(achievement._id)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-3">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>No achievements yet. Add your first achievement!</p>
          </div>
        )}
      </div>
    </div>
  )
}
