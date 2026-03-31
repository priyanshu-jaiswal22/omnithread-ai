'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-destructive mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => reset()} className="flex-1 bg-gradient-primary hover:opacity-90 text-white font-semibold">
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex-1 border-border text-white hover:bg-card"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
