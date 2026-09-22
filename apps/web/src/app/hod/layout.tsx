'use client';
import { DashboardShell } from '@/components/dashboard-shell';

import { usePathname } from 'next/navigation';

export default function HodLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/hod/change-password') {
    return <>{children}</>;
  }

  return <DashboardShell title="HOD Dashboard">{children}</DashboardShell>;
}
