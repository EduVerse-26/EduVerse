'use client';

import { useQuery } from '@tanstack/react-query';
import { getFacultyList, getStudents, getCourses, getClassPerformance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCog, GraduationCap, BookOpen, BarChart3, AlertTriangle, TrendingUp, Calendar, Megaphone } from 'lucide-react';

export default function HodDashboard() {
  const { data: faculty, isLoading: facLoading } = useQuery({
    queryKey: ['faculty', 'dept-1'],
    queryFn: () => getFacultyList('dept-1'),
  });
  const { data: students, isLoading: stuLoading } = useQuery({
    queryKey: ['students', 'dept-1'],
    queryFn: () => getStudents('dept-1'),
  });
  const { data: courses, isLoading: courseLoading } = useQuery({
    queryKey: ['courses', 'dept-1'],
    queryFn: () => getCourses('dept-1'),
  });
  const { data: performance } = useQuery({
    queryKey: ['performance', '2024', 'A'],
    queryFn: () => getClassPerformance('2024', 'A'),
  });

  const stats = [
    { label: 'Faculty Members', value: faculty?.length || 0, icon: UserCog, color: 'from-blue-500 to-indigo-600', sub: 'All active' },
    { label: 'Students', value: students?.length || 0, icon: GraduationCap, color: 'from-emerald-500 to-green-600', sub: '2 sections' },
    { label: 'Courses', value: courses?.length || 0, icon: BookOpen, color: 'from-violet-500 to-purple-600', sub: 'Semester 3' },
    { label: 'Avg Attendance', value: `${performance?.averageAttendance || 0}%`, icon: BarChart3, color: 'from-amber-500 to-orange-600', sub: 'Department avg' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-violet-600/90 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white border-0 mb-3">Computer Science Department</Badge>
          <h2 className="text-2xl font-bold mb-2">Department Overview</h2>
          <p className="text-white/70 max-w-xl">Monitor faculty, students, courses, and department performance. Manage timetables and announcements.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.sub}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance + Low Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance?.topPerformers.map((s, i) => (
                <div key={s.studentId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium">{s.studentName}</span>
                  </div>
                  <Badge variant="success">{s.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Flagged — Low Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance?.lowPerformers.map((s) => (
                <div key={s.studentId} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-medium">{s.studentName}</span>
                  </div>
                  <Badge variant="destructive">{s.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Manage Faculty', href: '/hod/faculty', icon: '👨‍🏫' },
              { label: 'Manage Students', href: '/hod/students', icon: '🎓' },
              { label: 'Course Allocation', href: '/hod/courses', icon: '📚' },
              { label: 'Timetable', href: '/hod/timetable', icon: '📅' },
              { label: 'Performance', href: '/hod/performance', icon: '📊' },
              { label: 'Announcements', href: '/hod/announcements', icon: '📢' },
            ].map((action) => (
              <a key={action.label} href={action.href} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
