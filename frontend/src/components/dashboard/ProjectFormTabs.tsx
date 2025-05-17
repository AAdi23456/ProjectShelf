import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import MediaGalleryEditor from './MediaGalleryEditor';
import TimelineEditor from './TimelineEditor';
import TechnologiesEditor from './TechnologiesEditor';
import OutcomesEditor from './OutcomesEditor';

interface Project {
  id?: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string;
  slug?: string;
  timeline: {
    date: string;
    title: string;
    description: string;
  }[];
  technologies: string[];
  outcomes: {
    metric?: string;
    testimonial?: string;
  }[];
  mediaItems: any[];
}

interface ProjectFormTabsProps {
  project: Project;
  handleInputChange: (field: keyof Project, value: any) => void;
  projectId: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ProjectFormTabs({
  project,
  handleInputChange,
  projectId,
  activeTab = 'overview',
  onTabChange
}: ProjectFormTabsProps) {
  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab} 
      onValueChange={onTabChange}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="technologies">Technologies</TabsTrigger>
        <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">Project Content</label>
          <Textarea
            id="content"
            value={project.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('content', e.target.value)}
            placeholder="Describe your project in detail..."
            className="min-h-[300px]"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="media">
        <MediaGalleryEditor 
          projectId={project.id || projectId} 
          mediaItems={project.mediaItems || []}
          onChange={(mediaItems) => handleInputChange('mediaItems', mediaItems)}
          onCoverImageChange={(url) => handleInputChange('coverImage', url)}
          coverImage={project.coverImage}
        />
      </TabsContent>
      
      <TabsContent value="timeline">
        <TimelineEditor 
          timeline={project.timeline} 
          onChange={(timeline) => handleInputChange('timeline', timeline)}
        />
      </TabsContent>
      
      <TabsContent value="technologies">
        <TechnologiesEditor 
          technologies={project.technologies}
          onChange={(technologies) => handleInputChange('technologies', technologies)}
        />
      </TabsContent>
      
      <TabsContent value="outcomes">
        <OutcomesEditor 
          outcomes={project.outcomes}
          onChange={(outcomes) => handleInputChange('outcomes', outcomes)}
        />
      </TabsContent>
    </Tabs>
  );
} 