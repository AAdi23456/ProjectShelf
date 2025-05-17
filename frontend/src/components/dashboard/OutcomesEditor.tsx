'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface OutcomeItem {
  metric?: string;
  testimonial?: string;
}

interface OutcomesEditorProps {
  outcomes: OutcomeItem[];
  onChange: (outcomes: OutcomeItem[]) => void;
}

export default function OutcomesEditor({ outcomes = [], onChange }: OutcomesEditorProps) {
  const [metric, setMetric] = useState('');
  const [testimonial, setTestimonial] = useState('');

  const addOutcome = () => {
    if (!metric.trim() && !testimonial.trim()) {
      return;
    }

    const newOutcome: OutcomeItem = {
      metric: metric.trim() || undefined,
      testimonial: testimonial.trim() || undefined
    };

    onChange([...outcomes, newOutcome]);
    
    // Reset form
    setMetric('');
    setTestimonial('');
    
    toast.success('Outcome added');
  };

  const removeOutcome = (index: number) => {
    const updatedOutcomes = [...outcomes];
    updatedOutcomes.splice(index, 1);
    onChange(updatedOutcomes);
    toast.success('Outcome removed');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Project Outcome</h3>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="metric" className="block text-sm font-medium mb-1">Key Metric (optional)</label>
            <Input
              id="metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="e.g., 50% increase in conversion rate"
            />
          </div>
          
          <div>
            <label htmlFor="testimonial" className="block text-sm font-medium mb-1">Testimonial (optional)</label>
            <Textarea
              id="testimonial"
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Add a client or team testimonial"
              className="h-24"
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={addOutcome}
          disabled={!metric.trim() && !testimonial.trim()}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Outcome
        </Button>
      </div>
      
      {outcomes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Outcomes</h3>
          
          <div className="space-y-3">
            {outcomes.map((outcome, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-md bg-background relative group"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOutcome(index)}
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                {outcome.metric && (
                  <div className="mb-2">
                    <h4 className="font-medium text-sm">Key Metric</h4>
                    <p>{outcome.metric}</p>
                  </div>
                )}
                
                {outcome.testimonial && (
                  <div>
                    <h4 className="font-medium text-sm">Testimonial</h4>
                    <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground">
                      "{outcome.testimonial}"
                    </blockquote>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 