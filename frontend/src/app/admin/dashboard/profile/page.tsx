"use client"
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useData'
import api from '@/lib/api'
import { Save, Upload, X } from 'lucide-react'
import { mutate } from 'swr'

export default function ProfilePage() {
  const { profile, isLoading } = useProfile()
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    tagline: '',
    bio: '',
    contact: {
      email: '',
      phone: '',
      location: ''
    },
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    },
    skills: {
      technical: [] as string[],
      soft: [] as string[]
    },
    stats: {
      yearsOfExperience: 0,
      projectsCompleted: 0,
      certificationsEarned: 0,
      clientsSatisfied: 0
    }
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [techSkillInput, setTechSkillInput] = useState('')
  const [softSkillInput, setSoftSkillInput] = useState('')

  useEffect(() => {
    if (profile) {
      // Map backend profile structure to form structure
      setFormData({
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        title: profile.title || '',
        company: profile.company || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        contact: {
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location?.city || profile.location?.country || ''
        },
        socialLinks: {
          linkedin: profile.social?.linkedin || '',
          github: profile.social?.github || '',
          twitter: profile.social?.twitter || '',
          website: profile.social?.website || ''
        },
        skills: {
          technical: profile.skills?.technical || [],
          soft: profile.skills?.soft || []
        },
        stats: {
          yearsOfExperience: profile.stats?.yearsOfExperience || 0,
          projectsCompleted: profile.stats?.projectsCompleted || 0,
          certificationsEarned: profile.stats?.certificationsEarned || 0,
          clientsSatisfied: profile.stats?.clientsSatisfied || 0
        }
      })
      if (profile.profileImage) {
        // Only add API URL if it's not an external URL
        const imageUrl = profile.profileImage.startsWith('http') 
          ? profile.profileImage 
          : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${profile.profileImage}`
        setImagePreview(imageUrl)
      }
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const addSkill = (type: 'technical' | 'soft') => {
    const input = type === 'technical' ? techSkillInput : softSkillInput
    if (input.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [type]: [...prev.skills[type], input.trim()]
        }
      }))
      if (type === 'technical') setTechSkillInput('')
      else setSoftSkillInput('')
    }
  }

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index)
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('adminToken')
      
      // Upload image if new one is selected
      let profileImagePath = formData.profileImage
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('profileImage', imageFile)
        
        const imageRes = await api.post('/profile/upload-image', imageFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        profileImagePath = imageRes.data.profileImage
      }

      // Update profile (backend always uses PUT /profile, not /profile/:id)
      const profileData = { ...formData, profileImage: profileImagePath }
      
      await api.put('/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Revalidate cache
      mutate('/profile')
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to update profile' 
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Management</h1>
        <p className="text-gray-400">Update your personal information and profile details</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-red-500/20 border border-red-500 text-red-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Profile Image</h2>
          <div className="flex items-center space-x-6">
            {imagePreview && (
              <img src={imagePreview} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            )}
            <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
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
              <label className="block text-gray-300 mb-2">Title</label>
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
              <label className="block text-gray-300 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Phone</label>
              <input
                type="text"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Location</label>
              <input
                type="text"
                name="contact.location"
                value={formData.contact.location}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">LinkedIn</label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">GitHub</label>
              <input
                type="url"
                name="socialLinks.github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Twitter</label>
              <input
                type="url"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Website</label>
              <input
                type="url"
                name="socialLinks.website"
                value={formData.socialLinks.website}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Technical Skills</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={techSkillInput}
                  onChange={(e) => setTechSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('technical'))}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Add skill..."
                />
                <button
                  type="button"
                  onClick={() => addSkill('technical')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.technical.map((skill, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full flex items-center space-x-2">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSkill('technical', index)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Soft Skills</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={softSkillInput}
                  onChange={(e) => setSoftSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('soft'))}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Add skill..."
                />
                <button
                  type="button"
                  onClick={() => addSkill('soft')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.soft.map((skill, index) => (
                  <span key={index} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full flex items-center space-x-2">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSkill('soft', index)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Years of Experience</label>
              <input
                type="number"
                name="stats.yearsOfExperience"
                value={formData.stats.yearsOfExperience}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Projects Completed</label>
              <input
                type="number"
                name="stats.projectsCompleted"
                value={formData.stats.projectsCompleted}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Certifications</label>
              <input
                type="number"
                name="stats.certificationsEarned"
                value={formData.stats.certificationsEarned}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Clients Satisfied</label>
              <input
                type="number"
                name="stats.clientsSatisfied"
                value={formData.stats.clientsSatisfied}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </form>
    </div>
  )
}
