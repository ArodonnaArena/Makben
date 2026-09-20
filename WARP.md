

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a modern portfolio website for Makanjuola Ebenezer, an Electrical Engineer at NAMA. The project uses a monorepo structure with separate frontend and backend directories.

**Tech Stack:**
- Frontend: Next.js 15.1.5, React 19, TypeScript, Tailwind CSS 3.4.1, Framer Motion 12.0.1
- Backend: Express.js with MongoDB (Mongoose), JWT authentication, bcryptjs, helmet, multer
- Deployment: Vercel (frontend)

## Development Commands

### Frontend Development (Next.js)
Navigate to the frontend directory for all frontend commands:

```pwsh
cd frontend
```

**Install dependencies:**
```pwsh
npm install
```

**Development server:**
```pwsh
npm run dev
```
Opens on http://localhost:3000

**Build for production:**
```pwsh
npm run build
```

**Start production server:**
```pwsh
npm start
```

**Linting:**
```pwsh
npm run lint
```

### Backend Development (Express.js)
Navigate to the backend directory for backend commands:

```pwsh
cd backend
```

**Install dependencies:**
```pwsh
npm install
```

**Development server:**
```pwsh
npm run dev
```
Opens on http://localhost:5000

**Build for production:**
```pwsh
npm run build
```

**Start production server:**
```pwsh
npm start
```

### Environment Variables
Backend requires a `.env` file with:
- `MONGODB_URI` - MongoDB connection string (defaults to `mongodb://localhost/portfolio`)
- `PORT` - Server port (defaults to `5000`)

## Architecture

### Monorepo Structure
```
Makben/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # Next.js 15 App Router
│       ├── components/
│       │   ├── layout/    # Navbar, Footer, Layout wrapper
│       │   ├── sections/  # Page sections (Hero, About, Experience, etc.)
│       │   └── ui/        # Reusable UI components (ParticleSystem)
│       ├── pages/     # Legacy pages directory
│       └── styles/
├── backend/           # Express.js API
│   └── src/
│       ├── models/    # Mongoose schemas (Project, Skill)
│       └── app.ts     # Main Express application
└── vercel.json        # Vercel deployment config (frontend only)
```

### Frontend Architecture

**App Router (Next.js 15):**
- Uses the new App Router pattern (`src/app/`)
- Main page is in `src/app/page.tsx` which assembles all sections
- All components are client-side rendered (`"use client"` directive)

**Component Organization:**
1. **Layout Components** (`src/components/layout/`):
   - `Navbar.tsx` - Navigation header
   - `Footer.tsx` - Footer
   - `Layout.tsx` - Wraps pages with Framer Motion animations

2. **Section Components** (`src/components/sections/`):
   - Each major page section is a separate component
   - Sections: Hero, About, Experience, Skills, Achievements, CV, Projects, VideoGallery, Contact
   - All sections are imported and rendered in `src/app/page.tsx`

3. **UI Components** (`src/components/ui/`):
   - Reusable animation components
   - `ParticleSystem.tsx` exports ParticleSystem, FloatingShapes, AnimatedGrid

