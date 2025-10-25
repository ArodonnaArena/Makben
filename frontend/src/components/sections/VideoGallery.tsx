"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { useVideos } from '@/hooks/useData'
import { Play, X, Eye, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export function VideoGallery() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { videos, isLoading, isError } = useVideos()
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Project Demo', 'Tutorial', 'Presentation', 'Interview', 'Event', 'Other']

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory)

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  if (isError) {
    return (
      <section id="videos" className="py-20 bg-[#2b2d3a]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400">Failed to load videos</p>
        </div>
      </section>
    )
  }

  return (
    <section id="videos" className="py-20 bg-[#2b2d3a]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Video Gallery
            </motion.h2>
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Watch my project demos, tutorials, and presentations
            </motion.p>
          </div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#ff4757] text-white'
                    : 'bg-[#353748] text-gray-300 hover:bg-[#3d3f52] hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#353748] rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-[#3d3f52]"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[#3d3f52] rounded"></div>
                    <div className="h-3 bg-[#3d3f52] rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Grid */}
          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#353748] rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative h-48 bg-gray-700">
                    {video.thumbnailUrl ? (
                      <Image
                        src={`${API_URL}${video.thumbnailUrl}`}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : video.isExternal && video.externalUrl ? (
                      <Image
                        src={`https://img.youtube.com/vi/${getYouTubeID(video.externalUrl)}/hqdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
                    </div>
                    {video.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                        Featured
                      </div>
                    )}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views} views</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(video.publishedDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                    {video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {video.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No videos found in this category</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Video Player */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {selectedVideo.isExternal && selectedVideo.externalUrl ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeID(selectedVideo.externalUrl)}`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full rounded-lg"
                  />
                ) : (
                  <video
                    src={`${API_URL}${selectedVideo.videoUrl}`}
                    controls
                    className="absolute inset-0 w-full h-full rounded-lg"
                  />
                )}
              </div>

              {/* Video Info */}
              <div className="mt-6 space-y-4">
                <div>
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    {selectedVideo.category}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{selectedVideo.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <span className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{selectedVideo.views} views</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedVideo.publishedDate).toLocaleDateString()}</span>
                  </span>
                </div>
                {selectedVideo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
