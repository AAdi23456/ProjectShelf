import { useState, useEffect } from 'react';
import { ImageOff, Youtube } from 'lucide-react';

interface MediaItem {
  id?: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption?: string;
}

interface MediaRendererProps {
  media: MediaItem;
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
  captionClassName?: string;
  showCaption?: boolean;
}

export default function MediaRenderer({
  media,
  aspectRatio = 'auto',
  className = '',
  captionClassName = '',
  showCaption = true
}: MediaRendererProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to determine aspect ratio class
  const aspectRatioClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'video' ? 'aspect-video' : '';

  // Safety check for excessively long URLs
  useEffect(() => {
    if (media.url.length > 2000) {
      setHasError(true);
      setErrorMessage('URL is too long to process');
    } else {
      setHasError(false);
      setErrorMessage(null);
    }
  }, [media.url]);

  // Helper function to determine if a URL is from YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Helper function to determine if a URL is from Vimeo
  const isVimeoUrl = (url: string): boolean => {
    return url.includes('vimeo.com');
  };

  // Helper to ensure proper embed URL format
  const getEmbedUrl = (url: string): string => {
    // Safety check for very long URLs
    if (url.length > 2000) {
      setHasError(true);
      setErrorMessage('URL is too long to process');
      return '';
    }
    
    // Already an embed URL
    if (url.includes('/embed/')) return url;

    // Convert YouTube watch URL to embed URL
    if (isYouTubeUrl(url)) {
      // Extract video ID from various YouTube URL formats
      const videoIdMatch = 
        url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/) || [];
      const videoId = videoIdMatch[1];
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Convert Vimeo URL to embed URL
    if (isVimeoUrl(url)) {
      const videoIdMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [];
      const videoId = videoIdMatch[1];
      
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // Return original if no conversions needed
    return url;
  };

  if (media.type === 'VIDEO') {
    const embedUrl = getEmbedUrl(media.url);
    
    return (
      <div className={`overflow-hidden ${aspectRatioClass} ${className}`}>
        <div className="w-full h-full bg-gray-100">
          <iframe 
            src={embedUrl}
            className="w-full h-full" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title={media.caption || "Embedded video"}
          ></iframe>
        </div>
        {showCaption && media.caption && (
          <div className={`p-2 text-sm text-muted-foreground ${captionClassName}`}>
            {media.caption}
          </div>
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`w-full flex flex-col items-center justify-center bg-gray-100 ${aspectRatioClass} ${className}`}>
        <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">{errorMessage || 'Image unavailable'}</span>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className={`relative ${aspectRatioClass} bg-gray-100`}>
        <img 
          src={media.url} 
          alt={media.caption || 'Media image'} 
          className="w-full h-full object-cover" 
          onError={() => setHasError(true)}
        />
      </div>
      {showCaption && media.caption && (
        <div className={`p-2 text-sm text-muted-foreground ${captionClassName}`}>
          {media.caption}
        </div>
      )}
    </div>
  );
} 