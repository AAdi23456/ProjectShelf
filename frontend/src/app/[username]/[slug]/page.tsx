import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock data for a single project
const mockProject = {
  id: "1",
  title: "E-commerce Redesign",
  slug: "ecommerce-redesign",
  description: "A complete redesign of an e-commerce platform focusing on user experience and conversion optimization.",
  overview: "This project was a comprehensive redesign of an established e-commerce platform that was struggling with cart abandonment and conversion rates. The client needed a more intuitive, responsive design that would increase user engagement and sales.",
  tools: ["Figma", "React", "Next.js", "Tailwind CSS", "Shopify API"],
  outcomes: "The redesign resulted in a 35% decrease in cart abandonment and a 28% increase in overall conversion rate. User session duration increased by 45%, and the client reported significantly improved customer feedback.",
  timeline: [
    { title: "Research & Analysis", description: "Conducted user interviews and analyzed existing site metrics to identify pain points.", date: "January 2023" },
    { title: "Wireframing", description: "Created low-fidelity wireframes focusing on improved user flow.", date: "February 2023" },
    { title: "UI Design", description: "Developed high-fidelity mockups with a refreshed visual identity.", date: "March 2023" },
    { title: "Development", description: "Implemented the new design with a focus on performance and accessibility.", date: "April-May 2023" },
    { title: "Testing & Launch", description: "Conducted user testing and iterative improvements before full launch.", date: "June 2023" }
  ],
  mediaItems: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?q=80&w=2070&auto=format&fit=crop",
      type: "IMAGE",
      caption: "Homepage redesign featuring new product categorization"
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop",
      type: "IMAGE",
      caption: "Mobile-responsive product detail page"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1555421689-d68471e5f594?q=80&w=2070&auto=format&fit=crop",
      type: "IMAGE",
      caption: "Streamlined checkout process"
    }
  ],
  user: {
    username: "johndoe",
    name: "John Doe",
    avatarUrl: "https://github.com/shadcn.png"
  }
};

export default function ProjectPage({ params }: { params: { username: string; slug: string } }) {
  // In a real app, you would fetch project data based on the username and slug
  const project = mockProject;
  
  return (
    <div className="container mx-auto py-10">
      {/* Project header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/${params.username}`} className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={project.user.avatarUrl} alt={project.user.name} />
              <AvatarFallback>{project.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span>{project.user.name}</span>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-muted-foreground mb-8">{project.description}</p>
      </div>
      
      {/* Media gallery */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.mediaItems.map((media) => (
            <Card key={media.id} className="overflow-hidden">
              <img 
                src={media.url} 
                alt={media.caption || project.title}
                className="w-full h-64 object-cover"
              />
              {media.caption && (
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{media.caption}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      {/* Project details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
          <p className="mb-8">{project.overview}</p>
          
          <h2 className="text-2xl font-bold mb-4">Outcomes</h2>
          <p className="mb-8">{project.outcomes}</p>
          
          <h2 className="text-2xl font-bold mb-4">Development Timeline</h2>
          <div className="space-y-6 mb-8">
            {project.timeline.map((item, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{item.date}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              
              <div className="mt-8">
                <Button className="w-full">Contact About This Project</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 