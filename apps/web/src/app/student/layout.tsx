'use client';
import { DashboardShell } from '@/components/dashboard-shell';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="Student Dashboard">{children}</DashboardShell>;
}
