'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClassPerformance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, AlertTriangle, GraduationCap, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformancePage() {
  const [batch, setBatch] = useState('2024');
  const [section, setSection] = useState('A');

  const { data: performance, isLoading } = useQuery({ 
    queryKey: ['hodPerformance', batch, section], 
    queryFn: () => getClassPerformance(batch, section) 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Department Performance & Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Continuous evaluation metrics, section distributions, and early-warning alerts</p>
        </div>
        <div className="flex gap-2">
          <Select value={batch} onValueChange={setBatch}>
            <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="2024">Batch 2024</SelectItem>
              <SelectItem value="2025">Batch 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="w-[120px] h-9 text-xs rounded-xl">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Class Attendance</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{performance?.averageAttendance || 0}%</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Section average
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{performance?.averageMarks || 0}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Continuous assessment
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Honor Students</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{performance?.topPerformers?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Above 85% aggregate
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card border-rose-500/30">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">At-Risk Students</p>
                <p className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{performance?.lowPerformers?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs text-rose-600/80">
              Below 65% benchmark
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reporting / Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Subject Score Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">Mean continuous assessment score across department courses</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance?.subjectDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                  <XAxis dataKey="courseName" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
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
                  <Bar dataKey="averageMarks" name="Average Marks %" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={42} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Support Intervention List
            </CardTitle>
            <p className="text-xs text-muted-foreground">Students flagged below academic retention standards</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              {performance?.lowPerformers?.map((student, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 border border-rose-500/20 bg-rose-500/[0.03] rounded-xl">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{student.studentName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{student.studentId}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs font-mono">
                    {student.percentage}% Average
                  </Badge>
                </div>
              ))}
              {(!performance?.lowPerformers || performance.lowPerformers.length === 0) && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No students currently flagged as at risk for this section.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
