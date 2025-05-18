'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Project, Analytics } from '@/lib/types';
import { 
  PlusCircle, 
  BarChart3, 
  Layout, 
  User, 
  Eye, 
  Calendar, 
  TrendingUp,
  ExternalLink,
  Edit,
  Clock,
  Loader2
} from 'lucide-react';

// Simple bar chart component
const SimpleBarChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data, 1);
  
  return (
    <div className="flex items-end h-14 gap-1 mt-2">
      {data.map((value, i) => (
        <div 
          key={i} 
          className="bg-primary/80 hover:bg-primary flex-1 rounded-t transition-all"
          style={{ 
            height: `${Math.max((value / max) * 100, 4)}%`,
          }}
          title={`${value} views`}
        />
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentViews, setRecentViews] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
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
        
        // Generate some mock recent view data for the chart
        // In a real application, this would come from the API
        setRecentViews(
          Array(7).fill(0).map(() => Math.floor(Math.random() * 10))
        );
        
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
        setProjects([]);
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

  // Get most viewed project
  const getMostViewedProject = () => {
    if (!projects.length) return null;
    
    return projects.reduce((mostViewed, current) => {
      const currentViews = current.analytics?.reduce((sum: number, a: Analytics) => sum + a.views, 0) || 0;
      const mostViewedViews = mostViewed.analytics?.reduce((sum: number, a: Analytics) => sum + a.views, 0) || 0;
      
      return currentViews > mostViewedViews ? current : mostViewed;
    }, projects[0]);
  };

  // Get most recent project
  const getMostRecentProject = () => {
    if (!projects.length) return null;
    
    return [...projects].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  };

  const mostViewedProject = getMostViewedProject();
  const mostRecentProject = getMostRecentProject();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome, {user?.name || user?.username}</h1>
            <p className="text-muted-foreground">
              Manage your portfolio and track your project analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/dashboard/analytics')}
              variant="outline"
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/projects/new/edit')}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:w-[400px] mb-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Projects
                    </CardDescription>
                    <CardTitle className="text-2xl">{projects.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {projects.length === 0 ? "Create your first project" : "Total portfolio projects"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-[#4CAF50]">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Views
                    </CardDescription>
                    <CardTitle className="text-2xl">{calculateTotalViews()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Total views across all projects
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-[#FF9800]">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last 7 Days
                    </CardDescription>
                    <CardTitle className="text-2xl">{recentViews.reduce((a, b) => a + b, 0)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart data={recentViews} />
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-[#2196F3]">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Portfolio
                    </CardDescription>
                    <CardTitle className="text-lg font-medium truncate">
                      /{user?.username}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Link 
                      href={`/${user?.username}`}
                      className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                      target="_blank"
                    >
                      View public profile
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Highlight Projects Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mostViewedProject && (
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/50">
                      <CardDescription className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Most Viewed Project
                      </CardDescription>
                      <CardTitle className="text-xl line-clamp-1">{mostViewedProject.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {mostViewedProject.mediaItems && mostViewedProject.mediaItems[0] && (
                        <div className="relative h-44">
                          <img 
                            src={mostViewedProject.mediaItems[0].url}
                            alt={mostViewedProject.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/placeholder-project.svg';
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {mostViewedProject.analytics?.reduce((sum: number, a: Analytics) => sum + a.views, 0) || 0}
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {mostViewedProject.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => router.push(`/dashboard/projects/${mostViewedProject.id}/edit`)}
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button 
                            size="sm"
                            className="gap-1"
                            onClick={() => router.push(`/${user?.username}/projects/${mostViewedProject.id}`)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {mostRecentProject && (
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/50">
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Most Recent Project
                      </CardDescription>
                      <CardTitle className="text-xl line-clamp-1">{mostRecentProject.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {mostRecentProject.mediaItems && mostRecentProject.mediaItems[0] && (
                        <div className="relative h-44">
                          <img 
                            src={mostRecentProject.mediaItems[0].url}
                            alt={mostRecentProject.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/placeholder-project.svg';
                            }}
                          />
                          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                            {new Date(mostRecentProject.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {mostRecentProject.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => router.push(`/dashboard/projects/${mostRecentProject.id}/edit`)}
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button 
                            size="sm"
                            className="gap-1"
                            onClick={() => router.push(`/${user?.username}/projects/${mostRecentProject.id}`)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {projects.length === 0 && (
                  <Card className="col-span-1 md:col-span-2">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                      <div className="mb-4 rounded-full bg-muted p-3">
                        <PlusCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                      <p className="text-muted-foreground text-center mb-6">
                        Create your first project to showcase your work and track analytics
                      </p>
                      <Button 
                        onClick={() => router.push('/dashboard/projects/new/edit')}
                        className="gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Create Your First Project
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Projects</h2>
                <Button 
                  onClick={() => router.push('/dashboard/projects/new/edit')}
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Project</span>
                </Button>
              </div>

              {projects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <PlusCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Create your first project to showcase your work and track analytics
                    </p>
                    <Button 
                      onClick={() => router.push('/dashboard/projects/new/edit')}
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Your First Project
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                      {project.mediaItems && project.mediaItems[0] && (
                        <div className="relative h-40">
                          <img 
                            src={project.mediaItems[0].url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/placeholder-project.svg';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {project.analytics?.reduce((sum: number, a: Analytics) => sum + a.views, 0) || 0}
                          </div>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow pb-0">
                                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                            {project.tools && project.tools.length > 0 && (
                              <span className="text-xs bg-muted rounded-full px-2 py-1">
                                {project.tools[0]}
                                {project.tools.length > 1 && ` +${project.tools.length - 1}`}
                              </span>
                            )}
                          </div>
                      </CardContent>
                      <CardFooter className="pt-4 pb-4 flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="default" 
                          className="flex-1" 
                          size="sm"
                          onClick={() => router.push(`/${user?.username}/projects/${project.id}`)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ProtectedRoute>
  );
} 