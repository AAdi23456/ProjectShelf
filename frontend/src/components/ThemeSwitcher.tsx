'use client';

import { useState } from 'react';
import { useTheme, ThemeType } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Moon, Sun, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ThemeSwitcher() {
  const { currentTheme, darkMode, setTheme, toggleDarkMode, themes } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {expanded && (
        <Card className="absolute right-0 mt-2 w-80 shadow-lg z-50 opacity-100 transform transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg">Theme Settings</CardTitle>
            <CardDescription>Choose a theme for your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dark Mode</span>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="h-8 w-8"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(Object.keys(themes) as ThemeType[]).map((themeKey) => {
                const theme = themes[themeKey];
                const isActive = currentTheme === themeKey;

                return (
                  <div 
                    key={themeKey}
                    className={cn(
                      "cursor-pointer overflow-hidden rounded-md border-2 transition-all",
                      isActive ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setTheme(themeKey)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{theme.name}</span>
                        {isActive && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{theme.description}</div>
                    </div>
                    
                    {/* Theme preview */}
                    <div 
                      className="h-16 p-2"
                      style={{ 
                        background: theme.background,
                        color: theme.foreground,
                      }}
                    >
                      <div className="flex items-start space-x-2">
                        <div 
                          className="rounded-md h-10 w-10" 
                          style={{ 
                            background: theme.primary,
                            borderRadius: theme.radius
                          }}
                        />
                        <div>
                          <div 
                            className="h-3 w-20 rounded mb-2" 
                            style={{ 
                              background: theme.secondary,
                              borderRadius: theme.radius
                            }}
                          />
                          <div 
                            className="h-2 w-16 rounded" 
                            style={{ 
                              background: theme.accent,
                              borderRadius: theme.radius
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpanded(false)}
            >
              Close
            </Button>
            <Button 
              size="sm" 
              onClick={() => setExpanded(false)}
            >
              Apply Theme
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 