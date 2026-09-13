'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getStudentAttendance, getAssignments, getQuizzes, getCodingExams,
  getStudentPerformance, getNotifications, getAnnouncements
} from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardCheck, FileText, HelpCircle, Code2, TrendingUp, Bell,
  Megaphone, Calendar, BarChart3, ChevronRight, BookOpen, Clock
} from 'lucide-react';
import { getTimeRemaining } from '@eduverse/utils';
import Link from 'next/link';

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

  const stats = [
    {
      label: 'Overall Attendance',
      value: `${overallAttendance}%`,
      icon: ClipboardCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      sub: overallAttendance >= 75 ? 'On Track' : 'Below Threshold',
      badgeVariant: overallAttendance >= 75 ? ('success' as const) : ('destructive' as const),
    },
    {
      label: 'Pending Tasks',
      value: pendingAssignments,
      icon: FileText,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10',
      sub: `${assignments?.length || 0} total assignments`,
      badgeVariant: 'outline' as const,
    },
    {
      label: 'Upcoming Tests',
      value: (quizzes?.length || 0) + (codingExams?.length || 0),
      icon: Code2,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10',
      sub: 'Quizzes & Coding',
      badgeVariant: 'secondary' as const,
    },
    {
      label: 'Academic Score',
      value: `${performance?.overallMarks || 0}%`,
      icon: TrendingUp,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      sub: `Trend: ${performance?.trend || 'stable'}`,
      badgeVariant: 'outline' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clean Chic Welcome Header */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Student Workspace</span>
            <span className="text-xs text-muted-foreground">• Semester 3</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Arun</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            You have {pendingAssignments} pending assignments and {unreadNotifs} unread notifications.
            Your current academic performance is on track.
          </p>
        </div>
        {unreadNotifs > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/10 text-primary text-xs font-medium shrink-0">
            <Bell className="w-3.5 h-3.5" />
            <span>{unreadNotifs} new notification{unreadNotifs > 1 ? 's' : ''}</span>
          </div>
        )}
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
                  {stat.badgeVariant === 'success' ? 'Good' : stat.badgeVariant === 'destructive' ? 'Alert' : 'Active'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Upcoming Deadlines & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deadlines Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
              <p className="text-xs text-muted-foreground">Assignments requiring your immediate submission</p>
            </div>
            <Link href="/student/assignments" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {assignments?.slice(0, 4).map((assignment) => {
                const deadline = getTimeRemaining(assignment.deadline);
                return (
                  <Link
                    key={assignment.id}
                    href={`/student/assignments`}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group hover:bg-muted/20 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{assignment.courseName} • Max {assignment.maxMarks} pts</p>
                      </div>
                    </div>
                    <Badge
                      variant={deadline.urgency === 'high' ? 'destructive' : deadline.urgency === 'medium' ? 'warning' : 'outline'}
                      className="shrink-0 ml-3 text-xs"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {deadline.text}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary" />
                Announcements
              </CardTitle>
              <p className="text-xs text-muted-foreground">Campus updates & notices</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5">
              {announcements?.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">{ann.title}</p>
                    {ann.priority === 'urgent' && <Badge variant="destructive" className="text-[9px] py-0 px-1.5">URGENT</Badge>}
                    {ann.priority === 'high' && <Badge variant="warning" className="text-[9px] py-0 px-1.5">HIGH</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{ann.content}</p>
                  <p className="text-[10px] text-muted-foreground/70">{ann.authorName} • {ann.scope}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance by Subject Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Attendance by Subject
              </CardTitle>
              <p className="text-xs text-muted-foreground">Threshold required: 75% attendance per course</p>
            </div>
            <Link href="/student/attendance" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Detailed breakdown <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendance?.map((subject) => (
              <div key={subject.courseId} className="p-4 rounded-xl border border-border/70 bg-card hover:border-border transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{subject.courseName}</p>
                    <p className="text-xs text-muted-foreground">{subject.courseCode}</p>
                  </div>
                  <Badge variant={subject.status === 'safe' ? 'success' : subject.status === 'warning' ? 'warning' : 'destructive'} className="shrink-0 text-xs">
                    {subject.percentage}%
                  </Badge>
                </div>

                <div className="w-full bg-muted/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      subject.status === 'safe' ? 'bg-emerald-500' : subject.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>{subject.present} Present • {subject.absent} Absent</span>
                  <span>{subject.totalClasses} classes</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quick Navigation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Attendance', href: '/student/attendance', icon: ClipboardCheck },
            { label: 'Timetable', href: '/student/timetable', icon: Calendar },
            { label: 'Resources', href: '/student/resources', icon: BookOpen },
            { label: 'Assignments', href: '/student/assignments', icon: FileText },
            { label: 'Coding Exams', href: '/student/coding-exams', icon: Code2 },
            { label: 'Performance', href: '/student/performance', icon: TrendingUp },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border/70 bg-card hover:bg-muted/40 hover:border-border transition-all text-center group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-muted/80 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs font-medium text-foreground">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
