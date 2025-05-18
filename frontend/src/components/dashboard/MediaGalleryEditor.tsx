'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  X, 
  Video, 
  Image as ImageIcon, 
  Star,
  Trash2,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import MediaRenderer from '@/components/MediaRenderer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaItem {
  id?: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption?: string;
}

interface MediaGalleryEditorProps {
  projectId: string;
  mediaItems: MediaItem[];
  onChange: (mediaItems: MediaItem[]) => void;
  onCoverImageChange: (coverImageUrl: string) => void;
  coverImage?: string;
}

export default function MediaGalleryEditor({
  projectId,
  mediaItems = [],
  onChange,
  onCoverImageChange,
  coverImage
}: MediaGalleryEditorProps) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [urlError, setUrlError] = useState<string | null>(null);
  
  const MAX_URL_LENGTH = 2000;
  
  // Helper to validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Clear previous error
    setUrlError(null);
    
    // Check URL length
    if (newUrl.length > MAX_URL_LENGTH) {
      setUrlError(`URL is too long (maximum ${MAX_URL_LENGTH} characters)`);
    }
  };

  const addMediaItem = () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    if (url.length > MAX_URL_LENGTH) {
      toast.error(`URL is too long (maximum ${MAX_URL_LENGTH} characters)`);
      return;
    }

    if (!isValidUrl(url.trim())) {
      toast.error('Please enter a valid URL format');
      return;
    }

    const newMediaItem: MediaItem = {
      id: `temp-${Date.now()}`,
      url: url.trim(),
      type: mediaType,
      caption: caption.trim() || undefined
    };

    const updatedMediaItems = [...mediaItems, newMediaItem];
    onChange(updatedMediaItems);
    
    // Reset form
    setUrl('');
    setCaption('');
    setUrlError(null);
  };

  const removeMediaItem = (index: number) => {
    const updatedMediaItems = [...mediaItems];
    updatedMediaItems.splice(index, 1);
    onChange(updatedMediaItems);
  };

  const setCoverImage = (url: string) => {
    onCoverImageChange(url);
    toast.success('Cover image updated');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add Media</h3>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={mediaType === 'IMAGE' ? 'default' : 'outline'}
            onClick={() => setMediaType('IMAGE')}
            className="flex-1"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Image
          </Button>
          
          <Button
            type="button"
            variant={mediaType === 'VIDEO' ? 'default' : 'outline'}
            onClick={() => setMediaType('VIDEO')}
            className="flex-1"
          >
            <Video className="mr-2 h-4 w-4" />
            Video
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {mediaType === 'IMAGE' ? 'Image URL' : 'Video URL'}
            </label>
            
            {mediaType === 'VIDEO' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Info className="h-3 w-3 mr-1" />
                      Supported formats
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)</p>
                    <p>Vimeo URLs (e.g., https://vimeo.com/VIDEO_ID)</p>
                    <p>Direct embed URLs (iframe src URLs)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <Input
            value={url}
            onChange={handleUrlChange}
            placeholder={mediaType === 'IMAGE' 
              ? 'https://example.com/image.jpg'
              : 'https://www.youtube.com/watch?v=VIDEO_ID'
            }
            className={urlError ? "border-destructive" : ""}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {mediaType === 'IMAGE' 
                ? 'Direct link to image (JPG, PNG, etc)'
                : 'Regular YouTube/Vimeo links will be automatically converted to embed format'
              }
            </p>
            <p className={`text-xs ${url.length > MAX_URL_LENGTH * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
              {url.length} / {MAX_URL_LENGTH}
            </p>
          </div>
          
          {urlError && (
            <p className="text-xs text-destructive">{urlError}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium">Caption (optional)</label>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption for this media"
            className="h-20"
          />
        </div>
        
        <Button 
          type="button" 
          onClick={addMediaItem}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Add {mediaType === 'IMAGE' ? 'Image' : 'Video'}
        </Button>
      </div>
      
      {mediaItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Media Gallery</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {mediaItems.map((item, index) => (
              <div key={item.id || index} className="relative rounded-md border overflow-hidden group">
                <MediaRenderer 
                  media={item} 
                  aspectRatio={item.type === 'VIDEO' ? 'video' : 'square'}
                  isPreview={true}
                />
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  {item.type === 'IMAGE' && (
                    <button
                      type="button"
                      onClick={() => setCoverImage(item.url)}
                      className={`rounded-full p-1 bg-background/80 hover:bg-background transition-colors ${
                        coverImage === item.url ? 'text-yellow-500' : 'text-muted-foreground'
                      }`}
                      title="Set as cover image"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeMediaItem(index)}
                    className="rounded-full p-1 bg-background/80 hover:bg-background text-destructive transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 