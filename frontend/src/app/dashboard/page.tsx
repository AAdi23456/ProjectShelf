'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Project, Analytics } from '@/lib/types';
import { projectAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setIsLoading(false); // Make sure loading is set to false if no user
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Fetching projects for user:', user.id);
        
        // Use direct fetch call like projects page does
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/user/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        console.log('Projects fetched directly:', data);
        
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
        setProjects([]); // Ensure projects is at least an empty array
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Calculate total views across all projects
  const calculateTotalViews = () => {
    return projects.reduce((total, project) => {
      const projectViews = project.analytics?.reduce((sum: number, analytic: Analytics) => sum + analytic.views, 0) || 0;
      return total + projectViews;
    }, 0);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and analytics
          </p>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <CardDescription>All projects in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{projects.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <CardDescription>All time project views</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateTotalViews()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Portfolio</CardTitle>
              <CardDescription>Public profile link</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/${user?.username}`}
                className="text-primary hover:underline"
              >
                /{user?.username}
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Projects list */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <Button onClick={() => {
            console.log('Navigating to create project page: /dashboard/projects/new/edit');
            router.push('/dashboard/projects/new/edit');
          }}>
            Create Project
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card className="bg-muted">
            <CardContent className="p-6 text-center">
              <p className="mb-4">You don't have any projects yet</p>
              <Button>
                <Link href="/dashboard/projects/new/edit">Create Your First Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="bg-muted">
            <CardContent className="p-6 text-center">
              <p className="mb-4">You don't have any projects yet</p>
              <Button>
                <Link href="/dashboard/projects/new/edit">Create Your First Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden h-full flex flex-col">
                {project.mediaItems && project.mediaItems[0] && (
                  <div className="relative h-40">
                    <img 
                      src={project.mediaItems[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.log(`Image failed to load: ${target.src}`);
                        target.onerror = null; // Prevent infinite loop
                        target.src = '/placeholder-project.svg';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span>
                      Views: {project.analytics?.reduce((sum: number, a: Analytics) => sum + a.views, 0) || 0}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <div className="px-6 pb-6 pt-0 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => router.push(`/${user?.username}/projects/${project.id}`)}
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 