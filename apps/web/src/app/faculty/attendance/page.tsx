'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, getAttendanceSessions, markAttendance } from '@eduverse/api';
import type { AttendanceStatus } from '@eduverse/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Save, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyAttendancePage() {
  const queryClient = useQueryClient();
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [selectedSession] = useState('att-sess-1');

  const { data: students } = useQuery({
    queryKey: ['students', 'dept-1', '2024', 'A'],
    queryFn: () => getStudents('dept-1', '2024', 'A'),
  });

  const { data: sessions } = useQuery({
    queryKey: ['attendanceSessions'],
    queryFn: () => getAttendanceSessions(),
  });

  const saveMutation = useMutation({
    mutationFn: () => markAttendance(selectedSession, Object.entries(records).map(([studentId, status]) => ({ studentId, status }))),
    onSuccess: () => {
      toast.success('Attendance saved successfully');
      queryClient.invalidateQueries({ queryKey: ['attendanceSessions'] });
    },
  });

  const markAllPresent = () => {
    const all: Record<string, AttendanceStatus> = {};
    students?.forEach(s => { all[s.id] = 'present'; });
    setRecords(all);
  };

  const presentCount = Object.values(records).filter(s => s === 'present').length;
  const absentCount = Object.values(records).filter(s => s === 'absent').length;
  const lateCount = Object.values(records).filter(s => s === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Mark Attendance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Data Structures (CS301) • Section A • Period 1 (09:00 - 09:50)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllPresent} className="h-9">
            <Check className="w-4 h-4 mr-1.5" />
            Mark All Present
          </Button>
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="h-9">
            <Save className="w-4 h-4 mr-1.5" />
            Save Records
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="stat-card p-4">
          <CardContent className="p-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Enrolled</span>
            <p className="text-2xl font-bold text-foreground mt-1">{students?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="stat-card p-4 border-emerald-500/30">
          <CardContent className="p-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Present</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{presentCount}</p>
          </CardContent>
        </Card>
        <Card className="stat-card p-4 border-rose-500/30">
          <CardContent className="p-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Absent</span>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{absentCount}</p>
          </CardContent>
        </Card>
        <Card className="stat-card p-4 border-amber-500/30">
          <CardContent className="p-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Late</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{lateCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Roster Table */}
      <Card className="border border-border/70 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/70">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Users className="w-4 h-4 text-primary" />
            Student Attendance Roster
          </CardTitle>
          <p className="text-xs text-muted-foreground">Click a status button to toggle between Present, Absent, or Late</p>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-2">
            {students?.map((student) => {
              const status = records[student.id] || 'present';
              return (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold">
                      {student.rollNumber.slice(-3)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{student.rollNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setRecords((prev) => ({ ...prev, [student.id]: 'present' }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        status === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1" />
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecords((prev) => ({ ...prev, [student.id]: 'absent' }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        status === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" />
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecords((prev) => ({ ...prev, [student.id]: 'late' }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        status === 'late'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      Late
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
