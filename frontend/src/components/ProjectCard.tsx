import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import MediaRenderer from '@/components/MediaRenderer';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
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

  return (
    <Link href={`/${username}/projects/${project.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md hover:-translate-y-1">
        <div className="w-full h-48 overflow-hidden">
          <MediaRenderer 
            media={media}
            aspectRatio="auto" 
            className="w-full h-full"
            showCaption={false}
            isPreview={true}
          />
        </div>
        <CardContent className="p-5">
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{project.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
} 