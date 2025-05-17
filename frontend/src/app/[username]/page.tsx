'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import { useAuth } from '@/context/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  mediaItems: any[];
}

interface Portfolio {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  projects: Project[];
}

export default function UserPortfolio() {
  const params = useParams();
  const { user } = useAuth();
  const username = params.username as string;
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isOwner = user?.username === username;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolios/${username}`, {
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if available for analytics tracking
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio');
        }
        
        const data = await response.json();
        setPortfolio(data.portfolio);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Could not load this portfolio. The user may not exist.');
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchPortfolio();
    }
  }, [username]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
      </div>
    );
  }
  
  if (error || !portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-destructive">Portfolio Not Found</h1>
        <p className="mt-2 text-muted-foreground">{error || 'This user does not exist or has no public portfolio.'}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {portfolio.avatarUrl && (
            <img 
              src={portfolio.avatarUrl} 
              alt={portfolio.name} 
              className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{portfolio.name}</h1>
            <p className="text-muted-foreground">@{portfolio.username}</p>
            {portfolio.bio && (
              <p className="max-w-2xl mt-4">{portfolio.bio}</p>
            )}
          </div>
        </div>
        
        {isOwner && (
          <div className="mt-6 flex gap-2">
            <a 
              href="/dashboard" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Edit Portfolio
            </a>
          </div>
        )}
      </div>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">Projects</h2>
        
        {portfolio.projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                username={username}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 