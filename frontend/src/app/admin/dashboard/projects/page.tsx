"use client"
import { useState } from 'react'
import { useProjects } from '@/hooks/useData'
import api from '@/lib/api'
import { Plus, Edit2, Trash2, Save, X, Upload, Star } from 'lucide-react'
import { mutate } from 'swr'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

interface ProjectForm {
  title: string
  shortDescription: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  status: string
  projectUrl?: string
  githubUrl?: string
  featured: boolean
  outcomes: string[]
}

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    shortDescription: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    status: 'Completed',
    projectUrl: '',
    githubUrl: '',
    featured: false,
    outcomes: []
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [outcomeInput, setOutcomeInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const statuses = ['Completed', 'In Progress', 'Planned', 'On Hold']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('adminToken')
      
      // Upload image if new one is selected
      let imagePath = editingId ? projects.find((p: any) => p._id === editingId)?.imageUrl : undefined
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', imageFile)
        
        const imageRes = await api.post('/projects/upload-image', imageFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        imagePath = imageRes.data.imageUrl
      }

      const projectData = { ...formData, imageUrl: imagePath }

      if (editingId) {
        await api.put(`/projects/${editingId}`, projectData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage({ type: 'success', text: 'Project updated successfully!' })
      } else {
        await api.post('/projects', projectData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMessage({ type: 'success', text: 'Project created successfully!' })
      }

      mutate('/projects')
      resetForm()
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to save project' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title,
      shortDescription: project.shortDescription || '',
      description: project.description,
      technologies: project.technologies || [],
      startDate: project.startDate?.split('T')[0] || '',
      endDate: project.endDate?.split('T')[0] || '',
      status: project.status,
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
      outcomes: project.outcomes || []
    })
    if (project.imageUrl) {
      // Only add API URL if it's not an external URL
      const imageUrl = project.imageUrl.startsWith('http') 
        ? project.imageUrl 
        : `${API_URL}${project.imageUrl}`
      setImagePreview(imageUrl)
    }
    setEditingId(project._id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      mutate('/projects')
      setMessage({ type: 'success', text: 'Project deleted successfully!' })
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to delete project' 
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      status: 'Completed',
      projectUrl: '',
      githubUrl: '',
      featured: false,
      outcomes: []
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingId(null)
    setIsFormOpen(false)
    setTechInput('')
    setOutcomeInput('')
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

  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, outcomeInput.trim()]
      }))
      setOutcomeInput('')
    }
  }

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
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
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-gray-300 mb-2">Project Image</label>
                {imagePreview && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 w-fit">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Brief one-liner about the project"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Full Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
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
                  <label className="block text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Project URL</label>
                  <input
                    type="url"
                    name="projectUrl"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="https://project-demo.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-gray-300 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Featured Project</span>
                </label>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Technologies Used *</label>
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

              <div>
                <label className="block text-gray-300 mb-2">Project Outcomes</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    placeholder="Add outcome..."
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                      <span className="text-gray-300">{outcome}</span>
                      <button type="button" onClick={() => removeOutcome(index)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
                  <span>{isSaving ? 'Saving...' : 'Save Project'}</span>
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

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <div key={project._id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {project.imageUrl && (
              <div className="relative h-48">
                <Image
                  src={`${API_URL}${project.imageUrl}`}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">{project.shortDescription || project.description.substring(0, 80) + '...'}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech: string, idx: number) => (
                  <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-gray-400 text-xs px-2 py-1">+{project.technologies.length - 3} more</span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                <span className={`px-2 py-1 rounded ${
                  project.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                  project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
