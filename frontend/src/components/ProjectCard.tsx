import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import MediaRenderer from '@/components/MediaRenderer';
import { CalendarIcon, Clock, TagIcon } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  technologies?: string[];
  mediaItems?: Array<{
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    caption?: string;
  }>;
}

interface ProjectCardProps {
  project: Project;
  username: string;
}

export default function ProjectCard({ project, username }: ProjectCardProps) {
  // Check if valid media items exist
  const hasMediaItems = project.mediaItems && project.mediaItems.length > 0 && project.mediaItems[0]?.url;
  
  // Determine if the first media is a video
  const firstMediaIsVideo = hasMediaItems && project.mediaItems?.[0]?.type === 'VIDEO';
  
  // Create a media object for rendering
  const media = hasMediaItems && project.mediaItems
    ? {
        url: project.mediaItems[0]?.url || '',
        type: project.mediaItems[0]?.type || 'IMAGE' as const,
        caption: project.mediaItems[0]?.caption
      }
    : {
        url: project.coverImage || '/placeholder-project.jpg',
        type: 'IMAGE' as const,
        caption: project.title
      };

  // Format date
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/${username}/projects/${project.id}`}>
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border border-gray-200 rounded-xl">
        <div className="relative w-full h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
          <MediaRenderer 
            media={media}
            aspectRatio="auto" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            showCaption={false}
            isPreview={true}
          />
          {firstMediaIsVideo && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs z-20">
              Video
            </div>
          )}
        </div>
        <CardContent className="p-5 relative">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-secondary/50 rounded-full">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-xs px-2 py-1 bg-secondary/50 rounded-full">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
          
          <span className="absolute bottom-5 right-5 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Project →
          </span>
        </CardContent>
      </Card>
    </Link>
  );
} 