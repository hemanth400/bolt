import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, X, ExternalLink } from 'lucide-react';
import { hasValidSupabaseConfig } from '@/lib/supabase';

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (hasValidSupabaseConfig() || !isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-100 dark:text-yellow-300 dark:border-yellow-600 dark:bg-yellow-900/30">
                Demo Mode
              </Badge>
              <span className="text-sm text-yellow-700 dark:text-yellow-300 truncate">
                Authentication disabled. Set up Supabase to enable full features.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-700 hover:text-yellow-800 dark:text-yellow-300 dark:hover:text-yellow-200 h-6 px-2 text-xs"
              onClick={() => {
                // This could trigger showing setup instructions
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Setup Guide
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-yellow-700 hover:text-yellow-800 dark:text-yellow-300 dark:hover:text-yellow-200 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
