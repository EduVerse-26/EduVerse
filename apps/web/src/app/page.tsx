'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_DASHBOARD_PATHS } from '@eduverse/config';
import { GraduationCap } from 'lucide-react';

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
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center animate-pulse">
          <GraduationCap className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading EduVerse...</p>
      </div>
    </div>
  );
}
