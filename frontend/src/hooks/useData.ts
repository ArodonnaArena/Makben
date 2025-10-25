import useSWR from 'swr';
import { profileAPI, projectsAPI, skillsAPI, experiencesAPI, achievementsAPI } from '@/lib/api';
import type { Profile, Project, Skill, Experience, Achievement } from '@/types';

// Profile hook
export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile>(
    '/profile',
    profileAPI.get,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    profile: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Projects hooks
export function useProjects(params?: { category?: string; status?: string; featured?: boolean }) {
  const key = params ? ['/projects', params] : '/projects';
  
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    key,
    () => projectsAPI.getAll(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    projects: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProject(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Project>(
    id ? `/projects/${id}` : null,
    () => (id ? projectsAPI.getOne(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    project: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Skills hooks
export function useSkills(params?: { category?: string }) {
  const key = params ? ['/skills', params] : '/skills';
  
  const { data, error, isLoading, mutate } = useSWR<Skill[]>(
    key,
    () => skillsAPI.getAll(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    skills: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Experiences hook
export function useExperiences() {
  const { data, error, isLoading, mutate } = useSWR<Experience[]>(
    '/experiences',
    experiencesAPI.getAll,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    experiences: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Achievements hooks
export function useAchievements(params?: { category?: string; featured?: boolean }) {
  const key = params ? ['/achievements', params] : '/achievements';
  
  const { data, error, isLoading, mutate } = useSWR<Achievement[]>(
    key,
    () => achievementsAPI.getAll(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    achievements: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
