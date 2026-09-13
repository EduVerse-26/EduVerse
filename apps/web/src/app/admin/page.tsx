'use client';

import { useQuery } from '@tanstack/react-query';
import { getDepartments, getAllUsers } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Users, GraduationCap, UserCog, Activity, ChevronRight, PlusCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: departments, isLoading: depsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const stats = [
    {
      label: 'Total Departments',
      value: departments?.length || 0,
      icon: Building2,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10',
      change: 'Active faculties',
      badgeVariant: 'outline' as const,
    },
    {
      label: 'Registered Users',
      value: users?.length || 0,
      icon: Users,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-500/10',
      change: 'Campus community',
      badgeVariant: 'secondary' as const,
    },
    {
      label: 'Teaching Faculty',
      value: users?.filter(u => u.role === 'faculty').length || 0,
      icon: UserCog,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      change: 'All departments',
      badgeVariant: 'success' as const,
    },
    {
      label: 'Total Students',
      value: users?.filter(u => u.role === 'student').length || 0,
      icon: GraduationCap,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      change: 'Undergrad & Postgrad',
      badgeVariant: 'outline' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clean Chic Welcome Header */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">System Administration</span>
            <span className="text-xs text-muted-foreground">• EduVerse Central Campus</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Institution Management Dashboard</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Centralized institutional oversight. Supervise departments, assign department heads, manage user roles, and enforce system security policies.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/departments">
            <Badge variant="default" className="text-xs py-1 px-3 cursor-pointer hover:bg-primary/90">
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              Add Department
            </Badge>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Uizard PM Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  {depsLoading || usersLoading ? (
                    <Skeleton className="h-9 w-16 mt-1 rounded-lg" />
                  ) : (
                    <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.change}</span>
                <Badge variant={stat.badgeVariant} className="text-[10px] py-0 px-2">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Departments Overview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments Overview Card */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <Building2 className="w-4 h-4 text-primary" />
                Academic Departments
              </CardTitle>
              <p className="text-xs text-muted-foreground">Departmental codes, designated leadership, and capacity</p>
            </div>
            <Link href="/admin/departments" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {depsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-2.5">
                {departments?.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-semibold text-sm text-foreground truncate">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.code} • {dept.hodName ? `HOD: ${dept.hodName}` : 'Unassigned HOD'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {dept.facultyCount} Faculty
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {dept.studentCount} Students
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Administration Actions Card */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Administrative Workflows
            </CardTitle>
            <p className="text-xs text-muted-foreground">Central administrative controls and operations</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Departments', href: '/admin/departments', icon: Building2, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
                { label: 'HOD Allocations', href: '/admin/hod-management', icon: UserCog, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' },
                { label: 'User Directory', href: '/admin/users', icon: Users, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
                { label: 'Campus Settings', href: '/admin/settings', icon: Settings, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/70 bg-card hover:bg-muted/40 hover:border-border transition-all group shadow-xs"
                >
                  <div className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center shrink-0`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
