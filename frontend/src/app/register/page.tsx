'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/lib/hooks/useToast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { user, register, clearError, error } = useAuth();
  const router = useRouter();
  const { authError } = useToast();
  
  // Redirect if already authenticated - use useCallback to prevent recreation on every render
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // Clear errors on mount only
  useEffect(() => {
    clearError();
  }, [clearError]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
    
    // Clear password error when user types
    if (id === 'password' || id === 'confirmPassword') {
      setPasswordError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      authError('Passwords do not match');
      return;
    }
    
    // Don't proceed if already submitting
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare user data for registration
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'VISITOR', // Default role
      };
      
      console.log('Submitting registration with data:', userData);
      
      // Directly call the register function from context
      await register(userData);
      
      // If we get here without errors, registration was successful
      console.log('Registration successful');
      
    } catch (error) {
      console.error('Registration failed in component:', error);
      // Error toast is already shown by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 items-center">
        {/* Left Side - Image and Text */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 space-y-6">
          <div className="relative w-full h-64">
            <Image 
              src="/register-hero.svg" 
              alt="Create your portfolio" 
              fill
              className="object-contain"
              priority
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Create your professional portfolio</h1>
            <p className="text-gray-600 max-w-md">
              Join creators from around the world showcasing their work with beautiful, modular case studies.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Designers</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Developers</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600">Writers</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Registration Form */}
        <Card className="w-full max-w-md shadow-xl border-0 mx-auto bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2 pb-6 border-b">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Join ProjectShelf</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Start creating your professional portfolio today
              </CardDescription>
              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 mt-2 rounded-md font-medium border border-red-200">
                  {error}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
                  <Input 
                    id="username" 
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="h-10 pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">This will be the URL of your portfolio: projectshelf.com/@username</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {passwordError && (
                  <p className="text-sm text-red-600 font-medium mt-1">{passwordError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pt-2 pb-6 border-t">
              <Button 
                className="w-full py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create account'}
              </Button>
              <div className="mt-6 text-center text-sm border-t pt-4">
                <span className="text-gray-600">Already have an account?</span>{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 