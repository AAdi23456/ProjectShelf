'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useToast } from '@/lib/hooks/useToast';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'CREATOR' | 'VISITOR';
  bio?: string;
  avatarUrl?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  upgradeToCreator: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  name: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Helper function to save token in both localStorage and cookies
const saveToken = (token: string) => {
  localStorage.setItem('token', token);
  Cookies.set('auth_token', token, { expires: 7 }); // 7 days expiry
  console.log('Token saved to both localStorage and cookies');
};

// Helper function to remove token from both storage mechanisms
const removeToken = () => {
  localStorage.removeItem('token');
  Cookies.remove('auth_token');
  console.log('Token removed from both localStorage and cookies');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authError, authSuccess, showToast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUserAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Session expired');
        }
        
        const data = await response.json();
        console.log('User authenticated:', data.user);
        setUser(data.user);
      } catch (err) {
        console.error('Auth check error:', err);
        removeToken();
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Invalid email or password';
        
        authError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      saveToken(data.token);
      setUser(data.user);
      authSuccess('Successfully logged in!');
      console.log('Login successful, user:', data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Registration failed';
        
        authError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      saveToken(data.token);
      setUser(data.user);
      authSuccess('Account created successfully!');
      console.log('Registration successful, user:', data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const upgradeToCreator = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/upgrade-to-creator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Upgrade failed';
        authError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      saveToken(data.token);
      setUser(data.user);
      authSuccess('Account upgraded to Creator successfully!');
      console.log('Upgrade successful, user:', data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upgrade';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    authSuccess('Successfully logged out');
    console.log('User logged out');
    // Redirect to homepage after logout
    window.location.href = '/';
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
    login,
    register,
    logout,
      error, 
    clearError,
    upgradeToCreator
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 