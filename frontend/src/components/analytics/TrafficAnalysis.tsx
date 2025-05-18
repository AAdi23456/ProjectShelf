'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// Sample data structure for traffic statistics
interface TrafficStats {
  dailyData: {
    date: string;
    views: number;
    visitors: number;
    newVisitors: number;
    returningVisitors: number;
  }[];
  deviceData: {
    name: string;
    value: number;
    percentage: number;
  }[];
  totalViews: number;
  totalVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: {
    path: string;
    views: number;
    percentage: number;
  }[];
}

interface TrafficAnalysisProps {
  trafficData: TrafficStats;
}

export default function TrafficAnalysis({ trafficData }: TrafficAnalysisProps) {
  const [timeframe, setTimeframe] = useState('30days');
  
  // Format data for visualizations
  const formattedData = trafficData.dailyData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: item.views,
    visitors: item.visitors,
    newVisitors: item.newVisitors,
    returningVisitors: item.returningVisitors
  }));
  
  // Time-filtered data
  const getFilteredData = () => {
    if (timeframe === '7days') {
      return formattedData.slice(-7);
    } else if (timeframe === '30days') {
      return formattedData.slice(-30);
    } else {
      return formattedData;
    }
  };
  
  const filteredData = getFilteredData();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Portfolio Traffic</CardTitle>
            <CardDescription>Visitor traffic and engagement statistics</CardDescription>
          </div>
          <div className="mt-2 sm:mt-0">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Views</div>
              <div className="text-3xl font-bold">{trafficData.totalViews.toLocaleString()}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Unique Visitors</div>
              <div className="text-3xl font-bold">{trafficData.totalVisitors.toLocaleString()}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Session</div>
              <div className="text-3xl font-bold">{trafficData.avgSessionDuration}s</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Bounce Rate</div>
              <div className="text-3xl font-bold">{trafficData.bounceRate}%</div>
            </div>
          </div>
          
          <Tabs defaultValue="traffic">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="traffic">Traffic Overview</TabsTrigger>
              <TabsTrigger value="visitors">Visitor Types</TabsTrigger>
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="traffic">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="visitors" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="visitors">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newVisitors" stroke="#8884d8" activeDot={{ r: 8 }} name="New Visitors" />
                    <Line type="monotone" dataKey="returningVisitors" stroke="#82ca9d" name="Returning Visitors" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Device Breakdown</h3>
                  <div className="space-y-3">
                    {trafficData.deviceData.map((device, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="text-sm font-medium">{device.name}</div>
                        <div className="text-sm">
                          <span className="font-medium">{device.value}</span>
                          <span className="text-muted-foreground ml-2">({device.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Key Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                      <span>{trafficData.deviceData[0]?.name || "Mobile"} users spend the most time on your portfolio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                      <span>Returning visitors browse {Math.round(trafficData.avgSessionDuration * 1.5)}s longer than new visitors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                      <span>Your portfolio has a good retention rate compared to industry average</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pages">
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium">Page</th>
                      <th className="text-center p-3 font-medium">Views</th>
                      <th className="text-right p-3 font-medium">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficData.topPages.map((page, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{page.path}</td>
                        <td className="text-center p-3">{page.views}</td>
                        <td className="text-right p-3">{page.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>These are the most viewed pages on your portfolio. Consider highlighting these projects in your portfolio layout.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
} 