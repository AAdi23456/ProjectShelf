'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Share2, Clock, MousePointer } from 'lucide-react';

interface ProjectEngagement {
  projectId: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  clickThroughs: number;
  bounceRate: number;
  sections: {
    name: string;
    viewTime: number;
    percentage: number;
  }[];
  referrers: {
    source: string;
    count: number;
    percentage: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

interface CaseStudyEngagementProps {
  projects: ProjectEngagement[];
}

export default function CaseStudyEngagement({ projects }: CaseStudyEngagementProps) {
  const [selectedProject, setSelectedProject] = useState<string>(
    projects.length > 0 ? projects[0].projectId : ''
  );

  const currentProject = projects.find(p => p.projectId === selectedProject);

  if (!currentProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Case Study Engagement</CardTitle>
          <CardDescription>No projects available to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Create and share projects to see engagement metrics.</p>
        </CardContent>
      </Card>
    );
  }

  // Format section data for visualizations
  const sectionData = currentProject.sections.map((section, index) => ({
    name: section.name,
    value: section.percentage,
    viewTime: Math.round(section.viewTime),
    fill: COLORS[index % COLORS.length]
  }));

  // Format referrer data for visualizations
  const referrerData = currentProject.referrers.map((ref, index) => ({
    name: ref.source,
    value: ref.count,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Case Study Engagement</CardTitle>
            <CardDescription>Visitor interest by section for each case study</CardDescription>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className="flex flex-wrap gap-2">
              {projects.map(project => (
                <Button
                  key={project.projectId}
                  variant={selectedProject === project.projectId ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProject(project.projectId)}
                  className="text-xs"
                >
                  {project.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5 bg-primary/10 p-2 rounded-full">
                  <MousePointer className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Views</div>
                  <div className="text-2xl font-bold">{currentProject.views}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5 bg-primary/10 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Avg. Time</div>
                  <div className="text-2xl font-bold">{currentProject.avgTimeOnPage}s</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5 bg-primary/10 p-2 rounded-full">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Click Through</div>
                  <div className="text-2xl font-bold">{currentProject.clickThroughs}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5 bg-primary/10 p-2 rounded-full">
                  <Share2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Bounce Rate</div>
                  <div className="text-2xl font-bold">{currentProject.bounceRate}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="sections">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="sections">Section Interest</TabsTrigger>
              <TabsTrigger value="referrers">Traffic Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sections">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Section Engagement</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={1}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                        >
                          {sectionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Section View Time (seconds)</h3>
                  <div className="space-y-4">
                    {currentProject.sections.map((section, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{section.name}</span>
                          <span className="text-sm text-muted-foreground">{Math.round(section.viewTime)}s</span>
                        </div>
                        <Progress
                          value={section.percentage}
                          className="h-2"
                          indicatorClassName={`bg-[${COLORS[index % COLORS.length]}]`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="referrers">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Traffic Sources</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={referrerData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Top Referrers</h3>
                  <div className="space-y-3">
                    {currentProject.referrers.sort((a, b) => b.count - a.count).map((referrer, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <Badge variant="outline" className="mb-1">{referrer.source}</Badge>
                          <div className="text-sm text-muted-foreground">{referrer.percentage}% of traffic</div>
                        </div>
                        <div className="text-xl font-bold">{referrer.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
} 