'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        
        setProjectStats(projectData);
        setPortfolioStats(portfolioData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user, period]);
  
  const formatChartData = (data: any[], dateKey: string) => {
    return data.map(item => ({
      date: new Date(item[dateKey]).toLocaleDateString(),
      views: item.count
    }));
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Please log in to view analytics</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="year">Last 12 months</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
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
        <Tabs defaultValue="projects">
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Project Views</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Visits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Views</CardTitle>
                  <CardDescription>All project views</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{projectStats?.totalViews || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Unique Viewers</CardTitle>
                  <CardDescription>Distinct visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{projectStats?.uniqueViewers || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Views</CardTitle>
                  <CardDescription>Per project</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {projectStats?.projectBreakdown?.length 
                      ? Math.round(projectStats.totalViews / projectStats.projectBreakdown.length) 
                      : 0}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
                <CardDescription>Daily project views</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {projectStats?.dailyViews?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatChartData(projectStats.dailyViews, 'day')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No view data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {projectStats?.projectBreakdown?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Breakdown</CardTitle>
                  <CardDescription>Views by project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projectStats.projectBreakdown.map((project: any) => (
                      <div key={project.projectId} className="flex justify-between items-center">
                        <div className="font-medium">{project.project.title}</div>
                        <div className="text-muted-foreground">{project.count} views</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Visits</CardTitle>
                  <CardDescription>Portfolio page visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{portfolioStats?.totalVisits || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Unique Visitors</CardTitle>
                  <CardDescription>Distinct visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{portfolioStats?.uniqueVisitors || 0}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Visits Over Time</CardTitle>
                <CardDescription>Daily portfolio visits</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {portfolioStats?.dailyVisits?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatChartData(portfolioStats.dailyVisits, 'day')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No visit data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 