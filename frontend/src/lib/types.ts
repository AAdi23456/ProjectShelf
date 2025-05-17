// Role enum
export type Role = 'CREATOR' | 'VISITOR';

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Analytics types
export interface Analytics {
  id: string;
  views: number;
  engagement: number;
  clickThroughs: number;
  date: string;
  projectId?: string;
  userId?: string;
}

// Media types
export interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption?: string;
  order: number;
  projectId: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  overview: string;
  timeline?: Record<string, any>;
  tools: string[];
  outcomes: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  mediaItems?: Media[];
  analytics?: Analytics[];
  user?: Partial<User>;
} 