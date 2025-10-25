# Frontend-Backend Integration Guide

## ✅ What's Done

1. **API Client Setup** ✅
   - Created `src/lib/api.ts` with all API functions
   - Configured axios with auth interceptors
   - All CRUD operations ready

2. **TypeScript Types** ✅
   - Created `src/types/index.ts` with all interfaces
   - Profile, Project, Skill, Experience, Achievement types

3. **Custom Hooks** ✅
   - Created `src/hooks/useData.ts` with SWR hooks
   - `useProfile()`, `useProjects()`, `useSkills()`, etc.

4. **Loading Skeletons** ✅
   - Created `src/components/ui/LoadingSkeleton.tsx`
   - Ready-to-use skeleton components

5. **Environment Config** ✅
   - Created `.env.local` with API URL

6. **Dependencies Installed** ✅
   - axios
   - swr

## 🔄 How to Connect Each Section

### Example: Skills Section

**Current:** Hardcoded data
**Goal:** Fetch from API

#### Step 1: Import hooks and types
```tsx
import { useSkills } from '@/hooks/useData'
import { SkillCardSkeleton } from '@/components/ui/LoadingSkeleton'
```

#### Step 2: Use the hook
```tsx
export function Skills() {
  const { skills, isLoading, isError } = useSkills()
  
  // Group skills by category
  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)
  
  // ... rest of component
}
```

#### Step 3: Add loading state
```tsx
{isLoading && (
  <div className="grid lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <SkillCardSkeleton key={i} />
    ))}
  </div>
)}
```

#### Step 4: Add error state
```tsx
{isError && (
  <div className="text-center text-red-400">
    <p>Failed to load skills. Please try again.</p>
  </div>
)}
```

#### Step 5: Render dynamic data
```tsx
{!isLoading && !isError && (
  <div className="grid lg:grid-cols-3 gap-8">
    {Object.entries(skillCategories).map(([category, categorySkills]) => (
      <SkillCard 
        key={category}
        category={category}
        skills={categorySkills}
      />
    ))}
  </div>
)}
```

### Complete Example: Dynamic Skills Component

```tsx
"use client"
import { useSkills } from '@/hooks/useData'
import { SkillCardSkeleton } from '@/components/ui/LoadingSkeleton'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function Skills() {
  const { skills, isLoading, isError } = useSkills()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Group by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  return (
    <section id="skills" className="section-padding relative">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} /* header animation */>
          <h2 className="section-title">Skills & Expertise</h2>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkillCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">Failed to load skills</p>
          </div>
        )}

        {/* Data */}
        {!isLoading && !isError && (
          <div className="grid lg:grid-cols-3 gap-8">
            {Object.entries(categories).map(([category, categorySkills], idx) => (
              <motion.div
                key={category}
                className="card-glass"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-6">{category}</h3>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill._id}>
                      <div className="flex justify-between mb-2">
                        <span>{skill.name}</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full">
                        <motion.div
                          className="h-full bg-primary-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.proficiency}%` } : {}}
                          transition={{ duration: 1.5, delay: idx * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

## 🎯 Integration Checklist

### For Each Section:

- [ ] **Hero** - Use `useProfile()` for personal info
  ```tsx
  const { profile, isLoading } = useProfile()
  // Use profile.firstName, profile.lastName, profile.title, etc.
  ```

- [ ] **About** - Use `useProfile()` for bio, stats
  ```tsx
  const { profile } = useProfile()
  // Use profile.bio, profile.stats, profile.location
  ```

- [ ] **Experience** - Use `useExperiences()`
  ```tsx
  const { experiences, isLoading } = useExperiences()
  // Map over experiences array
  ```

- [ ] **Skills** - Use `useSkills()`
  ```tsx
  const { skills, isLoading } = useSkills()
  // Group by category if needed
  ```

- [ ] **Achievements** - Use `useAchievements()`
  ```tsx
  const { achievements, isLoading } = useAchievements({ featured: true })
  ```

- [ ] **Projects** - Use `useProjects()`
  ```tsx
  const { projects, isLoading } = useProjects({ featured: true })
  ```

- [ ] **Contact** - Use `useProfile()` for contact info
  ```tsx
  const { profile } = useProfile()
  // Use profile.email, profile.phone, profile.social
  ```

## 🔧 Quick Testing

### 1. Start Backend
```pwsh
cd backend
npm run dev
```

### 2. Populate with Test Data

Use Postman/Insomnia to POST test data:

**Create Skills:**
```
POST http://localhost:5000/api/skills/bulk
Headers: Authorization: Bearer YOUR_ADMIN_TOKEN
Body:
{
  "skills": [
    {
      "name": "Electrical System Design",
      "category": "Technical Expertise",
      "proficiency": 95
    },
    {
      "name": "AutoCAD Electrical",
      "category": "Software & Tools",
      "proficiency": 85
    }
  ]
}
```

**Create Profile:**
```
PUT http://localhost:5000/api/profile
Headers: Authorization: Bearer YOUR_ADMIN_TOKEN
Body:
{
  "firstName": "Makanjuola",
  "lastName": "Benjamin",
  "title": "Electrical Engineer",
  "company": "NAMA",
  "bio": "Experienced electrical engineer...",
  "email": "contact@makben.com",
  "stats": {
    "yearsOfExperience": 10,
    "projectsCompleted": 50,
    "certificationsEarned": 8,
    "clientsSatisfied": 100
  }
}
```

### 3. Update Section Component

Update any section file (e.g., `Skills.tsx`) to use the hooks

### 4. Test Frontend
```pwsh
cd frontend
npm run dev
```

Visit http://localhost:3000 and check the console for:
- API calls
- Data loading
- Any errors

## 🎨 Best Practices

### 1. Always Handle Loading States
```tsx
{isLoading && <SkeletonComponent />}
```

### 2. Always Handle Error States
```tsx
{isError && <ErrorMessage />}
```

### 3. Provide Fallbacks
```tsx
const displayName = profile?.firstName || 'User'
```

### 4. Use Optional Chaining
```tsx
profile?.social?.linkedin
```

### 5. Add Key to Mapped Items
```tsx
{skills.map(skill => <div key={skill._id}>...</div>)}
```

## 🚀 Advanced: Image Handling

When displaying images from backend:

```tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')

// For profile image
<Image 
  src={`${API_URL}${profile.profileImage}`}
  alt={profile.firstName}
  width={200}
  height={200}
/>

// Or use Next.js Image with loader
<Image
  src={profile.profileImage || '/default-avatar.png'}
  alt="Profile"
  width={200}
  height={200}
  loader={({ src }) => `${API_URL}${src}`}
/>
```

## 📝 Next Steps

1. **Test each hook independently** in a simple component
2. **Update one section at a time** (start with Skills - easiest)
3. **Add proper error boundaries** for production
4. **Implement retry logic** for failed requests
5. **Add caching** with SWR configuration
6. **Build admin dashboard** for content management

## 🔒 Important Notes

- Backend must be running for API calls to work
- Need admin token for creating/updating data
- Use MongoDB Compass to verify data in database
- Check browser Network tab to debug API calls
- Check backend console for API request logs

---

**Ready to integrate?** Start with the Skills section as it's the simplest!
