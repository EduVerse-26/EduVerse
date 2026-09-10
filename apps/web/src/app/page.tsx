'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_DASHBOARD_PATHS } from '@eduverse/config';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        router.replace(ROLE_DASHBOARD_PATHS[user.role]);
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-primary animate-pulse-glow flex items-center justify-center">
          <span className="text-2xl">🎓</span>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading EduVerse...</p>
      </div>
    </div>
  );
}
