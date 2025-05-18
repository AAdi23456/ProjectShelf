'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Info } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import TrafficAnalysis from '@/components/analytics/TrafficAnalysis';
import CaseStudyEngagement from '@/components/analytics/CaseStudyEngagement';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Sample data for development and testing
const sampleTrafficData = {
  dailyData: Array.from({ length: 60 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (59 - i));
    return {
      date: date.toISOString(),
      views: Math.floor(Math.random() * 50) + 10,
      visitors: Math.floor(Math.random() * 30) + 5,
      newVisitors: Math.floor(Math.random() * 20) + 3,
      returningVisitors: Math.floor(Math.random() * 15) + 2
    };
  }),
  deviceData: [
    { name: 'Mobile', value: 235, percentage: 58.7 },
    { name: 'Desktop', value: 142, percentage: 35.5 },
    { name: 'Tablet', value: 23, percentage: 5.8 }
  ],
  totalViews: 843,
  totalVisitors: 412,
  avgSessionDuration: 134,
  bounceRate: 42.7,
  topPages: [
    { path: '/johndoe/project-name', views: 254, percentage: 30.1 },
    { path: '/johndoe', views: 186, percentage: 22.1 },
    { path: '/johndoe/another-project', views: 127, percentage: 15.1 },
    { path: '/johndoe/third-project', views: 98, percentage: 11.6 },
    { path: '/johndoe/contact', views: 42, percentage: 5.0 }
  ]
};

// Sample project engagement data
const sampleProjectEngagement = [
  {
    projectId: "project1",
    title: "E-commerce Redesign",
    views: 542,
    uniqueVisitors: 387,
    avgTimeOnPage: 214,
    clickThroughs: 73,
    bounceRate: 35.8,
    sections: [
      { name: "Overview", viewTime: 68, percentage: 35 },
      { name: "Process", viewTime: 42, percentage: 22 },
      { name: "Gallery", viewTime: 54, percentage: 28 },
      { name: "Outcomes", viewTime: 30, percentage: 15 }
    ],
    referrers: [
      { source: "Google", count: 210, percentage: 39 },
      { source: "LinkedIn", count: 142, percentage: 26 },
      { source: "Twitter", count: 87, percentage: 16 },
      { source: "Direct", count: 103, percentage: 19 }
    ]
  },
  {
    projectId: "project2",
    title: "Mobile App UI Design",
    views: 324,
    uniqueVisitors: 230,
    avgTimeOnPage: 183,
    clickThroughs: 46,
    bounceRate: 42.3,
    sections: [
      { name: "Overview", viewTime: 54, percentage: 32 },
      { name: "Process", viewTime: 36, percentage: 21 },
      { name: "Gallery", viewTime: 62, percentage: 36 },
      { name: "Outcomes", viewTime: 18, percentage: 11 }
    ],
    referrers: [
      { source: "Google", count: 125, percentage: 39 },
      { source: "Dribbble", count: 98, percentage: 30 },
      { source: "Behance", count: 56, percentage: 17 },
      { source: "Direct", count: 45, percentage: 14 }
    ]
  }
];

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [projectStats, setProjectStats] = useState<any>(null);
  const [portfolioStats, setPortfolioStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // We'd normally fetch from these endpoints
        // For this implementation, we're using sample data
        /*
        // Fetch project views statistics
        const projectRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/project-views?period=${period}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Fetch portfolio visits statistics
        const portfolioRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/portfolio-visits?period=${period}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!projectRes.ok || !portfolioRes.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const projectData = await projectRes.json();
        const portfolioData = await portfolioRes.json();
        */
        
        // Using sample data instead for this implementation
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProjectStats({
          totalViews: sampleTrafficData.totalViews,
          uniqueViewers: sampleTrafficData.totalVisitors,
          dailyViews: sampleTrafficData.dailyData.slice(-30).map(item => ({
            day: item.date,
            count: item.views
          })),
          projectBreakdown: sampleProjectEngagement.map(project => ({
            projectId: project.projectId,
            count: project.views,
            project: {
              title: project.title
            }
          }))
        });
        
        setPortfolioStats({
          totalVisits: sampleTrafficData.totalViews,
          uniqueVisitors: sampleTrafficData.totalVisitors,
          dailyVisits: sampleTrafficData.dailyData.slice(-30).map(item => ({
            day: item.date,
            count: item.visitors
          }))
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user, period]);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Please log in to view analytics</p>
      </div>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Analytics Dashboard" 
        subheading="Track visitor engagement and interest in your portfolio"
      />
      
      <div className="space-y-8">
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                <span>About the data</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>This dashboard shows analytics for your portfolio and projects. Data may be delayed by up to 24 hours.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <TrafficAnalysis trafficData={sampleTrafficData} />
            
            <CaseStudyEngagement projects={sampleProjectEngagement} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Demographics</CardTitle>
                  <CardDescription>Age and location breakdown of visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-60 border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">Demographics data visualization placeholder</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>How visitor engagement changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-60 border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">Engagement trends visualization placeholder</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
} 