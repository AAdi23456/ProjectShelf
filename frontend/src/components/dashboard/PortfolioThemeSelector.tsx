'use client';

import { useState } from 'react';
import { ThemeType, useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PreviewProject {
  title: string;
  description: string;
  image: string;
}

const previewProject: PreviewProject = {
  title: "Project Title",
  description: "A brief description of the project showcasing its key features and outcomes.",
  image: "https://placehold.co/600x400/png",
};

export default function PortfolioThemeSelector() {
  const { currentTheme, darkMode, setTheme, toggleDarkMode, themes } = useTheme();
  const [showDarkPreview, setShowDarkPreview] = useState(false);
  
  // Toggle between light/dark preview without actually changing the site theme
  const handlePreviewModeChange = () => {
    setShowDarkPreview(!showDarkPreview);
  };
  
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Theme Engine</h2>
        <p className="text-muted-foreground">
          Customize the look and feel of your portfolio with prebuilt themes.
        </p>
      </div>
      
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Select Theme</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                id="preview-mode" 
                checked={showDarkPreview}
                onCheckedChange={handlePreviewModeChange}
              />
              <Label htmlFor="preview-mode">Dark Preview</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(themes) as ThemeType[]).map((themeKey) => {
              const theme = themes[themeKey];
              const isActive = currentTheme === themeKey;
              
              return (
                <Card 
                  key={themeKey}
                  className={cn(
                    "cursor-pointer overflow-hidden transition-all",
                    isActive ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                  )}
                  onClick={() => setTheme(themeKey)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{theme.name}</CardTitle>
                      {isActive && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <CardDescription className="text-xs">{theme.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {/* Theme Preview */}
                    <div 
                      className="h-32 p-4"
                      style={{ 
                        background: showDarkPreview ? 'oklch(0.145 0 0)' : theme.background,
                        color: showDarkPreview ? 'oklch(0.985 0 0)' : theme.foreground,
                      }}
                    >
                      <div 
                        className="h-6 w-28 mb-3"
                        style={{ 
                          background: theme.primary,
                          borderRadius: theme.radius
                        }}
                      />
                      <div className="flex items-start space-x-2">
                        <div 
                          className="rounded-md h-14 w-14 flex-shrink-0" 
                          style={{ 
                            background: showDarkPreview ? 'oklch(0.205 0 0)' : theme.card,
                            borderRadius: theme.radius,
                            border: `1px solid ${theme.border}`
                          }}
                        />
                        <div>
                          <div 
                            className="h-3 w-24 rounded mb-2" 
                            style={{ 
                              background: theme.secondary,
                              borderRadius: theme.radius
                            }}
                          />
                          <div 
                            className="h-2 w-20 rounded mb-2" 
                            style={{ 
                              background: theme.accent,
                              borderRadius: theme.radius
                            }}
                          />
                          <div 
                            className="h-2 w-16 rounded" 
                            style={{ 
                              background: theme.muted,
                              borderRadius: theme.radius
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground">
              Selected theme: <span className="font-medium">{themes[currentTheme].name}</span>
            </p>
            <div className="flex items-center space-x-2">
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div className="rounded-lg overflow-hidden border">
            {/* Header Preview */}
            <div 
              className="p-4 border-b flex justify-between items-center"
              style={{ 
                background: showDarkPreview ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                borderColor: showDarkPreview ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)',
              }}
            >
              <div className="font-bold">Portfolio Name</div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-16 rounded" />
                <div className="h-2 w-12 rounded" />
                <div className="h-2 w-14 rounded" />
              </div>
            </div>
            
            {/* Content Preview */}
            <div 
              className="p-6"
              style={{ 
                background: showDarkPreview ? 'oklch(0.145 0 0)' : 'oklch(1 0 0)',
              }}
            >
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">{previewProject.title}</h1>
                <p className="text-muted-foreground mb-6">{previewProject.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div 
                    className="rounded-lg overflow-hidden border"
                    style={{ 
                      borderColor: showDarkPreview ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)',
                    }}
                  >
                    <div 
                      className="aspect-video bg-muted"
                      style={{ 
                        background: showDarkPreview ? 'oklch(0.269 0 0)' : 'oklch(0.97 0 0)',
                      }}
                    />
                    <div 
                      className="p-4"
                      style={{ 
                        background: showDarkPreview ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                      }}
                    >
                      <h3 className="font-medium mb-2">Project Gallery</h3>
                      <p className="text-sm text-muted-foreground">
                        Showcase your project with multiple media items
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className="rounded-lg overflow-hidden border"
                    style={{ 
                      borderColor: showDarkPreview ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)',
                    }}
                  >
                    <div 
                      className="p-4"
                      style={{ 
                        background: showDarkPreview ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                      }}
                    >
                      <h3 className="font-medium mb-2">Project Timeline</h3>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i} 
                            className="flex items-start"
                            style={{ 
                              color: showDarkPreview ? 'oklch(0.708 0 0)' : 'oklch(0.556 0 0)',
                            }}
                          >
                            <div 
                              className="h-4 w-4 rounded-full mt-1 mr-2"
                              style={{ 
                                background: themes[currentTheme].primary,
                              }}
                            />
                            <div>
                              <div className="text-xs font-medium">Month {i}, 2023</div>
                              <div 
                                className="text-sm"
                                style={{ 
                                  color: showDarkPreview ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
                                }}
                              >
                                Development Phase {i}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  style={{ 
                    background: themes[currentTheme].primary,
                    color: showDarkPreview ? 'oklch(0.205 0 0)' : 'oklch(0.985 0 0)',
                  }}
                >
                  View Project
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={handlePreviewModeChange}
              className="mr-2"
            >
              Toggle Preview Mode
            </Button>
            <Button onClick={() => {}}>
              Apply Theme
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 