'use client';

import { useQuery } from '@tanstack/react-query';
import { getFacultyList, getStudents, getCourses, getClassPerformance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserCog, GraduationCap, BookOpen, BarChart3, AlertTriangle,
  TrendingUp, Calendar, Megaphone, ChevronRight, CheckCircle2,
  Users, Award
} from 'lucide-react';
import Link from 'next/link';

export default function HodDashboard() {
  const { data: faculty } = useQuery({
    queryKey: ['faculty', 'dept-1'],
    queryFn: () => getFacultyList('dept-1'),
  });
  const { data: students } = useQuery({
    queryKey: ['students', 'dept-1'],
    queryFn: () => getStudents('dept-1'),
  });
  const { data: courses } = useQuery({
    queryKey: ['courses', 'dept-1'],
    queryFn: () => getCourses('dept-1'),
  });
  const { data: performance } = useQuery({
    queryKey: ['performance', '2024', 'A'],
    queryFn: () => getClassPerformance('2024', 'A'),
  });

  const stats = [
    {
      label: 'Department Faculty',
      value: faculty?.length || 0,
      icon: UserCog,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10',
      sub: 'All active teaching staff',
      badgeVariant: 'outline' as const,
    },
    {
      label: 'Enrolled Students',
      value: students?.length || 0,
      icon: GraduationCap,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      sub: 'Batches 2024 & 2025',
      badgeVariant: 'success' as const,
    },
    {
      label: 'Allocated Courses',
      value: courses?.length || 0,
      icon: BookOpen,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10',
      sub: 'Semester 3 & 5',
      badgeVariant: 'secondary' as const,
    },
    {
      label: 'Average Attendance',
      value: `${performance?.averageAttendance || 0}%`,
      icon: BarChart3,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      sub: 'Department-wide metric',
      badgeVariant: 'outline' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clean Chic Welcome Header */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Department Administration</span>
            <span className="text-xs text-muted-foreground">• Computer Science & Engineering</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Department Overview</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Monitor faculty workloads, student attendance rates, curriculum allocations, and academic risk metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs py-1 px-3">
            CSE Department Active
          </Badge>
        </div>
      </div>

      {/* Overview Stat Cards - Uizard PM Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.sub}</span>
                <Badge variant={stat.badgeVariant} className="text-[10px] py-0 px-2">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performers + Flagged Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers Card */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Top Academic Performers
              </CardTitle>
              <p className="text-xs text-muted-foreground">Highest scoring students across continuous assessments</p>
            </div>
            <Link href="/hod/performance" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Analytics <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {performance?.topPerformers.map((s, i) => (
                <div
                  key={s.studentId}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
                      #{i + 1}
                    </span>
                    <span className="font-semibold text-sm text-foreground">{s.studentName}</span>
                  </div>
                  <Badge variant="success" className="text-xs font-mono">
                    {s.percentage}% Score
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Performers / Flagged Card */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Flagged for Academic Support
              </CardTitle>
              <p className="text-xs text-muted-foreground">Students requiring mentorship intervention or counseling</p>
            </div>
            <Badge variant="destructive" className="text-[10px]">
              {performance?.lowPerformers.length || 0} Flagged
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {performance?.lowPerformers.map((s) => (
                <div
                  key={s.studentId}
                  className="flex items-center justify-between p-3 rounded-xl border border-rose-500/20 bg-rose-500/[0.03] hover:bg-rose-500/[0.06] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-semibold text-sm text-foreground">{s.studentName}</span>
                  </div>
                  <Badge variant="destructive" className="text-xs font-mono">
                    {s.percentage}% At Risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Department Workflows</CardTitle>
          <p className="text-xs text-muted-foreground">Direct management tools for staff, curricula, and scheduling</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Faculty Directory', href: '/hod/faculty', icon: UserCog, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
              { label: 'Student Directory', href: '/hod/students', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
              { label: 'Course Allocation', href: '/hod/courses', icon: BookOpen, color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10' },
              { label: 'Master Timetable', href: '/hod/timetable', icon: Calendar, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
              { label: 'Class Analytics', href: '/hod/performance', icon: BarChart3, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' },
              { label: 'Announcements', href: '/hod/announcements', icon: Megaphone, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border/70 bg-card hover:bg-muted/40 hover:border-border transition-all group shadow-xs text-center"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center transition-colors shrink-0`}>
                  <action.icon className="w-5 h-5" />
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
  );
}
