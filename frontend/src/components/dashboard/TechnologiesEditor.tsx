'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TechnologiesEditorProps {
  technologies: string[];
  onChange: (technologies: string[]) => void;
}

export default function TechnologiesEditor({ technologies = [], onChange }: TechnologiesEditorProps) {
  const [techInput, setTechInput] = useState('');
  
  const addTechnology = () => {
    if (!techInput.trim()) {
      toast.error('Please enter a technology name');
      return;
    }
    
    if (technologies.includes(techInput.trim())) {
      toast.error('This technology already exists');
      return;
    }
    
    // Add new technology
    const updatedTechnologies = [...technologies, techInput.trim()];
    onChange(updatedTechnologies);
    
    // Reset input
    setTechInput('');
    
    toast.success('Technology added');
  };
  
  const removeTechnology = (indexToRemove: number) => {
    const updatedTechnologies = technologies.filter((_, index) => index !== indexToRemove);
    onChange(updatedTechnologies);
    toast.success('Technology removed');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Technologies</h3>
        
        <div className="flex space-x-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., React, TailwindCSS, Node.js"
            className="flex-1"
          />
          
          <Button 
            type="button" 
            onClick={addTechnology}
            disabled={!techInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Press Enter to add a technology
        </p>
      </div>
      
      {technologies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Technologies Used</h3>
          
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <div 
                key={index} 
                className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1"
              >
                <span className="mr-1">{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTechnology(index)}
                  className="text-primary/70 hover:text-primary transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 