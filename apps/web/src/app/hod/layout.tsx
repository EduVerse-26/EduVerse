'use client';
import { DashboardShell } from '@/components/dashboard-shell';

export default function HodLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell title="HOD Dashboard">{children}</DashboardShell>;
}
