import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 text-center bg-gradient-to-b from-background to-muted">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Showcase Your Work with <span className="text-primary">ProjectShelf</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Create dynamic portfolios with modular case studies for designers, developers, and writers.
          </p>
          
          {/* Two main options as requested */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link href="/explore" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full py-8 text-lg gap-2">
                <span className="text-xl">🔍</span>
                <div className="flex flex-col items-start">
                  <span className="font-bold">Explore Portfolios</span>
                  <span className="text-xs text-muted-foreground">Browse published work</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full py-8 text-lg gap-2">
                <span className="text-xl">✍️</span>
                <div className="flex flex-col items-start">
                  <span className="font-bold">Start as Creator</span>
                  <span className="text-xs text-muted-foreground">Login or sign up</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Creators</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Showcase your work with beautiful case studies and personalized portfolio pages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Portfolio Builder"
              description="Create comprehensive case studies with project overviews, media galleries, timelines, and outcomes."
            />
            <FeatureCard 
              title="Theme Engine"
              description="Choose from multiple pre-built themes and customize your portfolio with real-time preview."
            />
            <FeatureCard 
              title="Analytics Dashboard"
              description="Track portfolio traffic, engagement, and visitor interest per case study."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Work?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join other creative professionals showcasing their best work on ProjectShelf.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
            <Button size="lg">Create Your Portfolio</Button>
          </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg">Explore Portfolios</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
