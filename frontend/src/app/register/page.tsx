'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, AtSign } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { user, register, clearError, error } = useAuth();
  const router = useRouter();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if already submitting
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await register({
        email,
        password,
        username,
        name
      });
      // Redirect will happen automatically due to the useEffect above
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-6xl grid md:grid-cols-2 gap-6 items-center transition-opacity duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Left Side - Image and Text */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 space-y-8">
          <div className="relative w-full h-64">
            <Image 
              src="/register-hero.svg" 
              alt="Join ProjectShelf" 
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
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Start as a Creator</h1>
            <p className="text-gray-600 max-w-md text-lg">
              Create your account to build amazing case studies and portfolios to showcase your best work.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition duration-300 transform hover:scale-105">
                <svg className="h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-center text-sm font-medium text-gray-600">Create Projects</p>
              </div>
              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition duration-300 transform hover:scale-105">
                <svg className="h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="mt-2 text-center text-sm font-medium text-gray-600">Share Globally</p>
              </div>
              <div className="p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition duration-300 transform hover:scale-105">
                <svg className="h-8 w-8 text-purple-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <p className="mt-2 text-center text-sm font-medium text-gray-600">Track Analytics</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Register Form */}
        <Card className="w-full max-w-md shadow-2xl border-0 mx-auto bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-blue-100">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2 pb-6">
              <div className="mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Create Account</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Join as a creator and start building your portfolio
              </CardDescription>
              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 mt-2 rounded-md font-medium border border-red-200 animate-pulse">
                  {error}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 pl-3 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-gray-500" />
                  Username
                </Label>
                <div className="relative">
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="johndoe" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 pl-3 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-3 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10 border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pt-2 pb-6 border-t">
              <div className="text-center text-sm pt-4">
                <span className="text-gray-600">Already have an account?</span>{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 hover:underline">
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