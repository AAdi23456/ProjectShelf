'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, MoveUp, MoveDown, Calendar } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineEditorProps {
  timeline: TimelineItem[];
  onChange: (timeline: TimelineItem[]) => void;
}

export default function TimelineEditor({ timeline = [], onChange }: TimelineEditorProps) {
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addTimelineItem = () => {
    if ((!date.trim() && !selectedDate) || !title.trim()) {
      return;
    }

    // Format the date
    let formattedDate = date;
    if (selectedDate) {
      const month = selectedDate.toLocaleString('default', { month: 'short' });
      const year = selectedDate.getFullYear();
      formattedDate = `${month} ${year}`;
    }

    const newItem: TimelineItem = {
      date: formattedDate.trim(),
      title: title.trim(),
      description: description.trim()
    };

    onChange([...timeline, newItem]);
    
    // Reset form
    setDate('');
    setSelectedDate(null);
    setTitle('');
    setDescription('');
  };

  const removeTimelineItem = (index: number) => {
    const updatedTimeline = [...timeline];
    updatedTimeline.splice(index, 1);
    onChange(updatedTimeline);
  };

  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === timeline.length - 1)
    ) {
      return;
    }

    const updatedTimeline = [...timeline];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedTimeline[index], updatedTimeline[newIndex]] = 
    [updatedTimeline[newIndex], updatedTimeline[index]];
    
    onChange(updatedTimeline);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      setDate(`${month} ${year}`);
    } else {
      setDate('');
    }
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Timeline Entry</h3>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="date"
                  value={date}
                  onChange={handleManualDateChange}
                  placeholder="e.g., Jan 2023 or Q1 2023"
                  className="pr-10"
                />
                <div className="absolute right-2 top-0 bottom-0 flex items-center">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    customInput={
                      <button type="button">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </button>
                    }
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Milestone Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Project Kickoff"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this milestone"
              className="h-20"
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={addTimelineItem}
          disabled={(!date.trim() && !selectedDate) || !title.trim()}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Timeline Entry
        </Button>
      </div>
      
      {timeline.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Timeline Entries</h3>
          
          <div className="space-y-3">
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-md bg-background relative"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-muted-foreground">{item.date}</div>
                    <div className="font-semibold">{item.title}</div>
                    {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveTimelineItem(index, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveTimelineItem(index, 'down')}
                      disabled={index === timeline.length - 1}
                      className="h-8 w-8"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimelineItem(index)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 