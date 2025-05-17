'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, Calendar, Wrench, ImageOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import MediaGallery from '@/components/MediaGallery';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  technologies?: string[];
  timeline?: {
    date: string;
    title: string;
    description: string;
  }[];
  outcomes?: {
    metric?: string;
    testimonial?: string;
  }[];
  mediaItems: Media[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const username = params.username as string;
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isOwner = user?.username === username;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        console.log(`Fetching project: ${username}/${projectId}`);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolios/${username}/projects/${projectId}`, {
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if available for analytics tracking
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        console.log('Project data fetched:', data.project?.id);
        setProject(data.project);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Could not load this project. It may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    if (username && projectId) {
      fetchProject();
    }
  }, [username, projectId]);
  
    // We'll use the MediaGallery component instead of this
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading project...</p>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-destructive">Project Not Found</h1>
        <p className="mt-2 text-muted-foreground">{error || 'This project does not exist or you do not have permission to view it.'}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Navigation */}
      <div className="mb-8">
        <button 
          onClick={() => router.push(`/${username}`)} 
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to {username}'s portfolio
        </button>
      </div>
      
      {/* Project header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
        
        {isOwner && (
          <div className="flex gap-2 mb-6">
            <a 
              href={`/dashboard/projects/${project.id}/edit`} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Edit Project
            </a>
          </div>
        )}
      </div>
      
      {/* Media gallery */}
      {project.mediaItems && project.mediaItems.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <MediaGallery mediaItems={project.mediaItems} />
        </section>
      )}
      
      {/* Main content */}
      {project.content && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {project.content}
          </div>
        </section>
      )}
      
      {/* Timeline */}
      {project.timeline && project.timeline.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Development Timeline</h2>
          <div className="space-y-6">
            {project.timeline.map((item, index) => (
              <div key={index} className="flex gap-4 border-l-2 border-primary/20 pl-4 py-2">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <div className="font-medium">{item.date}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Tools & Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <div key={index} className="px-3 py-1 bg-primary/10 rounded-full flex items-center gap-1">
                <Wrench className="w-4 h-4" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Outcomes */}
      {project.outcomes && project.outcomes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Outcomes</h2>
          <div className="grid grid-cols-1 gap-6">
            {project.outcomes.map((outcome, index) => (
              <div key={index} className="bg-card rounded-lg p-5 border">
                {outcome.metric && (
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg">Key Metric</h3>
                    <p>{outcome.metric}</p>
                  </div>
                )}
                {outcome.testimonial && (
                  <div>
                    <h3 className="font-semibold text-lg">Testimonial</h3>
                    <blockquote className="border-l-2 border-primary/20 pl-4 italic">
                      {outcome.testimonial}
                    </blockquote>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 