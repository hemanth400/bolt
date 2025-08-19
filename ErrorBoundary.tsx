import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-2">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              If this error persists, please check:
              <ul className="mt-2 text-left space-y-1">
                <li>• Your Supabase configuration is correct</li>
                <li>• Environment variables are set properly</li>
                <li>• Database schema is set up correctly</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
