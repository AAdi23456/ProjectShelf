import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Twitter, Linkedin, Instagram, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="space-y-4 md:col-span-2">
            <div>
              <Link href="/" className="inline-block">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  ProjectShelf
                </span>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Create dynamic and beautiful portfolios with modular case studies for designers, developers, and creative professionals.
            </p>
            
            {/* <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Subscribe to our newsletter</h4>
              <div className="flex gap-2 max-w-sm">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white"
                />
                <Button type="submit" className="shrink-0" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Get the latest updates and resources directly to your inbox.
              </p>
            </div> */}
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {/* <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li> */}
              {/* <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li> */}
              <li>
                <Link href="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Explore
                </Link>
              </li>
              {/* <li>
                <Link href="/examples" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Examples
                </Link>
              </li> */}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {/* <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li> */}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">Company</h4>
            {/* <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul> */}
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProjectShelf. All rights reserved.
          </p>
          
          {/* <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gray-900 transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-700 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-600 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
} 