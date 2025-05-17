"use client";

import { Toaster as SonnerToaster } from "sonner";

// Simplified approach without custom styling that would cause type errors
export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      closeButton
      richColors
      duration={3000}
      className="z-50"
    />
  );
} 