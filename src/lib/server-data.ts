import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/makben-portfolio';

let connected = false;

export async function connectDB() {
  if (!connected) {
    await mongoose.connect(MONGODB_URI);
    connected = true;
  }
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'viewer'], default: 'viewer' },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    technologies: [String],
    imageUrl: String,
    images: [String],
    projectUrl: String,
    githubUrl: String,
    category: {
      type: String,
      enum: ['electrical', 'software', 'infrastructure', 'other'],
      default: 'other',
    },
    status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' },
    featured: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    client: String,
    role: String,
    challenges: [String],
    outcomes: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProjectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency: { type: Number, required: true },
    icon: String,
  },
  { timestamps: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    responsibilities: [String],
    achievements: [String],
    technologies: [String],
    companyLogo: String,
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ExperienceSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, enum: ['award', 'certification', 'publication', 'recognition', 'milestone', 'other'], default: 'other' },
    issuer: String,
    imageUrl: String,
    documentUrl: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AchievementSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const ProfileSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    title: String,
    company: String,
    bio: String,
    tagline: String,
    profileImage: String,
    resumeUrl: String,
    email: { type: String, required: true },
    phone: String,
    birthday: Date,
    interests: [String],
    location: {
      city: String,
      state: String,
      country: String,
    },
    social: {
      linkedin: String,
      github: String,
      twitter: String,
      facebook: String,
      instagram: String,
      website: String,
    },
    stats: {
      yearsOfExperience: Number,
      projectsCompleted: Number,
      certificationsEarned: Number,
      clientsSatisfied: Number,
    },
    skills: {
      technical: [String],
      soft: [String],
    },
    languages: [{ name: String, proficiency: String }],
    education: [{ institution: String, degree: String, field: String, startDate: String, endDate: String, current: Boolean }],
    availability: { type: String, enum: ['available', 'unavailable', 'open-to-opportunities'], default: 'available' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: String,
    category: { type: String, enum: ['Project Demo', 'Tutorial', 'Presentation', 'Interview', 'Event', 'Other'], default: 'Other' },
    duration: String,
    tags: [String],
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedDate: { type: Date, default: Date.now },
    externalUrl: String,
    isExternal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, default: 'General' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
export const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);
export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

export function getTokenSecret() {
  return process.env.JWT_SECRET || 'your-super-secret-jwt-key-please-change-this-in-production-123456789';
}

export function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, getTokenSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getTokenSecret()) as { id: string; email: string; role: string };
}

export function getUserFromAuthorization(authHeader?: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function parseRequestBody(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const body: Record<string, any> = {};
    const files: Record<string, File[]> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const fileKey = key;
        if (!files[fileKey]) files[fileKey] = [];
        files[fileKey].push(value);
      } else {
        body[key] = value;
      }
    }

    for (const [key, values] of Object.entries(files)) {
      const saved: string[] = [];
      for (const file of values) {
        const folder = key === 'profileImage' ? 'profiles' : key === 'resume' ? 'documents' : key === 'companyLogo' ? 'logos' : key === 'imageUrl' || key === 'achievement' ? 'achievements' : key === 'document' ? 'documents' : key === 'video' ? 'videos' : key === 'thumbnail' ? 'thumbnails' : key.includes('image') || key.includes('Image') ? 'projects' : 'uploads';
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
        fs.mkdirSync(uploadDir, { recursive: true });
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        const arrayBuffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
        saved.push(`/uploads/${folder}/${fileName}`);
      }
      body[key] = saved.length === 1 ? saved[0] : saved;
    }

    return { body, files };
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    try {
      const text = await request.text();
      if (!text) return { body: {}, files: {} };
      return { body: JSON.parse(text), files: {} };
    } catch {
      return { body: {}, files: {} };
    }
  }

  return { body: {}, files: {} };
}

export function objectFromRecord(record: Record<string, any>) {
  return Object.keys(record).reduce((acc, key) => {
    const value = record[key];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        acc[key] = parsed;
      } catch {
        acc[key] = value;
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

export function parseQuery(searchParams: URLSearchParams) {
  const result: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  return result;
}

export function ensureAuthorized(request: Request) {
  const authHeader = request.headers.get('authorization');
  const user = getUserFromAuthorization(authHeader);
  if (!user) {
    return { ok: false, error: 'Unauthorized', status: 401 as const };
  }
  return { ok: true, user };
}

export function ensureAdmin(request: Request) {
  const auth = ensureAuthorized(request);
  if (!auth.ok) return auth;
  if (auth.user.role !== 'admin' && auth.user.role !== 'superadmin') {
    return { ok: false, error: 'Admin access required', status: 403 as const };
  }
  return { ok: true, user: auth.user };
}

export async function ensureUserExists() {
  await connectDB();
  const count = await User.countDocuments();
  return count;
}
