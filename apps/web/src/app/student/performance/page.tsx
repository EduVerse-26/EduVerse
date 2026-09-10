'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentPerformance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, BarChart3, BookOpen } from 'lucide-react';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentPerformancePage() {
  const { data: perf } = useQuery({
    queryKey: ['performance', 'stu-1'],
    queryFn: () => getStudentPerformance('stu-1'),
  });

  const trendIcon = perf?.trend === 'improving' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> :
    perf?.trend === 'declining' ? <TrendingDown className="w-5 h-5 text-red-500" /> :
    <Minus className="w-5 h-5 text-amber-500" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <p className="text-muted-foreground">Track your academic performance and progress</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
            <p className="text-3xl font-bold mt-1">{perf?.overallAttendance || 0}%</p>
            <Badge variant={perf?.overallAttendance && perf.overallAttendance >= 75 ? 'success' : 'destructive'} className="mt-2">
              {perf?.overallAttendance && perf.overallAttendance >= 75 ? 'On Track' : 'Below Target'}
            </Badge>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Overall Marks</p>
            <p className="text-3xl font-bold mt-1">{perf?.overallMarks || 0}%</p>
            <Badge variant="outline" className="mt-2">Grade: A</Badge>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Performance Trend</p>
            <div className="flex items-center gap-2 mt-1">
              {trendIcon}
              <p className="text-2xl font-bold capitalize">{perf?.trend || 'stable'}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Based on last 6 months</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
              Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perf?.attendanceTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Marks Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Marks Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perf?.marksTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Subject-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Attendance</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Assignments</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Quizzes</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Coding</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Internal</th>
                </tr>
              </thead>
              <tbody>
                {perf?.subjectWise.map((subject) => (
                  <tr key={subject.courseId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{subject.courseName}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={subject.attendance >= 75 ? 'success' : 'destructive'}>{subject.attendance}%</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">{subject.assignmentAvg}%</td>
                    <td className="py-3 px-4 text-center">{subject.quizAvg}%</td>
                    <td className="py-3 px-4 text-center">{subject.codingAvg}%</td>
                    <td className="py-3 px-4 text-center font-semibold">{subject.internalMarks}%</td>
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
