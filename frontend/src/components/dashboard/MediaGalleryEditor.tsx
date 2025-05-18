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
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Add Media</h3>
          <div className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-full">
            {mediaItems.length} items
          </div>
        </div>
        
        <div className="bg-gray-50 border rounded-lg p-5 space-y-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={mediaType === 'IMAGE' ? 'default' : 'outline'}
              onClick={() => setMediaType('IMAGE')}
              className="flex-1"
              size="sm"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </Button>
            
            <Button
              type="button"
              variant={mediaType === 'VIDEO' ? 'default' : 'outline'}
              onClick={() => setMediaType('VIDEO')}
              className="flex-1"
              size="sm"
            >
              <Video className="mr-2 h-4 w-4" />
              Video
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {mediaType === 'IMAGE' ? 'Image URL' : 'Video URL'}
              </label>
              
              {mediaType === 'VIDEO' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground hover:text-foreground cursor-help">
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
              placeholder="Add a description for this media..."
              className="mt-1 h-20"
            />
          </div>
          
          <Button
            type="button"
            onClick={addMediaItem}
            disabled={!url.trim() || !!urlError}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Add {mediaType.toLowerCase()}
          </Button>
        </div>
      </div>
      
      {mediaItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Media Gallery</h3>
            <p className="text-xs text-muted-foreground">
              Drag to reorder • Click star to set as cover image
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mediaItems.map((item, index) => (
              <div 
                key={item.id || index} 
                className="group relative bg-gray-50 border rounded-lg overflow-hidden transition-all hover:shadow-md"
              >
                <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/50 to-transparent p-3 z-10 flex justify-between items-start">
                  <div>
                    <Button
                      type="button"
                      variant={coverImage === item.url ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7 rounded-full bg-black/30 hover:bg-black/50 border-0"
                      onClick={() => setCoverImage(item.url)}
                    >
                      <Star className={`h-3 w-3 ${coverImage === item.url ? "fill-yellow-400 text-yellow-400" : "text-white"}`} />
                    </Button>
                  </div>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeMediaItem(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="relative h-48">
                  <MediaRenderer 
                    media={{
                      url: item.url,
                      type: item.type,
                      caption: item.caption
                    }}
                    aspectRatio="auto"
                    isPreview={true}
                    showCaption={false}
                  />
                </div>
                
                {item.caption && (
                  <div className="p-3 bg-white border-t">
                    <p className="text-sm">{item.caption}</p>
                  </div>
                )}
                
                <div className="absolute inset-0 border-2 border-primary opacity-0 pointer-events-none transition-opacity rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 