'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, BookOpen, Search } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ProjectShelf
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/explore" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              <BookOpen className="mr-1 h-4 w-4" />
              Explore
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        
        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-100"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Avatar className="h-8 w-8">
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name ? user.name.substring(0, 2) : user?.username?.substring(0, 2) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{user?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-md shadow-lg p-1 z-50">
                  <Link href={`/${user?.username}`}>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsUserMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIsUserMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link href="/explore" className="flex items-center text-sm font-medium p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Explore
            </Link>
            <Link href="/search" className="flex items-center text-sm font-medium p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="flex items-center text-sm font-medium p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link href={`/${user?.username}`} className="flex items-center text-sm font-medium p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Button variant="ghost" className="flex items-center justify-start text-sm font-medium p-2 text-red-500 hover:bg-red-50 rounded-md" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2 border-t">
                <Link href="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 