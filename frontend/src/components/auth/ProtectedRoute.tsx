'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/lib/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    // If role is required and user doesn't have it, redirect to dashboard or home
    if (
      requiredRole &&
      isAuthenticated &&
      user &&
      user.role !== requiredRole
    ) {
      router.push(user.role === 'CREATOR' ? '/dashboard' : '/');
    }
  }, [loading, isAuthenticated, user, requiredRole, router]);

  // Show nothing while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or doesn't have required role, don't render children
  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // If authenticated and has required role (or no role required), render children
  return <>{children}</>;
} 