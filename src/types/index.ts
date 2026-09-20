export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
  createdAt: string;
  lastLogin?: string;
}

export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  company?: string;
  bio: string;
  tagline?: string;
  profileImage?: string;
  resumeUrl?: string;
  email: string;
  phone?: string;
  birthday?: string;
  interests?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  stats?: {
    yearsOfExperience?: number;
    projectsCompleted?: number;
    certificationsEarned?: number;
    clientsSatisfied?: number;
  };
  skills?: {
    technical?: string[];
    soft?: string[];
  };
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  }>;
  availability?: 'available' | 'unavailable' | 'open-to-opportunities';
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  imageUrl?: string;
  images?: string[];
  projectUrl?: string;
  githubUrl?: string;
  category: 'electrical' | 'software' | 'infrastructure' | 'other';
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  startDate?: string;
  endDate?: string;
  client?: string;
  role?: string;
  challenges?: string[];
  outcomes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  companyLogo?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: 'award' | 'certification' | 'publication' | 'recognition' | 'milestone' | 'other';
  issuer?: string;
  imageUrl?: string;
  documentUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: 'Project Demo' | 'Tutorial' | 'Presentation' | 'Interview' | 'Event' | 'Other';
  duration?: string;
  tags: string[];
  featured: boolean;
  views: number;
  publishedDate: string;
  externalUrl?: string;
  isExternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}
