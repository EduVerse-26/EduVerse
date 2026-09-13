'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssignments, getQuizzes, getCodingExams, getFacultyTimetable } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardCheck, FileText, HelpCircle, Code2, Calendar, MessageCircle,
  BookOpen, ChevronRight, Clock, MapPin, CheckSquare, PlusCircle
} from 'lucide-react';
import Link from 'next/link';

export default function FacultyDashboard() {
  const { data: assignments } = useQuery({ queryKey: ['assignments'], queryFn: () => getAssignments() });
  const { data: quizzes } = useQuery({ queryKey: ['quizzes'], queryFn: () => getQuizzes() });
  const { data: codingExams } = useQuery({ queryKey: ['codingExams'], queryFn: () => getCodingExams() });
  const { data: timetable } = useQuery({ queryKey: ['facultyTimetable', 'fac-1'], queryFn: () => getFacultyTimetable('fac-1') });

  const pendingEval = assignments?.reduce((acc, a) => acc + (a.totalSubmissions - a.evaluatedCount), 0) || 0;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayClasses = timetable?.filter(s => s.day === today && s.type !== 'break') || [];

  const stats = [
    {
      label: 'Assignments',
      value: assignments?.length || 0,
      icon: FileText,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10',
      sub: `${pendingEval} pending evaluation`,
      badgeVariant: 'warning' as const,
    },
    {
      label: 'Active Quizzes',
      value: quizzes?.length || 0,
      icon: HelpCircle,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10',
      sub: 'Continuous assessment',
      badgeVariant: 'outline' as const,
    },
    {
      label: 'Coding Tests',
      value: codingExams?.length || 0,
      icon: Code2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      sub: 'Lab examinations',
      badgeVariant: 'success' as const,
    },
    {
      label: "Today's Lectures",
      value: todayClasses.length,
      icon: Calendar,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      sub: `Scheduled for ${today}`,
      badgeVariant: 'outline' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clean Chic Welcome Header */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Faculty Portal</span>
            <span className="text-xs text-muted-foreground">• Academic Session 2026</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Professor</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            You have {todayClasses.length} lectures scheduled today and {pendingEval} student submissions awaiting evaluation.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/faculty/assignments/create">
            <Badge variant="default" className="text-xs py-1 px-3 cursor-pointer hover:bg-primary/90">
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              New Assignment
            </Badge>
          </Link>
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

      {/* Today's Schedule + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule Card */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Today&apos;s Class Schedule
              </CardTitle>
              <p className="text-xs text-muted-foreground">Lectures and lab sessions for today ({today})</p>
            </div>
            <Link href="/faculty/timetable" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Full Schedule <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm font-medium">No classes scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 text-center shrink-0">
                        <p className="text-xs font-semibold text-foreground">Period {slot.period}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">{slot.startTime}</p>
                      </div>
                      <div className="w-px h-8 bg-border/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{slot.courseName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{slot.room}</span>
                          <span>•</span>
                          <span>{slot.batch || 'Batch A'}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={slot.type === 'lab' ? 'info' : 'outline'} className="text-xs capitalize shrink-0">
                      {slot.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <p className="text-xs text-muted-foreground">Common academic workflows and management tasks</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Mark Attendance', href: '/faculty/attendance', icon: CheckSquare, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
                { label: 'Upload Materials', href: '/faculty/resources', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
                { label: 'Create Assignment', href: '/faculty/assignments/create', icon: FileText, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' },
                { label: 'Build Quiz', href: '/faculty/quizzes', icon: HelpCircle, color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10' },
                { label: 'Coding Exam', href: '/faculty/coding-exams', icon: Code2, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' },
                { label: 'Enter Marks', href: '/faculty/marks', icon: ClipboardCheck, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 hover:border-border transition-all group"
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
