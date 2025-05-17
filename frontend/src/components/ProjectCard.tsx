import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  mediaItems: Array<{
    id: string;
    url: string;
    type: string;
  }>;
}

interface ProjectCardProps {
  project: Project;
  username: string;
}

export default function ProjectCard({ project, username }: ProjectCardProps) {
  // Get the first media item as cover image, or use project.coverImage if available
  const coverImage = project.coverImage || 
    (project.mediaItems && project.mediaItems.length > 0 
      ? project.mediaItems[0].url 
      : '/placeholder-project.jpg');

  return (
    <Link href={`/${username}/projects/${project.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md hover:-translate-y-1">
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={coverImage} 
            alt={project.title}
            className="w-full h-full object-cover"
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