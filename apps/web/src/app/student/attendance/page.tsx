'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentAttendance } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
        <h2 className="text-2xl font-bold">Attendance</h2>
        <p className="text-muted-foreground">Track your attendance across all subjects</p>
      </div>

      {/* Overall Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
              <p className="text-4xl font-bold mt-1">{overall}%</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={overallStatus === 'safe' ? 'success' : overallStatus === 'warning' ? 'warning' : 'destructive'}>
                  {overallStatus === 'safe' ? '✅ Safe' : overallStatus === 'warning' ? '⚠️ Warning' : '🚨 Critical'}
                </Badge>
                <span className="text-xs text-muted-foreground">Minimum required: 75%</span>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
                <circle
                  cx="48" cy="48" r="44" fill="none" strokeWidth="4"
                  strokeDasharray={`${overall * 2.76} 276`}
                  className={overallStatus === 'safe' ? 'text-emerald-500' : overallStatus === 'warning' ? 'text-amber-500' : 'text-red-500'}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-bold">{overall}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise */}
      {isLoading ? (
        <div className="grid gap-4">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
      ) : (
        <div className="space-y-4">
          {attendance?.map((subject) => (
            <Card key={subject.courseId} className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{subject.courseName}</h3>
                      <Badge variant="outline" className="text-[10px]">{subject.courseCode}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="text-emerald-500">✓ {subject.present} Present</span>
                      <span className="text-red-500">✕ {subject.absent} Absent</span>
                      <span className="text-amber-500">⏳ {subject.late} Late</span>
                      <span>Total: {subject.totalClasses} classes</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 max-w-md">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          subject.status === 'safe' ? 'bg-emerald-500' : subject.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <p className={`text-2xl font-bold ${
                      subject.status === 'safe' ? 'text-emerald-500' : subject.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {subject.percentage}%
                    </p>
                    <Badge variant={subject.status === 'safe' ? 'success' : subject.status === 'warning' ? 'warning' : 'destructive'} className="text-[10px] mt-1">
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
  );
}
