'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentAttendance, getAssignments, getQuizzes, getCodingExams, getStudentPerformance, getNotifications, getAnnouncements } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, FileText, HelpCircle, Code2, TrendingUp, Bell, Megaphone, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { getTimeRemaining } from '@eduverse/utils';

export default function StudentDashboard() {
  const { data: attendance } = useQuery({ queryKey: ['studentAttendance', 'stu-1'], queryFn: () => getStudentAttendance('stu-1') });
  const { data: assignments } = useQuery({ queryKey: ['assignments'], queryFn: () => getAssignments() });
  const { data: quizzes } = useQuery({ queryKey: ['quizzes'], queryFn: () => getQuizzes() });
  const { data: codingExams } = useQuery({ queryKey: ['codingExams'], queryFn: () => getCodingExams() });
  const { data: performance } = useQuery({ queryKey: ['performance', 'stu-1'], queryFn: () => getStudentPerformance('stu-1') });
  const { data: notifications } = useQuery({ queryKey: ['notifications', 'usr-stu-1'], queryFn: () => getNotifications('usr-stu-1') });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: () => getAnnouncements() });

  const overallAttendance = attendance ? Math.round(attendance.reduce((a, c) => a + c.percentage, 0) / attendance.length) : 0;
  const pendingAssignments = assignments?.filter(a => new Date(a.deadline) > new Date()).length || 0;
  const unreadNotifs = notifications?.filter(n => !n.isRead).length || 0;

  const trendIcon = performance?.trend === 'improving' ? '📈' : performance?.trend === 'declining' ? '📉' : '➡️';
  const trendColor = performance?.trend === 'improving' ? 'text-emerald-500' : performance?.trend === 'declining' ? 'text-red-500' : 'text-amber-500';

  const stats = [
    { label: 'Overall Attendance', value: `${overallAttendance}%`, icon: ClipboardCheck, color: overallAttendance >= 75 ? 'from-emerald-500 to-green-600' : 'from-red-500 to-rose-600', sub: overallAttendance >= 75 ? 'You\'re safe' : 'Below threshold!' },
    { label: 'Pending Assignments', value: pendingAssignments, icon: FileText, color: 'from-blue-500 to-indigo-600', sub: `${assignments?.length || 0} total` },
    { label: 'Upcoming Exams', value: (quizzes?.length || 0) + (codingExams?.length || 0), icon: Code2, color: 'from-purple-500 to-pink-600', sub: 'Quizzes + Coding' },
    { label: 'Performance', value: `${performance?.overallMarks || 0}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-600', sub: `Trend: ${performance?.trend || 'stable'}` },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-fuchsia-600/90 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Hello, Arun! 👋</h2>
            <p className="text-white/70 max-w-lg">
              You have {pendingAssignments} pending assignments and {unreadNotifs} unread notifications.
              Your performance trend is <span className={trendColor}>{performance?.trend} {trendIcon}</span>.
            </p>
          </div>
          {unreadNotifs > 0 && (
            <Badge className="bg-white/20 text-white border-0 text-sm">
              <Bell className="w-3.5 h-3.5 mr-1" />
              {unreadNotifs} new
            </Badge>
          )}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments?.slice(0, 4).map((assignment) => {
                const deadline = getTimeRemaining(assignment.deadline);
                return (
                  <a key={assignment.id} href={`/student/assignments/${assignment.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
                      </div>
                    </div>
                    <Badge variant={deadline.urgency === 'high' ? 'destructive' : deadline.urgency === 'medium' ? 'warning' : 'outline'}>
                      {deadline.text}
                    </Badge>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Latest Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements?.slice(0, 3).map((ann) => (
                <div key={ann.id} className="space-y-1">
                  <div className="flex items-start gap-2">
                    {ann.priority === 'urgent' && <Badge variant="destructive" className="text-[10px] mt-0.5">URGENT</Badge>}
                    {ann.priority === 'high' && <Badge variant="warning" className="text-[10px] mt-0.5">IMPORTANT</Badge>}
                    <p className="text-sm font-medium leading-tight">{ann.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                  <p className="text-[10px] text-muted-foreground/60">{ann.authorName} • {ann.scope}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Attendance by Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendance?.map((subject) => (
              <div key={subject.courseId} className="p-4 rounded-xl border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">{subject.courseName}</p>
                    <p className="text-xs text-muted-foreground">{subject.courseCode}</p>
                  </div>
                  <Badge variant={subject.status === 'safe' ? 'success' : subject.status === 'warning' ? 'warning' : 'destructive'}>
                    {subject.percentage}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      subject.status === 'safe' ? 'bg-emerald-500' : subject.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>{subject.present}P / {subject.absent}A / {subject.late}L</span>
                  <span>{subject.totalClasses} classes</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Attendance', href: '/student/attendance', icon: '✅' },
          { label: 'Timetable', href: '/student/timetable', icon: '📅' },
          { label: 'Resources', href: '/student/resources', icon: '📚' },
          { label: 'Assignments', href: '/student/assignments', icon: '📝' },
          { label: 'Coding Exams', href: '/student/coding-exams', icon: '💻' },
          { label: 'Performance', href: '/student/performance', icon: '📊' },
        ].map((link) => (
          <a key={link.label} href={link.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-center">
            <span className="text-2xl">{link.icon}</span>
            <span className="text-xs font-medium">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
