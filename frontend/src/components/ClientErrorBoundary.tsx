'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import ErrorBoundary with no SSR to avoid hydration issues
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), {
  ssr: false
});

export function ClientErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
} 