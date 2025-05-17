'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Save, Eye, Trash2, Upload, Plus, Check } from 'lucide-react';
import ProjectFormTabs from '@/components/dashboard/ProjectFormTabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MediaGalleryEditor from '@/components/dashboard/MediaGalleryEditor';
import TimelineEditor from '@/components/dashboard/TimelineEditor';
import TechnologiesEditor from '@/components/dashboard/TechnologiesEditor';
import OutcomesEditor from '@/components/dashboard/OutcomesEditor';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface OutcomeItem {
  metric?: string;
  testimonial?: string;
}

interface Project {
  id?: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string;
  slug?: string;
  timeline: TimelineItem[];
  technologies: string[];
  outcomes: OutcomeItem[];
  isPublished?: boolean;
  mediaItems: any[];
}

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project>({
    title: '',
    description: '',
    content: '',
    timeline: [],
    technologies: [],
    outcomes: [],
    mediaItems: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [redirectAfterSave, setRedirectAfterSave] = useState(false);
  
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builder/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      const data = await response.json();
      setProject(data.project);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Could not load project. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);
  
  useEffect(() => {
    if (user) {
      fetchProject();
    }
  }, [user, fetchProject]);
  
  const saveProject = async (showToast = true, shouldRedirect = false) => {
    try {
      setSaving(true);
      setRedirectAfterSave(shouldRedirect);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builder/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving project:', errorData);
        
        // Handle authentication/user errors
        if (response.status === 401 || response.status === 403 || response.status === 404) {
          if (errorData.message.includes('User not found')) {
            // Force user to login again
            localStorage.removeItem('token');
            toast.error('Your session has expired. Please log in again.');
            setTimeout(() => {
              router.push('/login');
            }, 1500);
            return;
          }
        }
        
        throw new Error(errorData.message || 'Failed to save project');
      }
      
      const data = await response.json();
      console.log('Project saved successfully:', data);
      
      if (projectId === 'new' && data.project.id) {
        if (shouldRedirect) {
          // Show success message
          toast.success('Project created successfully! Redirecting to projects page...');
          
          // Redirect to the projects page after a short delay
          setTimeout(() => {
            router.push('/dashboard/projects');
          }, 1500);
        } else {
          // Just update the URL without redirecting
          window.history.replaceState(null, '', `/dashboard/projects/${data.project.id}/edit`);
          // Update local state with the saved data and new ID
          setProject(prev => ({ ...prev, ...data.project }));
          if (showToast) {
            toast.success('Project saved successfully');
          }
        }
      } else {
        // Update local state with the saved data
        setProject(prev => ({ ...prev, ...data.project }));
        
        if (showToast) {
          toast.success('Project saved successfully');
        }
      }
    } catch (err) {
      console.error('Error saving project:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };
  
  const publishProject = async () => {
    try {
      if (!project.id) {
        await saveProject();
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builder/${project.id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish project');
      }
      
      const data = await response.json();
      setProject(prev => ({ ...prev, ...data.project }));
      toast.success('Project published successfully');
    } catch (err) {
      console.error('Error publishing project:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to publish project');
    }
  };
  
  const unpublishProject = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builder/${project.id}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to unpublish project');
      }
      
      const data = await response.json();
      setProject(prev => ({ ...prev, ...data.project }));
      toast.success('Project unpublished successfully');
    } catch (err) {
      console.error('Error unpublishing project:', err);
      toast.error('Failed to unpublish project');
    }
  };
  
  const handleInputChange = (field: keyof Project, value: any) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading project...</p>
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
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">{projectId === 'new' ? 'Create New Project' : 'Edit Project'}</h1>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => router.push('/dashboard/projects')}
          >
            Cancel
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => saveProject(true, false)}
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>
          
          <Button 
            size="sm"
            variant="default"
            onClick={() => saveProject(true, true)}
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Save & Finish
          </Button>
          
          {project.id && (
            project.isPublished ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={unpublishProject}
              >
                Unpublish
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="default"
                onClick={publishProject}
              >
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </Button>
            )
          )}
          
          {project.id && user?.username && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => router.push(`/${user.username}/projects/${project.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Editor Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Project Title</label>
              <Input
                id="title"
                value={project.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                placeholder="Enter project title"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Short Description</label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                placeholder="Enter a short description of your project"
                className="w-full h-20"
              />
            </div>
          </div>
          
          <ProjectFormTabs
            project={project}
            handleInputChange={handleInputChange}
            projectId={projectId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Live Preview Column */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 max-h-[900px] overflow-y-auto sticky top-4">
          <div className="text-xs uppercase font-semibold text-gray-500 mb-2 sticky top-0 bg-white pb-2 border-b">
            Live Preview
          </div>
          
          {/* Project Preview */}
          <div className="pt-4">
            {/* Project Header */}
            <h1 className="text-3xl font-bold mb-2">{project.title || 'Project Title'}</h1>
            <p className="text-gray-600 mb-6">{project.description || 'Project description will appear here.'}</p>
            
            {/* Cover Image */}
            {project.coverImage && (
              <div className="w-full h-64 bg-gray-100 mb-8 rounded-lg overflow-hidden">
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Project Content */}
            <div className="prose max-w-none mb-8">
              {project.content ? (
                <div>{project.content}</div>
              ) : (
                <p className="text-gray-400 italic">Project content will appear here.</p>
              )}
            </div>

            {/* Media Gallery */}
            {project.mediaItems && project.mediaItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Media Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.mediaItems.map((item, index) => (
                    <div key={item.id || index} className="bg-gray-100 rounded-lg overflow-hidden">
                      {item.type === 'VIDEO' ? (
                        <iframe src={item.url} className="w-full aspect-video" frameBorder="0" allowFullScreen></iframe>
                      ) : (
                        <img src={item.url} alt={item.caption || 'Project image'} className="w-full h-full object-cover" />
                      )}
                      {item.caption && <p className="p-2 text-sm text-gray-600">{item.caption}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {project.timeline && project.timeline.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Project Timeline</h2>
                <div className="space-y-4">
                  {project.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 border-l-2 border-blue-500">
                      <div>
                        <div className="font-semibold">{item.date}</div>
                        <div className="text-lg font-medium">{item.title}</div>
                        {item.description && <p className="text-gray-600 mt-1">{item.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Outcomes */}
            {project.outcomes && project.outcomes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Project Outcomes</h2>
                <div className="space-y-4">
                  {project.outcomes.map((outcome, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      {outcome.metric && <div className="font-semibold">{outcome.metric}</div>}
                      {outcome.testimonial && <div className="italic text-gray-600 mt-2">"{outcome.testimonial}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 