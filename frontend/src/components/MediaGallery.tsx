'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import MediaRenderer from './MediaRenderer';
import { Button } from '@/components/ui/button';

interface MediaItem {
  id?: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption?: string;
}

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  className?: string;
  initialLayout?: 'grid' | 'slider';
}

export default function MediaGallery({
  mediaItems,
  className = '',
  initialLayout = 'grid'
}: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'slider'>(initialLayout);

  // No media to display
  if (!mediaItems || mediaItems.length === 0) {
    return null;
  }

  // For single media item, display it directly
  if (mediaItems.length === 1) {
    return (
      <div className={`rounded-md overflow-hidden ${className}`}>
        <MediaRenderer
          media={mediaItems[0]}
          aspectRatio={mediaItems[0].type === 'VIDEO' ? 'video' : 'auto'}
        />
      </div>
    );
  }

  // For multiple items, display as grid or slider
  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'auto';
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    } else {
      setActiveIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className={className}>
      {layout === 'grid' ? (
        // Grid layout
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaItems.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]"
              onClick={() => openModal(index)}
            >
              <MediaRenderer
                media={item}
                aspectRatio={item.type === 'VIDEO' ? 'video' : 'square'}
                showCaption={false}
              />
            </div>
          ))}
        </div>
      ) : (
        // Slider layout
        <div className="relative">
          <div className="overflow-hidden rounded-md">
            <MediaRenderer
              media={mediaItems[activeIndex]}
              aspectRatio={mediaItems[activeIndex].type === 'VIDEO' ? 'video' : 'auto'}
            />
          </div>
          
          {mediaItems.length > 1 && (
            <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia('prev');
                }}
                className="bg-background/80 hover:bg-background rounded-full h-8 w-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia('next');
                }}
                className="bg-background/80 hover:bg-background rounded-full h-8 w-8"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          {/* Pagination dots for slider */}
          <div className="flex justify-center mt-2 gap-1">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-4 bg-primary' : 'w-2 bg-muted'
                }`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle layout button if there are multiple items */}
      {mediaItems.length > 1 && (
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLayout(prev => prev === 'grid' ? 'slider' : 'grid')}
            className="text-xs text-muted-foreground"
          >
            View as {layout === 'grid' ? 'Slider' : 'Grid'}
          </Button>
        </div>
      )}

      {/* Lightbox modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl mx-auto">
            <Button
              size="icon"
              variant="ghost"
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="overflow-hidden rounded-md">
              <MediaRenderer
                media={mediaItems[activeIndex]}
                aspectRatio={mediaItems[activeIndex].type === 'VIDEO' ? 'video' : 'auto'}
                className="max-h-[80vh]"
              />
            </div>
            
            {mediaItems.length > 1 && (
              <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateMedia('prev');
                  }}
                  className="bg-background/80 hover:bg-background rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateMedia('next');
                  }}
                  className="bg-background/80 hover:bg-background rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 