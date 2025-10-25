import axios from 'axios';
import type { Profile, Project, Skill, Experience, Achievement, AuthResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string; role?: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    const response = await api.get<{ profile: Profile }>('/profile');
    return response.data.profile;
  },

  update: async (data: FormData) => {
    const response = await api.put('/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params?: { category?: string; status?: string; featured?: boolean }) => {
    const response = await api.get<{ projects: Project[] }>('/projects', { params });
    return response.data.projects;
  },

  getOne: async (id: string) => {
    const response = await api.get<{ project: Project }>(`/projects/${id}`);
    return response.data.project;
  },

  create: async (data: FormData) => {
    const response = await api.post('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/projects/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Skills API
export const skillsAPI = {
  getAll: async (params?: { category?: string }) => {
    const response = await api.get<{ skills: Skill[] }>('/skills', { params });
    return response.data.skills;
  },

  getOne: async (id: string) => {
    const response = await api.get<{ skill: Skill }>(`/skills/${id}`);
    return response.data.skill;
  },

  create: async (data: Partial<Skill>) => {
    const response = await api.post('/skills', data);
    return response.data;
  },

  bulkCreate: async (skills: Partial<Skill>[]) => {
    const response = await api.post('/skills/bulk', { skills });
    return response.data;
  },

  update: async (id: string, data: Partial<Skill>) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};

// Experiences API
export const experiencesAPI = {
  getAll: async () => {
    const response = await api.get<{ experiences: Experience[] }>('/experiences');
    return response.data.experiences;
  },

  getOne: async (id: string) => {
    const response = await api.get<{ experience: Experience }>(`/experiences/${id}`);
    return response.data.experience;
  },

  create: async (data: FormData) => {
    const response = await api.post('/experiences', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/experiences/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/experiences/${id}`);
    return response.data;
  },
};

// Achievements API
export const achievementsAPI = {
  getAll: async (params?: { category?: string; featured?: boolean }) => {
    const response = await api.get<{ achievements: Achievement[] }>('/achievements', { params });
    return response.data.achievements;
  },

  getOne: async (id: string) => {
    const response = await api.get<{ achievement: Achievement }>(`/achievements/${id}`);
    return response.data.achievement;
  },

  create: async (data: FormData) => {
    const response = await api.post('/achievements', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/achievements/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/achievements/${id}`);
    return response.data;
  },
};

export default api;
