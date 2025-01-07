'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function SharedError({
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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">出错了</h2>
        <p className="text-muted-foreground">{error.message || '发生了未知错误'}</p>
        <Button onClick={reset} variant="default">
          重试
        </Button>
      </div>
    </div>
  );
} 