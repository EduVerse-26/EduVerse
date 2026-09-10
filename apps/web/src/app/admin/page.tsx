'use client';

import { useQuery } from '@tanstack/react-query';
import { getDepartments, getAllUsers } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Users, GraduationCap, UserCog, TrendingUp, Activity } from 'lucide-react';

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
    { label: 'Departments', value: departments?.length || 0, icon: Building2, color: 'from-indigo-500 to-purple-600', change: '+2 this year' },
    { label: 'Total Users', value: users?.length || 0, icon: Users, color: 'from-cyan-500 to-blue-600', change: '15 active' },
    { label: 'Faculty', value: users?.filter(u => u.role === 'faculty').length || 0, icon: UserCog, color: 'from-emerald-500 to-teal-600', change: 'All active' },
    { label: 'Students', value: users?.filter(u => u.role === 'student').length || 0, icon: GraduationCap, color: 'from-amber-500 to-orange-600', change: '3 batches' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Administrator</h2>
          <p className="text-white/70 max-w-xl">Manage your institution from a single dashboard. Monitor departments, allocate HODs, and oversee the entire campus ecosystem.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {depsLoading || usersLoading ? (
                    <Skeleton className="h-9 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Departments Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Departments Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {depsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {departments?.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.code} • {dept.hodName || 'No HOD assigned'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{dept.facultyCount} Faculty</Badge>
                      <Badge variant="outline" className="text-xs">{dept.studentCount} Students</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Department', href: '/admin/departments', icon: '🏢' },
                { label: 'Manage HODs', href: '/admin/hods', icon: '👤' },
                { label: 'View All Users', href: '/admin/users', icon: '👥' },
                { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
