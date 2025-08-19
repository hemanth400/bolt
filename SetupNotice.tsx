import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Database,
  Key,
  ExternalLink,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Play,
  X
} from 'lucide-react';
import { hasValidSupabaseConfig } from '@/lib/supabase';
import { DemoApp } from '@/components/DemoApp';

interface SetupNoticeProps {
  onShowDemo?: () => void;
}

export function SetupNotice({ onShowDemo }: SetupNoticeProps) {
  const [showEnvExample, setShowEnvExample] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopyEnv = async () => {
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

    try {
      await navigator.clipboard.writeText(envContent);
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (hasValidSupabaseConfig()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Alert */}
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">
            Supabase Setup Required
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            To enable authentication and database features, please configure your Supabase credentials.
          </AlertDescription>
        </Alert>

        {/* Main Setup Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Welcome to Skill Friend</CardTitle>
            <CardDescription className="text-base">
              Complete the setup below to start your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Mode Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Currently Running in Demo Mode
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You can explore the interface with sample data, but authentication and real database features are disabled.
                  </p>
                </div>
              </div>
            </div>

            {/* Setup Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Quick Setup (5 minutes)</h3>
              
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <Badge variant="outline" className="flex-shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    1
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">Create a Supabase Project</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to{' '}
                      <a 
                        href="https://supabase.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        supabase.com
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {' '}and create a new project (free tier available)
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <Badge variant="outline" className="flex-shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    2
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">Get Your Credentials</h4>
                    <p className="text-sm text-muted-foreground">
                      In your Supabase dashboard, go to Settings → API and copy your Project URL and anon key
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <Badge variant="outline" className="flex-shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    3
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">Set Environment Variables</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add your Supabase credentials to the environment variables
                    </p>
                    
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEnvExample(!showEnvExample)}
                        className="flex items-center gap-2"
                      >
                        {showEnvExample ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showEnvExample ? 'Hide' : 'Show'} Environment Variables
                      </Button>

                      {showEnvExample && (
                        <div className="relative">
                          <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyEnv}
                            className="absolute top-2 right-2"
                          >
                            {copiedEnv ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <Badge variant="outline" className="flex-shrink-0 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    4
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">Set Up Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Run the provided SQL schema in your Supabase SQL Editor to create the required tables
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Link */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground text-center">
                Need help? Check the{' '}
                <button 
                  onClick={() => {
                    // This would open the setup guide - for now just scroll to show it exists
                    const setupFile = 'SKILL_FRIEND_SETUP.md';
                    console.log(`See ${setupFile} for detailed setup instructions`);
                  }}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  detailed setup guide
                </button>
                {' '}for step-by-step instructions
              </p>
            </div>

            {/* Continue in Demo Mode */}
            <div className="border-t pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPreview(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                Preview App with Sample Data
              </Button>

              {onShowDemo && (
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={onShowDemo}
                >
                  Skip Setup (Demo Mode)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What You'll Get After Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Secure user authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Course enrollment & progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Points system & leaderboards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Gamified learning experience</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Skill Friend - App Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <DemoApp showBanner={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
