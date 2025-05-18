'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Portfolio {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  projectCount: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
}

export default function ExplorePage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPublishedPortfolios = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/portfolios/published`);
        if (response.data && response.data.users) {
          setPortfolios(response.data.users);
          setPagination(response.data.pagination);
        } else {
          setPortfolios(response.data || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching published portfolios:', error);
        setIsLoading(false);
      }
    };

    fetchPublishedPortfolios();
  }, []);

  const trackPortfolioView = async (username: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/portfolio-visit`, {
        userId: portfolios.find(p => p.username === username)?.id,
        viewerId: null
      });
      router.push(`/${username}`);
    } catch (error) {
      console.error('Error tracking view:', error);
      router.push(`/${username}`);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Explore Portfolios</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-lg">Loading portfolios...</div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-6">No published portfolios available yet.</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{portfolio.name || portfolio.username}</CardTitle>
                <CardDescription>
                  {portfolio.projectCount} {portfolio.projectCount === 1 ? 'project' : 'projects'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{portfolio.bio || 'No bio available'}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => trackPortfolioView(portfolio.username)}
                >
                  View Portfolio
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <p className="text-sm text-muted-foreground">
            Showing page {pagination.page} of {pagination.pages} ({pagination.total} portfolios)
          </p>
        </div>
      )}
    </div>
  );
} 