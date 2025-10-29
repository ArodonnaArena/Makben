"use client"
import { useState } from 'react'
import { useVideos } from '@/hooks/useData'
import { videosAPI } from '@/lib/api'
import { Plus, Save, X, Trash2, Upload, Link as LinkIcon, Star } from 'lucide-react'
import { mutate } from 'swr'

interface VideoForm {
  title: string
  description: string
  category: 'Project Demo' | 'Tutorial' | 'Presentation' | 'Interview' | 'Event' | 'Other'
  tagsInput: string
  featured: boolean
  duration?: string
  publishedDate?: string
  isExternal: boolean
  externalUrl?: string
  videoFile?: File | null
  thumbnailFile?: File | null
}

export default function VideosPage() {
  const { videos, isLoading } = useVideos()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formData, setFormData] = useState<VideoForm>({
    title: '',
    description: '',
    category: 'Project Demo',
    tagsInput: '',
    featured: false,
    duration: '',
    publishedDate: new Date().toISOString().slice(0, 10),
    isExternal: true,
    externalUrl: '',
    videoFile: null,
    thumbnailFile: null,
  })

  const categories = ['Project Demo', 'Tutorial', 'Presentation', 'Interview', 'Event', 'Other'] as const

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Project Demo',
      tagsInput: '',
      featured: false,
      duration: '',
      publishedDate: new Date().toISOString().slice(0, 10),
      isExternal: true,
      externalUrl: '',
      videoFile: null,
      thumbnailFile: null,
    })
    setIsFormOpen(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'videoFile' | 'thumbnailFile'
  ) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      // Build base payload
      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        featured: formData.featured,
        duration: formData.duration || undefined,
        tags: formData.tagsInput
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        publishedDate: formData.publishedDate
          ? new Date(formData.publishedDate).toISOString()
          : new Date().toISOString(),
      }

      // External vs upload handling
      if (formData.isExternal) {
        if (!formData.externalUrl) {
          throw new Error('External URL is required for external videos')
        }
        payload.isExternal = true
        payload.externalUrl = formData.externalUrl
        // thumbnail optional; can be uploaded too
        if (formData.thumbnailFile) {
          const thumbFD = new FormData()
          thumbFD.append('thumbnail', formData.thumbnailFile)
          const thumbRes = await videosAPI.uploadThumbnail(formData.thumbnailFile)
          payload.thumbnailUrl = thumbRes.thumbnailUrl
        }
      } else {
        // Upload video file first
        if (!formData.videoFile) {
          throw new Error('Please select a video file to upload')
        }
        const videoRes = await videosAPI.uploadVideo(formData.videoFile)
        payload.isExternal = false
        payload.videoUrl = videoRes.videoUrl
        if (formData.thumbnailFile) {
          const thumbRes = await videosAPI.uploadThumbnail(formData.thumbnailFile)
          payload.thumbnailUrl = thumbRes.thumbnailUrl
        }
      }

      await videosAPI.create(payload)
      mutate('/videos')
      setMessage({ type: 'success', text: 'Video added successfully!' })
      resetForm()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || err.message || 'Failed to add video' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return
    try {
      await videosAPI.delete(id as any)
      mutate('/videos')
      setMessage({ type: 'success', text: 'Video deleted successfully!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to delete video' })
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Videos Management</h1>
          <p className="text-gray-400">Add YouTube/Vimeo links or upload video files</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video</span>
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
          <div className="bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Video</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Category + Featured */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
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
                <div className="flex items-end">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="text-gray-300 flex items-center space-x-1"><Star className="w-4 h-4" /> <span>Featured</span></span>
                  </label>
                </div>
              </div>

              {/* Tags + Duration + Date */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tagsInput"
                    value={formData.tagsInput}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="demo, tutorial"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Duration (e.g., 04:32)</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="03:45"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Published Date</label>
                  <input
                    type="date"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              {/* Source Toggle */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-6 mb-4">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      name="isExternal"
                      checked={formData.isExternal}
                      onChange={() => setFormData(prev => ({ ...prev, isExternal: true }))}
                    />
                    <span className="text-gray-300 flex items-center space-x-2"><LinkIcon className="w-4 h-4" /> <span>External (YouTube/Vimeo)</span></span>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      name="isExternal"
                      checked={!formData.isExternal}
                      onChange={() => setFormData(prev => ({ ...prev, isExternal: false }))}
                    />
                    <span className="text-gray-300 flex items-center space-x-2"><Upload className="w-4 h-4" /> <span>Upload File</span></span>
                  </label>
                </div>

                {formData.isExternal ? (
                  <div>
                    <label className="block text-gray-300 mb-2">External URL *</label>
                    <input
                      type="url"
                      name="externalUrl"
                      value={formData.externalUrl}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Video File *</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'videoFile')}
                        className="w-full text-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Thumbnail (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnailFile')}
                        className="w-full text-gray-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Video'}</span>
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

      {/* Videos List */}
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">All Videos</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video: any) => (
              <div key={video._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{video.title}</h4>
                    <p className="text-gray-400 text-sm">{video.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{video.description}</p>
                {video.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.tags.slice(0, 3).map((t: string, i: number) => (
                      <span key={i} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
