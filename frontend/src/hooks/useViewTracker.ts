'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook to track page views for public routes
 */
export function useViewTracker() {
  const { user } = useAuth();

  /**
   * Track a project view
   * @param projectId - The ID of the project being viewed
   * @param ownerId - The user ID of the project owner
   */
  const trackProjectView = async (projectId: string, ownerId: string) => {
    // Don't track if the viewer is the owner
    if (user?.id === ownerId) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/project-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          ownerId,
          // Include viewer info if available
          viewerId: user?.id || null
        }),
      });

      if (!response.ok) {
        console.error('Failed to track project view:', await response.text());
      }
    } catch (error) {
      console.error('Error tracking project view:', error);
    }
  };

  /**
   * Track a portfolio visit
   * @param portfolioUserId - The user ID of the portfolio owner
   */
  const trackPortfolioVisit = async (portfolioUserId: string) => {
    // Don't track if the viewer is the owner
    if (user?.id === portfolioUserId) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/portfolio-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: portfolioUserId,
          // Include viewer info if available
          viewerId: user?.id || null
        }),
      });

      if (!response.ok) {
        console.error('Failed to track portfolio visit:', await response.text());
      }
    } catch (error) {
      console.error('Error tracking portfolio visit:', error);
    }
  };

  return {
    trackProjectView,
    trackPortfolioVisit,
  };
} 