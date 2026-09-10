'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssignments, getQuizzes, getCodingExams, getAttendanceSessions, getFacultyTimetable } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, FileText, HelpCircle, Code2, Calendar, MessageCircle, BookOpen, Megaphone } from 'lucide-react';

export default function FacultyDashboard() {
  const { data: assignments } = useQuery({ queryKey: ['assignments'], queryFn: () => getAssignments() });
  const { data: quizzes } = useQuery({ queryKey: ['quizzes'], queryFn: () => getQuizzes() });
  const { data: codingExams } = useQuery({ queryKey: ['codingExams'], queryFn: () => getCodingExams() });
  const { data: timetable } = useQuery({ queryKey: ['facultyTimetable', 'fac-1'], queryFn: () => getFacultyTimetable('fac-1') });

  const pendingEval = assignments?.reduce((acc, a) => acc + (a.totalSubmissions - a.evaluatedCount), 0) || 0;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayClasses = timetable?.filter(s => s.day === today && s.type !== 'break') || [];

  const stats = [
    { label: 'Assignments', value: assignments?.length || 0, icon: FileText, color: 'from-blue-500 to-cyan-500', sub: `${pendingEval} pending evaluation` },
    { label: 'Quizzes', value: quizzes?.length || 0, icon: HelpCircle, color: 'from-purple-500 to-pink-500', sub: 'Active quizzes' },
    { label: 'Coding Exams', value: codingExams?.length || 0, icon: Code2, color: 'from-emerald-500 to-teal-500', sub: 'Scheduled exams' },
    { label: "Today's Classes", value: todayClasses.length, icon: Calendar, color: 'from-amber-500 to-red-500', sub: `${today}` },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Good Morning, Professor</h2>
          <p className="text-white/70 max-w-xl">
            You have {todayClasses.length} classes today and {pendingEval} submissions waiting for evaluation.
          </p>
        </div>
      </div>

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

      {/* Today's Schedule + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No classes scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">Period {slot.period}</p>
                      <p className="text-sm font-medium">{slot.startTime}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{slot.courseName}</p>
                      <p className="text-xs text-muted-foreground">{slot.room} • {slot.type}</p>
                    </div>
                    <Badge variant={slot.type === 'lab' ? 'info' : 'outline'}>
                      {slot.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Mark Attendance', href: '/faculty/attendance', icon: '✅' },
                { label: 'Upload Resource', href: '/faculty/resources', icon: '📄' },
                { label: 'Create Assignment', href: '/faculty/assignments/create', icon: '📝' },
                { label: 'Build Quiz', href: '/faculty/quizzes/create', icon: '❓' },
                { label: 'Coding Exam', href: '/faculty/coding-exams/create', icon: '💻' },
                { label: 'Counseling', href: '/faculty/counseling', icon: '💬' },
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
    </div>
  );
}
