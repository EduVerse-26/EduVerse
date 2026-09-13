'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentAttendance } from '@eduverse/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function StudentAttendancePage() {
  const { data: attendance, isLoading } = useQuery({
    queryKey: ['studentAttendance', 'stu-1'],
    queryFn: () => getStudentAttendance('stu-1'),
  });

  const overall = attendance ? Math.round(attendance.reduce((a, c) => a + c.percentage, 0) / attendance.length) : 0;
  const overallStatus = overall >= 75 ? 'safe' : overall >= 65 ? 'warning' : 'critical';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Attendance Overview</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Subject-level attendance tracking and eligibility monitoring</p>
      </div>

      {/* Overall Summary Card - Uizard PM Style */}
      <Card className="border border-border/70 bg-card rounded-2xl shadow-xs">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cumulative Attendance</span>
              <p className="text-4xl font-bold tracking-tight text-foreground">{overall}%</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant={overallStatus === 'safe' ? 'success' : overallStatus === 'warning' ? 'warning' : 'destructive'} className="text-xs">
                  {overallStatus === 'safe' ? 'Eligible for Exams' : overallStatus === 'warning' ? 'Warning: Low Attendance' : 'Critical Shortage'}
                </Badge>
                <span className="text-xs text-muted-foreground">• Required: 75%</span>
              </div>
            </div>
            
            <div className="w-24 h-24 rounded-full border-4 border-border/60 flex items-center justify-center relative shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/40" />
                <circle
                  cx="48" cy="48" r="44" fill="none" strokeWidth="4"
                  strokeDasharray={`${overall * 2.76} 276`}
                  className={overallStatus === 'safe' ? 'text-emerald-500' : overallStatus === 'warning' ? 'text-amber-500' : 'text-rose-500'}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-bold text-foreground">{overall}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Courses ({attendance?.length || 0})</span>
          <span className="text-xs text-muted-foreground">Min. 75% per course</span>
        </div>

        {isLoading ? (
          <div className="grid gap-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
        ) : (
          <div className="space-y-3">
            {attendance?.map((subject) => (
              <Card key={subject.courseId} className="border border-border/70 hover:border-border transition-all shadow-xs">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-sm text-foreground truncate">{subject.courseName}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">{subject.courseCode}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ {subject.present} Present</span>
                        <span className="text-rose-600 dark:text-rose-400 font-medium">✕ {subject.absent} Absent</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">⏳ {subject.late} Late</span>
                        <span>• Total: {subject.totalClasses} classes</span>
                      </div>
                      
                      <div className="w-full bg-muted/80 rounded-full h-2 max-w-md overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            subject.status === 'safe' ? 'bg-emerald-500' : subject.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                      <p className={`text-2xl font-bold tracking-tight ${
                        subject.status === 'safe' ? 'text-emerald-600 dark:text-emerald-400' : subject.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {subject.percentage}%
                      </p>
                      <Badge variant={subject.status === 'safe' ? 'success' : subject.status === 'warning' ? 'warning' : 'destructive'} className="text-[10px] mt-1 capitalize">
                        {subject.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
