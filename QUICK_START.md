# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- ✅ Git (installed)
- ✅ Node.js 18+ (installed)
- ✅ MongoDB Server 8.2.1 (installed, needs restart)
- ✅ MongoDB Compass 1.47.1 (installed)

### Step 1: Restart Computer
MongoDB needs a system restart to be available in PATH.

### Step 2: Start MongoDB
```pwsh
net start MongoDB
```

Or check if it's running:
```pwsh
Get-Service MongoDB
```

### Step 3: Start Backend
```pwsh
cd backend
npm run dev
```

**Expected Output:**
```
✅ Connected to MongoDB
📦 Database: mongodb://localhost:27017/makben-portfolio
🚀 Server running on port 5000
🌍 Environment: development
📡 API available at http://localhost:5000/api
```

### Step 4: Test API
Open browser or Postman:
- Health Check: http://localhost:5000/api/health
- Should return: `{"status":"ok","message":"Server is running"}`

### Step 5: Create Admin User
**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "email": "admin@makben.com",
  "password": "SecurePassword123!",
  "name": "Makanjuola Benjamin",
  "role": "admin"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@makben.com",
    "name": "Makanjuola Benjamin",
    "role": "admin"
  }
}
```

**Save the token!** You'll need it for admin operations.

### Step 6: Start Frontend
In a new terminal:
```pwsh
cd frontend
npm run dev
```

Open: http://localhost:3000

## 🎯 Common Commands

### Backend
```pwsh
cd backend

# Development mode
npm run dev

# Build for production
npm run build

# Start production
npm start
```

### Frontend
```pwsh
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Start production
npm start

# Lint code
npm run lint
```

### MongoDB
```pwsh
# Start service
net start MongoDB

# Stop service
net stop MongoDB

# Check status
Get-Service MongoDB

# Open MongoDB Compass GUI
# Search "MongoDB Compass" in Start Menu
```

## 🔐 Authentication

All protected routes need this header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## 📁 File Structure Quick Reference

```
backend/src/
  ├── controllers/    # API logic
  ├── models/         # Database schemas
  ├── routes/         # API routes
  ├── middleware/     # Auth & Upload
  └── app.ts          # Main file

frontend/src/
  ├── app/           # Pages (Next.js App Router)
  ├── components/
  │   ├── layout/    # Navbar, Footer
  │   ├── sections/  # Hero, About, etc.
  │   └── ui/        # Reusable components
  └── styles/        # Global CSS
```

## 🐛 Troubleshooting

### MongoDB won't start
```pwsh
# Check if port 27017 is in use
netstat -ano | findstr :27017

# If MongoDB service doesn't exist, reinstall MongoDB
# Or use MongoDB Atlas (cloud) instead
```

### Backend won't start
```pwsh
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Change port in backend/.env
PORT=5001
```

### Frontend won't connect to backend
- Check `backend/.env` has `FRONTEND_URL=http://localhost:3000`
- Check backend is running on port 5000
- Check CORS settings in `backend/src/app.ts`

### Dependencies issues
```pwsh
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json  
npm install
```

## 📚 Documentation

- **Full Project Status:** `PROJECT_STATUS.md`
- **Backend API Docs:** `backend/README.md`
- **WARP Instructions:** `WARP.md`

## 🎨 Testing the Enhanced UI

The frontend now has amazing animations! Check out:
- Custom scrollbar
- Gradient text effects
- Glass morphism cards
- Particle systems
- Smooth transitions

All in the existing frontend at http://localhost:3000

## 🔄 What's Next?

1. ✅ Backend API is complete
2. ✅ Frontend is enhanced with animations
3. ⏳ Connect frontend to backend (Phase 5)
4. ⏳ Build admin dashboard (Phase 4)
5. ⏳ Deploy to production (Phase 8)

See `PROJECT_STATUS.md` for detailed progress and next steps!

## 💡 Pro Tips

- Use MongoDB Compass to view/edit database visually
- Use Postman or Insomnia to test API endpoints
- Keep the token from registration - you'll need it for admin operations
- Backend automatically creates `uploads/` folder for file storage
- Check browser console for frontend errors
- Check terminal for backend errors

## 🆘 Need Help?

1. Check `PROJECT_STATUS.md` for current state
2. Check `backend/README.md` for API documentation
3. Check `WARP.md` for development guidelines
4. Verify MongoDB is running
5. Verify both frontend and backend are running
6. Check for errors in terminal output

---

**Happy Coding! 🚀**
