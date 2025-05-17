'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Edit, Eye, Trash2, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';
import MediaRenderer from '@/components/MediaRenderer';

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string;
  coverImage?: string;
  mediaItems: Array<{
    id: string;
    url: string;
    type: string;
    caption?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/user/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // Handle authentication/user errors
          if (response.status === 401 || response.status === 403 || response.status === 404) {
            const errorData = await response.json();
            if (errorData.message && errorData.message.includes('User not found')) {
              // Force user to login again
              localStorage.removeItem('token');
              toast.error('Your session has expired. Please log in again.');
              router.push('/login');
              return;
            }
          }
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Could not load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProjects();
    }
  }, [user, router]);
  
  const deleteProject = async (id: string) => {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      // Remove from list
      setProjects(projects.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
    }
  };
  
  const getProjectCoverImage = (project: Project) => {
    if (project.coverImage) {
      return project.coverImage;
    }
    
    if (project.mediaItems && project.mediaItems.length > 0) {
      const firstImage = project.mediaItems.find(item => item.type === 'IMAGE');
      if (firstImage) {
        return firstImage.url;
      }
    }
    
    return '/placeholder-project.svg';
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading projects...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-destructive">Error</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">My Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your portfolio projects</p>
        </div>
        
        <Button 
          onClick={() => router.push('/dashboard/projects/new/edit')}
          size="lg"
          className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Project
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-lg bg-muted/30 transition-all duration-300">
          <div className="max-w-md mx-auto">
            <div className="mb-4 text-center">
              <div className="relative mx-auto w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-12 w-12 text-muted-foreground/50" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-3">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to showcase your work. Add images, videos, and details about your design and development process.</p>
            <Button 
              onClick={() => router.push('/dashboard/projects/new/edit')}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden h-full border group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-gradient-to-b from-white to-gray-50/50">
              <div className="relative h-56 bg-muted overflow-hidden">
                <ImageWithFallback 
                  project={project}
                  coverImage={getProjectCoverImage(project)}
                />
                <div className="absolute top-0 right-0 left-0 p-4 flex justify-between items-start">
                  {project.isPublished && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      Published
                    </div>
                  )}
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/80 hover:bg-background shadow-sm"
                      onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              </div>
              
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{project.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    {user?.username && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/${user.username}/projects/${project.id}`)}
                        className="rounded-full hover:text-primary hover:border-primary transition-colors duration-300"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="rounded-full text-destructive hover:text-white hover:bg-destructive transition-colors duration-300"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component for image with fallback
function ImageWithFallback({ project, coverImage }: { project: Project, coverImage: string }) {
  const firstMedia = project.mediaItems && project.mediaItems.length > 0 
    ? project.mediaItems[0] 
    : null;
    
  if (firstMedia) {
    return (
      <div className="w-full h-full">
        <MediaRenderer 
          media={{
            id: firstMedia.id,
            url: firstMedia.url,
            type: firstMedia.type as 'IMAGE' | 'VIDEO',
            caption: firstMedia.caption
          }}
          aspectRatio="square"
          showCaption={false}
        />
      </div>
    );
  }
    
  const [imgSrc, setImgSrc] = useState(coverImage);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when image source changes
    setImgSrc(coverImage);
    setHasError(false);
  }, [coverImage]);

  return (
    <>
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
          <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Image unavailable</span>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <img 
            src={imgSrc} 
            alt={project.title}
            className="w-full h-full object-cover absolute inset-0"
            onError={() => {
              console.log(`Image failed to load: ${imgSrc}`);
              if (imgSrc !== '/placeholder-project.svg') {
                setImgSrc('/placeholder-project.svg');
              } else {
                setHasError(true);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}
    </>
  );
} 