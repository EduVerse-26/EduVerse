'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentPerformance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3, BookOpen, Activity, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentPerformancePage() {
  const { data: perf } = useQuery({
    queryKey: ['performance', 'stu-1'],
    queryFn: () => getStudentPerformance('stu-1'),
  });

  const trendIcon = perf?.trend === 'improving' ? (
    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
  ) : perf?.trend === 'declining' ? (
    <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
  ) : (
    <Minus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Academic Performance & Analytics</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Track your grades, attendance trends, and continuous assessment metrics</p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Overall Attendance</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight text-foreground">{perf?.overallAttendance || 0}%</p>
            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Minimum requirement: 75%</span>
              <Badge variant={perf?.overallAttendance && perf.overallAttendance >= 75 ? 'success' : 'destructive'} className="text-[10px]">
                {perf?.overallAttendance && perf.overallAttendance >= 75 ? 'Qualified' : 'Critical'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Internal Assessment Marks</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight text-foreground">{perf?.overallMarks || 0}%</p>
            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Cumulative Grade Point: 8.8</span>
              <Badge variant="outline" className="text-[10px]">Grade: A</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Performance Trajectory</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {trendIcon}
              <p className="text-2xl font-bold tracking-tight capitalize text-foreground">{perf?.trend || 'stable'}</p>
            </div>
            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Based on past 6 months</span>
              <Badge variant="secondary" className="text-[10px]">Steady</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reporting / Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Monthly Attendance Trend (%)
            </CardTitle>
            <p className="text-xs text-muted-foreground">Historical session participation rates</p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perf?.attendanceTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar dataKey="percentage" name="Attendance %" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={42} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Marks Trend Chart */}
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Examination & Marks Progress (%)
            </CardTitle>
            <p className="text-xs text-muted-foreground">Continuous assessment and exam scoring trajectory</p>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perf?.marksTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name="Marks %"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'hsl(var(--background))', stroke: '#2563EB', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#2563EB' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance Table */}
      <Card className="border border-border/70 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Subject-wise Performance Breakdown
          </CardTitle>
          <p className="text-xs text-muted-foreground">Detailed score distributions across continuous assessment components</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="text-left py-3 px-4">Subject</th>
                  <th className="text-center py-3 px-4">Attendance</th>
                  <th className="text-center py-3 px-4">Assignments</th>
                  <th className="text-center py-3 px-4">Quizzes</th>
                  <th className="text-center py-3 px-4">Coding Lab</th>
                  <th className="text-center py-3 px-4">Internal Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {perf?.subjectWise.map((subject) => (
                  <tr key={subject.courseId} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{subject.courseName}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={subject.attendance >= 75 ? 'success' : 'destructive'} className="text-xs">
                        {subject.attendance}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground font-mono text-xs">{subject.assignmentAvg}%</td>
                    <td className="py-3 px-4 text-center text-muted-foreground font-mono text-xs">{subject.quizAvg}%</td>
                    <td className="py-3 px-4 text-center text-muted-foreground font-mono text-xs">{subject.codingAvg}%</td>
                    <td className="py-3 px-4 text-center font-semibold text-foreground font-mono text-xs">
                      {subject.internalMarks}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
