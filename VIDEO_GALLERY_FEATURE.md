# Video Gallery Feature - Complete Integration Guide

## Overview
A complete video gallery system with upload capabilities, supporting both self-hosted videos and external YouTube/Vimeo links.

## What's Been Implemented

### Backend (Express + TypeScript + MongoDB)
✅ **Video Model** (`backend/src/models/Video.ts`)
- Supports both uploaded and external videos
- Fields: title, description, videoUrl, thumbnailUrl, category, duration, tags, featured, views
- Categories: Project Demo, Tutorial, Presentation, Interview, Event, Other
- Automatic view counting
- Indexed for efficient queries

✅ **Video Routes** (`backend/src/routes/videos.ts`)
- `POST /api/videos/upload-video` - Upload video file (100MB limit, .mp4, .avi, .mov, etc.)
- `POST /api/videos/upload-thumbnail` - Upload thumbnail (5MB limit, images)
- `GET /api/videos` - Get all videos with filters (category, featured, tags)
- `GET /api/videos/:id` - Get single video (increments view count)
- `POST /api/videos` - Create new video entry
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video (also deletes files)

✅ **Route Registration** (`backend/src/app.ts`)
- Videos API registered at `/api/videos`

### Frontend (Next.js + TypeScript + Tailwind + Framer Motion)

✅ **Types** (`frontend/src/types/index.ts`)
- Video interface with all fields

✅ **API Client** (`frontend/src/lib/api.ts`)
- `videosAPI.getAll()` - Fetch all videos
- `videosAPI.getOne(id)` - Fetch single video  
- `videosAPI.create()` - Create video
- `videosAPI.update()` - Update video
- `videosAPI.delete()` - Delete video
- `videosAPI.uploadVideo()` - Upload video file
- `videosAPI.uploadThumbnail()` - Upload thumbnail

✅ **Custom Hooks** (`frontend/src/hooks/useData.ts`)
- `useVideos(params)` - Fetch videos with SWR caching
- `useVideo(id)` - Fetch single video with SWR caching

✅ **Video Gallery Component** (`frontend/src/components/sections/VideoGallery.tsx`)
- Beautiful grid layout with thumbnails
- Category filter (All, Project Demo, Tutorial, etc.)
- Click to play videos in modal
- Supports YouTube embed and self-hosted videos
- Displays: views, published date, tags, duration
- Featured badge for highlighted videos
- Loading skeletons
- Responsive design

✅ **Main Page Integration** (`frontend/src/app/page.tsx`)
- Video Gallery added between Projects and Contact sections

## Features

### Video Management
- **Upload Videos**: Direct file upload up to 100MB
- **External Links**: Support for YouTube/Vimeo URLs
- **Thumbnails**: Custom thumbnail upload or auto-fetch from YouTube
- **Categories**: Organize videos by type
- **Tags**: Add multiple tags for filtering
- **Featured**: Mark important videos
- **View Tracking**: Automatic view counting
- **Duration Display**: Show video length

### User Experience
- **Responsive Grid**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Filter by Category**: Quick category switching
- **Modal Player**: Full-screen video player with details
- **YouTube Integration**: Automatic YouTube embed support
- **Thumbnail Preview**: Shows custom or YouTube thumbnail
- **Smooth Animations**: Framer Motion transitions
- **Loading States**: Skeleton screens while fetching

## How to Use

### Adding Videos via API

1. **Upload a video file:**
```bash
curl -X POST http://localhost:5000/api/videos/upload-video \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "video=@/path/to/video.mp4"
```

2. **Upload a thumbnail:**
```bash
curl -X POST http://localhost:5000/api/videos/upload-thumbnail \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "thumbnail=@/path/to/thumbnail.jpg"
```

3. **Create video entry:**
```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project Demo",
    "description": "A demonstration of my latest project",
    "videoUrl": "/uploads/videos/video-123456.mp4",
    "thumbnailUrl": "/uploads/thumbnails/thumb-123456.jpg",
    "category": "Project Demo",
    "duration": "05:30",
    "tags": ["React", "TypeScript", "Demo"],
    "featured": true
  }'
```

4. **Or use external YouTube video:**
```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type": application/json" \
  -d '{
    "title": "My YouTube Tutorial",
    "description": "Learn how to build this feature",
    "externalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "isExternal": true,
    "category": "Tutorial",
    "tags": ["Tutorial", "JavaScript"],
    "featured": false
  }'
```

### Frontend Usage

The Video Gallery is automatically integrated. Users can:
1. Browse videos by category
2. Click thumbnails to open video player
3. Watch videos in full-screen modal
4. View video details, tags, and stats

## Admin Dashboard Integration (Next Step)

To complete the feature, create an admin page to manage videos:

**File:** `frontend/src/app/admin/dashboard/videos/page.tsx`

Should include:
- List all videos
- Upload video + thumbnail
- Add/edit video details
- Toggle featured status
- Delete videos
- Support for external URLs

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Video.ts
│   ├── routes/
│   │   └── videos.ts
│   └── app.ts (updated)
└── uploads/
    ├── videos/
    └── thumbnails/

frontend/
├── src/
│   ├── app/
│   │   └── page.tsx (updated)
│   ├── components/
│   │   └── sections/
│   │       └── VideoGallery.tsx
│   ├── hooks/
│   │   └── useData.ts (updated)
│   ├── lib/
│   │   └── api.ts (updated)
│   └── types/
│       └── index.ts (updated)
```

## Environment Variables

Make sure these are set:

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/makben-portfolio
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```

3. **Visit:** http://localhost:3000

4. **Scroll to Video Gallery section**

## Next Steps

1. **Create Admin Video Management Page** - Build CRUD interface in admin dashboard
2. **Add Video Analytics** - Track watch time, completion rate
3. **Video Compression** - Add ffmpeg integration for video optimization
4. **Playlists** - Group videos into playlists
5. **Comments** - Allow viewers to comment on videos
6. **Video Search** - Add search functionality by title/description/tags

## Deployment Notes

- Store videos in cloud storage (AWS S3, Cloudinary, etc.) for production
- Use CDN for video delivery
- Consider video transcoding service for multiple quality options
- Implement rate limiting on upload endpoints
- Add file type and malware scanning

## Support

For issues or questions, check:
- Backend logs: `backend/logs/`
- Frontend console: Browser DevTools
- MongoDB: Use MongoDB Compass to inspect video documents