**Design System:**
- **Custom Color Palette:** Defined in `tailwind.config.ts`
  - `primary`: Blue tones (#3b82f6)
  - `electric`: Cyan tones (#06b6d4)
  - `accent`: Purple/magenta tones (#d946ef)
- **Custom Animations:** float, pulse-slow, gradient, glow, shimmer
- **Glass Morphism:** Extensive use of backdrop-blur and transparency
- **Path Alias:** `@/*` maps to `./src/*` (see `tsconfig.json`)

**Animation Patterns:**
- Framer Motion is used throughout for complex animations
- Common patterns:
  - Scroll-based animations with `useScroll` and `useTransform`
  - Staggered animations for list items
  - Particle systems with random positioning and infinite loops
  - Mouse-following effects in Hero section

### Backend Architecture

**Express.js Setup:**
- Entry point: `backend/src/app.ts`
- Middleware stack: express.json, cors, helmet, morgan
- MongoDB connection via Mongoose (connection string from env)

**Data Models:**
- `User`: email, password (hashed), name, role (admin/viewer), lastLogin
- `Profile`: firstName, lastName, title, company, bio, profileImage, contact, social, stats, skills
- `Project`: title, description, technologies[], imageUrl, projectUrl, githubUrl, status, featured
- `Skill`: name, category, proficiency (number), icon, yearsOfExperience
- `Experience`: position, company, location, startDate, endDate, current, description, achievements[], technologies[]
- `Achievement`: title, description, date, category, issuer, imageUrl, documentUrl, featured
- `Video`: title, description, videoUrl, thumbnailUrl, category, duration, tags[], featured, views, isExternal

**Security:**
- Dependencies include: bcryptjs, jsonwebtoken, helmet
- CORS enabled (currently open, should be configured for production)

## Key Implementation Details

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Next.js plugin enabled

### ESLint Configuration
- Extends: `next/core-web-vitals`, `next/typescript`
- Custom rules:
  - `react/no-unescaped-entities`: off
  - `react-hooks/exhaustive-deps`: warn

### Deployment
- **Frontend:** Configured for Vercel via `vercel.json`
  - Build command: `cd frontend && npm run build`
  - Output directory: `frontend/.next`
- **Backend:** Not currently configured for deployment (no start script in package.json)

## Development Notes

### When Working with Frontend:
1. All new sections should use `"use client"` directive at the top
2. Follow the established pattern in `src/components/sections/` for new sections
3. Use Framer Motion for animations to maintain consistency
4. Leverage the custom Tailwind theme colors (primary, electric, accent)
5. Particle and animation components are in `src/components/ui/` directory
6. New animated backgrounds available in `AnimatedBackground.tsx` (multiple variants)
7. Enhanced global CSS with utilities: `.glass`, `.btn-primary`, `.card-3d`, etc.

### When Working with Backend:
1. **Backend is now FULLY IMPLEMENTED** with complete CRUD operations
2. Run with: `cd backend && npm run dev`
3. MongoDB must be running: `net start MongoDB` (Windows)
4. TypeScript is configured - use `.ts` files
5. All routes follow pattern: `/api/{resource}`
6. Authentication uses JWT with bearer tokens
7. Admin routes require `role: 'admin'`
8. File uploads handled by multer in `/uploads` directory

### Backend API Endpoints:
- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/change-password`
- **Profile:** `/api/profile` (GET public, PUT/POST admin), `/api/profile/upload-image`
- **Projects:** `/api/projects` (full CRUD), `/api/projects/upload-image`
- **Skills:** `/api/skills` (full CRUD + bulk create)
- **Experiences:** `/api/experiences` (full CRUD)
- **Achievements:** `/api/achievements` (full CRUD), `/api/achievements/upload-image`, `/api/achievements/upload-document`
- **Videos:** `/api/videos` (full CRUD), `/api/videos/upload-video`, `/api/videos/upload-thumbnail`
- **Health:** `/api/health`

### When Adding New Features:
- Install dependencies in the appropriate directory (`frontend/` or `backend/`)
- Frontend images go in `frontend/public/images/`
- Backend uploads go to `backend/uploads/` (auto-organized by type)
- Backend requires MongoDB connection to run
- Use environment variables from `.env` files

### Database Information:
- **Database:** MongoDB (localhost or Atlas)
- **Connection:** `mongodb://localhost:27017/makben-portfolio`
- **GUI Tool:** MongoDB Compass (installed)
- **Models:** User, Profile, Project, Skill, Experience, Achievement, Video

### Security Notes:
- Passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire in 7 days
- Image uploads limited to 10MB
- Video uploads limited to 100MB
- Accepted image types: jpg, jpeg, png, gif, webp
- Accepted video types: mp4, avi, mov, wmv, flv, webm, mkv
- Accepted document types: pdf, doc, docx
- CORS configured for `http://localhost:3000`

## Frontend-Backend Integration

### Data Fetching
- **Library:** SWR (stale-while-revalidate)
- **Location:** `src/hooks/useData.ts`
- **Available Hooks:**
  - `useProfile()` - Fetch profile data
  - `useProjects(params)` - Fetch projects (with filters)
  - `useProject(id)` - Fetch single project
  - `useSkills(params)` - Fetch skills
  - `useExperiences()` - Fetch work experience
  - `useAchievements(params)` - Fetch achievements
  - `useVideos(params)` - Fetch videos
  - `useVideo(id)` - Fetch single video

### API Client
- **Location:** `src/lib/api.ts`
- **Modules:** profileAPI, projectsAPI, skillsAPI, experiencesAPI, achievementsAPI, videosAPI
- **Auth:** Automatically includes JWT token from localStorage

### Environment Variables (Frontend)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Admin Dashboard

### Admin Routes
- **Login:** `/admin/login`
- **Dashboard:** `/admin/dashboard`
- **Profile:** `/admin/dashboard/profile`
- **Experience:** `/admin/dashboard/experience`
- **Projects:** `/admin/dashboard/projects`
- **Skills:** `/admin/dashboard/skills`
- **Achievements:** `/admin/dashboard/achievements`
- **Videos:** `/admin/dashboard/videos` (TODO)

### Admin Features
- Protected routes with JWT authentication
- CRUD interfaces for all content types
- Image/video upload with preview
- Real-time form validation
- Success/error messaging
- SWR cache invalidation on updates

### Creating Admin User
```bash
# POST http://localhost:5000/api/auth/register
{
  "email": "admin@makben.com",
  "password": "YourSecurePassword123!",
  "name": "Makanjuola Ebenezer",
  "role": "admin"
}
```

## Recent Updates (2025)

### Video Gallery Feature
- Complete video management system
- Support for uploaded videos (up to 100MB)
- Support for external YouTube/Vimeo links
- Category filtering (Project Demo, Tutorial, Presentation, etc.)
- Thumbnail support with auto-fetch from YouTube
- View tracking and statistics
- Featured video highlighting
- Modal video player with details
- Responsive grid layout

### Frontend Enhancements
- All sections now fetch data dynamically from API
- Loading skeletons for better UX
- Error handling and fallback UI
- Hydration error fixes for particle systems
- Client-only rendering for random animations

### TypeScript Improvements
- Proper type definitions for all models
- Interface exports from models
- Fixed return type annotations
- Reduced strict checking for faster development

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB is running: `Get-Service MongoDB`
- Check port 5000 is available
- Check `.env` file exists with correct variables
- Run `npm install` in backend directory

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check CORS settings in `backend/src/app.ts`
- Clear browser cache and restart dev server

**Hydration errors:**
- Check that components using `Math.random()` have client-only rendering
- Ensure `useEffect` is used for client-side only operations
- Verify `"use client"` directive is at top of component files

**TypeScript errors:**
- Run `npm run build` to check for errors
- Check `tsconfig.json` for strict settings
- Verify all imports have correct paths
- Use `@/` alias for src imports
